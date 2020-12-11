const bcrypt = require('bcrypt');
const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

describe('api:user', function() {
  let app = require('../../test/app.js');
  const fixture = require('./user.fixture')(app);
  let createdUser;

  it('allows the creation of a user', done => {
    app.model('user').create(fixture.user, (err, user) => {
      createdUser = user;
      if (err) return done(err);
      expect(user.name).toEqual(fixture.user.name);
      done();
    });
  });

  it('prohibits multiple users with the same e-mail', done => {
    app.model('user').create(fixture.user, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('forces the e-mail address to lowercase', done => {
    createdUser.email = fixture.user.email.toUpperCase();
    createdUser.save().then(() => {
      app.model('user').findOne({ email: fixture.user.email }, (err, user) => {
        expect(user.email).toEqual(fixture.user.email);
        done();
      });
    }).catch(done);
  });

  it('encodes the user password', done => {
    expect(createdUser.password).toNotEqual(fixture.user.password);
    bcrypt.compare(fixture.user.password, createdUser.password, (err, valid) => {
      expect(valid).toEqual(true);
      done(err);
    });
  });

  it('constructs a gravatar URL for the user avatar', () => {
    expect(createdUser.avatar).toEqual('https://gravatar.com/avatar/06782fa1fde3e919a3ab224d3b22dbfa.png?d=mm');
  });

  it('protects the user list against anonymous access', done => {
    request(app).get('/user').expect(401, done);
  });

  let authToken;
  let decodedToken;

  describe('login and authentication', () => {
    it('rejects invalid login attempts', done => {
      request(app).post('/user/auth')
        .field('email', 'nope@nothere.com')
        .field('password', 'nope')
        .expect(401, done);
    });

    it('allows valid users to login', done => {
      request(app).post('/user/auth')
        .set('Accept', 'application/json')
        .send({ email: fixture.user.email, password: fixture.user.password })
        .expect(200, (err, response) => {
          expect(response.body.data.email).toEqual(fixture.user.email);
          expect(response.body.token).toBeTruthy();
          authToken = response.body.token;
          done();
        });
    });

    it('provides a valid JWT for authorization', done => {
      jwt.verify(authToken, app.config.security.jwtSecret, (err, decoded) => {
        if (err) return done(err);
        decodedToken = decoded;
        done();
      });
    });

    it('allows an authenticated user to view private routes', done => {
      request(app).get('/user')
        .set('Authorization', `JWT ${authToken}`)
        .expect(200, done);
    });
  });

  describe('new user registration', () => {
    it('allows a new user to register via the API', done => {
      request(app).post('/user')
        .send(fixture.newUser)
        .expect(201, done);
    });

    let registeredUser;

    it('creates a matching ministry for the registering user', done => {
      app.model('user').findOne({ email: fixture.newUser.email }, (err, user) => {
        expect(user.ministry).toBeTruthy();
        registeredUser = user;
        done();
      });
    });

    it('gives new users administrative priveleges', () => {
      expect(registeredUser.permission).toEqual('admin');
    });

    it('requires new users to validate their e-mail', () => {
      expect(registeredUser.confirmed).toEqual(false);
    });
  });

  describe('token re-issuance', () => {
    before(done => setTimeout(() => done(), 1000));

    it('allows users to refresh their un-expired token', done => {
      request(app).post('/user/auth')
        .set('Accept', 'application/json')
        .set('Authorization', `JWT ${authToken}`)
        .expect(200, (err, response) => {
          expect(response.body.token).toBeTruthy();
          authToken = response.body.token;
          done();
        });
    });

    it('extends the expiration date when refreshing a token', done => {
      jwt.verify(authToken, app.config.security.jwtSecret, (err, decoded) => {
        if (err) return done(err);
        expect(decoded.exp - decodedToken.exp > 0).toBeTruthy();
        done();
      });
    });
  });
});

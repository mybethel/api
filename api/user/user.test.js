const bcrypt = require('bcrypt');
const expect = require('expect');
const request = require('supertest');

const fixture = require('./user.fixture');

describe('api:user', function() {
  let app = require('../../test/app.js');
  let createdUser;

  before(() => app.model('user').remove());

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
      expect(err).toExist();
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
});

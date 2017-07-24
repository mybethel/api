const expect = require('expect');
const request = require('supertest');
const sinon = require('sinon');

const app = require('../../test/app.js');

describe('api:media', function() {
  let fixture;
  let generateUrl;
  let token;

  before(done => {
    fixture = require('./media.fixture')(app, done);
  });

  before(() => {
    token = app.token.issue({});
  });

  before(() => {
    generateUrl = sinon.stub(app.aws.s3, 'getSignedUrl')
      .callsFake((collection, body, cb) => cb(null, 'https://s3.amazonaws.com/cloud.bethel.io'));
  });

  it('requires a Ministry ID to make the database association', done => {
    request(app).post('/media')
      .set('Authorization', `JWT ${token}`)
      .send({ originalFilename: 'podcast_episode.mp3' })
      .expect(400, done);
  });

  it('returns a signed S3 URL after media is created', done => {
    request(app).post('/media')
      .set('Accept', 'application/json')
      .set('Authorization', `JWT ${token}`)
      .send(fixture.media)
      .expect(201, (err, response) => {
        expect(response.body.data.filename).toEqual(`${response.body.data._id}.mp4`);
        expect(generateUrl.called).toEqual(true);
        expect(generateUrl.args[0][1].Key).toEqual(`media/${fixture.media.ministry}/${response.body.data.filename}`);
        done(err);
      });
  });

  it('allows a file upload to be re-tried', done => {
    request(app).post('/media')
      .set('Authorization', `JWT ${token}`)
      .send(fixture.media)
      .expect(200, (err, response) => {
        done(err);
      });
  });

  it('does not create duplicate files when re-trying uploads', done => {
    app.model('media').find().then(results => {
      expect(results.length).toEqual(1);
      done();
    });
  });

  it('backfills a mimetype if none is present', done => {
    request(app).post('/media')
      .set('Accept', 'application/json')
      .set('Authorization', `JWT ${token}`)
      .send(fixture.mediaNoType)
      .expect(201, (err, response) => {
        expect(response.body.data.type).toEqual('audio/mpeg');
        done(err);
      });
  });

  it('includes the podcast ID in the upload path', done => {
    request(app).post('/media')
      .set('Accept', 'application/json')
      .set('Authorization', `JWT ${token}`)
      .send(fixture.mediaPodcast)
      .expect(201, (err, response) => {
        expect(generateUrl.args[3][1].Key).toEqual(`media/${fixture.mediaPodcast.ministry}/${fixture.mediaPodcast.podcast}/${response.body.data.filename}`);
        done(err);
      });
  });
});

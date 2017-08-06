module.exports = function(app, done) {
  let fixture = {
    media: {
      filename: 'episode.mp4',
      mime: 'video/mp4',
      ministry: '5312766065959720008e2080',
    },
    mediaNoType: {
      filename: 'episode.mp3',
      ministry: '5312766065959720008e2080',
    },
    mediaPodcast: {
      mime: 'audio/mp3',
      filename: 'episode.mp3',
      ministry: '5312766065959720008e2080',
      podcast: '5313b36d3ff2a012009bb790',
    }
  };

  Promise.all([
    app.model('media').remove(),
  ]).then(() => done());

  return fixture;
};

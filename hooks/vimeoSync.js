const fetch = require('node-fetch');

module.exports = app => ({
  async run(podcast) {
    app.profile(`vimeoSync:${podcast._id}`)
    app.log.verbose(`vimeoSync: running for ${podcast._id}`)
    let service = await app.model('integration').findOne({ _id: podcast.service });
    getVideos(service.accessToken)
      .then(checkPages(service.accessToken, podcast.sourceMeta.map(tag => tag.trim())))
      .then(results => {
        return Promise.all(results.map(result => {
          result.podcast = podcast._id;
          app.model('media').update({ uuid: result.uuid, podcast: podcast._id }, result)
            .catch(err => {
              app.log.verbose(`vimeoSync: new media ${result.uuid} on podcast ${podcast._id}`);
              app.model('media').create(result);
            });
        }));
      })
      .then(() => {
        podcast.lastSync = new Date();
        podcast.save();
        app.log.verbose(`vimeoSync: finished for ${podcast._id}`);
        app.profile(`vimeoSync:${podcast._id}`);
      })
      .catch(err => app.log.error(err));
  }
});

/**
 * Simple wrapper around the Vimeo API to query a user for all their videos.
 * This hits the `/me/videos` endpoint on Vimeo which uses the `token` to
 * determine which user to return videos for.
 * @param {String} token User token for the Vimeo API.
 * @param {Function} cb Callback once the request has been fulfilled.
 * @param {Number} page Optional page number for pagination.
 */
function getVideos(token, page) {
  const route = `/me/videos?page=${page || 1}&per_page=50`;
  return fetch(`https://api.vimeo.com${route}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Bethel Technologies <hello@bethel.io>'
    },
  }).then(function(res) {
    return res.json();
  });
}

/**
 * Process the first page of results and determine how many pages to sync. This
 * allows for the sync process to finish faster. When more pages are present,
 * each additional page is fetched in parallel. Once all pages have been fetched
 * every page of results is parsed.
 * @param {String} token User token for the Vimeo API.
 * @param {Array} tags All tags which should be used to match.
 */
function checkPages(token, tags) {
  const tagsToSync = tags.toString().toLowerCase();

  return function firstPageCallback(response) {
    let additionalPages = 0;
    if (response.total > 50) {
      additionalPages = Math.ceil((response.total - 50) / 50);
    }

    let pageRequests = [];
    for (var i = 2; i <= additionalPages + 1; i++) {
      pageRequests.push(getVideos(token, i));
    }

    return Promise.all(pageRequests).then(results => {
      results.unshift(response);
      return processResults(results, tags);
    });
  }
}

/**
 * Process all pages of Vimeo results and determine which videos match the
 * criteria to sync. This is solely based on the tags, although by default any
 * videos which have not been marked as public will be ignored.
 * @param {Array} results Each page of results returned from the Vimeo API.
 * @param {Array} tags All tags which should be used to match.
 */
function processResults(results, tags) {
  const tagsToSync = tags.toString().toLowerCase();
  let matchingVideos = [];

  return new Promise(resolve => {
    results.forEach(response => {
      matchingVideos = matchingVideos.concat(response.data.filter(video => {
        // If a video is not marked as public it is ignored. In the future this
        // could be modified to allow private channels to be used as a source.
        if (video.privacy && video.privacy.view !== 'anybody') {
          return false;
        }

        // If a video has not finished uploading the Vimeo API may still return
        // the record. We ignore these since they do not have any media yet.
        if (!video.files || video.files.length < 1) {
          return false;
        }

        // Simple string matching is used to determine if any of the tags from
        // Vimeo match the tags passed to this function.
        let matches = video.tags.map(tag =>
                        tagsToSync.indexOf(tag.name.toLowerCase()) >= 0
                      ).filter(match => match === true);

        // If at least one tag matches, the video should be included.
        return matches.length > 0;
      }));
    });

    resolve(matchingVideos.map(video => {
      let variants = video.files.reduce(function(result, file, index) {
        result[file.quality] = file.link_secure;
        return result;
      }, {});

      return {
        date: video.created_time,
        deleted: false,
        description: video.description,
        duration: video.duration,
        name: video.name,
        tags: video.tags.map(tag => tag.name),
        thumbnail: video.pictures && video.pictures[0].link,
        url: variants.sd,
        uuid: video.uri.replace('/videos/', ''),
        variants,
      };
    }));
  });
}

const fetch = require('node-fetch');
const querystring = require('querystring');

let redirectUrl = 'https://api.bethel.io/integration/vimeo/authorized';

module.exports = app => ({
  async accessToken(code) {
    let token = await fetch('https://api.vimeo.com/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
      }),
      headers: {
        'Authorization': `basic ${new Buffer(app.config.vimeo.key + ':' + app.config.vimeo.secret).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
    return await token.json();
  },

  authorizationEndpoint(ministryId) {
    return `https://api.vimeo.com/oauth/authorize?${querystring.stringify({
      client_id: app.config.vimeo.key,
      redirect_uri: redirectUrl,
      response_type: 'code',
      state: ministryId,
    })}`
  },
});

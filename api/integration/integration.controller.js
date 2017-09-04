module.exports = (router, app) => ({

  async vimeo(req, res) {
    // If this is not a response from Vimeo, redirect the user to request permission.
    if (req.params.id !== 'authorized') {
      return res.ok({
        url: app.vimeo.authorizationEndpoint(req.authorization.ministry),
      });
    }

    let token = await app.vimeo.accessToken(req.query.code);
    if (typeof token.access_token === 'undefined')
      return res.forbidden('invalid access token response from Vimeo');

    app.model('integration').findOrCreate({
      ministry: req.query.state,
      provider: 'vimeo',
      user: token.user.uri,
    }, {
      accountType: token.user.account,
      accessToken: token.access_token,
      link: token.user.link,
      ministry: req.query.state,
      name: token.user.name,
      picture: token.user.pictures[0],
      provider: 'vimeo',
      user: token.user.uri,
    }).then(result => {
      res.redirect('https://beta.bethel.io/#/settings/integrations');
    }).catch(err => res.serverError(err));
  },
})

module.exports = (router, app) => ({
  async findOne(req, res) {
    let site = await app.model('site').findOne({
      host: req.params.id.replace('www.', '')
    }).populate('ministry');

    res.ok({ data: site });
  },

  async '/:id/page'(req, res) {
    let page = await app.model('content').findOne({
      site: req.params.id,
      slug: req.query.slug,
    });

    res.ok({ data: page });
  }
})

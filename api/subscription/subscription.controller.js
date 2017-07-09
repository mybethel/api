module.exports = (router, app) => ({

  async create(req, res) {
    if (!req.body.id) return res.badRequest('id required');

    let existing = await app.model('subscription').findOne({ ministry: req.body.id });
    if (existing) return res.badRequest('subscription already exists');

    let customer = await app.stripe.customers.create({ metadata: { ministry: req.body.id } });
    app.model('subscription').create({
      customerId: customer.id,
      ministry: req.body.id,
    }).then(subscription => res.ok(subscription));
  },

  async findOne(req, res) {
    if (!req.params.id) return res.badRequest('id required');

    let metadata = await app.model('subscription').findOne({
      $or: [
        { _id: req.params.id },
        { customerId: req.params.id },
        { ministry: req.params.id },
      ],
    });
    if (!metadata) return res.notFound();

    let customer = await app.stripe.customers.retrieve(metadata.customerId);
    res.ok(customer);
  }

});

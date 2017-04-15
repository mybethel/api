module.exports = function(app) {
  before(() => app.model('user').remove());

  return {
    user: {
      name: 'Jayne Cobb',
      email: 'jayne@bethel.io',
      password: 'v3ra'
    },
    newUser: {
      name: 'Registered User',
      ministryName: 'Global Community Church',
      email: 'registration@bethel.io',
      password: 'abcd1234',
    },
  };
};

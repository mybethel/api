module.exports = {
  '*': 'publicRead',
  '/user/auth': true,
  '/user': 'publicCreate',
  '/subscription': 'authenticated',
};

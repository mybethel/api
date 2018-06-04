const AWS = require('aws-sdk');

module.exports = app => {
  AWS.config.update(app.config.aws);

  return {
    s3: new AWS.S3({ params: { Bucket: app.config.aws.bucket } }),
  };
};

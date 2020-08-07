process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const environment = require('./environment');

module.exports = environment.map((env) => {
  env.config.set('mode', 'production');
  return env.toWebpackConfig();
});

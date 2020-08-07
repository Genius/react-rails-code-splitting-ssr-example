process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const environment = require('./environment');

module.exports = environment.map((env) => {
  env.config.set('mode', 'development');
  return env.toWebpackConfig();
});

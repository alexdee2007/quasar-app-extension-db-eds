const path = require('path');

/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

function extendConf (conf) {
  conf.boot.push('~quasar-app-extension-db-eds/src/boot/register-db-eds.js');
  conf.build.transpileDependencies.push(/quasar-app-extension-db-eds[\\/]src[\\/](?!lib[\\/]euscp\.js)/);
  conf.build.env['EDS_PROXY_URI'] = JSON.stringify(process.env.EDS_PROXY_URI);
  conf.build.env['EDS_CA_SERVERS_URI'] = JSON.stringify(process.env.EDS_CA_SERVERS_URI);
  conf.build.env['EDS_CA_CERTIFICATES_URI'] = JSON.stringify(process.env.EDS_CA_CERTIFICATES_URI);
  conf.build.env['EDS_DIRECT_ACCESS'] = JSON.stringify(process.env.EDS_DIRECT_ACCESS);
}

module.exports = function (api) {

  api.compatibleWith('quasar', '^1.8.0');
  api.compatibleWith('@quasar/app', '^1.5.0');

  api.extendQuasarConf(extendConf);
  api.chainWebpack(chain => chain.resolve.alias.set('db-eds', path.resolve(__dirname)));

}

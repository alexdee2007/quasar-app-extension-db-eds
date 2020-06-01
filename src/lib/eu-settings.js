export default {
  language: 'uk',
  encoding: 'utf-8',
  httpProxyServiceURL: process.env.EDS_PROXY_URI,
  directAccess: process.env.EDS_DIRECT_ACCESS === 'true',
  CAs: process.env.EDS_CA_SERVERS_URI,
  CACertificates: process.env.EDS_CA_CERTIFICATES_URI
};

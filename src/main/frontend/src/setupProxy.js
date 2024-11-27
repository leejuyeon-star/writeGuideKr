// //  CORS 방지를 위한 프록시 설정
//  const { createProxyMiddleware } = require('http-proxy-middleware');

//  module.exports = function(app){
//      app.use(
//          createProxyMiddleware({
//              target: 'http://localhost:8080',
//              changeOrigin: true,
//              pathFilter : '/api',
//          }),
//      );

//      app.use(
//          createProxyMiddleware({
//              target: 'http://localhost:8080',
//              changeOrigin: true,
//              pathFilter : '/logout',
//          })
//      );
//  };



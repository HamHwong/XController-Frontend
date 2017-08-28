"use strict"
var path = require("path")
var pathConfig = {
  root: path.dirname(__dirname),
  src: path.dirname(__dirname) + "/src",
  less: path.dirname(__dirname) + "/src/less",
  css: path.dirname(__dirname) + "/src/css",
  js: path.dirname(__dirname) + "/src/js",
  dist: path.dirname(__dirname) + "/dist",
  distJs: path.dirname(__dirname) + "/dist/js",
  distCss: path.dirname(__dirname) + "/dist/css",
  config: __dirname,
}

var serverConfig = {
  host: '127.0.0.1',
  port: '8888',
  root: 'dist',
  homepage: 'login.html',
}

var Path = function() {
  return pathConfig
}
var Server = function() {
  return serverConfig
}

exports.path = Path()
exports.server = Server()

const Hapi = require('hapi')

exports.server = new Hapi.Server({ port: process.env.PORT || 1337 })

exports.Todo = require('../../src/models/todo')
exports.Project = require('../../src/models/project')
exports.Post = require('../../src/models/post')

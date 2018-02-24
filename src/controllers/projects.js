const Boom = require('boom')

const Project = require('../models/project')

/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.show = (request, h) => {
  return Project.find({})
    .then(list => h.view('home/index', { list }) )
    .catch(err => Boom.badImplementation(err))
}

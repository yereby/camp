const Boom = require('boom')

const Projects = require('./projects')

/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.show = (request, h) => {
  return Projects.list()
    .then(projects => h.view('home/index', { projects }))
    .catch(err => Boom.badImplementation(err))
}

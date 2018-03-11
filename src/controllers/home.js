const Boom = require('boom')

const Projects = require('./projects')

/**
 * Show the list of all users
 *
 * @example GET /users/
 * @return {Object} The list of users || status code 404
 */
module.exports.show = {
  tags: ['api', 'home'],
  description: 'Display the home page',
  plugins: {
    'hapi-swagger': {
      produces: ['text/html'],
    }
  },
  handler: (request, h) => {
    return Projects.list.handler()
      .then(projects => h.view('home/index', { projects }))
      .catch(err => Boom.badImplementation(err))
  }
}

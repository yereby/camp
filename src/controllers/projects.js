const Boom = require('boom')
const Joi = require('joi')

const Project = require('../models/project')

/**
 * Show the list of all projects
 *
 * @example GET /projects
 * @return {Object} The list of projects || status code 404
 */
module.exports.list = () => {
  return Project.find({})
    .then()
    .catch(err => Boom.badImplementation(err))
}

/**
 * Create a project
 *
 * @example POST /projects
 * @return {Object} Project created || Some errors
 */
module.exports.create = {
  validate: {
    payload: {
      name: Joi.string(),
      todos: Joi.array(),
    }
  },
  handler: async request => {
    try {
      return await Project.create(request.payload)
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.forbidden(err)
    }
  }
}

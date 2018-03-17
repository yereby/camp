const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Project = require('../models/project')

/**
 * Show the list of all projects
 *
 * @example GET /projects
 * @return {Object} The list of projects || status code 404
 */
module.exports.list = {
  tags: ['api', 'projects'],
  description: 'Get the list of all projects',
  plugins: { 'hapi-swagger': { order: 1 } },
  handler: () => {
    return Project.find({})
      .populate('posts')
      .then()
      .catch(err => Boom.badImplementation(err))
  }
}

/**
 * Create a project
 *
 * @example POST /projects
 * @return {Object} Project created || Some errors
 */
module.exports.create = {
  tags: ['api', 'projects'],
  description: 'Create a project',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 2, } },
  validate: {
    payload: {
      name: Joi.string().required().description('The name of the new project'),
      description: Joi.string().description('The description of the new project'),
    }
  },
  handler: async (request, h) => {
    try {
      const project = await Project.create(request.payload)
      return h.response(project).created()
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.badImplementation(err)
    }
  }
}

module.exports.set = {
  tags: ['api', 'projects'],
  description: 'Update a project',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 3, } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
    },
    payload: {
      name: Joi.string().required().description('The name of the project'),
      description: Joi.string().allow('').description('The description of the project'),
    },
  },
  handler: async (request, h) => {
    try {
      const project = request.params.project

      const result = await Project.update(
        { _id: project },
        { $set: request.payload },
        { runValidators: true }
      )

      if (result.n === 0) { return Boom.notFound() }
      return h.response().code(204)
    } catch(err) { return Boom.badImplementation(err) }
  }
}

module.exports.remove = {
  tags: ['api', 'projects'],
  description: 'Remove one project and all his todos and posts',
  plugins: { 'hapi-swagger': { order: 4 } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to delete'),
    }
  },
  handler: async request => {
    try {
      const project = request.params.project

      const result = await Project.remove({ _id: project })

      if (result.n === 0) { return Boom.notFound() }
      return result
    } catch(err) { return Boom.badImplementation(err) }
  }
}

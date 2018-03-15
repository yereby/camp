const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Project = require('../models/project')

module.exports.list = {
  tags: ['api', 'todos'],
  description: 'Display todos of a single project',
  plugins: { 'hapi-swagger': { order: 1 } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to fetch'),
    },
  },
  handler: async (request, h) => {
    try {
      const project = await Project.findOne({_id: request.params.project })

      if (!project) { return Boom.notFound() }
      if (!project.todos.length) { return h.response().code(204) }

      return project.todos
    } catch(err) { return Boom.badImplementation(err) }
  }
}

module.exports.add = {
  tags: ['api', 'todos'],
  description: 'Add a todo to a project',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 2, } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
    },
    payload: {
      content: Joi.string().required().description('Text of the task'),
      done: Joi.boolean().default(false).description('Task done or not'),
    }
  },
  handler: async (request, h) => {
    try {
      const project = request.params.project
      const { content, done } = request.payload

      const result = await Project.update(
        { _id: project },
        { $addToSet: { todos: { content, done } }},
        { runValidators: true }
      )

      if (result.nModified === 0) { return Boom.notFound() }
      return h.response().created()
    } catch(err) { return Boom.badImplementation(err) }
  }
}

module.exports.set = {
  tags: ['api', 'todos'],
  description: 'Update one todo of a project',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 3, } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
      todo: Joi.objectId().description('Task to update'),
    },
    payload: {
      content: Joi.string().required().description('Text of the task'),
      done: Joi.boolean().required().default(true).description('Task done or not'),
    },
  },
  handler: async request => {
    try {
      const { project, todo } = request.params

      const result = await Project.update(
        { _id: project, 'todos._id': todo },
        { $set: { 'todos.$': request.payload }},
        { runValidators: true }
      )

      if (result.nModified === 0) { return Boom.notFound() }
      return result
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.badImplementation(err)
    }
  }
}

module.exports.remove = {
  tags: ['api', 'todos'],
  description: 'Remove one todo of a project',
  plugins: { 'hapi-swagger': { order: 4 } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
      todo: Joi.objectId().description('Task to remove'),
    },
  },
  handler: async request => {
    try {
      const { project, todo } = request.params

      const result = await Project.update(
        { _id: project },
        { $pull: { todos: { _id: todo } }},
        { runValidators: true }
      )

      if (result.nModified === 0) { return Boom.notFound() }
      return result
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.badImplementation(err)
    }
  }
}

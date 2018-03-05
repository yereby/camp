const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Todo = require('../models/todo')
const Project = require('../models/project')

module.exports.add = {
  tags: ['api'],
  validate: {
    params: {
      project: Joi.objectId(),
    },
    payload: {
      content: Joi.string().required(),
      done: Joi.boolean()
    }
  },
  handler: async request => {
    try {
      const project = request.params.project
      const { content, done } = request.payload

      const result = await Project.update(
        { _id: project },
        { $addToSet: { todos: { content, done } }},
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

module.exports.set = {
  tags: ['api'],
  validate: {
    params: {
      project: Joi.objectId(),
      todo: Joi.objectId(),
    },
    payload: {
      content: Joi.string().required(),
      done: Joi.boolean(),
    },
  },
  handler: async request => {
    try {
      console.log(request.params, request.payload)
      const { project, todo } = request.params

      const result = await Project.update(
        { _id: project, 'todos._id': todo },
        { $set: { 'todos.$': request.payload }},
        { runValidators: true }
      )

      if (result.n === 0) { return Boom.notFound() }
      return result
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.badImplementation(err)
    }
  }
}

module.exports.remove = {
  tags: ['api'],
  validate: {
    params: {
      project: Joi.objectId(),
      todo: Joi.objectId(),
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

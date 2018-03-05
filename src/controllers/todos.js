const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Todo = require('../models/todo')
const Project = require('../models/project')

/**
 * Show the list of all todos
 *
 * @example GET /todos
 * @return {Object} The list of todos || status code 404
 */
module.exports.list = {
  tags: ['api'],
  handler: () => {
    return Todo.find({})
      .then()
      .catch(err => Boom.badImplementation(err))
  }
}

/**
 * Create a todo
 *
 * @example POST /todos
 * @return {Object} Todo created || Some errors
 */
module.exports.create = {
  tags: ['api'],
  validate: {
    payload: {
      content: Joi.string(),
      done: Joi.boolean(),
    }
  },
  handler: async request => {
    try {
      return await Todo.create(request.payload)
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
      id: Joi.objectId(),
    },
  },
  handler: async request => {
    try {
      const id = request.params.id
      const result = await Todo.deleteOne({ _id: id })

      if (result.n === 0) { return Boom.notFound() }
      return result
    } catch(err) { console.log(err); return Boom.badImplementation(err) }
  }
}

const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Todo = require('../models/todo')

/**
 * Show the list of all todos
 *
 * @example GET /todos
 * @return {Object} The list of todos || status code 404
 */
module.exports.list = () => {
  return Todo.find({})
    .then()
    .catch(err => Boom.badImplementation(err))
}

/**
 * Create a todo
 *
 * @example POST /todos
 * @return {Object} Todo created || Some errors
 */
module.exports.create = {
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
      return Boom.forbidden(err)
    }
  }
}

module.exports.set = {
  validate: {
    params: {
      id: Joi.objectId(),
    },
    payload: {
      content: Joi.string(),
      done: Joi.boolean(),
    },
  },
  handler: async request => {
    try {
      const id = request.params.id
      const result = await Todo.update(
        { _id: id },
        request.payload,
        { runValidators: true }
      )

      if (result.n === 0) { return Boom.notFound() }
      return result
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.forbidden(err)
    }
  }
}

module.exports.remove = {
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

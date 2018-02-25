const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Project = require('../models/project')
const Todo = require('../models/todo')

/**
 * Show the list of all projects
 *
 * @example GET /projects
 * @return {Object} The list of projects || status code 404
 */
module.exports.list = () => {
  return Project.find({})
    .populate('todos')
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

module.exports.addTodo = {
  validate: {
    params: {
      project: Joi.objectId(),
    },
    payload: {
      content: Joi.string(),
    }
  },
  handler: async request => {
    try {
      const _id = request.params.project
      const content = request.payload.content

      const todo = await Todo.create({ content })

      return await Project.update(
        { _id },
        { $addToSet: { todos: todo['_id'] }},
        { runValidators: true }
      )
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.forbidden(err)
    }
  }
}

module.exports.removeTodo = {
  validate: {
    params: {
      project: Joi.objectId(),
      todo: Joi.objectId(),
    },
  },
  handler: async request => {
    try {
      const { project, todo } = request.params

      return await Project.update(
        { _id: project },
        { $pull: { todos: todo }},
        { runValidators: true }
      )
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.forbidden(err)
    }
  }
}

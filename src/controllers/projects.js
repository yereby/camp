const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Project = require('../models/project')
const Post = require('../models/post')

/**
 * Show the list of all projects
 *
 * @example GET /projects
 * @return {Object} The list of projects || status code 404
 */
module.exports.list = {
  tags: ['api'],
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
  tags: ['api'],
  validate: {
    payload: {
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      todos: Joi.array().allow(''),
      posts: Joi.array().allow('')
    }
  },
  handler: async request => {
    try {
      const { posts } = request.payload

      if (posts) {
        const newPosts = []
        for (let post of posts) {
          newPosts.push(await Post.create(post))
        }
        request.payload.posts = newPosts
      }

      return await Project.create(request.payload)
    } catch(err) {
      if (err.code === 11000) { return Boom.conflict(err) }
      return Boom.badImplementation(err)
    }
  }
}

module.exports.addTodo = {
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

module.exports.removeTodo = {
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

      console.log('aAAAAA', project, todo)
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

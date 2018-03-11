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
  plugins: { 'hapi-swagger': { order: 2 } },
  validate: {
    payload: {
      name: Joi.string().required().description('The name of the new project'),
      description: Joi.string().allow('').description('The description of the new project'),
      todos: Joi.array().allow('').description('Tasks to add to the project').items({
        content: Joi.string().required().description('Text of the task'),
        done: Joi.boolean().default(false).description('Task done or not'),
      }),
      posts: Joi.array().allow('').description('Posts to add to the project').items({
        title: Joi.string().required().description('Title of the post'),
        content: Joi.string().required().description('Content of the post'),
        author: Joi.string().required().description('Author of the post'),
      }),
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

module.exports.remove = {
  tags: ['api', 'projects'],
  description: 'Remove one project and all his todos and posts',
  plugins: { 'hapi-swagger': { order: 3 } },
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

const Boom = require('boom')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Project = require('../models/project')
const Post = require('../models/post')

const postPayloadValidation = {
  title: Joi.string().required().description('Title of the post'),
  content: Joi.string().required().description('Content of the post'),
}

module.exports.list = {
  tags: ['api', 'posts'],
  description: 'Display posts of a single project',
  plugins: { 'hapi-swagger': { order: 1 } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to fetch'),
    },
  },
  handler: async (request, h) => {
    try {
      const project = await Project
        .findOne({_id: request.params.project })
        .populate('posts')

      if (!project) { return Boom.notFound() }
      if (!project.posts.length) { return h.response().code(204) }

      return project.posts
    } catch(err) { return Boom.badImplementation(err) }
  }
}

module.exports.add = {
  tags: ['api', 'posts'],
  description: 'Add a post to a project',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 2, } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
    },
    payload: postPayloadValidation,
  },
  handler: async (request, h) => {
    try {
      const project = request.params.project

      const post = await Post.create(request.payload)

      const result = await Project.update(
        { _id: project },
        { $addToSet: { posts: post }},
        { runValidators: true }
      )

      if (result.nModified === 0) {
        await Post.remove(post)
        return Boom.notFound()
      }

      return h.response().created()
    } catch(err) { return Boom.badImplementation(err) }
  }
}

module.exports.set = {
  tags: ['api', 'posts'],
  description: 'Update one post of a project',
  plugins: { 'hapi-swagger': { payloadType: 'form', order: 3, } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
      post: Joi.objectId().description('Post to update'),
    },
    payload: postPayloadValidation,
  },
  handler: async (request, h) => {
    try {
      const { project, post } = request.params

      // Check the post is really in the project
      // And the project exists
      const result = await Project.findOne({
        _id: project,
        posts: { _id: post },
      })
      if (!result) { return Boom.notFound() }

      await Post.update(
        { _id: post },
        { $set: request.payload },
        { runValidators: true }
      )

      return h.response().code(204)
    } catch(err) { return Boom.badImplementation(err) }
  }
}

module.exports.remove = {
  tags: ['api', 'posts'],
  description: 'Remove one post of a project',
  plugins: { 'hapi-swagger': { order: 4 } },
  validate: {
    params: {
      project: Joi.objectId().description('ID of the project to update'),
      post: Joi.objectId().description('Task to remove'),
    },
  },
  handler: async (request, h) => {
    try {
      const { project, post } = request.params

      const result = await Project.update(
        { _id: project },
        { $pull: { posts: post }},
        { runValidators: true }
      )
      if (result.n === 0) { return Boom.notFound() }

      const res = await Post.remove({ _id: post })
      if (res.n === 0) { return Boom.notFound() }

      return h.response().code(204)
    } catch(err) { return Boom.badImplementation(err) }
  }
}

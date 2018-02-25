const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise
const ObjectId = Mongoose.Schema.Types.ObjectId

const Todo = require('./todo')

const projectSchema = new Mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: true,
  },
  description: String,
  todos: [Todo],
  posts: [{ type: ObjectId, ref: 'Post' }],
})

module.exports = Mongoose.model('Project', projectSchema)

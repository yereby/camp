const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const projectSchema = new Mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: true,
  },
  todos: [{
    name: String,
    done: Boolean,
  }],
  posts: [{
    text: String,
    author: String,
  }],
})

module.exports = Mongoose.model('Project', projectSchema)


const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const postSchema = new Mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: String,
  comments: [{ content: String, author: String }],
})

module.exports = Mongoose.model('Post', postSchema)

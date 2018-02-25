const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const postSchema = new Mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  content: String,
  author: String,
  comments: [{ content: String, author: String }],
})

module.exports = Mongoose.model('Post', postSchema)

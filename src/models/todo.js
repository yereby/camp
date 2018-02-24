const Mongoose = require('mongoose')
Mongoose.Promise = global.Promise

const todoSchema = new Mongoose.Schema({
  content: {
    type: String,
    index: true,
    trim: true,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
})

module.exports = Mongoose.model('Todo', todoSchema)

const Mongoose = require('mongoose')

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

module.exports = todoSchema

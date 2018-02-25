const Mongoose = require('mongoose')
const ObjectId = Mongoose.Schema.Types.ObjectId
Mongoose.Promise = global.Promise

const projectSchema = new Mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: true,
  },
  todos: [{ type: ObjectId, ref: 'Todo' }],
  posts: [{
    text: String,
    author: String,
  }],
})

module.exports = Mongoose.model('Project', projectSchema)

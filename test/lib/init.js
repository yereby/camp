const faker = require('faker/locale/fr')

module.exports.server = require('../../src/index')
module.exports.Todo = require('../../src/models/todo')
module.exports.Project = require('../../src/models/project')

const fakeTodos = [{
  content: faker.lorem.sentence(),
  done: faker.random.boolean(),
}]

module.exports.fakeTodos = fakeTodos

module.exports.fakeProjects = [{
  _id: '5a9db83a1bdec6079b92ae13',
  name: faker.lorem.sentence(),
  description: faker.lorem.paragraphs(),
  todos: fakeTodos,
  post: [],
}]

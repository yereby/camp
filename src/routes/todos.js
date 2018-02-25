const Todos = require('../controllers/todos')

module.exports = [
  { method: 'GET', path: '/todos', handler: Todos.list },
  { method: 'POST', path: '/todos', options: Todos.create },
  { method: 'PUT', path: '/todos/{id}', options: Todos.set },
  { method: 'DELETE', path: '/todos/{id}', options: Todos.remove },
]

const Todos = require('../controllers/todos')

module.exports = [
  { method: 'PUT', path: '/projects/{project}/todos', options: Todos.add },
  { method: 'PUT', path: '/projects/{project}/todos/{todo}', options: Todos.set },
  { method: 'DELETE', path: '/projects/{project}/todos/{todo}', options: Todos.remove },
]

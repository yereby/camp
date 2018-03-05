const Projects = require('../controllers/projects')
const Todos = require('../controllers/todos')

module.exports = [
  { method: 'GET', path: '/projects', options: Projects.list },
  { method: 'POST', path: '/projects', options: Projects.create },
  { method: 'PUT', path: '/projects/{project}/todos', options: Projects.addTodo },
  { method: 'PUT', path: '/projects/{project}/todos/{todo}', options: Todos.set },
  { method: 'DELETE', path: '/projects/{project}/todos/{todo}', options: Projects.removeTodo },
]

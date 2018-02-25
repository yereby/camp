const Projects = require('../controllers/projects')

module.exports = [
  { method: 'GET', path: '/projects', handler: Projects.list },
  { method: 'POST', path: '/projects', options: Projects.create },
  { method: 'PUT', path: '/projects/{project}/todo', options: Projects.addTodo },
  { method: 'DELETE', path: '/projects/{project}/todo/{todo}', options: Projects.removeTodo },
]

const Projects = require('../controllers/projects')

module.exports = [
  { method: 'GET', path: '/projects', options: Projects.list },
  { method: 'POST', path: '/projects', options: Projects.create },
  { method: 'PUT', path: '/projects/{project}', options: Projects.set },
  { method: 'DELETE', path: '/projects/{project}', options: Projects.remove },
]

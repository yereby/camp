const Projects = require('../controllers/projects')

module.exports = [
  { method: 'GET', path: '/projects', handler: Projects.list },
  { method: 'POST', path: '/projects', options: Projects.create },
]

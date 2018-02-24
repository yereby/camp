const Projects = require('../controllers/projects')

// ## Projects list

module.exports = [
  { method: 'GET', path: '/projects', handler: Projects.show },
]

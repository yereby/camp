const Home = require('./home')
const Statics = require('./statics')
const Projects = require('./projects')
const Todos = require('./todos')

module.exports = [...Home, ...Statics, ...Projects, ...Todos]

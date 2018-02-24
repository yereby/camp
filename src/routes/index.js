const Home = require('./home')
const Statics = require('./statics')
const Projects = require('./projects')

module.exports = [...Home, ...Statics, ...Projects]

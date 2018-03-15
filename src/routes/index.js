const Home = require('./home')
const Statics = require('./statics')
const Projects = require('./projects')
const Todos = require('./todos')
const Posts = require('./posts')

module.exports = [...Home, ...Statics, ...Projects, ...Posts, ...Todos]

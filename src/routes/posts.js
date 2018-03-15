const Posts = require('../controllers/posts')

module.exports = [
  { method: 'GET', path: '/projects/{project}/posts', options: Posts.list },
  { method: 'POST', path: '/projects/{project}/posts', options: Posts.add },
  { method: 'PUT', path: '/projects/{project}/posts/{post}', options: Posts.set },
  { method: 'DELETE', path: '/projects/{project}/posts/{post}', options: Posts.remove },
]

const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Project, Post } = require('../lib/init')

const { fakeProjects } = require('../lib/fixtures.js')
const fakeProject = fakeProjects[0]
const fakePostCreate = {
  title: fakeProject.posts[0].title,
  content: fakeProject.posts[0].content,
}

test('Before all', async () => {
  server.route(require('../../src/routes/posts'))
  await server.initialize()
})

test('Get the list of posts of a project', async t => {
  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/posts`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').chain('populate').resolves(fakeProject)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  let actual = res.result.length
  let expected = fakeProject.posts.length
  t.equal(actual, expected, 'Length is ok')

  actual = res.result[0].title
  expected = fakeProject.posts[0].title
  t.equal(actual, expected, 'Post is ok')
})


test('Get the list of posts of a project that does not exists', async t => {
  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/posts`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').chain('populate').resolves(null)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Get an empty list of posts of a project', async t => {
  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/posts`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').chain('populate').resolves({posts: []})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 204
  t.equal(actual, expected, 'status code = 204')
})

test('Add a valid post', async t => {
  const options = {
    method: 'POST',
    url: `/projects/${fakeProject._id}/posts`,
    payload: fakePostCreate
  }

  const postMock = sinon.mock(Post)
  postMock.expects('create').resolves({n: 1})

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 1})

  const res = await server.inject(options)
  postMock.verify()
  postMock.restore()
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 201
  t.equal(actual, expected, 'status code = 201')
})

test('Add a post to a project that does not exists', async t => {
  const options = {
    method: 'POST',
    url: `/projects/${fakeProject._id}/posts`,
    payload: fakePostCreate
  }

  const postMock = sinon.mock(Post)
  postMock.expects('create').resolves({n: 1})

  const postRemoveMock = sinon.mock(Post)
  postRemoveMock.expects('remove').resolves({n: 1})

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 0})

  const res = await server.inject(options)
  postMock.verify()
  postMock.restore()
  postRemoveMock.verify()
  postRemoveMock.restore()
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Add a post to a project with wrong params', async t => {
  const options = {
    method: 'POST',
    url: `/projects/${fakeProject._id}/posts`,
    payload: { title: fakePostCreate.title }
  }

  const res = await server.inject(options)

  const actual = res.statusCode
  const expected = 400
  t.equal(actual, expected, 'status code = 400')
})

test('Update a post', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/posts/${fakeProject.posts[0]._id}`,
    payload: fakePostCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').resolves(fakeProject)

  const postMock = sinon.mock(Post)
  postMock.expects('update').resolves({n: 1})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()
  postMock.verify()
  postMock.restore()

  const actual = res.statusCode
  const expected = 204
  t.equal(actual, expected, 'status code = 204')
})

test('Update a post or a project that does not exists', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/posts/${fakeProject.posts[0]._id}`,
    payload: fakePostCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').resolves(null)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Update a post with wrong params', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/posts/${fakeProject.posts[0]._id}`,
    payload: { content: fakePostCreate.content }
  }

  const res = await server.inject(options)

  const actual = res.statusCode
  const expected = 400
  t.equal(actual, expected, 'status code = 400')
})

test('Remove a post', async t => {
  const options = {
    method: 'DELETE',
    url: `/projects/${fakeProject._id}/posts/${fakeProject.posts[0]._id}`,
    payload: fakePostCreate
  }

  const postMock = sinon.mock(Post)
  postMock.expects('remove').resolves({n: 1})

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({n: 1})

  const res = await server.inject(options)
  postMock.verify()
  postMock.restore()
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 204
  t.equal(actual, expected, 'status code = 204')
})

test('Remove a post for a project that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: `/projects/${fakeProject._id}/posts/${fakeProject.posts[0]._id}`,
    payload: fakePostCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({n: 0})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Remove a post that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: `/projects/${fakeProject._id}/posts/${fakeProject.posts[0]._id}`,
    payload: fakePostCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({n: 1})

  const postMock = sinon.mock(Post)
  postMock.expects('remove').resolves({n: 0})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()
  postMock.verify()
  postMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

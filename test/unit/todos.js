const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Project } = require('../lib/init')

const { fakeProjects } = require('../lib/fixtures.js')
const fakeProject = fakeProjects[0]
const fakeTodo = fakeProject.todos[0]
const fakeTodoCreate = {
  content: fakeTodo.content,
  done: fakeTodo.done
}

test('Before all', async () => {
  server.route(require('../../src/routes/todos'))
  await server.initialize()
})

test('Get the list of todos of a project', async t => {
  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/todos`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').withArgs({ _id: fakeProject._id }).resolves(fakeProject)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  let actual = res.statusCode
  let expected = 200
  t.equal(actual, expected, 'status code = 200')

  actual = res.result[0].content
  expected = fakeProject.todos[0].content
  t.equal(actual, expected, 'Content is ok')
})

test('Get the list of todos of a project that does not exists', async t => {
  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/todos`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').withArgs({ _id: fakeProject._id }).resolves(null)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Get an empty todo list of a project', async t => {
  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/todos`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').withArgs({ _id: fakeProject._id }).resolves({todos: []})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 204
  t.equal(actual, expected, 'status code = 204')
})

test('Add a todo to a project', async t => {
  const options = {
    method: 'POST',
    url: `/projects/${fakeProject._id}/todos`,
    payload: fakeTodoCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 1})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 201
  t.equal(actual, expected, 'status code = 201')
})

test('Add a todo to a project that does not exists', async t => {
  const options = {
    method: 'POST',
    url: `/projects/${fakeProject._id}/todos`,
    payload: fakeTodoCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 0})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Add a todo to a project without good payload', async t => {
  const options = {
    method: 'POST',
    url: `/projects/${fakeProject._id}/todos`,
    payload: { done: true }
  }

  const res = await server.inject(options)

  const actual = res.statusCode
  const expected = 400
  t.equal(actual, expected, 'status code = 400')
})

test('Update a todo', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/todos/${fakeTodo._id}`,
    payload: fakeTodoCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 1})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 200
  t.equal(actual, expected, 'status code = 200')
})

test('Update a todo for a project that does not exists', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/todos/${fakeTodo._id}`,
    payload: fakeTodoCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 0})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Update a todo that does not exists', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/todos/${fakeTodo._id}`,
    payload: fakeTodoCreate
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({nModified: 0})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Update a todo with wrong payload', async t => {
  const options = {
    method: 'PUT',
    url: `/projects/${fakeProject._id}/todos/${fakeTodo._id}`,
    payload: { done: true }
  }

  const res = await server.inject(options)

  const actual = res.statusCode
  const expected = 400
  t.equal(actual, expected, 'status code = 400')
})

test('Remove a todo', async t => {
  const options = {
    method: 'DELETE',
    url: `/projects/${fakeProject._id}/todos/${fakeTodo._id}`,
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({n: 1})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 204
  t.equal(actual, expected, 'status code = 204')
})

test('Remove a todo that does not exists', async t => {
  const options = {
    method: 'DELETE',
    url: `/projects/${fakeProject._id}/todos/${fakeTodo._id}`,
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

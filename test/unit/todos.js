const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Project, fakeProjects } = require('../lib/init')

test('Before all', async () => {
  await server.liftOff()
})

test('Get the list of todos of a project', async t => {
  const fakeProject = fakeProjects[0]

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
  const fakeProject = fakeProjects[0]

  const options = {
    method: 'GET',
    url: `/projects/${fakeProject._id}/todos`
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('findOne').withArgs({ _id: fakeProject._id }).resolves(null)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  let actual = res.statusCode
  let expected = 404
  t.equal(actual, expected, 'status code = 404')
})

test('Get an empty todo list of a project', async t => {
  const fakeProject = fakeProjects[0]
  fakeProject.todos = []

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

  let actualTodo = res.result
  let expectedTodo = []
  t.same(actualTodo, expectedTodo, 'Todo list empty')
})

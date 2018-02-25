const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')
const faker = require('faker/locale/fr')

const server = require('../../src/index')
const Todo = require('../../src/models/todo')

const fakeTodo = [{
  content: faker.lorem.sentence(),
  done: faker.random.boolean(),
}]

test('Before all', async () => {
  await server.liftOff()
})

test('Get the list of todos', async t => {
  const options = {
    method: 'GET',
    url: '/todos'
  }

  const todoMocked = sinon.mock(Todo)
  todoMocked.expects('find').resolves(fakeTodo)

  const res = await server.inject(options)
  todoMocked.verify()
  todoMocked.restore()

  let actual = res.statusCode
  let expected = 200
  t.equal(actual, expected, 'status code = 200')

  actual = res.result.length
  expected = 1
  t.equal(actual, expected, 'Length must be 1')
})

test('Get an empty list of todos', async t => {
  const options = {
    method: 'GET',
    url: '/todos'
  }

  const todoMocked = sinon.mock(Todo)
  todoMocked.expects('find').resolves([])

  const res = await server.inject(options)
  todoMocked.verify()
  todoMocked.restore()

  let actual = res.statusCode
  let expected = 200
  t.equal(actual, expected, 'status code = 200')

  actual = res.result.length
  expected = 0
  t.equal(actual, expected, 'Length must be 0')
})

test('Get a list of todos with errors from DB', async t => {
  const options = {
    method: 'GET',
    url: '/todos'
  }

  const todoMocked = sinon.mock(Todo)
  todoMocked.expects('find').throws()

  const res = await server.inject(options)
  todoMocked.verify()
  todoMocked.restore()

  let actual = res.statusCode
  let expected = 500
  t.equal(actual, expected, 'status code = 500')
})

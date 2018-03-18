const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Project } = require('../lib/init')

const { fakeProjects } = require('../lib/fixtures.js')

test('Before all', async () => {
  await server.liftOff()
})

test('Get the home page', async t => {
  const options = {
    method: 'GET',
    url: '/'
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('find').chain('populate').resolves(fakeProjects)

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  let actual = res.statusCode
  let expected = 200
  t.equal(actual, expected, 'status code = 200')

})

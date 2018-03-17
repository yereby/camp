const test = require('tap').test
const sinon = require('sinon')
require('sinon-mongoose')

const { server, Project } = require('../lib/init')

const { fakeProjects } = require('../lib/fixtures.js')
const fakeProject = fakeProjects[0]
const fakeCreate = {
  name: fakeProject.name,
  description: fakeProject.description,
}


test('Before all', async () => {
  await server.liftOff()
})

/*
 * Get projects
 */
test('Get projects', async () => {
  test('Get the list of projects', async t => {
    const options = {
      method: 'GET',
      url: '/projects'
    }

    const projectMock = sinon.mock(Project)
    projectMock.expects('find').chain('populate').resolves(fakeProjects)

    const res = await server.inject(options)
    projectMock.verify()
    projectMock.restore()

    let actual = res.result.length
    let expected = fakeProjects.length
    t.equal(actual, expected, 'length is ok')

    actual = res.result[0].name
    expected = fakeProjects[0].name
    t.equal(actual, expected, 'name is ok')

    actual = res.result[0].todos
    expected = fakeProjects[0].todos
    t.equal(actual, expected, 'todos are ok')

    actual = res.result[0].posts
    expected = fakeProjects[0].posts
    t.equal(actual, expected, 'posts are ok')
  })

  test('Get an empty list', async t => {
    const options = {
      method: 'GET',
      url: '/projects'
    }

    const projectMock = sinon.mock(Project)
    projectMock.expects('find').chain('populate').resolves([])

    const res = await server.inject(options)
    projectMock.verify()
    projectMock.restore()

    const actual = res.result.length
    const expected = 0
    t.equal(actual, expected, 'length is ok')
  })
})

/*
 * Create projects
 */
test('Create a project', async () => {
  test('A valid one', async t => {
    const options = {
      method: 'POST',
      url: '/projects',
      payload: fakeCreate
    }

    const projectMock = sinon.mock(Project)
    projectMock.expects('create').resolves(fakeProject)

    const res = await server.inject(options)
    projectMock.verify()
    projectMock.restore()

    let actual = res.result.name
    let expected = fakeProject.name
    t.equal(actual, expected, 'Name is ok')

    actual = res.result.description
    expected = fakeProject.description
    t.equal(actual, expected, 'Description is ok')
  })

  test('With a duplicate name', async t => {
    const options = {
      method: 'POST',
      url: '/projects',
      payload: fakeCreate
    }

    const projectMock = sinon.mock(Project)
    projectMock.expects('create').throws({ code: 11000 })

    const res = await server.inject(options)
    projectMock.verify()
    projectMock.restore()

    const actual = res.statusCode
    const expected = 409
    t.equal(actual, expected, 'Send a 409 code')
  })

  test('With no name', async t => {
    const options = {
      method: 'POST',
      url: '/projects',
      payload: { description: fakeProject.description }
    }

    const res = await server.inject(options)

    const actual = res.statusCode
    const expected = 400
    t.equal(actual, expected, 'Send a 400 code')
  })
})

/*
 * Update a project
 */
test('Update a valid project', async t => {
  const options = {
    method: 'PUT',
    url: '/projects/' + fakeProject._id,
    payload: fakeCreate,
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({n: 1})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 204
  t.equal(actual, expected, 'Send a 204 code')
})

test('Update a project that does not exists', async t => {
  const options = {
    method: 'PUT',
    url: '/projects/' + fakeProject._id,
    payload: fakeCreate,
  }

  const projectMock = sinon.mock(Project)
  projectMock.expects('update').resolves({n: 0})

  const res = await server.inject(options)
  projectMock.verify()
  projectMock.restore()

  const actual = res.statusCode
  const expected = 404
  t.equal(actual, expected, 'Send a 404 code')
})

test('Update a project without the good payload', async t => {
  const options = {
    method: 'PUT',
    url: '/projects/' + fakeProject._id,
    payload: { description: fakeCreate.description },
  }

  const res = await server.inject(options)

  const actual = res.statusCode
  const expected = 400
  t.equal(actual, expected, 'Send a 400 code')
})

/*
 * Remove a project
 */
test('Remove a project', async () => {
  test('That exists', async t => {
    const options = {
      method: 'DELETE',
      url: '/projects/' + fakeProject._id,
    }

    const projectMock = sinon.mock(Project)
    projectMock.expects('remove').resolves({ n: 1 })

    const res = await server.inject(options)
    projectMock.verify()
    projectMock.restore()

    let actual = res.statusCode
    let expected = 200
    t.equal(actual, expected, 'Send a 200 code')

    actual = res.result.n
    expected = 1
    t.equal(actual, expected, 'Remove one project')
  })

  test('That does not exists', async t => {
    const options = {
      method: 'DELETE',
      url: '/projects/' + fakeProject._id,
    }

    const projectMock = sinon.mock(Project)
    projectMock.expects('remove').withArgs({_id: fakeProject._id}).resolves({ n: 0 })

    const res = await server.inject(options)
    projectMock.verify()
    projectMock.restore()

    const actual = res.statusCode
    const expected = 404
    t.equal(actual, expected, 'Send a 404 code')
  })
})

const faker = require('faker/locale/fr')

const fakeTodos = []
for (let i = 0; i < 5; i++) {
  fakeTodos.push({
    _id: `5a9db83a1bdec6079b92ae3${i}`,
    content: faker.lorem.sentence(),
    done: faker.random.boolean(),
  })
}

const fakePosts = []
for (let i = 0; i < 3; i++) {
  fakePosts.push({
    _id: `5a9db83a1bdec6079b92ae2${i}`,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    author: '',
    comments: [],
  })
}

const fakeProjects = []
for (let i = 0; i < 2; i++) {
  fakeProjects.push({
    _id: `5a9db83a1bdec6079b92ae1${i}`,
    name: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(),
    todos: fakeTodos,
    posts: fakePosts.map(post => post._id),
  })
}

exports.fakeTodos = fakeTodos
exports.fakePosts = fakePosts
exports.fakeProjects = fakeProjects

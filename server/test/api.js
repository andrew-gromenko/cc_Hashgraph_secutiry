const test = require('tape')
const request = require('supertest')
const app = require('../api/index')

test('POST /user', function (assert) {
  const user = { username: 'user' }
  request(app)
  .post('/user')
  .send(user)
  .expect(200)
  .end((err, res) => {
    assert.error(err, 'No error')
    assert.end()
  })
})

test('POST /user bad', function (assert) {
  const user = {}
  request(app)
  .post('/user')
  .send(user)
  .expect(400)
  .end((err, res) => {
    console.log(res.body)
    assert.error(err, 'No error')
    assert.end()
  })
})

test('POST /file', function (assert) {
  const file = { name: 'file.txt', encryptedString: 'string' }
  request(app)
  .post('/file')
  .send(file)
  .expect(200)
  .end((err, res) => {
    console.log(res.body)
    assert.error(err, 'No error')
    assert.end()
  })
})

test('POST /file bad', function (assert) {
  const file = {}
  request(app)
  .post('/file')
  .send(file)
  .expect(400)
  .end((err, res) => {
    assert.error(err, 'No error')
    assert.end()
  })
})

test('POST /group', function (assert) {
  const group = { name: 'file.txt', tresorId: '1234' }
  request(app)
  .post('/group')
  .send(group)
  .expect(200)
  .end((err, res) => {
    assert.error(err, 'No error')
    assert.end()
  })
})

test('POST /group bad', function (assert) {
  const group = { name: 'file.txt', encryptedString: 'string' }
  request(app)
  .post('/group')
  .send(group)
  .expect(400)
  .end((err, res) => {
    assert.error(err, 'No error')
    assert.end()
  })
})

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}))

function replaceGroupFileIds (groups) {
  const files = router.db.get('files').value()

  return groups.map(({ name, fileIds }) => {
    return {
      name,
      files: fileIds.map(id => {
        let file = files.find(f => f.id === id)
        return {id, name: file.name}
      })
    }
  })
}

function submatch (str, sub) {
  return str.match(new RegExp(sub, 'i'))
}

server.get('/groups/user/:id', (req, res) => {
  const groups = router.db.get('groups').value()
  const userId = +req.params.id

  let userGroups = groups.filter(g => g.userIds.includes(userId))
  let fileGroups = replaceGroupFileIds(userGroups)

  res.jsonp(fileGroups)
})

server.get('/group/:id', (req, res) => {
  const { id } = +req.params
  const group = router.db.get('groups').value().find(g => g.id == id)

  res.jsonp(group)
})

server.get('/files/search/:subname', (req, res) => {
  const { subname } = req.params
  const files = router.db.get('files').value().filter(f => {
    return submatch(f.name, subname)
  })

  res.jsonp(files)
})

server.get('/users/search/:subname', (req, res) => {
  const { subname } = req.params
  const users = router.db.get('users').value().filter(u => {
    return submatch(u.name, subname)
  })

  res.jsonp(users)
})

server.patch('/group/:id/add/file/:fileId', (req, res) => {
  const { id, fileId } = req.params
  console.log('file ' + fileId + ' added')

  const file = router.db.get('files').find(f => f.id == fileId)

  res.jsonp(file)
})

server.patch('/group/:id/remove/file/:fileId', (req, res) => {
  const { id, fileId } = req.params
  console.log('file ' + fileId + ' removed')

  res.jsonp({})
})

server.patch('/group/:id/add/user/:fileId', (req, res) => {
  const { id, fileId } = req.params
  console.log('user ' + fileId + ' added')

  const user = router.db.get('users').find(f => f.id == fileId)

  res.jsonp(user)
})

server.patch('/group/:id/remove/user/:userId', (req, res) => {
  const { id, userId } = req.params
  console.log('user ' + userId + ' removed')

  res.jsonp({})
})

server.use(router)
server.use(middlewares)

server.listen(3004, () => {
  console.log('JSON Server is running')
})

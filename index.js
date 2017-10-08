const uuid = require('uuid/v4')
const jsonServer = require('json-server')

const router = jsonServer.router('db.json')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

const updateOrDelete = (req, res) => method => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'missing ID in request body' })
  }
  router.db.get('ideas')[method](req.body.id, req.body).write()
  res.json(req.body)
}

server.get('/ideas/new', (req, res) => {
  const doc = {
    id: uuid(),
    created_date: new Date().toISOString()
  }

  router.db.get('ideas').insert(doc).write()
  res.json(doc)
})

server.post('/idea/update', (req, res) => updateOrDelete(req, res)('updateById'))
server.post('/idea/delete', (req, res) => updateOrDelete(req, res)('removeById'))

server.use(router)
server.listen(3000, () => console.log('JSON Server is running'))

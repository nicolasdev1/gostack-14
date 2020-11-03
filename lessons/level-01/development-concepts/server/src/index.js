require('dotenv/config')

const express = require('express')
const cors = require('cors')
const { v4: uuid, validate: isUuid } = require('uuid')

const app = express()

app.use(cors())
app.use(express.json())

const projects = []

function logRequests(request, response, next) {
  const { method, url } = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next()

  console.timeEnd(logLabel)
}

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id))
    return response.status(400).json({ error: 'Invalid project ID.' })

  return next()
}

app.use(logRequests)
app.use('/projects/:id', validateProjectId)

app.get('/projects', (request, response) => {
  console.log('3')

  const { title } = request.query

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects

  return response.status(200).json(results)
})

app.post('/projects', (request, response) => {
  const { title, owner } = request.body

  const project = { id: uuid(), title, owner }

  projects.push(project)

  return response.status(201).json(project)
})

app.put('/projects/:id', (request, response) => {
  const { id } = request.params
  const { title, owner } = request.body

  const index = projects.findIndex((project) => project.id === id)

  if (index === -1)
    return response.status(400).json({ error: 'Project not found' })

  const project = {
    id,
    title,
    owner,
  }

  projects[index] = project

  return response.status(200).json(projects[index])
})

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params

  const index = projects.findIndex((project) => project.id === id)

  if (index === -1)
    return response.status(400).json({ error: 'Project not found' })

  projects.splice(index, 1)

  return response.status(204).send()
})

app.listen(process.env.PORT, () =>
  console.log(`🎯 Listening on port ${process.env.PORT}...`)
)

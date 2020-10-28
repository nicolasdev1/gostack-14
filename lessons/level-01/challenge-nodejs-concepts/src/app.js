const express = require('express')
const cors = require('cors')

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get('/repositories', (_, response) => response.status(200).json(repositories))

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const id = uuid()

  try {
    const repository = {
      id,
      title,
      url,
      techs,
      likes: 0
    }

    repositories.push(repository)

    return response.status(201).json(repository)
  } catch (error) {
    return response.status(400).json(error)
  }
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  if (!isUuid(id)) return response.status(400).json({ message: 'ID inválido.' })

  const {
    title,
    url,
    techs
  } = request.body

  try {  
    const index = repositories.findIndex(repository => repository.id === id)

    if (!repositories[index]) return response.status(400).json({ error: 'Repositório não encontrado.' })

    const newRepository = {
      id,
      title,
      url,
      techs,
      likes: repositories[index].likes
    }

    repositories[index] = newRepository

    return response.status(200).json(newRepository)
  } catch (error) {
    return response.status(400).json(error)
  }
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  try {
    const index = repositories.findIndex(repository => repository.id === id)

    if (index === -1) return response.status(400).json({ message: 'Repositório não encontrado.' })

    repositories.splice(index, 1)

    return response.status(204).send()
  } catch (error) {
    return response.status(400).json(error)
  }
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  try {
    const index = repositories.findIndex(repository => repository.id === id)

    if (index === -1) return response.status(400).json({ message: 'Repositório não encontrado.' })

    const newRepository = {
      ...repositories[index],
      likes: repositories[index].likes + 1
    }

    repositories[index] = newRepository

    return response.status(201).json({ likes: newRepository.likes })
  } catch (error) {
    return response.status(400).json(error)
  }
})

module.exports = app

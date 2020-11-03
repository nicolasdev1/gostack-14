import React, { useEffect, useState } from 'react'
import api from './services/api'

import './styles.css'

function App() {
  const [repositories, setRepositories] = useState([])

  async function handleLoadRepositories() {
    const response = await api.get('/repositories')

    setRepositories(response.data)
  }
  
  async function handleAddRepository() {
    const data = {
      title: 'nicolasdev1',
      url: 'https://github.com/nicolasdev1/nicolasdev1',
      techs: [
        'ReactJS',
        'React Native',
        'Node.js'
      ]
    }

    const response = await api.post('/repositories', data)

    setRepositories([ ...repositories, response.data ])
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`)

    setRepositories(repositories.filter(repository => repository.id !== id))
  }

  async function handleAddLikeInRepository(id) {
    await api.post(`/repositories/${id}/like`)

    const index = repositories.findIndex(repository => repository.id === id)

    setRepositories([ repositories[index] = {
      ...repositories[index], likes: repositories[index].likes += 1
    } ])
  }

  useEffect(() => {
    handleLoadRepositories()
  }, [])

  return (
    <div>
      <ul data-testid='repository-list'>
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <br />
            {repository.likes}

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>

            <button onClick={() => handleAddLikeInRepository(repository.id)}>
              Like
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  )
}

export default App

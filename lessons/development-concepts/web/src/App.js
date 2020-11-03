import React, { useEffect, useState } from 'react'

import api from './services/api'
import Header from './components/Header'

import backgroundImage from './assets/background.jpeg'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])

  async function handleAddProject() {
    const data = {
      title: 'Front-end com ReactJS',
      owner: 'Nícolas Carvalho',
    }

    const response = await api.post('projects', data)

    setProjects((oldProjects) => [...oldProjects, response.data])
  }

  async function handleLoadProjects() {
    const response = await api.get('projects')

    setProjects(response.data)
  }

  async function handleRemoveProject(id) {
    await api.delete(`projects/${id}`)

    setProjects(projects.filter((project) => project.id !== id))
  }

  useEffect(() => {
    handleLoadProjects()
  }, [])

  return (
    <>
      <Header title="Projects" />

      <img width={512} src={backgroundImage} alt="Imagem de fundo" />

      <ul>
        {projects.map((project) => (
          <div key={project.id}>
            <li>{project.title}</li>
            <li>{project.owner}</li>

            <button
              type="button"
              onClick={() => handleRemoveProject(project.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </ul>

      <button type="button" onClick={handleAddProject}>
        Adicionar projeto
      </button>
    </>
  )
}

export default App

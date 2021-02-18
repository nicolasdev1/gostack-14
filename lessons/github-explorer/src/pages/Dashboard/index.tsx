import { useState, FormEvent } from 'react'

import { FiChevronRight } from 'react-icons/fi'

import api from '../../services/api'

import { Title, Form, Repositories } from './styles'
import logoImg from '../../assets/logo.svg'

interface Repository {
    
}

const Dashboard: React.FC = () => {
    const [newRepository, setNewRepository] = useState('')
    const [repositories, setRepositories] = useState([])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        const { data } = await api.get(`repos/${newRepository}`)

        setRepositories([...repositories, data])
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form onSubmit={handleAddRepository}>
                <input
                    value={newRepository}
                    onChange={event => setNewRepository(event.target.value)}
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            <Repositories>
                <a href="test">
                    <img
                        src="https://avatars.githubusercontent.com/u/56241288?s=460&u=8641d9b9ac08aa43eebac41b25bac5c6f3f6bf9e&v=4"
                        alt="Nícolas Carvalho"
                    />
                    <div>
                        <strong>nicolasdev1/clean-architecture-app</strong>
                        <p>Swift application using Test-Driven Development (TDD) as a methodology.</p>
                    </div>
                    
                    <FiChevronRight size={20} />
                </a>
            </Repositories>
        </>
    )
}

export default Dashboard

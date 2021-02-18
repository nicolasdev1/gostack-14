import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

import api from '../../services/api'

import { Title, Form, Repositories, Error } from './styles'
import logoImg from '../../assets/logo.svg'

interface Repository {
    full_name: string
    description: string
    owner: {
        login: string
        avatar_url: string
    }
}

const Dashboard: React.FC = () => {
    const [newRepository, setNewRepository] = useState<string>('')
    const [inputError, setInputError] = useState<string>('')
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories')

        if (!storagedRepositories) return []

        return JSON.parse(storagedRepositories)
    })

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        
        if (!newRepository) {
            return setInputError('Digite o autor/nome do repositório.')
        }

        try {
            const { data } = await api.get<Repository>(`repos/${newRepository}`)

            setRepositories([...repositories, data])
            setNewRepository('')
        } catch {
            setInputError('Ocorreu um erro ao buscar o repositório.')
        }
    }

    function onChange(event: ChangeEvent<HTMLInputElement>): void {
        setNewRepository(event.target.value)
        setInputError('')
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepository}
                    onChange={onChange}
                    placeholder="Digite o nome/autor do repositório"
                    autoComplete="none"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard

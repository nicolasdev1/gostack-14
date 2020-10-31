import React, { useCallback, useEffect, useMemo, useState } from 'react'

import api from './services/api'

import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

export default function App() {
  const [repositories, setRepositories] = useState([])

  async function handleLoadRepositories() {
    const response = await api.get('/repositories')
  
    console.log('get')
  
    setRepositories(response.data)
  }

  async function handleCreateRepository() {
    const data = {
      title: 'nicolasdev1',
      url: 'https://github.com/nicolasdev1/nicolasdev1',
      techs: [
        "ReactJS",
        "Node.js",
        "React Native"
      ]
    }

    const response = await api.post('/repositories', data)

    setRepositories([...repositories, response.data])
  }

  async function handleLikeRepository(id) {
    await api.post(`/repositories/${id}/like`)

    repositories.filter(repository => {
      if (repository.id === id)
        repository.likes = repository.likes += 1
    })

    setRepositories([ ...repositories ])
  }

  async function handleDeleteRepository(id) {
    await api.delete(`/repositories/${id}`)

    setRepositories(repositories.filter(repository => repository.id !== id))
  }

  useEffect(() => {
    handleLoadRepositories()
  }, [])

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor='#7159c1' />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateRepository}
        >
          <Text style={[styles.buttonText, { marginBottom: 10, marginLeft: 10, backgroundColor: '#50c878', }]}>Adicionar</Text>
        </TouchableOpacity>
        {repositories.map((repository, index) => (
          <View key={index} style={styles.repositoryContainer}>
            <Text style={styles.repository}>{repository.title}</Text>

            <View style={styles.techsContainer}>
              {repository.techs.map((tech, index) => (
                <Text key={index} style={styles.tech}>
                  {tech}
                </Text>
              ))}
            </View>

            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes <= 1 ? `${repository.likes} curtida` : `${repository.likes} curtidas`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repository.id)}

              testID={`like-button-${repository.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDeleteRepository(repository.id)}

              testID={`like-button-${repository.id}`}
            >
              <Text style={[styles.buttonText, { backgroundColor: '#9b111e', }]}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
  }
})

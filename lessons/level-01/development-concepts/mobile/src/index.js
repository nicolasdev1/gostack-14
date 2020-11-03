import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native'

import api from './services/api'

const App = () => {
  const [projects, setProjects] = useState([])

  const handleLoadProjects = async () => {
    const { data } = await api.get('projects')

    setProjects(data)
  }

  const handleAddProject = async () => {
    const data = {
      title: `Novo projeto ${Date.now()}`,
      owner: 'Nícolas Carvalho',
    }

    const { data: project } = await api.post('projects', data)

    setProjects((oldProjects) => [...oldProjects, project])
  }

  useEffect(() => {
    handleLoadProjects()
  }, [])

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <FlatList
          keyExtractor={(project) => project.id}
          data={projects}
          renderItem={({ item: project }) => (
            <View>
              <Text style={styles.project}>{project.title}</Text>
              <Text style={styles.project}>{project.owner}</Text>
            </View>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={handleAddProject}
        >
          <Text style={styles.buttonText}>Adicionar projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  project: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
})

export default App

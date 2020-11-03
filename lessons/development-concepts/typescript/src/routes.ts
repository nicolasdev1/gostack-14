import { Request, Response } from 'express'
import createUser from './services/CreateUser'

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    // name: 'Nícolas Carvalho',
    email: 'nicolaspessoal@icloud.com',
    password: 'nicolas123',
    techs: [
      'Node.js',
      'ReactJS',
      { title: 'Javascript', experience: 100 }
    ]
  })

  return response.json(user)
}

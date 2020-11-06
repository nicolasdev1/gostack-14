import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())

app.post('/users', (request: Request, response: Response) => {
  const { name, email } = request.body

  const user = {
    name,
    email,
  }

  return response.status(201).json(user)
})

app.listen(5555, () => console.log('Server started on port 5555!'))

import { Router, Request, Response } from 'express'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'

const transactions = Router()

const transactionsRepository = new TransactionsRepository()

transactions.get('/', (_: Request, response: Response) => {
  try {
    const transactions = transactionsRepository.all()

    const balance = transactionsRepository.getBalance()

    return response.status(200).json({
      transactions,
      balance
    })
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

transactions.post('/', (request: Request, response: Response) => {
  try {
    const { title, value, type } = request.body

    const createTransaction = new CreateTransactionService(transactionsRepository)

    const transaction = createTransaction.execute({ title, value, type })

    return response.status(201).json(transaction)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

export default transactions

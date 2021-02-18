import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'

import AppError from '../errors/AppError'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = await getCustomRepository(
      TransactionsRepository
    )

    const transaction = await transactionsRepository.findOne(id)

    if (!transaction) {
      throw new AppError('The transaction does not exist.')
    }

    await transactionsRepository.remove(transaction)
  }
}

export default DeleteTransactionService

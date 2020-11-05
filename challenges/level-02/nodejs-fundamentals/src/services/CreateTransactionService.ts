import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'

interface RequestDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    const typeAccepted = type === 'income' || type === 'outcome'

    if (!typeAccepted) {
      throw Error('Only two types are possible, income or outcome.')
    }

    const { total } = this.transactionsRepository.getBalance()

    if (type === 'outcome' && value > total)
      throw Error('You do not have enough balance.')

    const transaction = this.transactionsRepository.create({ title, value, type })

    return transaction
  }
}

export default CreateTransactionService

import { getCustomRepository, getRepository, In } from 'typeorm'
import csvParse from 'csv-parse'
import fs from 'fs'

import Transaction from '../models/Transaction'
import Category from '../models/Category'

import TransactionsRepository from '../repositories/TransactionsRepository'

interface CsvTransaction {
  title: string
  type: 'income' | 'outcome'
  value: number
  category: string
}

class ImportTransactionsService {
  public async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = await getCustomRepository(
      TransactionsRepository
    )
    const categoriesRepository = await getRepository(Category)

    const contactsReadStream = fs.createReadStream(filePath)

    const parser = csvParse({
      from_line: 2
    })

    const parseCsv = contactsReadStream.pipe(parser)

    const transactions: CsvTransaction[] = []
    const categories: string[] = []

    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim()
      )

      if (!title || !type || !value || !category) return

      categories.push(category)

      transactions.push({ title, type, value, category })
    })

    await new Promise(resolve => parseCsv.on('end', resolve))

    const existingCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    })

    const existingCategoriesTitle = existingCategories.map(
      (category: Category) => category.title
    )

    const addCategoriesTitles = categories
      .filter(category => !existingCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index)

    const newCategories = categoriesRepository.create(
      addCategoriesTitles.map(title => ({
        title
      }))
    )

    await categoriesRepository.save(newCategories)

    const finalCategories = [...newCategories, ...existingCategories]

    const newTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category
        )
      }))
    )

    await transactionsRepository.save(newTransactions)

    await fs.promises.unlink(filePath)

    return newTransactions
  }
}

export default ImportTransactionsService

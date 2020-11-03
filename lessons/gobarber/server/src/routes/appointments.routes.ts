import { Request, Response, Router } from 'express'
import { v4 as uuid } from 'uuid'
import { startOfHour, parseISO } from 'date-fns'

const appointmentsRouter = Router()

const appointments = []

appointmentsRouter.post('/', (request: Request, response: Response) => {
    const { barber, date } = request.body

    const parsedDate = startOfHour(parseISO(date))

    const appointment = {
        id: uuid(),
        barber,
        date: parsedDate
    }

    appointments.push(appointment)

    return response.status(200).json(appointment)
})

export default appointmentsRouter

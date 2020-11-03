import { Request, Response, Router } from 'express'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()
const appointmentsRepository = new AppointmentsRepository()

appointmentsRouter.get('/', (_: Request, response: Response) => {
  const appointments = appointmentsRepository.all()

  return response.status(200).json(appointments)
})

appointmentsRouter.post('/', (request: Request, response: Response) => {
  try {
    const { barber, date } = request.body

    const parsedDate = parseISO(date)

    const createAppointment = new CreateAppointmentService(
      appointmentsRepository
    )

    const appointment = createAppointment.execute({ barber, date: parsedDate })

    return response.status(201).json(appointment)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

export default appointmentsRouter

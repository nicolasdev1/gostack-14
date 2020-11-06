import { Request, Response, Router } from 'express'
import { startOfHour, parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'

const appointmentsRouter = Router()
const appointmentsRepository = new AppointmentsRepository()

appointmentsRouter.get('/', (_: Request, response: Response) => {
  const appointments = appointmentsRepository.all()

  return response.status(200).json(appointments)
})

appointmentsRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body

  const parsedDate = startOfHour(parseISO(date))

  const findAppointmentInSameDate = appointmentsRepository.findByDate(
    parsedDate
  )

  if (findAppointmentInSameDate)
    return response
      .status(400)
      .json({ error: 'This appointment is already booked.' })

  const appointment = appointmentsRepository.create({
    provider,
    date: parsedDate
  })

  return response.status(201).json(appointment)
})

export default appointmentsRouter

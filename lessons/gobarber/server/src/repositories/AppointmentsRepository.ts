import Appointment from '../models/Appointment'
import { isEqual } from 'date-fns'

interface CreateAppointmentDTO {
  barber: string
  date: Date
}

class AppointmentsRepository {
  private appointments: Appointment[]

  constructor() {
    this.appointments = []
  }

  public findByDate(date: Date): Appointment | null {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date)
    )

    return findAppointment || null
  }

  public all(): Appointment[] {
    return this.appointments
  }

  public create({ barber, date }: CreateAppointmentDTO): Appointment {
    const appointment = new Appointment({ barber, date })

    this.appointments.push(appointment)

    return appointment
  }
}

export default AppointmentsRepository

'use server'
import { auth } from '@/auth'
import { createScreening, updateScreening, deleteScreening } from '@/lib/admin-db'
import { getRoomsByCinema } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAuth() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
}

export async function createScreeningAction(formData: FormData) {
  await requireAuth()

  await createScreening({
    movieId:          Number(formData.get('movieId')),
    roomId:           Number(formData.get('roomId')),
    date:             formData.get('date')   as string,
    time:             formData.get('time')   as string,
    projectionFormat: (formData.get('format') as string) || null,
  })

  revalidatePath('/admin/screenings')
  revalidatePath('/')
  redirect('/admin/screenings')
}

export async function updateScreeningAction(id: number, formData: FormData) {
  await requireAuth()

  await updateScreening(id, {
    movieId:          Number(formData.get('movieId')),
    roomId:           Number(formData.get('roomId')),
    date:             formData.get('date')   as string,
    time:             formData.get('time')   as string,
    projectionFormat: (formData.get('format') as string) || null,
  })

  revalidatePath('/admin/screenings')
  revalidatePath('/')
  redirect('/admin/screenings')
}

export async function deleteScreeningAction(id: number) {
  await requireAuth()
  await deleteScreening(id)
  revalidatePath('/admin/screenings')
  revalidatePath('/')
  redirect('/admin/screenings')
}

export async function getRoomsForCinemaAction(cinemaId: number) {
  await requireAuth()
  return getRoomsByCinema(cinemaId)
}

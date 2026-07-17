'use server'
import { createCinema, updateCinema, deleteCinema, createRoom, deleteRoom } from '@/lib/admin-db'
import { requireAuth } from '@/lib/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCinemaAction(formData: FormData) {
  await requireAuth()

  const name = formData.get('name') as string
  if (!name?.trim()) throw new Error('Name is required')

  const cinema = await createCinema({
    name:    name.trim(),
    address: (formData.get('address') as string) || null,
    active:  formData.get('active') !== 'false',
  })

  const roomNumber = (formData.get('roomNumber') as string)?.trim()
  if (roomNumber) {
    await createRoom({ cinemaId: cinema.id, number: roomNumber })
  }

  revalidatePath('/admin/cinemas')
  redirect('/admin/cinemas')
}

export async function updateCinemaAction(id: number, formData: FormData) {
  await requireAuth()

  await updateCinema(id, {
    name:    (formData.get('name')    as string).trim(),
    address: (formData.get('address') as string) || null,
    active:  formData.get('active') === 'on',
  })

  revalidatePath('/admin/cinemas')
  redirect('/admin/cinemas')
}

export async function deleteCinemaAction(id: number) {
  await requireAuth()
  await deleteCinema(id)
  revalidatePath('/admin/cinemas')
  redirect('/admin/cinemas')
}

export async function addRoomAction(cinemaId: number, formData: FormData) {
  await requireAuth()

  const number = (formData.get('number') as string)?.trim()
  if (!number) throw new Error('Room number is required')

  await createRoom({ cinemaId, number })

  revalidatePath(`/admin/cinemas/${cinemaId}`)
}

export async function deleteRoomAction(cinemaId: number, roomId: number) {
  await requireAuth()
  await deleteRoom(roomId)
  revalidatePath(`/admin/cinemas/${cinemaId}`)
}

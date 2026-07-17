'use server'
import { createMovie, updateMovie, deleteMovie } from '@/lib/admin-db'
import { requireAuth } from '@/lib/require-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createFilmAction(formData: FormData) {
  await requireAuth()

  const title = formData.get('title') as string
  if (!title?.trim()) throw new Error('Title is required')

  await createMovie({
    title:           title.trim(),
    posterUrl:       (formData.get('posterUrl')  as string) || null,
    synopsis:        (formData.get('synopsis')   as string) || null,
    rating:          (formData.get('rating')     as string) || null,
    director:        (formData.get('director')   as string) || null,
    country:         (formData.get('country')    as string) || null,
    durationMinutes: formData.get('duration')    ? Number(formData.get('duration'))    : null,
    tmdbId:          formData.get('tmdbId')      ? Number(formData.get('tmdbId'))      : null,
    voteAverage:     (formData.get('voteAverage') as string) || null,
    isFeatured:      formData.get('isFeatured') === 'on',
    manualEdit:      true,
  })

  revalidatePath('/admin/films')
  revalidatePath('/')
  redirect('/admin/films')
}

export async function updateFilmAction(id: number, formData: FormData) {
  await requireAuth()

  await updateMovie(id, {
    title:           (formData.get('title')       as string).trim(),
    posterUrl:       (formData.get('posterUrl')   as string) || null,
    synopsis:        (formData.get('synopsis')    as string) || null,
    rating:          (formData.get('rating')      as string) || null,
    director:        (formData.get('director')    as string) || null,
    country:         (formData.get('country')     as string) || null,
    durationMinutes: formData.get('duration')     ? Number(formData.get('duration'))    : null,
    tmdbId:          formData.get('tmdbId')       ? Number(formData.get('tmdbId'))      : null,
    voteAverage:     (formData.get('voteAverage') as string) || null,
    isFeatured:      formData.get('isFeatured') === 'on',
    manualEdit:      true,
  })

  revalidatePath('/admin/films')
  revalidatePath(`/film/${id}`)
  revalidatePath('/')
  redirect('/admin/films')
}

export async function deleteFilmAction(id: number) {
  await requireAuth()
  await deleteMovie(id)
  revalidatePath('/admin/films')
  revalidatePath('/')
  redirect('/admin/films')
}

import { getScreenings } from '@/lib/db'
import HomeClient from './components/HomeClient'

export const revalidate = 3600; 

export default async function Home() {

  const screenings = await getScreenings();

  return (
    <HomeClient initialScreenings={screenings} />
  )
}
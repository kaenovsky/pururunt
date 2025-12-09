import { getScreenings } from '@/lib/db'
import HomeClient from './components/HomeClient'
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const revalidate = 3600; 

export default async function Home() {

  const screenings = await getScreenings();

  return (
    <>
      <Navbar />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <HomeClient initialScreenings={screenings} />
      </main>      
      <Footer />
    </>
  )
}
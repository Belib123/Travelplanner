import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DestinationHero } from '@/components/destination-hero'
import { DestinationInfo } from '@/components/destination-info'
import { DestinationRatings } from '@/components/destination-ratings'
import { NearbyAttractions } from '@/components/nearby-attractions'
import type { Destination, NearbyAttraction, DestinationRating } from '@/lib/types'

interface DestinationPageProps {
  params: Promise<{ id: string }>
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Fetch destination
  const { data: destination, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !destination) {
    notFound()
  }

  // Fetch ratings with profiles
  const { data: ratings } = await supabase
    .from('destination_ratings')
    .select('*, profile:profiles(*)')
    .eq('destination_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate average rating
  const avgRating = ratings && ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : null

  // Fetch nearby attractions
  const { data: attractions } = await supabase
    .from('nearby_attractions')
    .select('*')
    .eq('destination_id', id)
    .order('distance_km', { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <DestinationHero 
          destination={destination as Destination} 
          averageRating={avgRating}
          ratingCount={ratings?.length || 0}
        />
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DestinationInfo destination={destination as Destination} />
              <DestinationRatings 
                destinationId={id} 
                ratings={(ratings as DestinationRating[]) || []}
                averageRating={avgRating}
              />
            </div>
            
            <div className="space-y-6">
              <NearbyAttractions attractions={(attractions as NearbyAttraction[]) || []} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

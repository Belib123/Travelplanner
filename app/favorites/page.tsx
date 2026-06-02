import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DestinationCard } from '@/components/destination-card'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { SavedDestination, Destination } from '@/lib/types'

export default async function FavoritesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: savedDestinations } = await supabase
    .from('saved_destinations')
    .select('*, destination:destinations(*)')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
              <p className="text-muted-foreground">
                {savedDestinations?.length || 0} saved destination{savedDestinations?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/destinations">Explore More</Link>
            </Button>
          </div>

          {savedDestinations && savedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(savedDestinations as SavedDestination[]).map((saved) => (
                saved.destination && (
                  <DestinationCard 
                    key={saved.id} 
                    destination={saved.destination as Destination}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring destinations and save the ones you dream of visiting!
              </p>
              <Button asChild>
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

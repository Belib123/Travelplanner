import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DestinationCard } from '@/components/destination-card'
import { SearchBar } from '@/components/search-bar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Destination } from '@/lib/types'

const continents = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania']

interface DestinationsPageProps {
  searchParams: Promise<{ search?: string; continent?: string }>
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const params = await searchParams
  const search = params.search || ''
  const continent = params.continent || ''
  
  const supabase = await createClient()
  
  let query = supabase.from('destinations').select('*')
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,country.ilike.%${search}%,description.ilike.%${search}%`)
  }
  
  if (continent && continent !== 'All') {
    query = query.eq('continent', continent)
  }
  
  const { data: destinations } = await query.order('name', { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-50 via-background to-amber-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Explore Destinations
              </h1>
              <p className="text-muted-foreground mb-6">
                Discover amazing places around the world and start planning your next adventure
              </p>
              <SearchBar placeholder="Search by name, country, or keyword..." size="lg" />
            </div>
            
            {/* Continent Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {continents.map((c) => (
                <Link
                  key={c}
                  href={c === 'All' ? '/destinations' : `/destinations?continent=${encodeURIComponent(c)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                >
                  <Badge
                    variant={continent === c || (c === 'All' && !continent) ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 ${
                      continent === c || (c === 'All' && !continent)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {c}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">
                  {destinations?.length || 0} destination{destinations?.length !== 1 ? 's' : ''} found
                </span>
                {(search || continent) && (
                  <span className="text-muted-foreground">
                    {search && `for "${search}"`}
                    {search && continent && ' in '}
                    {continent && continent !== 'All' && continent}
                  </span>
                )}
              </div>
              {(search || continent) && (
                <Link href="/destinations">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    Clear filters
                  </Badge>
                </Link>
              )}
            </div>

            {/* Destinations Grid */}
            {destinations && destinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(destinations as Destination[]).map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you are looking for
                </p>
                <Link href="/destinations">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    View all destinations
                  </Badge>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

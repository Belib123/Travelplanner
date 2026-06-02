import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { DestinationCard } from '@/components/destination-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Globe, Compass, Calculator, Heart, Map, Users } from 'lucide-react'
import type { Destination } from '@/lib/types'

const continents = [
  { name: 'Europe', icon: '🏰' },
  { name: 'Asia', icon: '🏯' },
  { name: 'North America', icon: '🗽' },
  { name: 'South America', icon: '🌄' },
  { name: 'Africa', icon: '🦁' },
  { name: 'Oceania', icon: '🏝️' },
]

const features = [
  {
    icon: Map,
    title: 'Discover Destinations',
    description: 'Explore stunning places around the world with detailed information, photos, and travel tips.',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Create your bucket list by saving destinations you dream of visiting someday.',
  },
  {
    icon: Compass,
    title: 'Plan Trips',
    description: 'Organize your adventures with our intuitive trip planner and itinerary builder.',
  },
  {
    icon: Calculator,
    title: 'Track Budget',
    description: 'Stay on top of your travel expenses with our comprehensive budget calculator.',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-background to-amber-50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwZDlmOGYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Globe className="h-3 w-3 mr-1" />
                Your Adventure Awaits
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Discover Your Next
                <span className="text-primary"> Dream Destination</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
                Plan unforgettable trips, explore stunning destinations, and track your travel budget all in one place.
              </p>
              <div className="max-w-xl mx-auto">
                <SearchBar placeholder="Where do you want to go?" />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {['Paris', 'Tokyo', 'Bali', 'Santorini'].map((place) => (
                  <Link key={place} href={`/destinations?search=${place}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      {place}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Continents Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Explore by Region</h2>
              <p className="text-muted-foreground">Find your perfect destination by continent</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {continents.map((continent) => (
                <Link 
                  key={continent.name} 
                  href={`/destinations?continent=${encodeURIComponent(continent.name)}`}
                  className="group"
                >
                  <div className="p-6 rounded-xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-center">
                    <span className="text-4xl mb-3 block">{continent.icon}</span>
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {continent.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Destinations</h2>
                <p className="text-muted-foreground">Handpicked places loved by travelers</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/destinations" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(destinations as Destination[])?.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Everything You Need to Travel</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From discovering destinations to tracking your budget, we have got all the tools for your perfect trip.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
                >
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-teal-600">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Your Journey Today
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Join thousands of travelers who plan their adventures with Wanderlust. Create your free account and start exploring.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/sign-up">Create Free Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/destinations">Browse Destinations</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

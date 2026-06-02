import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Compass, 
  Heart, 
  Map, 
  Calculator, 
  Plus, 
  Calendar,
  ArrowRight
} from 'lucide-react'
import { DestinationCard } from '@/components/destination-card'
import type { Trip, SavedDestination, Destination } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user's trips
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch saved destinations
  const { data: savedDestinations } = await supabase
    .from('saved_destinations')
    .select('*, destination:destinations(*)')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })
    .limit(4)

  // Stats
  const { count: totalTrips } = await supabase
    .from('trips')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: totalSaved } = await supabase
    .from('saved_destinations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const completedTrips = (trips as Trip[])?.filter(t => t.status === 'completed').length || 0

  const quickLinks = [
    { icon: Plus, label: 'New Trip', href: '/trips/new', color: 'bg-primary/10 text-primary' },
    { icon: Map, label: 'Destinations', href: '/destinations', color: 'bg-amber-100 text-amber-600' },
    { icon: Heart, label: 'Favorites', href: '/favorites', color: 'bg-red-100 text-red-600' },
    { icon: Calculator, label: 'Budget', href: '/budget', color: 'bg-teal-100 text-teal-600' },
  ]

  function getStatusColor(status: string) {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-700'
      case 'upcoming': return 'bg-amber-100 text-amber-700'
      case 'ongoing': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p className="text-muted-foreground">
              Ready to plan your next adventure?
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Compass className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalTrips || 0}</p>
                    <p className="text-xs text-muted-foreground">Total Trips</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Map className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedTrips}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalSaved || 0}</p>
                    <p className="text-xs text-muted-foreground">Saved Places</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {(trips as Trip[])?.filter(t => t.status === 'upcoming').length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className={`p-3 rounded-lg mb-3 ${link.color}`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <span className="font-medium">{link.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Trips */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Trips</CardTitle>
                    <CardDescription>Your recent and upcoming adventures</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/trips/new" className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Trip
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {trips && trips.length > 0 ? (
                    <div className="space-y-3">
                      {(trips as Trip[]).map((trip) => (
                        <Link key={trip.id} href={`/trips/${trip.id}`}>
                          <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{trip.name}</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  {trip.start_date && (
                                    <span>
                                      {new Date(trip.start_date).toLocaleDateString()}
                                      {trip.end_date && ` - ${new Date(trip.end_date).toLocaleDateString()}`}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge className={getStatusColor(trip.status)}>
                                {trip.status}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/trips" className="gap-2">
                          View All Trips
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Compass className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-4">No trips yet. Start planning your first adventure!</p>
                      <Button asChild>
                        <Link href="/trips/new">Create Your First Trip</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Saved Destinations */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Saved Places</CardTitle>
                    <CardDescription>Your bucket list</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/favorites">
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {savedDestinations && savedDestinations.length > 0 ? (
                    <div className="space-y-3">
                      {(savedDestinations as SavedDestination[]).map((saved) => (
                        <Link key={saved.id} href={`/destinations/${saved.destination_id}`}>
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                              {saved.destination?.hero_image_url ? (
                                <img 
                                  src={saved.destination.hero_image_url} 
                                  alt={saved.destination.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Map className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{saved.destination?.name}</p>
                              <p className="text-xs text-muted-foreground">{saved.destination?.country}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No saved places yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MapPin, Star, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalDestinations: number
  totalReviews: number
  avgRating: number
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDestinations: 0,
    totalReviews: 0,
    avgRating: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get total destinations
      const { count: destinationsCount } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true })

      // Get total reviews
      const { count: reviewsCount } = await supabase
        .from('destination_ratings')
        .select('*', { count: 'exact', head: true })

      // Get average rating
      const { data: ratingData } = await supabase
        .from('destination_ratings')
        .select('rating')

      const avgRating =
        ratingData && ratingData.length > 0
          ? (ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length).toFixed(2)
          : 0

      setStats({
        totalUsers: usersCount || 0,
        totalDestinations: destinationsCount || 0,
        totalReviews: reviewsCount || 0,
        avgRating: parseFloat(avgRating as string) || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard. Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinations</CardTitle>
            <MapPin className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDestinations}</div>
            <p className="text-xs text-gray-500 mt-1">Listed destinations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-gray-500 mt-1">User reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-gray-500 mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 text-center transition-colors"
          >
            <Users className="h-8 w-8 mx-auto mb-2 text-teal-600" />
            <p className="font-medium text-sm">Manage Users</p>
          </a>
          <a
            href="/admin/destinations"
            className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-center transition-colors"
          >
            <MapPin className="h-8 w-8 mx-auto mb-2 text-amber-600" />
            <p className="font-medium text-sm">Manage Destinations</p>
          </a>
          <a
            href="/admin/reviews"
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 text-center transition-colors"
          >
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="font-medium text-sm">View Reviews</p>
          </a>
          <a
            href="/admin/analytics"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-center transition-colors"
          >
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-sm">Analytics</p>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

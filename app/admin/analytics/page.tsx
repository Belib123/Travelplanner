'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Analytics {
  newUsersThisMonth: number
  newDestinationsThisMonth: number
  reviewsThisMonth: number
  topDestinations: { name: string; reviews: number; avgRating: number }[]
  userGrowth: { month: string; count: number }[]
}

export default function AnalyticsPage() {
  const supabase = createClient()
  const [analytics, setAnalytics] = useState<Analytics>({
    newUsersThisMonth: 0,
    newDestinationsThisMonth: 0,
    reviewsThisMonth: 0,
    topDestinations: [],
    userGrowth: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // Get new users this month
      const { count: newUsersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)

      // Get new destinations this month
      const { count: newDestCount } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)

      // Get reviews this month
      const { count: reviewsCount } = await supabase
        .from('destination_ratings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)

      // Get top destinations by review count
      const { data: topDest } = await supabase
        .from('destinations')
        .select(`
          name,
          destination_ratings(rating)
        `)
        .order('destination_ratings(rating)', { ascending: false })
        .limit(5)

      const topDestinations = topDest
        ?.map(d => ({
          name: d.name,
          reviews: d.destination_ratings?.length || 0,
          avgRating: d.destination_ratings && d.destination_ratings.length > 0
            ? (d.destination_ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / d.destination_ratings.length).toFixed(1)
            : 0,
        }))
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 5) || []

      setAnalytics({
        newUsersThisMonth: newUsersCount || 0,
        newDestinationsThisMonth: newDestCount || 0,
        reviewsThisMonth: reviewsCount || 0,
        topDestinations,
        userGrowth: [],
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Platform statistics and insights</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  New Users This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-600">
                  {analytics.newUsersThisMonth}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  New Destinations This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {analytics.newDestinationsThisMonth}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Reviews This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {analytics.reviewsThisMonth}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Destinations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations by Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topDestinations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No destination data available
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.topDestinations.map((dest, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{dest.name}</p>
                        <p className="text-sm text-gray-500">
                          {dest.reviews} reviews • ★ {dest.avgRating}/5 avg rating
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">#{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Growth Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Growth chart visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

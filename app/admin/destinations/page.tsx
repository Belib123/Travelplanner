'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Search, Plus } from 'lucide-react'

interface Destination {
  id: string
  name: string
  country: string
  continent: string | null
  average_cost_per_day: number | null
  currency: string
  created_at: string
  average_rating?: number
}

export default function DestinationsPage() {
  const supabase = createClient()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDestination, setDeleteDestination] = useState<Destination | null>(null)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select(`
          id,
          name,
          country,
          continent,
          average_cost_per_day,
          currency,
          created_at,
          destination_ratings(rating)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formatted = data?.map(d => ({
        ...d,
        average_rating: d.destination_ratings && d.destination_ratings.length > 0
          ? (d.destination_ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / d.destination_ratings.length).toFixed(1)
          : 0,
      })) || []

      setDestinations(formatted)
    } catch (error) {
      console.error('Error fetching destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDestination = async (destination: Destination) => {
    try {
      // Delete related data first
      await supabase
        .from('destination_ratings')
        .delete()
        .eq('destination_id', destination.id)

      await supabase
        .from('nearby_attractions')
        .delete()
        .eq('destination_id', destination.id)

      await supabase
        .from('destination_photos')
        .delete()
        .eq('destination_id', destination.id)

      // Delete the destination
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', destination.id)

      if (error) throw error

      setDestinations(destinations.filter(d => d.id !== destination.id))
      setDeleteDestination(null)
    } catch (error) {
      console.error('Error deleting destination:', error)
    }
  }

  const filteredDestinations = destinations.filter(
    d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-600 mt-2">Manage travel destinations</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Destination
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Destinations List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No destinations found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Continent</TableHead>
                    <TableHead>Cost/Day</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDestinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell className="font-medium">{destination.name}</TableCell>
                      <TableCell>{destination.country}</TableCell>
                      <TableCell>{destination.continent || 'N/A'}</TableCell>
                      <TableCell>
                        {destination.average_cost_per_day
                          ? `${destination.currency} ${destination.average_cost_per_day}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          ★ {destination.average_rating || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(destination.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit size={16} />
                            Edit
                          </Button>
                          <Button
                            onClick={() => setDeleteDestination(destination)}
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDestination}
        onOpenChange={(open) => !open && setDeleteDestination(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Destination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteDestination?.name}? This will also delete all
              associated reviews, photos, and attractions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDestination && handleDeleteDestination(deleteDestination)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

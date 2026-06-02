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
import { Trash2, Search, Eye } from 'lucide-react'

interface Review {
  id: string
  destination_id: string
  user_id: string
  rating: number
  review: string | null
  created_at: string
  destination?: { name: string }
  profile?: { full_name: string | null; email: string }
}

export default function ReviewsPage() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteReview, setDeleteReview] = useState<Review | null>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('destination_ratings')
        .select(`
          id,
          destination_id,
          user_id,
          rating,
          review,
          created_at,
          destinations(name),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (review: Review) => {
    try {
      const { error } = await supabase
        .from('destination_ratings')
        .delete()
        .eq('id', review.id)

      if (error) throw error

      setReviews(reviews.filter(r => r.id !== review.id))
      setDeleteReview(null)
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-blue-100 text-blue-800'
    if (rating >= 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const filteredReviews = reviews.filter(
    r =>
      (r.destination?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (r.profile?.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (r.review?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600 mt-2">Manage user reviews and ratings for destinations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by destination, user, or review text..."
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
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        {review.destination?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{review.profile?.full_name || 'Unknown User'}</TableCell>
                      <TableCell>
                        <Badge className={getRatingColor(review.rating)}>
                          ★ {review.rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review.review ? review.review.substring(0, 50) + '...' : 'No text'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedReview(review)}
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <Eye size={16} />
                            View
                          </Button>
                          <Button
                            onClick={() => setDeleteReview(review)}
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

      {/* View Review Dialog */}
      <AlertDialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedReview?.destination?.name} - Review</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">User</p>
                <p className="font-medium">{selectedReview?.profile?.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <Badge className={getRatingColor(selectedReview?.rating || 0)}>
                  ★ {selectedReview?.rating}/5
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Review</p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {selectedReview?.review || 'No review text'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Posted on {selectedReview && new Date(selectedReview.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReview} onOpenChange={(open) => !open && setDeleteReview(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReview && handleDeleteReview(deleteReview)}
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

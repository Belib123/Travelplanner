'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { DestinationRating } from '@/lib/types'

interface DestinationRatingsProps {
  destinationId: string
  ratings: DestinationRating[]
  averageRating: number | null
}

export function DestinationRatings({ destinationId, ratings, averageRating }: DestinationRatingsProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    const { error } = await supabase
      .from('destination_ratings')
      .upsert({
        destination_id: destinationId,
        user_id: user.id,
        rating,
        review: review || null,
      })

    if (!error) {
      setShowForm(false)
      setReview('')
      window.location.reload()
    }
    
    setIsSubmitting(false)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Reviews & Ratings
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            Write a Review
          </Button>
        </div>
        
        {/* Rating Summary */}
        {averageRating && (
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({ratings.length} reviews)</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Review Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-muted/30 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review (optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={r.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {r.profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{r.profile?.full_name || 'Anonymous'}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= r.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {r.review && (
                      <p className="text-muted-foreground mt-2 text-sm">{r.review}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

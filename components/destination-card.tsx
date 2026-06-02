'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, MapPin, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import type { Destination } from '@/lib/types'

interface DestinationCardProps {
  destination: Destination
  showSaveButton?: boolean
}

export function DestinationCard({ destination, showSaveButton = true }: DestinationCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkSavedStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase
          .from('saved_destinations')
          .select('id')
          .eq('user_id', user.id)
          .eq('destination_id', destination.id)
          .single()
        setIsSaved(!!data)
      }
    }
    checkSavedStatus()
  }, [destination.id, supabase])

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!userId) {
      window.location.href = '/auth/login'
      return
    }

    setIsLoading(true)
    
    if (isSaved) {
      await supabase
        .from('saved_destinations')
        .delete()
        .eq('user_id', userId)
        .eq('destination_id', destination.id)
      setIsSaved(false)
    } else {
      await supabase
        .from('saved_destinations')
        .insert({ user_id: userId, destination_id: destination.id })
      setIsSaved(true)
    }
    
    setIsLoading(false)
  }

  return (
    <Link href={`/destinations/${destination.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden">
          {destination.hero_image_url ? (
            <Image
              src={destination.hero_image_url}
              alt={destination.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {showSaveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md"
              onClick={toggleSave}
              disabled={isLoading}
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {destination.continent || destination.country}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{destination.country}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {destination.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {destination.average_rating ? (
                <>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{destination.average_rating.toFixed(1)}</span>
                  {destination.rating_count && (
                    <span className="text-xs text-muted-foreground">({destination.rating_count})</span>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No reviews yet</span>
              )}
            </div>
            
            {destination.average_cost_per_day && (
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{destination.average_cost_per_day}</span>
                <span className="text-muted-foreground text-xs">/day</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

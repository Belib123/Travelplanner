'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Share2, Star, MapPin, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import type { Destination } from '@/lib/types'

interface DestinationHeroProps {
  destination: Destination
  averageRating: number | null
  ratingCount: number
}

export function DestinationHero({ destination, averageRating, ratingCount }: DestinationHeroProps) {
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

  async function toggleSave() {
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

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: destination.name,
        text: `Check out ${destination.name}, ${destination.country}!`,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <section className="relative">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {destination.hero_image_url ? (
          <Image
            src={destination.hero_image_url}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <MapPin className="h-20 w-20 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {destination.continent}
                  </Badge>
                  {averageRating && (
                    <Badge className="bg-amber-500/90 text-white border-amber-400">
                      <Star className="h-3 w-3 fill-white mr-1" />
                      {averageRating.toFixed(1)} ({ratingCount})
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {destination.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {destination.country}
                  </span>
                  {destination.best_season && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Best: {destination.best_season}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={toggleSave}
                  disabled={isLoading}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="secondary" className="gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

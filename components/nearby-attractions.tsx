import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation } from 'lucide-react'
import type { NearbyAttraction } from '@/lib/types'

interface NearbyAttractionsProps {
  attractions: NearbyAttraction[]
}

export function NearbyAttractions({ attractions }: NearbyAttractionsProps) {
  if (attractions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Nearby Attractions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium">{attraction.name}</h4>
                  {attraction.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {attraction.description}
                    </p>
                  )}
                </div>
                {attraction.category && (
                  <Badge variant="secondary" className="shrink-0">
                    {attraction.category}
                  </Badge>
                )}
              </div>
              {attraction.distance_km && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{attraction.distance_km} km away</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

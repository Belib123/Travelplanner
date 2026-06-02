import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Sun, Cloud, Lightbulb, Thermometer } from 'lucide-react'
import type { Destination } from '@/lib/types'

interface DestinationInfoProps {
  destination: Destination
}

export function DestinationInfo({ destination }: DestinationInfoProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About {destination.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {destination.description}
          </p>
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cost */}
        {destination.average_cost_per_day && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Daily Cost</p>
                  <p className="text-2xl font-bold">${destination.average_cost_per_day}</p>
                  <p className="text-xs text-muted-foreground">{destination.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Best Season */}
        {destination.best_season && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Sun className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Time to Visit</p>
                  <p className="text-lg font-semibold">{destination.best_season}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weather Info */}
      {destination.weather_info && Object.keys(destination.weather_info).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Weather Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(destination.weather_info).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Cloud className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Travel Tips */}
      {destination.travel_tips && destination.travel_tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {destination.travel_tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

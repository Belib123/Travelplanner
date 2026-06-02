'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Edit, 
  Trash2,
  Plus,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import type { Trip, TripItem, BudgetItem, Destination } from '@/lib/types'

interface TripDetailsProps {
  trip: Trip & { 
    trip_items: (TripItem & { destination: Destination })[]
    budget_items: BudgetItem[]
  }
}

export function TripDetails({ trip }: TripDetailsProps) {
  const [status, setStatus] = useState(trip.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalSpent = trip.budget_items?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const budgetRemaining = trip.total_budget ? Number(trip.total_budget) - totalSpent : null

  async function updateStatus(newStatus: string) {
    setIsUpdating(true)
    
    const { error } = await supabase
      .from('trips')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', trip.id)

    if (!error) {
      setStatus(newStatus as Trip['status'])
    }
    
    setIsUpdating(false)
  }

  async function deleteTrip() {
    if (!confirm('Are you sure you want to delete this trip?')) return

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', trip.id)

    if (!error) {
      router.push('/dashboard')
    }
  }

  function getStatusColor(s: string) {
    switch (s) {
      case 'planning': return 'bg-blue-100 text-blue-700'
      case 'upcoming': return 'bg-amber-100 text-amber-700'
      case 'ongoing': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{trip.name}</h1>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {trip.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(trip.start_date)}
                {trip.end_date && ` - ${formatDate(trip.end_date)}`}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={updateStatus} disabled={isUpdating}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={deleteTrip}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Notes */}
          {trip.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{trip.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Destinations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Destinations</CardTitle>
                <CardDescription>Places you are planning to visit</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/destinations">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {trip.trip_items && trip.trip_items.length > 0 ? (
                <div className="space-y-3">
                  {trip.trip_items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.destination?.name}</p>
                        <p className="text-sm text-muted-foreground">{item.destination?.country}</p>
                      </div>
                      {item.start_date && (
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.start_date)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No destinations added yet</p>
                  <p className="text-sm">Browse destinations and add them to your trip</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Budget Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trip.total_budget ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Budget</span>
                    <span className="font-bold text-lg">${Number(trip.total_budget).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-medium">${totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        totalSpent > Number(trip.total_budget) ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min((totalSpent / Number(trip.total_budget)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={`font-bold ${budgetRemaining && budgetRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${budgetRemaining?.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">No budget set</p>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/budget?trip=${trip.id}`}>
                  Manage Budget
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destinations</span>
                <span className="font-medium">{trip.trip_items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium">{trip.budget_items?.length || 0}</span>
              </div>
              {trip.start_date && trip.end_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

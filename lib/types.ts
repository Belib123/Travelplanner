export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  awarded_at: string
  badge?: Badge
}

export interface Destination {
  id: string
  name: string
  country: string
  continent: string | null
  description: string | null
  hero_image_url: string | null
  best_season: string | null
  average_cost_per_day: number | null
  currency: string
  latitude: number | null
  longitude: number | null
  weather_info: {
    summer?: string
    winter?: string
    dry_season?: string
    wet_season?: string
    rainfall?: string
    humidity?: string
    altitude?: string
    weather?: string
  } | null
  travel_tips: string[] | null
  created_at: string
  updated_at: string
  average_rating?: number
  rating_count?: number
}

export interface DestinationPhoto {
  id: string
  destination_id: string
  photo_url: string
  caption: string | null
  uploaded_by: string | null
  created_at: string
}

export interface NearbyAttraction {
  id: string
  destination_id: string
  name: string
  description: string | null
  distance_km: number | null
  category: string | null
  created_at: string
}

export interface DestinationRating {
  id: string
  destination_id: string
  user_id: string
  rating: number
  review: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface SavedDestination {
  id: string
  user_id: string
  destination_id: string
  saved_at: string
  destination?: Destination
}

export interface Trip {
  id: string
  user_id: string
  name: string
  start_date: string | null
  end_date: string | null
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  total_budget: number | null
  currency: string
  notes: string | null
  created_at: string
  updated_at: string
  trip_items?: TripItem[]
  budget_items?: BudgetItem[]
}

export interface TripItem {
  id: string
  trip_id: string
  destination_id: string
  start_date: string | null
  end_date: string | null
  accommodation_budget: number | null
  food_budget: number | null
  activities_budget: number | null
  transport_budget: number | null
  notes: string | null
  order_index: number
  created_at: string
  destination?: Destination
}

export interface BudgetItem {
  id: string
  trip_id: string
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'other'
  description: string
  amount: number
  currency: string
  date: string | null
  is_paid: boolean
  created_at: string
}

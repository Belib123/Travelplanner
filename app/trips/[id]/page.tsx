import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { TripDetails } from '@/components/trip-details'
import type { Trip, TripItem, BudgetItem } from '@/lib/types'

interface TripPageProps {
  params: Promise<{ id: string }>
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .select('*, trip_items(*, destination:destinations(*)), budget_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <TripDetails trip={trip as Trip & { trip_items: TripItem[], budget_items: BudgetItem[] }} />
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calculator, 
  DollarSign, 
  Plane, 
  Hotel, 
  Utensils, 
  Camera, 
  Car, 
  ShoppingBag,
  Plus,
  Trash2,
  Loader2,
  PieChart
} from 'lucide-react'
import type { Trip, BudgetItem } from '@/lib/types'

const categories = [
  { value: 'accommodation', label: 'Accommodation', icon: Hotel, color: 'bg-blue-100 text-blue-700' },
  { value: 'transportation', label: 'Transportation', icon: Plane, color: 'bg-amber-100 text-amber-700' },
  { value: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-green-100 text-green-700' },
  { value: 'activities', label: 'Activities', icon: Camera, color: 'bg-purple-100 text-purple-700' },
  { value: 'local_transport', label: 'Local Transport', icon: Car, color: 'bg-teal-100 text-teal-700' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700' },
  { value: 'other', label: 'Other', icon: DollarSign, color: 'bg-gray-100 text-gray-700' },
]

export default function BudgetPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<string>('')
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [tripBudget, setTripBudget] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  // New expense form
  const [showForm, setShowForm] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('other')
  const [expenseDate, setExpenseDate] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Load user's trips
      const { data: userTrips } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (userTrips) {
        setTrips(userTrips as Trip[])
        
        // Check for trip param in URL
        const tripParam = searchParams.get('trip')
        if (tripParam && userTrips.find(t => t.id === tripParam)) {
          setSelectedTrip(tripParam)
        } else if (userTrips.length > 0) {
          setSelectedTrip(userTrips[0].id)
        }
      }

      setIsLoading(false)
    }

    loadData()
  }, [supabase, router, searchParams])

  useEffect(() => {
    const loadBudgetItems = async () => {
      if (!selectedTrip) return

      const { data: items } = await supabase
        .from('budget_items')
        .select('*')
        .eq('trip_id', selectedTrip)
        .order('expense_date', { ascending: false })

      if (items) {
        setBudgetItems(items as BudgetItem[])
      }

      // Get trip budget
      const trip = trips.find(t => t.id === selectedTrip)
      setTripBudget(trip?.total_budget ? Number(trip.total_budget) : null)
    }

    loadBudgetItems()
  }, [selectedTrip, trips, supabase])

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: newItem, error } = await supabase
      .from('budget_items')
      .insert({
        trip_id: selectedTrip,
        user_id: user.id,
        description,
        amount: parseFloat(amount),
        category,
        expense_date: expenseDate || new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (!error && newItem) {
      setBudgetItems([newItem as BudgetItem, ...budgetItems])
      setShowForm(false)
      setDescription('')
      setAmount('')
      setCategory('other')
      setExpenseDate('')
    }

    setIsAdding(false)
  }

  async function deleteExpense(id: string) {
    const { error } = await supabase
      .from('budget_items')
      .delete()
      .eq('id', id)

    if (!error) {
      setBudgetItems(budgetItems.filter(item => item.id !== id))
    }
  }

  const totalSpent = budgetItems.reduce((sum, item) => sum + Number(item.amount), 0)
  const remaining = tripBudget ? tripBudget - totalSpent : null

  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: budgetItems
      .filter(item => item.category === cat.value)
      .reduce((sum, item) => sum + Number(item.amount), 0)
  })).filter(cat => cat.total > 0)

  function getCategoryInfo(categoryValue: string) {
    return categories.find(c => c.value === categoryValue) || categories[categories.length - 1]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Calculator className="h-8 w-8 text-primary" />
                Budget Calculator
              </h1>
              <p className="text-muted-foreground">Track your travel expenses</p>
            </div>
            
            <Select value={selectedTrip} onValueChange={setSelectedTrip}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTrip ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Add Expense Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Expenses</CardTitle>
                      <CardDescription>
                        {budgetItems.length} expense{budgetItems.length !== 1 ? 's' : ''} recorded
                      </CardDescription>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Add Expense Form */}
                    {showForm && (
                      <form onSubmit={handleAddExpense} className="p-4 border rounded-lg bg-muted/30 mb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Description *</Label>
                            <Input
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Hotel booking, Flight ticket..."
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Amount (USD) *</Label>
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={expenseDate}
                              onChange={(e) => setExpenseDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={isAdding}>
                            {isAdding ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              'Add Expense'
                            )}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}

                    {/* Expenses List */}
                    {budgetItems.length > 0 ? (
                      <div className="space-y-3">
                        {budgetItems.map((item) => {
                          const catInfo = getCategoryInfo(item.category)
                          return (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${catInfo.color}`}>
                                  <catInfo.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.description}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {catInfo.label}
                                    </Badge>
                                    {item.expense_date && (
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(item.expense_date).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold">${Number(item.amount).toLocaleString()}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => deleteExpense(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>No expenses recorded yet</p>
                        <p className="text-sm">Start adding your travel expenses</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Budget Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Budget Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                      <p className="text-4xl font-bold text-primary">${totalSpent.toLocaleString()}</p>
                    </div>
                    
                    {tripBudget && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-medium">${tripBudget.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              totalSpent > tripBudget ? 'bg-red-500' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min((totalSpent / tripBudget) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className={`font-bold ${remaining && remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${remaining?.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Spending by Category */}
                {categoryTotals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>By Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categoryTotals.map((cat) => (
                          <div key={cat.value} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded ${cat.color}`}>
                                <cat.icon className="h-3 w-3" />
                              </div>
                              <span className="text-sm">{cat.label}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${cat.total.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {totalSpent > 0 ? Math.round((cat.total / totalSpent) * 100) : 0}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-4">Create a trip to start tracking your budget</p>
                <Button asChild>
                  <a href="/trips/new">Create Your First Trip</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

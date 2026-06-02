'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Travel Planner',
    siteDescription: 'Discover and plan your next adventure',
    contactEmail: 'admin@travelplanner.com',
    maintenanceMode: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to Supabase
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage platform settings</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              placeholder="Your site name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Site Description</Label>
            <Input
              id="description"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              placeholder="Site description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-900">Maintenance Mode</p>
              <p className="text-amber-700">Enable to temporarily disable access to the platform</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`ml-auto px-3 py-1 rounded text-sm font-medium ${
                settings.maintenanceMode
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {settings.maintenanceMode ? 'On' : 'Off'}
            </button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">Settings saved successfully!</p>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a
              href="#"
              className="p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <p className="font-medium text-sm">Documentation</p>
            </a>
            <a
              href="#"
              className="p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <p className="font-medium text-sm">Help Center</p>
            </a>
            <a
              href="#"
              className="p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <p className="font-medium text-sm">Report Issue</p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Platform Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Database</span>
            <span className="font-medium">Supabase</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

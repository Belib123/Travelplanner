'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Trash2, Shield, UserX, Search } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string | null
  username: string | null
  role: 'user' | 'admin'
  created_at: string
}

export default function UsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [promoteUser, setPromoteUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

      if (authError) throw authError

      const userIds = authData.users.map(u => u.id)
      if (userIds.length === 0) {
        setUsers([])
        return
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      if (profileError) throw profileError

      const mergedUsers: User[] = authData.users.map(authUser => {
        const profile = profiles?.find(p => p.id === authUser.id)
        return {
          id: authUser.id,
          email: authUser.email || '',
          full_name: profile?.full_name || null,
          username: profile?.username || null,
          role: profile?.role || 'user',
          created_at: authUser.created_at,
        }
      })

      setUsers(mergedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePromoteToAdmin = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (error) throw error

      setUsers(users.map(u => u.id === user.id ? { ...u, role: 'admin' } : u))
      setPromoteUser(null)
    } catch (error) {
      console.error('Error promoting user:', error)
    }
  }

  const handleDemoteAdmin = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', user.id)

      if (error) throw error

      setUsers(users.map(u => u.id === user.id ? { ...u, role: 'user' } : u))
      setPromoteUser(null)
    } catch (error) {
      console.error('Error demoting user:', error)
    }
  }

  const handleDeleteUser = async (user: User) => {
    try {
      // Delete user from auth
      await supabase.auth.admin.deleteUser(user.id)

      setUsers(users.filter(u => u.id !== user.id))
      setDeleteUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const filteredUsers = users.filter(
    user =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-2">Manage platform users and their roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by email, name, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.email}</TableCell>
                      <TableCell>{user.full_name || user.username || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.role === 'user' ? (
                            <Button
                              onClick={() => setPromoteUser(user)}
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              <Shield size={16} />
                              Make Admin
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setPromoteUser(user)}
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              <UserX size={16} />
                              Remove Admin
                            </Button>
                          )}
                          <Button
                            onClick={() => setDeleteUser(user)}
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteUser?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUser && handleDeleteUser(deleteUser)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promote/Demote Confirmation Dialog */}
      <AlertDialog open={!!promoteUser} onOpenChange={(open) => !open && setPromoteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {promoteUser?.role === 'user' ? 'Make Admin' : 'Remove Admin'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {promoteUser?.role === 'user'
                ? `Are you sure you want to make ${promoteUser?.email} an admin? They will have access to the admin dashboard.`
                : `Are you sure you want to remove admin privileges from ${promoteUser?.email}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                promoteUser &&
                (promoteUser.role === 'user'
                  ? handlePromoteToAdmin(promoteUser)
                  : handleDemoteAdmin(promoteUser))
              }
            >
              {promoteUser?.role === 'user' ? 'Make Admin' : 'Remove Admin'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

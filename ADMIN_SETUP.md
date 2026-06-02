# Admin Account Setup Guide

## Overview
This travel planner application now includes an admin dashboard with comprehensive management features. This guide will help you set up admin accounts and use the admin dashboard.

## Prerequisites
- Supabase account and project set up
- Application running locally or deployed

## Step 1: Update Your Database Schema

You need to add a `role` column to your `profiles` table. Run this SQL in your Supabase SQL editor:

```sql
-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create an index for better query performance
CREATE INDEX idx_profiles_role ON profiles(role);
```

Alternatively, you can create the column through the Supabase dashboard:
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy and paste the SQL above
5. Click "Run"

## Step 2: Create Your First Admin Account

### Option A: Via Supabase Admin API (Recommended for Development)

1. In your Supabase project, go to SQL Editor
2. Run this query to update an existing user to admin:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

### Option B: Via Application (After Setup)

1. Create a regular user account through the sign-up page
2. Update the user to admin via the admin dashboard if you have another admin account already
3. Or run the SQL query above with the new user's email

## Step 3: Access the Admin Dashboard

1. Log in to your account at `/auth/login`
2. If your account has admin role, navigate to `/admin`
3. You'll see the admin dashboard with the following sections:

### Admin Dashboard Features

#### Dashboard Overview
- Total users count
- Total destinations count
- Total reviews count
- Average rating across all destinations
- Quick action links

#### Users Management (`/admin/users`)
- View all registered users
- Search users by email, name, or username
- Promote users to admin
- Demote admins back to regular users
- Delete user accounts

#### Destinations Management (`/admin/destinations`)
- View all destinations
- Search destinations by name or country
- Delete destinations (also deletes related reviews and photos)
- View average ratings per destination
- Cost and currency information

#### Reviews & Ratings (`/admin/reviews`)
- View all user reviews
- Search reviews by destination, user, or review text
- View full review text
- Delete inappropriate reviews
- Filter by rating

#### Analytics (`/admin/analytics`)
- New users this month
- New destinations this month
- Reviews posted this month
- Top destinations by review count
- Average ratings for top destinations

#### Settings (`/admin/settings`)
- Configure general site settings
- Manage contact information
- Enable/disable maintenance mode
- System information

## Code Structure

### New Files Created

**Components:**
- `components/admin/layout.tsx` - Main admin layout wrapper
- `components/admin/sidebar.tsx` - Navigation sidebar

**Pages:**
- `app/admin/page.tsx` - Dashboard overview
- `app/admin/layout.tsx` - Admin layout provider
- `app/admin/users/page.tsx` - User management
- `app/admin/destinations/page.tsx` - Destination management
- `app/admin/reviews/page.tsx` - Review management
- `app/admin/analytics/page.tsx` - Platform analytics
- `app/admin/settings/page.tsx` - Settings management

**Utilities:**
- `lib/admin.ts` - Admin utility functions
- `lib/types.ts` - Updated types with `UserRole` and `AdminUser`

**Middleware:**
- `lib/supabase/middleware.ts` - Updated with admin route protection

## Key Features

### Role-Based Access Control
- Only users with `role = 'admin'` can access `/admin/*` routes
- Middleware automatically redirects non-admin users to dashboard
- Protected routes require authentication

### User Management
- View all users in the system
- Promote regular users to admin
- Demote admins to regular users
- Delete users (removes from auth)

### Data Management
- Delete destinations and cascade-delete related data
- Moderate user reviews
- View user ratings and feedback

### Analytics & Insights
- Track new user registrations
- Monitor platform activity
- View top-performing destinations
- Track average ratings

## Security Considerations

1. **Only admins can access**: `/admin/*` routes are protected by middleware
2. **Role verification**: Every admin action checks the user's role in the database
3. **Cascade deletion**: Deleting destinations automatically removes related data
4. **User isolation**: Regular users cannot see admin features

## Making Additional Admins

Once you have your first admin account:

1. Go to `/admin/users`
2. Find the user you want to make an admin
3. Click "Make Admin" button
4. Confirm the action
5. The user will now have admin access after they log out and back in

## Troubleshooting

### Can't access `/admin`
- Make sure you're logged in
- Verify your profile has `role = 'admin'` in the profiles table
- Check that the Supabase middleware is running correctly

### Users table showing empty
- Ensure the profiles table is properly populated
- Check that Supabase auth and database are connected
- Verify you have the correct permissions

### Admin routes not protected
- Clear browser cache
- Restart the development server
- Verify middleware.ts is in the project root

## Next Steps

1. ✅ Update database schema with role column
2. ✅ Create first admin account via SQL
3. ✅ Log in and access `/admin` dashboard
4. ✅ Create additional admin accounts as needed
5. Consider: Adding more admin features (email notifications, user verification, etc.)

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review the application's error logs
- Verify your environment variables are set correctly

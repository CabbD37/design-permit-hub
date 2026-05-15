# Content Management System Setup

Your site now has a complete CMS that allows you to update all page content after publishing.

## Getting Started

### 1. Initialize Pages
Run the initialization function to create page records:

```bash
curl -X POST https://rtgkcalkcpmjlvbhgryw.supabase.co/functions/v1/init-content
```

This creates three pages: Home, Services, and Contact.

### 2. Create Admin Account
In the [Supabase Dashboard](https://supabase.com/dashboard/), navigate to Authentication > Users and create a new user with:
- Email: your-email@example.com
- Password: secure-password

Then update their metadata to mark as admin by running this in the SQL editor:

```sql
UPDATE auth.users 
SET raw_user_metadata = jsonb_set(
  COALESCE(raw_user_metadata, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@example.com';
```

### 3. Access Admin Panel
Navigate to `/admin/login` and sign in with your credentials.

## Managing Content

### Admin Panel Overview
- **Content Manager** - Main interface with tabbed sections for each page
- Each page has sections (Hero, Services, Why Us, CTA, etc.)
- Click a section to view and edit individual content items
- Changes are saved immediately to the database
- Toggle "Published" to make changes live

### Content Structure

Content is organized as:
- **Pages** (home, services, contact)
  - **Sections** (hero, services-snapshot, why-us, cta)
    - **Items** (individual content blocks with JSON data)

Each item's content is stored as flexible JSON, so you can add any fields you need.

### Current Implementation

Pages currently display hardcoded content. To fully integrate the database:

1. Update `/src/routes/index.tsx` to fetch from `getPageContent('home')`
2. Update `/src/routes/services.tsx` to fetch from `getPageContent('services')`
3. Update `/src/routes/contact.tsx` to fetch from `getPageContent('contact')`

The `getPageContent()` function is already available in `/src/lib/content.ts`.

## Database Schema

### pages
- `id` - UUID primary key
- `slug` - Unique page identifier (home, services, contact)
- `title` - Display name
- `published` - Controls visibility to public
- `created_at`, `updated_at` - Timestamps

### page_sections
- `id` - UUID primary key
- `page_id` - Foreign key to pages
- `slug` - Section identifier (hero, services-snapshot, etc.)
- `title` - Display name
- `description` - Optional description
- `sort_order` - Display order

### page_section_items
- `id` - UUID primary key
- `section_id` - Foreign key to page_sections
- `content` - JSONB field for flexible data storage
- `sort_order` - Display order

## Security

- Only published pages are visible to the public
- All edits require admin authentication
- RLS policies restrict data access appropriately
- Admin role is verified through user metadata

## Next Steps

To complete the integration:

1. Populate sections and items in the database (via admin panel or SQL)
2. Update page components to render database content
3. Test content updates in the admin panel
4. Deploy to production

Contact support if you have questions about the CMS setup.

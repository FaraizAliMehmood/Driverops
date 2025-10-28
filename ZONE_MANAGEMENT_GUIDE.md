# Zone Management Guide

## Overview
The Zone Management page provides a complete CRUD (Create, Read, Update, Delete) interface for managing delivery zones in the DriverOps SG application.

## Features

### 1. **View All Zones**
- Display all zones in a sortable table
- View zone details including name, status, coordinates, and timestamps
- Toggle between "All Zones" and "Active Zones Only" views

### 2. **Create New Zone**
- Click the "Create Zone" button to open a form dialog
- Fill in the required fields:
  - **Zone Name**: Name of the zone (e.g., "Marina Bay")
  - **Latitude**: Geographic latitude coordinate
  - **Longitude**: Geographic longitude coordinate
  - **Active Status**: Toggle to enable/disable the zone
- Click "Create Zone" to save

### 3. **Edit Zone**
- Click the pencil icon in the Actions column for any zone
- Update the zone information in the form dialog
- Click "Update Zone" to save changes

### 4. **Delete Zone**
- Click the trash icon in the Actions column for any zone
- Confirm the deletion in the alert dialog
- The zone will be permanently removed

### 5. **Filter Active Zones**
- Click the "Active Only" button to view only active zones
- Click again to return to viewing all zones

### 6. **Refresh Data**
- Click the "Refresh" button to fetch the latest zone data from the API

## Navigation

### From Dashboard
- Click the "Zones" button in the dashboard header to navigate to Zone Management

### Back to Dashboard
- Click the back arrow button in the Zone Management page to return to the dashboard

## API Configuration

### Setting up the Backend URL

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Set the `VITE_API_BASE_URL` environment variable:

```env
VITE_API_BASE_URL=http://localhost:3000
```

For production, use your deployed backend URL:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### API Endpoints Used

The Zone Management page integrates with the following API endpoints:

#### 1. Create Zone
```
POST /api/zones
Content-Type: application/json

Request Body:
{
  "zone_name": "Marina Bay",
  "is_active": true,
  "coordinates": {
    "lat": 1.280,
    "lng": 103.860
  }
}
```

#### 2. Get All Zones
```
GET /api/zones
```

#### 3. Get Zone by ID
```
GET /api/zones/:id
```

#### 4. Update Zone
```
PUT /api/zones/:id
Content-Type: application/json

Request Body (all fields optional):
{
  "zone_name": "Marina Bay Central",
  "is_active": false,
  "coordinates": {
    "lat": 1.285,
    "lng": 103.865
  }
}
```

#### 5. Delete Zone
```
DELETE /api/zones/:id
```

#### 6. Get Active Zones Only
```
GET /api/zones/active/list
```

## Testing Without a Backend

If you don't have a backend API yet, you can use the mock service for testing:

1. Update the import in `src/pages/ZoneManagement.tsx`:
```typescript
// Change this:
import { zoneService } from "@/services/zoneService";

// To this:
import { zoneService } from "@/services/mockZoneService";
```

2. The mock service will use local state to simulate API operations

## UI Components

The Zone Management page uses the following shadcn/ui components:
- **Button**: For actions and navigation
- **Card**: For layout and grouping
- **Table**: For displaying zones
- **Dialog**: For create/edit forms
- **AlertDialog**: For delete confirmation
- **Input**: For text and number inputs
- **Label**: For form labels
- **Switch**: For active/inactive toggle
- **Badge**: For status indicators
- **Toast (Sonner)**: For success/error notifications

## Styling

The page follows the application's design system with:
- Gradient background (`bg-gradient-hero`)
- Glass-morphism effects
- Responsive design for mobile and desktop
- Consistent color scheme with primary and accent colors

## Error Handling

All API operations include error handling with user-friendly toast notifications:
- **Success**: Green toast with success message
- **Error**: Red toast with error details

## Accessibility

The page includes:
- Proper semantic HTML
- Keyboard navigation support
- ARIA labels where needed
- Responsive design for all screen sizes

## Future Enhancements

Potential improvements for the Zone Management page:
1. **Map Integration**: Visual map to select zone coordinates
2. **Bulk Operations**: Delete or update multiple zones at once
3. **Search & Filter**: Search zones by name or filter by multiple criteria
4. **Pagination**: For large numbers of zones
5. **Zone History**: Track changes to zones over time
6. **Import/Export**: Import zones from CSV or export to various formats
7. **Zone Validation**: Check for overlapping zones or invalid coordinates


# DriverOps SG - Intelligent Driver Dashboard

A comprehensive dashboard application for delivery drivers in Singapore, featuring real-time flight tracking, zone management, weather alerts, and earnings tracking.

## Project info

**URL**: https://lovable.dev/projects/d3b5410c-07d3-42a9-9f2c-875665ff98b1

## Features

### 📊 Dashboard
- **Real-time Stats**: Live tracking of active drivers, completed deliveries, and today's earnings
- **Flight Feed**: Real-time flight tracking and status updates
- **Zone Recommendations**: Intelligent zone suggestions based on demand
- **Weather Alerts**: Real-time weather conditions and alerts
- **Earnings Tracker**: Track daily, weekly, and monthly earnings

### 🗺️ Zone Management (NEW)
A complete CRUD interface for managing delivery zones with the following capabilities:
- **Create Zones**: Add new delivery zones with name, coordinates, and active status
- **View Zones**: Display all zones in a sortable table with detailed information
- **Update Zones**: Edit existing zone details and configurations
- **Delete Zones**: Remove zones with confirmation dialog
- **Filter Zones**: Toggle between all zones and active zones only
- **Real-time Updates**: Auto-refresh capability to fetch latest zone data

For detailed documentation, see [ZONE_MANAGEMENT_GUIDE.md](./ZONE_MANAGEMENT_GUIDE.md)

## Pages

- **`/`** - Main Dashboard with live stats and flight feed
- **`/zones`** - Zone Management page for CRUD operations

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d3b5410c-07d3-42a9-9f2c-875665ff98b1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with hooks
- **React Router** - Client-side routing
- **shadcn/ui** - High-quality UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Tanstack Query** - Data fetching and caching
- **Axios** - HTTP client for API calls
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Environment Variables

Create a `.env` file in the root directory for API configuration:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000
```

For production, set your deployed backend URL.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── DashboardHeader.tsx
│   ├── FlightFeed.tsx
│   ├── StatsOverview.tsx
│   ├── WeatherAlert.tsx
│   ├── ZoneRecommendation.tsx
│   └── EarningsTracker.tsx
├── pages/            # Page components
│   ├── Index.tsx     # Main dashboard
│   ├── ZoneManagement.tsx  # Zone CRUD operations
│   └── NotFound.tsx
├── services/         # API services
│   ├── zoneService.ts      # Zone API calls
│   └── mockZoneService.ts  # Mock data for testing
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── App.tsx           # Main app with routing
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d3b5410c-07d3-42a9-9f2c-875665ff98b1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

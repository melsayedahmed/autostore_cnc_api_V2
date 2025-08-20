# CNC Parts Browser

A React 19 application for browsing vehicle parts using the CNC API from autostore.link.

## Features

- **Hierarchical Navigation**: Browse through Types → Models → Submodels → Model Years → Versions → Parts
- **Search Functionality**: Search across models, types, subtypes, and model years
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Configurable Colors**: Customize the entire color scheme via environment variables
- **API Integration**: Full integration with all CNC API endpoints
- **Image Gallery**: View part images with fallback placeholders
- **Breadcrumb Navigation**: Easy navigation with breadcrumb trail
- **Loading States**: Smooth loading indicators throughout the app

## Setup

1. Copy `.env.example` to `.env.local`
2. Set your API key in the `NEXT_PUBLIC_API_KEY` variable
3. Optionally customize colors using the color environment variables
4. Run the development server

## API Endpoints Used

- `GET /v2/user/types/index` - Get all available types
- `GET /v2/user/{type_id}/models/index` - Get models by type
- `GET /v2/user/{model_id}/submodels/index` - Get submodels by model
- `GET /v2/user/{submodel_id}/modelYears/index` - Get model years by submodel
- `GET /v2/user/{model_year_id}/versions/index` - Get versions by model year
- `GET /v2/user/{model_year_id}/parts/index` - Get parts by model year and version
- `POST /v2/search/{search}` - Search functionality

## Color Customization

You can customize the entire color scheme by setting environment variables in your `.env.local` file. All colors support HSL format. If not set, the app will use the default shadcn/ui color scheme.

Example custom color scheme:
\`\`\`env
NEXT_PUBLIC_PRIMARY_COLOR=hsl(142, 76%, 36%)
NEXT_PUBLIC_SECONDARY_COLOR=hsl(142, 76%, 96%)
NEXT_PUBLIC_BACKGROUND_COLOR=hsl(0, 0%, 100%)
\`\`\`

## Usage

1. Start by browsing through the available types
2. Navigate through the hierarchy: Types → Models → Submodels → Model Years → Versions → Parts
3. Use the search functionality to quickly find specific items
4. Use breadcrumbs to navigate back to previous levels
5. View part details including images, dimensions, and points
# autostore_cnc_api_V2

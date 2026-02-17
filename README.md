# No Kings Countdown - Vue/Nuxt 3 Edition

A countdown application showcasing 30 community actions leading up to the No Kings March, built with Vue 3 and Nuxt 3.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (or npm/yarn)

### Installation

Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

Generate a static site:

```bash
pnpm generate
# or
npm run generate
# or
yarn generate
```

The static files will be generated in the `out` directory.

Preview the production build:

```bash
pnpm preview
# or
npm run preview
# or
yarn preview
```

## Technology Stack

- **Framework**: Nuxt 3
- **UI Library**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS
- **Icons**: lucide-vue-next
- **Carousel**: vue-slick-carousel
- **Data Parsing**: papaparse
- **TypeScript**: Full type safety

## Project Structure

```
.
├── assets/
│   └── css/
│       └── main.css          # Global styles
├── components/
│   ├── CountdownDisplay.vue  # Main display component
│   ├── GridView.vue          # Fixed grid view with flip cards
│   ├── MasonryWallView.vue   # True masonry layout (vue-masonry-wall)
│   ├── CalendarView.vue      # Calendar view (Feb 16 - Mar 28)
│   └── CarouselView.vue      # Carousel view
├── composables/
│   ├── dateHelpers.ts        # Date utility functions
│   └── googleSheets.ts       # Data fetching logic
├── pages/
│   └── index.vue             # Home page
├── public/                   # Static assets
├── app.vue                   # Root app component
├── nuxt.config.ts            # Nuxt configuration
└── tailwind.config.js        # Tailwind configuration
```

## Features

- **Four View Modes**: Switch between grid, masonry, calendar, and carousel views
- **Interactive Cards**: Flip cards to reveal action details
- **Calendar Layout**: View events in a traditional calendar format (Feb 16 - Mar 28)
- **Current Day Highlighting**: Automatically highlights today's action
- **Responsive Design**: Optimized for mobile and desktop
- **Static Site Generation**: Deploys as a static site for GitHub Pages

## Data Source

The application fetches countdown data from a Google Sheets CSV export. Update the `SHEET_URL` in `composables/googleSheets.ts` to point to your own data source.

## Deployment

This project is configured for GitHub Pages deployment with a base path of `/No-Kings-Countdown/`. To deploy to a different path or domain, update the `baseURL` in [nuxt.config.ts](nuxt.config.ts).

## License

This project is open source and available under the MIT License.

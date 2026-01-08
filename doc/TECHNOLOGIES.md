# Technology Stack

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Vite | 7.2.4 | Build tool and dev server |

## UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| Material-UI (MUI) | 7.3.6 | Component library |
| @mui/icons-material | 7.3.6 | Icon set |
| @mui/x-data-grid | 8.23.0 | Data tables |
| @mui/x-date-pickers | 8.8.0 | Date/time pickers |
| Emotion | 11.14.0 | CSS-in-JS styling |

## State Management

| Technology | Purpose |
|------------|---------|
| React Context API | Global state management |
| useReducer | Complex state updates in AppContext |
| Custom Hooks | Data access with filtering and permissions |

## Routing

| Technology | Version | Purpose |
|------------|---------|---------|
| React Router DOM | 7.12.0 | Client-side routing |

## Internationalization

| Technology | Version | Purpose |
|------------|---------|---------|
| i18next | 25.2.1 | i18n framework |
| react-i18next | 15.5.2 | React bindings |
| i18next-browser-languagedetector | 8.0.6 | Auto language detection |

## Date & Time

| Technology | Version | Purpose |
|------------|---------|---------|
| date-fns | 4.1.0 | Date manipulation |
| @date-io/date-fns | 3.2.0 | Date adapter for MUI |

## Charts & Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| Recharts | 3.6.0 | Dashboard charts |

## Notifications

| Technology | Version | Purpose |
|------------|---------|---------|
| notistack | 3.0.2 | Toast notifications |

## Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| uuid | 11.1.0 | Unique ID generation |

## Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| Vitest | 3.2.4 | Test runner |
| @testing-library/react | 16.3.0 | React component testing |
| @testing-library/jest-dom | 6.6.3 | DOM matchers |
| @testing-library/user-event | 14.6.1 | User interaction simulation |
| @vitest/coverage-v8 | 3.2.4 | Code coverage |
| jsdom | 26.1.0 | DOM environment |

## Code Quality

| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.29.0 | Code linting |
| @typescript-eslint | 8.34.0 | TypeScript ESLint rules |

## Data Persistence

The application uses **localStorage** for data persistence. This is a demo/prototype approach - in production, this would be replaced with a backend API.

### Storage Keys

All keys are prefixed with `neostella_`:

| Key | Data |
|-----|------|
| `neostella_current_user` | Logged-in user |
| `neostella_users` | All users |
| `neostella_cases` | Cases |
| `neostella_clients` | Clients |
| `neostella_tasks` | Tasks |
| `neostella_time_entries` | Time entries |
| `neostella_activities` | Activity log |
| `neostella_notes` | Notes |
| `neostella_notifications` | Notifications |
| `neostella_language` | Selected language |
| `neostella_theme` | Theme preference |

## Browser Support

The application targets modern browsers with ES2022 support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

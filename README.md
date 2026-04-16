# Travel Agency Manager - Frontend

Tailwind CSS UI built in components are used for quick screens.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Script Setup)
- **Store**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcssui.com/)
- **UI Components**: [Headless UI](https://headlessui.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## Option A: Quick Start with Docker (Recommended)

This frontend can be run alongside the backend and database using Docker from the **backend repository**:

1. Navigate to the **backend** directory:
   ```bash
   cd travel_agency_manager_sio_backend
   ```
2. Start the entire stack:
   ```bash
   docker-compose up -d --build
   ```
The frontend will then be available at [http://localhost:5173](http://localhost:5173).

---

## Option B: Manual Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19.0 or higher)
- [npm](https://www.npmjs.com/)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/aounraza95/travel_agency_manager_sio_frontend
   cd travel_agency_manager_sio_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Ensure your backend API is running at `http://localhost:8000`. You can update the `baseURL` in `src/services/api.js` if necessary.

## Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Build

To build the project for production:
```bash
npm run build
```
The production-ready files will be in the `dist/` directory.

## Preview

To preview the production build locally:
```bash
npm run preview
```

## Test Login

ADMIN USER for /admin routes
```bash
Email: admin@example.com
Password: password
```
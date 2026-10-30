# CourseMaster - Frontend
Live Link: https://course-master4981.netlify.app/

Video link: https://drive.google.com/file/d/1vjMrBxr0-7xqjxMX2EBEBw30D_av1pOu/view

A modern E-learning platform frontend built with React, Redux Toolkit, and Tailwind CSS.

Admin email: admin@coursemaster.com
Pass: admin123

## Project Name & Description

**CourseMaster** is a full-featured E-learning platform where students can browse, purchase, and consume courses. The frontend provides an intuitive interface for students to enroll in courses, watch video lectures, complete assignments, and take quizzes. Administrators can manage courses, track enrollments, review assignments, and view analytics through a dedicated admin dashboard.

This is the frontend application of the CourseMaster platform, built with modern React technologies and responsive design principles.

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS + DaisyUI** - Styling
- **Axios** - HTTP client

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd course-master-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory (see `.env.example`)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api
# For production, use your deployed backend URL:
# VITE_API_BASE_URL=http://localhost:5000/api
```

**Required Variables:**
- `VITE_API_BASE_URL` - The base URL of the backend API (required)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CourseCard/     # Course listing components
│   └── shared/         # Shared components (Navbar, Footer, Logo)
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── CoursePlayer/   # Course video player
│   ├── CousrseDetails/ # Course details page
│   ├── Home/           # Home page with course listing
│   ├── Login/          # Login page
│   ├── Register/       # Registration page
│   └── student/        # Student dashboard
├── routes/              # Route protection components
├── services/           # API service functions
├── store/              # Redux store and slices
└── utils/              # Utility functions
```

## Features

### Public Features
- Browse courses with pagination, search, sorting, and filtering
- View detailed course information
- User registration and login

### Student Features
- Enroll in courses
- Watch video lectures (YouTube integration)
- Mark lessons as complete
- Track learning progress
- Submit assignments (text or Google Drive links)
- Take quizzes with immediate score feedback
- View enrolled courses dashboard

### Admin Features
- Create, update, and delete courses
- Add course syllabus (modules, lessons, videos, assignments, quizzes)
- Manage course batches
- View all enrollments
- Review and grade student assignments
- Filter enrollments by course/student
- Filter assignments by status

## API Integration

The frontend communicates with the backend API. All API endpoints are documented in the backend README.

### Key API Endpoints Used:

- **Authentication**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Courses**: `/api/courses` (GET all, GET by ID)
- **Enrollments**: `/api/enrollments/:courseId` (POST), `/api/enrollments/my` (GET)
- **Assignments**: `/api/assignments/submit` (POST), `/api/assignments/my` (GET), `/api/assignments/stats` (GET)
- **Quizzes**: `/api/quizzes/submit` (POST), `/api/quizzes/my` (GET), `/api/quizzes/stats` (GET)
- **Admin**: `/api/admin/courses`, `/api/admin/enrollments`, `/api/admin/assignments`, `/api/admin/analytics`

For complete API documentation with request/response formats, see [courseMaster_Backend/README.md](../backend/README.md).

## Development

- Development server runs on `http://localhost:5173` (default Vite port)
- Hot Module Replacement (HMR) is enabled
- ESLint is configured for code quality

## Deployment

The frontend can be deployed to:
- **Netlify**


## Assignment fixes and verification

### Local setup

Use Node.js 20.19+ or 22.12+. Run `npm ci`, copy `.env.example` to `.env`, set `VITE_API_BASE_URL=http://localhost:5000/api`, and start the backend separately. Run `npm run dev` and open `http://localhost:5173`.

### Checks

- `npm test`: frontend behavior checks for token persistence, enrollment state, course pricing, title wrapping, protected rendering, and API request headers.
- `npm run lint`: ESLint checks.
- `npm run build`: production bundle.

The regression tests compile real project modules with the esbuild version installed through Vite. No API calls leave the test process. Server-rendered component checks are not a replacement for a full browser layout review.

### Changes

Authentication uses a consistent token storage key and Bearer header. Protected routes require successful verification. Enrollment arrays remain usable after fetching, and course details reload the current user's enrollments. Course prices match the API value. Batch selection sends the actual batch identifier. Course searches apply page resets before requests and ignore stale responses. Course player completion checks lesson IDs, shows errors, and resets per-lesson forms. Video width and course titles adapt to their container.

### Deployment

Build with the deployed backend's API URL in `VITE_API_BASE_URL`; environment variables are read at build time. Use your own host and configure SPA route fallback. The supplied Vercel fallback configuration is retained. No production deployment has been performed.

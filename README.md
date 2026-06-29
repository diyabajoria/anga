# anga

Find daily work. Hire trusted local workers.

anga is a Rozgar category hackathon project for local daily-wage employment. It helps workers such as electricians, plumbers, carpenters, painters, AC repair workers, drivers, house helpers, delivery workers, and labourers find nearby jobs, while helping customers hire trusted local workers with clear wages, ratings, verification signals, and simple mobile-first flows.

The project includes a polished landing website with a real interactive phone mockup, a mobile app experience, OTP-based authentication, worker/customer onboarding, job posting and application flows, applicant review, notifications, and an in-app RAG-style Rozgar assistant.

## Hackathon Pitch

Many daily-wage workers still depend on word of mouth, middlemen, and uncertain payments to find work. Customers also struggle to quickly find trusted local workers with transparent rates and basic verification.

anga solves this by creating a local-first employment platform focused on:

- Nearby daily-wage jobs instead of generic service booking.
- Mobile OTP login for simple access.
- Worker and customer role-based flows.
- Transparent wage, distance, timing, status, and rating signals.
- Verified and document-uploaded badges for trust.
- Hindi and English friendly UI for local users.
- AI assistance for finding jobs, hiring workers, and understanding app actions.

## Live Demo Flow For Judges

Judges do not need a real phone number.

Use these demo credentials:

```text
Mobile number: 1234567890
OTP: 123456
```

Recommended demo path:

1. Open the landing page at `/`.
2. Notice the interactive phone mockup in the hero section.
3. Click `Try Demo` to focus only on the phone app.
4. Choose `Create account` or `Log in`.
5. Select a role: Worker or Customer.
6. Enter `1234567890`.
7. Use OTP `123456`.
8. Complete onboarding.
9. Try the worker dashboard, customer dashboard, AI assistant, job detail, post job, applicants, notifications, and profile flows.

## Core Features

### Landing Website

- Modern hackathon/demo website for the Anga project.
- Cream/off-white background, blue primary color, soft shadows, rounded UI.
- Interactive phone mockup that runs the real app routes.
- Full-screen demo mode with a back-to-home control.
- "Try it here" floating cue so visitors understand the phone is interactive.
- Sections: Hero, Why Anga, AI Rozgar Assistant, How it works, Features, Impact.
- Demo credentials card for judges.

### Authentication

- Mobile number + OTP authentication.
- No email/password flow.
- Role-aware login and signup.
- Existing users are routed to the correct dashboard.
- New or incomplete users are routed to onboarding.
- Development OTP is `123456`.

### Worker Onboarding

Worker profile setup includes:

- Name
- Phone
- Location/area
- Skills multi-select
- Experience
- Expected daily wage
- Available today toggle
- Preferred work distance
- Photo upload
- Optional document upload
- CTA to start finding jobs

### Customer Onboarding

Customer profile setup includes:

- Name
- Phone
- Address/location
- Homeowner, shop owner, or contractor type
- CTA to start hiring

### Worker Job Flow

- Nearby job cards with wage, distance, timing, customer rating, location, and status.
- Job detail screen with full work details, payment, distance, customer profile, requirements, and apply action.
- Application statuses: Pending, Accepted, Rejected, Completed.
- Safety actions such as report issue and SOS after accepted jobs.

### Customer Hiring Flow

- Post Job form with service type, description, location, date/time, budget, urgency, and number of workers.
- My Requests screen for posted jobs.
- Applicants screen with worker cards showing skill, rating, experience, distance, wage, verification status, call, and assign actions.
- Worker profile detail screen.

### AI Rozgar Assistant

anga includes two assistant experiences:

1. Dedicated `/assistant` route for structured job search and hiring intent parsing.
2. Floating in-app RAG-style chatbot that appears after login and onboarding.

The RAG chatbot answers using Anga's local knowledge base:

- Demo jobs
- Worker profiles
- Customer requests
- App help content
- OTP/login guidance
- Payment and trust/safety guidance

Example queries:

```text
Mujhe aaj electrician ka kaam chahiye
Mujhe kal plumber chahiye sink repair ke liye
How do I find verified workers?
How do I keep payment safe?
```

The assistant returns grounded answers with source cards and links to relevant app screens.

### Trust And Safety

- Verified badges
- Ratings
- Document uploaded badge
- Report issue button
- SOS button after job acceptance
- Transparent wage and payment type display
- Customer and worker profile details

## Tech Stack

### Frontend

- React 19
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS
- Lucide React icons
- GSAP animations
- Sonner toasts

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- OTP records with expiry
- Role-based API protection

### Database Models

- User
- OTP
- WorkerProfile
- CustomerProfile
- Job
- Application
- Notification

## Project Structure

```text
src/
  components/
    AppEntry.tsx
    AppShell.tsx
    BottomNav.tsx
    LocationAutocomplete.tsx
    PageShell.tsx
    PhoneMockup.tsx
    RagChatbot.tsx
  lib/
    api.ts
    data.ts
    i18n.tsx
    ragAssistant.ts
    session.ts
  routes/
    index.tsx
    app.tsx
    assistant.tsx
    auth.phone.tsx
    auth.otp.tsx
    worker.*
    customer.*
server/
  config/
  middleware/
  models/
  routes/
  seed.js
  server.js
```

## Routes

### Website

- `/` - Landing website with interactive phone mockup
- `/app` - Mobile app welcome experience
- `/login` - Login redirect
- `/signup` - Signup redirect

### Authentication

- `/role-selection`
- `/auth/phone`
- `/auth/otp`

### Worker

- `/worker`
- `/worker/setup`
- `/worker/job/$id`
- `/worker/applications`
- `/worker/notifications`
- `/worker/profile`

### Customer

- `/customer`
- `/customer/setup`
- `/customer/request`
- `/customer/my-requests`
- `/customer/request/$id/applicants`
- `/customer/worker/$id`
- `/customer/notifications`
- `/customer/profile`

### Assistant

- `/assistant`

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file from `.env.example`.

```bash
cp .env.example .env
```

Required values:

```text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=optional_google_maps_key
```

### 3. Start frontend and backend

```bash
npm run dev
```

This starts:

- API server on `http://localhost:5000`
- Vite app on the local dev port

### 4. Build for production

```bash
npm run build
```

## API Overview

### Auth

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Profile

- `GET /api/profile`
- `PUT /api/profile/worker`
- `PUT /api/profile/customer`

### Jobs

- `GET /api/jobs`
- `GET /api/jobs/nearby`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `POST /api/jobs/:id/apply`
- `GET /api/jobs/:id/applicants`
- `POST /api/jobs/:id/assign`
- `POST /api/jobs/:id/complete`

### Other

- `GET /api/applications/my`
- `GET /api/notifications`
- `GET /api/workers`

## What Makes Anga Hackathon-Ready

- Clear problem-solution fit for Rozgar and daily-wage employment.
- Working end-to-end flows for both workers and customers.
- Real backend with MongoDB persistence and JWT auth.
- Mobile-first UI designed for local users.
- Interactive website demo that lets judges use the app inside a phone mockup.
- AI assistant that is grounded in app data, not just a generic chatbot.
- Trust and safety features built into the product story.
- Demo credentials make judging frictionless.

## Future Scope

- Real SMS provider integration for production OTP.
- Google Maps Places and distance calculation in production.
- Worker/customer location-based matching with geospatial indexes.
- In-app chat between assigned worker and customer.
- Payment tracking and receipt upload.
- Admin moderation for reports and verification.
- Push notifications.
- Multilingual expansion beyond Hindi and English.

## Verification

Current verification commands:

```bash
npx eslint src/routes/index.tsx
npm run build
```

The latest build passes successfully.

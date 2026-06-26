# Roomify 🏡

Roomify is a premium full-stack accommodation booking and sharing platform inspired by Airbnb. Built using the **MVC (Model-View-Controller)** design pattern, it features a responsive server-rendered UI, cloud-based deployments, and a fully automated CI/CD pipeline.

## 🚀 Project Status
A fully functional prototype is implemented and containerized for production deployment. All core features — including listing management, user authentication, review systems, geolocation, and session storage — are complete. The app is containerized with **Docker** and automatically built and pushed to **Docker Hub** via **GitHub Actions** on every push to `main`.

---

## ✨ Implemented Features

### 🏨 Listing Management (CRUD)
- **Create, Read, Update, Delete:** Hosts can manage accommodation listings with fields for title, description, pricing, location, and country.
- **Ownership Association:** Every listing is tied to an owner (user). Only the owner is authorized to update or delete it.

### 🔐 User Authentication & Authorization
- **Secure Registration & Logins:** User sessions are handled securely using **Passport.js** (`passport-local` + `passport-local-mongoose`).
- **Route Protection Middleware:** Key routes are protected; users must be logged in to create listings or leave reviews.
- **Granular Permissions:** Authorization middleware ensures only listing owners can modify listings and only review authors can delete their reviews.

### 🖼️ Cloud-Based File Uploads
- **Cloudinary Integration:** Images uploaded during listing creation/editing are stored in the cloud using **Multer** and **multer-storage-cloudinary**.
- **Dynamic Image Sizing:** Show pages retrieve the original image; the edit page dynamically requests optimized thumbnails (`w_300, h_200`) via Cloudinary transformation URLs.

### 🗺️ Geocoding & Interactive Maps
- **Mapbox Geocoding SDK:** Listing addresses are automatically converted to GeoJSON coordinates (lng/lat) on creation via Mapbox forward geocoding.
- **Interactive Map Rendering:** The show page displays an interactive globe/map using **Mapbox GL JS**.
- **Custom Markers & Popups:** A red map marker pinned to the location shows the listing title and description on click.

### 💬 Review & Rating System
- **Dynamic Ratings:** Users can submit reviews with a comment and a 1–5 star rating using the styled **Starability** CSS system.
- **Author Identity:** Reviews display the author's username.
- **Delete Functionality:** Review authors can delete their own reviews, triggering an automated update to the parent listing's `reviews` array.

### 🎨 Responsive & Interactive UI
- **Bootstrap 5 Styling:** Responsive grids (`row-cols-lg-3 row-cols-md-2 row-cols-sm-1`) and custom cards.
- **Dynamic Filters:** A custom filter bar featuring *Trending*, *Rooms*, *Iconic Cities*, *Hill Stations*, *Forts*, *Pools*, *Camping*, *Farms*, *Arctic*, *Islands*, *Beaches*, and *Domes* with corresponding icons.
- **Destination Search:** A functional search form in the navigation bar to search for destinations.
- **Interactive Tax Switch:** A toggle switch to display prices exclusive of tax or with "+18% GST" dynamically.

### 💾 Session Storage & Flash Messages
- **Persistent Sessions:** Sessions are stored in MongoDB via `connect-mongo`, so logins persist across server restarts.
- **Flash Feedback:** Users receive immediate feedback on actions (success banners on create/edit, error banners for invalid operations).

---

## 🐳 Docker & CI/CD

### Containerization
The app is fully containerized using a production-ready **Dockerfile**:
- Uses the official `node` base image.
- Installs only production dependencies (`npm ci --omit=dev`).
- Exposes port `8080` and runs via `node app.js`.

### GitHub Actions — Automated CI/CD Pipeline
A **GitHub Actions** workflow (`.github/workflows/docker-publish.yml`) automates the build and publish process:

| Trigger | Behaviour |
|---|---|
| Push to `main` | Builds and pushes image tagged `latest` to Docker Hub |
| Pull Request | Builds only (no push) for validation |
| Any branch push | Builds and pushes image tagged with the branch name |

**Pipeline steps:**
1. Checkout source code
2. Extract Docker image metadata (tags, labels, annotations)
3. Log in to Docker Hub using repository secrets
4. Set up Docker Buildx for multi-platform builds
5. Build and push the image with SBOM and provenance attestations

**Docker Hub image:** `<DOCKER_USERNAME>/roomify`

To pull and run the latest image:
```bash
docker pull <your-dockerhub-username>/roomify:latest

docker run -p 8080:8080 \
  -e ATLASDB_URL=<your-mongodb-atlas-url> \
  -e SECRET=<your-session-secret> \
  -e MAP_TOKEN=<your-mapbox-token> \
  -e CLOUD_NAME=<your-cloudinary-cloud-name> \
  -e CLOUD_APIKEY=<your-cloudinary-api-key> \
  -e CLOUD_APISECRET=<your-cloudinary-api-secret> \
  <your-dockerhub-username>/roomify:latest
```

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Runtime** | Node.js v24.15.0 |
| **Backend Framework** | Express v5.2.1 |
| **Database** | MongoDB Atlas + Mongoose v9.1.5 |
| **Templating** | EJS v4.0.1 + EJS-Mate v4.0.0 |
| **Validation** | Joi v18.0.2 |
| **File Uploads** | Multer v2.1.1 + multer-storage-cloudinary |
| **Cloud Storage** | Cloudinary |
| **Maps** | Mapbox SDK + Mapbox GL JS |
| **Auth** | Passport.js (passport-local + passport-local-mongoose) |
| **Sessions** | express-session + connect-mongo |
| **Containerization** | Docker |
| **CI/CD** | GitHub Actions → Docker Hub |

### 📂 Directory Structure
```
roomify/
├── app.js                  # Express app entry point
├── middleware.js           # Auth & ownership middleware
├── schema.js               # Joi validation schemas
├── cloudConfig.js          # Cloudinary configuration
├── Dockerfile              # Production container definition
├── .github/
│   └── workflows/
│       └── docker-publish.yml  # CI/CD pipeline
├── models/
│   ├── listing.js          # Listing schema (GeoJSON, image, owner)
│   ├── review.js           # Review schema (rating, comment, author)
│   └── user.js             # User schema (Passport-local-mongoose)
├── routes/
│   ├── listing.js          # /listings routes
│   ├── review.js           # /listings/:id/reviews routes
│   └── user.js             # /signup, /login, /logout routes
├── controllers/
│   ├── listing.js          # Listing request handlers
│   ├── review.js           # Review request handlers
│   └── user.js             # User auth handlers
├── views/                  # EJS templates (listings, users, layouts, includes)
├── public/                 # Static CSS & client-side JS (Mapbox initializer)
├── init/                   # DB seed script & sample data
└── utils/                  # ExpressError wrapper & wrapAsync helper
```

---

## 🚀 Getting Started (Local Development)

### 📋 Prerequisites
- **Node.js** v24.15.0 or later
- A **MongoDB Atlas** URI or local MongoDB installation
- Cloudinary account credentials
- Mapbox access token

### 🔧 Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sahitya1903/roomify.git
   cd roomify
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   ATLASDB_URL=<your-mongodb-atlas-connection-string>
   SECRET=<your-session-secret>
   MAP_TOKEN=<your-mapbox-access-token>
   CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUD_APIKEY=<your-cloudinary-api-key>
   CLOUD_APISECRET=<your-cloudinary-api-secret>
   ```

### 🗃️ Database Initialization (Optional)
Populate the database with sample listings:
```bash
node init/index.js
```

### ⚡ Run the Application
```bash
node app.js
```
The app will be running at [http://localhost:8080](http://localhost:8080).

---

## 🎯 Planned Features

### ⚛️ React Frontend Migration (Major Planned Upgrade)
The current SSR (Server-Side Rendered) EJS frontend will be migrated to a **React** single-page application, decoupling the frontend from the backend entirely.

**Planned architecture shift:**
- **Frontend:** React (Vite) + React Router + component library (e.g. MUI or shadcn/ui)
- **Backend:** Express refactored into a pure **REST API** (JSON responses instead of rendered HTML)
- **Auth:** JWT-based or cookie-based stateless auth (replacing Passport.js sessions)
- **State Management:** Context API or Zustand for global state (auth, flash messages)

### 🗓️ Other Planned Features
- [ ] **Booking Flow:** Reservation calendar with check-in/check-out validation and Stripe/Razorpay payment gateway integration.
- [ ] **Host Dashboard:** A private portal for hosts to track listing performance, view bookings, and manage reservations.
- [ ] **Advanced Filtering & Search:** Real database query filters based on selected categories and geolocation search.
- [ ] **Testing:** Jest/Supertest + React Testing Library for automated frontend and backend tests.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

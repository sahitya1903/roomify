# Roomify 🏡

Roomify is a premium full-stack accommodation booking and sharing platform inspired by Airbnb. It is built using the MVC (Model-View-Controller) design pattern and features a responsive server-rendered user interface.

## 🚀 Project Status
A fully functional prototype is implemented and ready for local deployment. All core features—including listing management, user authentication, review systems, geolocation, and session storage—are complete.

---

## ✨ Implemented Features

### 🏨 Listing Management (CRUD)
- **Create, Read, Update, Delete:** Hosts can manage accommodation listings with fields for title, description, pricing, location, and country.
- **Ownership Association:** Every listing is programmatically tied to an owner (user). Only the owner of a listing is authorized to update or delete it.

### 🔐 User Authentication & Authorization
- **Secure Registration & Logins:** User sessions are handled securely using **Passport.js** (utilizing `passport-local` and `passport-local-mongoose` strategies).
- **Route Protection Middleware:** Key routes are protected; users must be logged in to create listings or leave reviews.
- **Granular Permissions:** Authorization middleware ensures only listing owners can modify listings and only review authors can delete their reviews.

### 🖼️ Cloud-Based File Uploads
- **Cloudinary Integration:** Images uploaded during listing creation/editing are stored in the cloud using **Multer** and **multer-storage-cloudinary**.
- **Dynamic Image Sizing:** Show page rendering retrieves the original image, while the edit page dynamically requests optimized thumbnails (`w_300, h_200`) using Cloudinary transformation URLs.

### 🗺️ Geocoding & Interactive Maps
- **Mapbox Geocoding SDK:** When a listing is created, its address string is automatically converted into coordinates (longitude & latitude) via Mapbox forward geocoding and stored as a GeoJSON Point in MongoDB.
- **Interactive Map Rendering:** The show page displays an interactive globe/map showing the listing location using Mapbox GL JS.
- **Custom Markers & Popups:** A custom red map marker is pinned to the location, which displays a popup showing the listing's title and description on click.

### 💬 Review & Rating System
- **Dynamic Ratings:** Users can submit reviews with detailed comment text and a 1–5 star rating using the styled **Starability** CSS system.
- **Author Identity:** Reviews display the author's username.
- **Delete Functionality:** Review authors can delete their reviews, which triggers an automated update to the parent listing's reviews array.

### 🎨 Responsive & Interactive UI
- **Bootstrap 5 Styling:** Styled using responsive grids (`row-cols-lg-3 row-cols-md-2 row-cols-sm-1`) and custom cards.
- **Dynamic Filters:** A custom filter bar featuring options like *Trending*, *Rooms*, *Iconic Cities*, *Hill Stations*, *Forts*, *Pools*, *Camping*, *Farms*, *Arctic*, *Islands*, *Beaches*, and *Domes* with corresponding icons.
- **Destination Search:** A functional search form in the navigation bar to search for destinations.
- **Interactive Tax Switch:** A toggle switch to display prices either exclusive of tax or with "+18% GST" dynamically.

### 💾 Session Storage & Flash Messages
- **Persistent Sessions:** Sessions are stored in the database via `connect-mongo`, ensuring logins persist even if the server restarts.
- **Flash Feedback:** Users receive immediate feedback on actions (e.g., success banners when creating/editing listings or error banners for invalid operations).

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Node.js, Express (v5.2.1)
- **Database:** MongoDB (using Mongoose v9.1.5 for schema validation and object modeling)
- **Templating Engine:** EJS (v4.0.1) with EJS-Mate (v4.0.0) layout boilerplates
- **Validation:** Joi (v18.0.2) schema validation for listings and reviews on the server side
- **File Uploads:** Multer, Cloudinary
- **Maps API:** Mapbox SDK
- **Security & Session:** Passport.js, Express-session, Connect-Mongo, Flash, Method-Override

### 📂 Directory Structure
- `/models`: Database schemas for `User`, `Listing`, and `Review`.
- `/views`: Server-rendered EJS templates grouped into `listings`, `users`, `layouts`, and `includes`.
- `/routes`: Router definitions mapping endpoints to controller actions.
- `/controllers`: Logic for processing incoming requests and querying models (MVC separation).
- `/public`: Static CSS (including starability ratings) and client-side JavaScript (e.g. Mapbox map initializer).
- `/init`: Seed script and sample data to easily populate the database.
- `/utils`: Custom wrappers for Express error handling.

---

## 🚀 Getting Started (Local Development)

### 📋 Prerequisites
Ensure you have **Node.js** (v24.15.0 or later recommended) and a **MongoDB Atlas** database URI or local MongoDB installation.

### 🔧 Installation & Setup
1. Clone the repository and navigate to the directory:
   ```bash
   git clone https://github.com/sahitya1903/roomify.git
   cd roomify
   ```
2. Install the dependencies:
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
To populate your database with seed data:
1. Navigate to the `init/` folder.
2. Run the seeding script:
   ```bash
   node init/index.js
   ```

### ⚡ Run the Application
Start the development server:
```bash
node app.js
```
The app will be running at [http://localhost:8080](http://localhost:8080).

---

## 🎯 Goals & Next Features
- [ ] **Booking Flow:** Implement reservation calendar date pickers, check-in/check-out validation, and Stripe/Razorpay payment gateway integration.
- [ ] **Host Dashboard:** Create a private portal for hosts to track their listings' performance, view bookings, and manage reservations.
- [ ] **Advanced Filtering & Search:** Implement actual database query filters based on the selected categories (Farms, Arctic, Beaches, etc.) and geolocation search queries.
- [ ] **Testing:** Add Jest / Supertest integration for automated integration testing of routes and middleware.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](file:///d:/OneDrive%20-%20NATIONAL%20INSTITUTE%20OF%20TECHNOLOGY%20ANDHRA%20PRADESH/Code%20Files/roomify/LICENSE) file for details.

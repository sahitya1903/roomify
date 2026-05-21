# Roomify 🏡

Roomify is a full-stack accommodation booking platform inspired by Airbnb. This repository contains a working prototype with core features implemented (see Project Status below).

## 🚀 Project Status
Working prototype — core features implemented and ready for local testing.

Implemented features:
- User authentication: signup, login, logout (Passport + passport-local-mongoose)
- Listings: create, read, update, delete (with owner association)
- Image uploads stored on Cloudinary (Multer + multer-storage-cloudinary)
- Geocoding (Mapbox) for listing locations and map display
- Reviews & ratings: users can add/delete reviews tied to listings
- Server-rendered frontend using EJS templates
- Sessions stored in MongoDB (connect-mongo) and flash messaging

## 🎯 Goals
- Continue expanding booking flows and host dashboard
- Add tests and CI, and improve UX and responsiveness
- Harden security and prepare for production deployment

## ✨ Planned / Next Features
- Booking system (reserve dates, payment integration)
- Host dashboard (manage listings, bookings)
- Improve responsive UI and accessibility
- Add automated tests and linting

## 🛠️ Tech Stack
- Frontend: Server-rendered EJS templates
- Backend: Node.js, Express
- Database: MongoDB (Mongoose) — currently configured to use Atlas
- Authentication: Passport (passport-local, passport-local-mongoose)
- File uploads: Multer + Cloudinary
- Geocoding / maps: Mapbox SDK

Key dependencies are listed in `package.json` (Express, Mongoose, Passport, Mapbox SDK, Cloudinary, etc.).

## 🚀 Get started (local development)
1. Prerequisites: Node.js, npm, and a MongoDB Atlas cluster (or local MongoDB).
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:

```
NODE_ENV=development
ATLASDB_URL=<your-mongodb-connection-string>
SECRET=<session-secret>
MAP_TOKEN=<mapbox-access-token>
CLOUD_NAME=<cloudinary-cloud-name>
CLOUD_APIKEY=<cloudinary-api-key>
CLOUD_APISECRET=<cloudinary-api-secret>
```

4. Start the app:

```bash
node app.js
# then open http://localhost:8080 in your browser
```

Notes:
- The app uses Cloudinary for image storage and Mapbox for geocoding; register for free accounts to obtain keys.
- Session data is stored in MongoDB via `connect-mongo`.
- Routes: listings (`/listings`), reviews (`/listings/:id/reviews`), auth (`/signup`, `/login`, `/logout`).

## 📄 License
MIT License

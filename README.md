# Shreya Commerce Classes — Complete Website

## Project Structure
```
shreya-commerce-classes/
├── frontend/          ← React app (what users see)
│   ├── public/
│   └── src/
│       ├── components/   ← Navbar, Footer, WhatsApp button etc.
│       ├── pages/        ← Home, About, Courses, Contact etc.
│       ├── context/      ← Auth context (student login state)
│       ├── hooks/        ← Custom React hooks
│       └── utils/        ← API call helpers
└── backend/           ← Node.js + Express API
    ├── routes/        ← API route files
    ├── controllers/   ← Business logic
    ├── middleware/    ← Auth middleware (JWT)
    ├── config/        ← DB config
    └── db/            ← SQL schema
```

## PHASE 1 — Install Everything (do this first)

### Step 1 — Install Node.js
1. Go to https://nodejs.org
2. Download "LTS" version (green button)
3. Install it (next → next → finish)
4. Open VS Code terminal: View → Terminal
5. Type: `node --version`  ← should show v18 or higher

### Step 2 — Install VS Code Extensions
Open VS Code → Extensions (Ctrl+Shift+X) → search and install:
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **GitLens**
- **Thunder Client** (for testing APIs)
- **PostgreSQL** by Chris Kolkman

### Step 3 — Install PostgreSQL
1. Go to https://www.postgresql.org/download/
2. Download for Windows
3. Install with default settings
4. Remember the password you set for "postgres" user
5. After install, open "pgAdmin 4" from Start menu

### Step 4 — Set up the project

Open VS Code terminal and run these commands ONE BY ONE:

```bash
# Navigate to where you want the project (Desktop example)
cd Desktop

# Create project folder
mkdir shreya-commerce-classes
cd shreya-commerce-classes

# Set up frontend
npx create-react-app frontend
cd frontend
npm install react-router-dom axios framer-motion react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# Set up backend
mkdir backend
cd backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken pg multer nodemailer
npm install -D nodemon
cd ..
```

### Step 5 — Copy all the files from this project into your folders

Every file in this project goes exactly where the folder structure shows.

### Step 6 — Create the database
Open pgAdmin 4 → right-click "Databases" → Create → Database
Name it: `shreya_classes`

Then open Query Tool and paste the content of `backend/db/schema.sql` and run it.

### Step 7 — Create .env file in backend/
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shreya_classes
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=shreya_classes_super_secret_key_2024
```

### Step 8 — Run the project

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Frontend opens at: http://localhost:3000
Backend runs at: http://localhost:5000

---

## Features Built
- Home page with hero, features, stats
- About page (home tuition focus)
- Courses page with editable fees
- Faculty page (Shraddha Ghodekar)
- Gallery page
- Blog/News page
- Testimonials (students submit their own marks + review)
- Contact page with Google Maps
- Inquiry form
- WhatsApp chat button
- Student login + register
- Student portal (notes, announcements)
- Admin dashboard (manage everything)
- Announcements system
- Online fee payment (Razorpay)

## Admin Login (default)
Email: admin@shreyaclasses.com
Password: Admin@1234
(Change this immediately after first login)

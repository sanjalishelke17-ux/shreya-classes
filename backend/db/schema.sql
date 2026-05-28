-- ============================================================
-- Shreya Commerce Classes — Full Database Schema
-- Run this ENTIRE file in pgAdmin Query Tool
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS admissions CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(150) NOT NULL,
  email          VARCHAR(200) UNIQUE NOT NULL,
  phone          VARCHAR(20),
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20)  DEFAULT 'student' CHECK (role IN ('student','admin')),
  class_enrolled VARCHAR(50),
  is_active      BOOLEAN      DEFAULT TRUE,
  created_at     TIMESTAMP    DEFAULT NOW(),
  updated_at     TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE courses (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  description  TEXT,
  subjects     TEXT[],
  fees_monthly NUMERIC(10,2),
  fees_yearly  NUMERIC(10,2),
  duration     VARCHAR(50) DEFAULT '1 Year',
  batch_size   VARCHAR(50) DEFAULT 'Small Batch',
  badge        VARCHAR(50),
  popular      BOOLEAN DEFAULT FALSE,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inquiries (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  phone      VARCHAR(20) NOT NULL,
  email      VARCHAR(200),
  class      VARCHAR(50),
  subject    VARCHAR(100),
  message    TEXT,
  status     VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new','contacted','enrolled','closed')),
  notes      TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE announcements (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  category   VARCHAR(50) DEFAULT 'General',
  is_public  BOOLEAN DEFAULT TRUE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  subject     VARCHAR(100),
  class       VARCHAR(50),
  file_url    VARCHAR(500),
  file_name   VARCHAR(200),
  file_size   BIGINT,
  downloads   INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE gallery (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200),
  description TEXT,
  image_url   VARCHAR(500) NOT NULL,
  category    VARCHAR(50) DEFAULT 'General',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(300) NOT NULL,
  slug         VARCHAR(300) UNIQUE,
  content      TEXT NOT NULL,
  excerpt      TEXT,
  image_url    VARCHAR(500),
  category     VARCHAR(50) DEFAULT 'General',
  is_published BOOLEAN DEFAULT FALSE,
  author_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE testimonials (
  id           SERIAL PRIMARY KEY,
  student_name VARCHAR(150) NOT NULL,
  year         VARCHAR(10),
  percentage   NUMERIC(5,2),
  stream       VARCHAR(50) DEFAULT '12th Commerce',
  review       TEXT NOT NULL,
  rating       INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_approved  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id                  SERIAL PRIMARY KEY,
  student_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  amount              NUMERIC(10,2) NOT NULL,
  month               VARCHAR(20),
  year                VARCHAR(10),
  razorpay_order_id   VARCHAR(200),
  razorpay_payment_id VARCHAR(200),
  status              VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  phone      VARCHAR(20) NOT NULL,
  email      VARCHAR(200),
  class      VARCHAR(50),
  school     VARCHAR(200),
  subjects   TEXT,
  message    TEXT,
  status     VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin user password: Admin@1234  (hashed with pgcrypto bcrypt)
INSERT INTO users (name, email, phone, password_hash, role) VALUES (
  'Admin',
  'admin@shreyaclasses.com',
  '9130136257',
  crypt('Admin@1234', gen_salt('bf', 10)),
  'admin'
);

INSERT INTO courses (name, description, subjects, duration, batch_size, badge, popular) VALUES
(
  '11th Commerce',
  'Foundation year for commerce students. Strong base in all subjects with individual attention and regular tests.',
  ARRAY['Accounts','Economics','Organisation of Commerce (OC)','Secretarial Practice (SP)','Mathematics & Statistics','English'],
  '1 Year', 'Small Batch', 'Standard XI', FALSE
),
(
  '12th Commerce',
  'Board exam preparation with focused coaching, mock tests, and in-depth coverage of entire syllabus.',
  ARRAY['Accounts','Economics','Organisation of Commerce (OC)','Secretarial Practice (SP)','Mathematics & Statistics','English'],
  '1 Year', 'Small Batch', 'Standard XII', TRUE
);

INSERT INTO announcements (title, content, category, is_public) VALUES (
  'Welcome to Shreya Commerce Classes!',
  'New batch registrations are open for 11th and 12th Commerce. Limited seats available. Contact us at 9130136257 for details.',
  'Important', TRUE
);

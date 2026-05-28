import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';

import {
  requestForToken,
  onMessageListener,
} from './firebase-messaging';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Faculty from './pages/Faculty';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Admission from './pages/Admission';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentPortal from './pages/student/StudentPortal';
import StudentNotes from './pages/student/StudentNotes';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentProfile from './pages/student/StudentProfile';
import StudentFees from './pages/student/StudentFees';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminNotes from './pages/admin/AdminNotes';
import AdminBlog from './pages/admin/AdminBlog';
import AdminGallery from './pages/admin/AdminGallery';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSettings from './pages/admin/AdminSettings';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const WithNav = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <WhatsAppButton />
  </>
);

function App() {

  useEffect(() => {

    requestForToken();

    onMessageListener()
      .then((payload) => {
        console.log("Notification Received:", payload);

        if (payload?.notification) {
          alert(
            `${payload.notification.title}\n${payload.notification.body}`
          );
        }
      })
      .catch((err) => console.log("Notification Error:", err));

  }, []);

  return (
    <AuthProvider>
      <Router>

        <ScrollToTop />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0b1e3a',
              color: '#fff',
              borderRadius: '10px',
            },
            success: {
              iconTheme: {
                primary: '#e8b02a',
                secondary: '#0b1e3a',
              },
            },
          }}
        />

        <Routes>

          {/* Public Pages */}

          <Route path="/" element={<WithNav><Home /></WithNav>} />
          <Route path="/about" element={<WithNav><About /></WithNav>} />
          <Route path="/courses" element={<WithNav><Courses /></WithNav>} />
          <Route path="/faculty" element={<WithNav><Faculty /></WithNav>} />
          <Route path="/gallery" element={<WithNav><Gallery /></WithNav>} />
          <Route path="/blog" element={<WithNav><Blog /></WithNav>} />
          <Route path="/blog/:slug" element={<WithNav><BlogPost /></WithNav>} />
          <Route path="/testimonials" element={<WithNav><Testimonials /></WithNav>} />
          <Route path="/contact" element={<WithNav><Contact /></WithNav>} />
          <Route path="/admission" element={<WithNav><Admission /></WithNav>} />

          {/* Authentication */}

          <Route path="/login" element={<WithNav><Login /></WithNav>} />
          <Route path="/register" element={<WithNav><Register /></WithNav>} />

          {/* Student Portal */}

          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <StudentPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/notes"
            element={
              <ProtectedRoute>
                <StudentNotes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/announcements"
            element={
              <ProtectedRoute>
                <StudentAnnouncements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/profile"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/portal/fees"
            element={
              <ProtectedRoute>
                <StudentFees />
              </ProtectedRoute>
            }
          />

          {/* Admin Panel */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <AdminStudents />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/notes"
            element={
              <AdminRoute>
                <AdminNotes />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/blog"
            element={
              <AdminRoute>
                <AdminBlog />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/gallery"
            element={
              <AdminRoute>
                <AdminGallery />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/inquiries"
            element={
              <AdminRoute>
                <AdminInquiries />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/announcements"
            element={
              <AdminRoute>
                <AdminAnnouncements />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/testimonials"
            element={
              <AdminRoute>
                <AdminTestimonials />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <AdminRoute>
                <AdminCourses />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />

        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
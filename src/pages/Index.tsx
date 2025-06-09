
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { BookingProvider } from '@/contexts/BookingContext';
import Navbar from '@/components/Navbar';
import Home from '@/components/Home';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import TrainSearch from '@/components/booking/TrainSearch';
import BookingForm from '@/components/booking/BookingForm';
import TicketDisplay from '@/components/booking/TicketDisplay';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Profile from '@/components/Profile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Index = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<TrainSearch />} />
              <Route 
                path="/booking" 
                element={
                  <ProtectedRoute>
                    <BookingForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ticket/:pnr" 
                element={
                  <ProtectedRoute>
                    <TicketDisplay />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </BookingProvider>
    </AuthProvider>
  );
};

export default Index;

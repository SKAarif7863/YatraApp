
import React, { createContext, useContext, useState } from 'react';

interface Train {
  id: string;
  number: string;
  name: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
}

interface TrainClass {
  type: string;
  name: string;
  fare: number;
  available: number;
  total: number;
}

interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  destination: string;
  fare: number;
  seatNumber?: string;
  coachNumber?: string;
}

interface BookingData {
  train: Train | null;
  selectedClass: string;
  passengers: Passenger[];
  totalFare: number;
  pnr?: string;
}

interface BookingContextType {
  bookingData: BookingData;
  setTrain: (train: Train) => void;
  setClass: (classType: string) => void;
  setPassengers: (passengers: Passenger[]) => void;
  calculateFare: (passenger: Passenger) => number;
  createBooking: () => Promise<string>;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Mock distance data for fare calculation
const STATION_DISTANCES: Record<string, Record<string, number>> = {
  'New Delhi': {
    'Mumbai Central': 1384,
    'Chennai Central': 2194,
    'Kolkata': 1472,
    'Bangalore': 2146,
    'Hyderabad': 1594,
    'Pune': 1463
  },
  'Mumbai Central': {
    'New Delhi': 1384,
    'Chennai Central': 1338,
    'Kolkata': 1968,
    'Bangalore': 1012,
    'Hyderabad': 711,
    'Pune': 192
  },
  // Add more stations as needed
};

const CLASS_RATES: Record<string, number> = {
  '3A': 2.5,   // Rs per km
  '2A': 4.0,   // Rs per km
  '1A': 6.5,   // Rs per km
  'SL': 1.5,   // Rs per km
  'CC': 3.0    // Rs per km
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    train: null,
    selectedClass: '',
    passengers: [],
    totalFare: 0
  });

  const setTrain = (train: Train) => {
    setBookingData(prev => ({ ...prev, train }));
  };

  const setClass = (classType: string) => {
    setBookingData(prev => ({ ...prev, selectedClass: classType }));
  };

  const calculateFare = (passenger: Passenger): number => {
    if (!bookingData.train || !bookingData.selectedClass) return 0;
    
    const sourceStation = bookingData.train.source;
    const destinationStation = passenger.destination;
    
    const distance = STATION_DISTANCES[sourceStation]?.[destinationStation] || 1000;
    const rate = CLASS_RATES[bookingData.selectedClass] || 2.0;
    
    return Math.round(distance * rate);
  };

  const setPassengers = (passengers: Passenger[]) => {
    const passengersWithFare = passengers.map(passenger => ({
      ...passenger,
      fare: calculateFare(passenger)
    }));
    
    const totalFare = passengersWithFare.reduce((sum, p) => sum + p.fare, 0);
    
    setBookingData(prev => ({
      ...prev,
      passengers: passengersWithFare,
      totalFare
    }));
  };

  const createBooking = async (): Promise<string> => {
    try {
      // Simulate seat allocation
      const allocatedPassengers = bookingData.passengers.map((passenger, index) => ({
        ...passenger,
        coachNumber: 'B1',
        seatNumber: `${index + 1}`
      }));

      const pnr = 'PNR' + Date.now().toString().slice(-6);
      
      setBookingData(prev => ({
        ...prev,
        passengers: allocatedPassengers,
        pnr
      }));
      
      return pnr;
    } catch (error) {
      console.error('Booking error:', error);
      throw new Error('Failed to create booking');
    }
  };

  const clearBooking = () => {
    setBookingData({
      train: null,
      selectedClass: '',
      passengers: [],
      totalFare: 0
    });
  };

  return (
    <BookingContext.Provider value={{
      bookingData,
      setTrain,
      setClass,
      setPassengers,
      calculateFare,
      createBooking,
      clearBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

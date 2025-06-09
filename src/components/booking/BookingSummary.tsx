
import React from 'react';

interface BookingSummaryProps {
  selectedClass: string;
  passengerCount: number;
  coachNumber: string;
  totalFare: number;
}

const BookingSummary = ({ selectedClass, passengerCount, coachNumber, totalFare }: BookingSummaryProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">Booking Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Travel Class</label>
          <p className="font-semibold text-blue-600">{selectedClass}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Total Passengers</label>
          <p className="font-semibold">{passengerCount}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Coach Number</label>
          <p className="font-semibold text-blue-600">{coachNumber}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Total Fare</label>
          <p className="font-semibold text-green-600 text-xl">₹{totalFare}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;

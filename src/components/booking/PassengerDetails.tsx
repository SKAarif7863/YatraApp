
import React from 'react';

interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  destination: string;
  fare: number;
  seatNumber?: string;
  coachNumber?: string;
}

interface PassengerDetailsProps {
  passengers: Passenger[];
  trainSource: string;
}

const PassengerDetails = ({ passengers, trainSource }: PassengerDetailsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">Passenger Details</h3>
      <div className="space-y-4">
        {passengers.map((passenger, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-lg text-blue-900">Passenger {index + 1}</h4>
              <div className="text-right">
                <div className="text-sm text-gray-600">Seat Number</div>
                <div className="font-bold text-blue-600">
                  {passenger.coachNumber}-{passenger.seatNumber}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="font-semibold">{passenger.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age/Gender</label>
                <p className="font-semibold">{passenger.age}/{passenger.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">From</label>
                <p className="font-semibold text-blue-600">{trainSource}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">To</label>
                <p className="font-semibold text-orange-600">{passenger.destination}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Individual Fare</label>
                <p className="font-semibold text-green-600">₹{passenger.fare}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerDetails;


import React from 'react';
import { Ticket } from 'lucide-react';

const SuccessMessage = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
      <div className="flex items-center space-x-2">
        <div className="bg-green-500 rounded-full p-1">
          <Ticket className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-green-800 font-medium">Booking Confirmed!</h3>
          <p className="text-green-700 text-sm">Your ticket has been booked successfully</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;

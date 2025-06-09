
import React from 'react';
import { Train } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface TicketHeaderProps {
  pnr: string;
  selectedClass: string;
  currentTime: Date;
}

const TicketHeader = ({ pnr, selectedClass, currentTime }: TicketHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-blue-900 to-orange-600 text-white">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-2xl flex items-center space-x-2">
            <Train className="h-6 w-6" />
            <span>IRCTC E-Ticket</span>
          </CardTitle>
          <p className="text-blue-100 mt-1">Indian Railway Catering and Tourism Corporation</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">PNR: {pnr}</div>
          <div className="text-sm text-blue-100">
            Booked on: {currentTime.toLocaleDateString('en-IN')}
          </div>
          <div className="text-sm text-blue-100">
            Class: {selectedClass}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default TicketHeader;

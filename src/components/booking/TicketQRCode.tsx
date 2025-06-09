
import React from 'react';
import { QrCode } from 'lucide-react';

interface TicketQRCodeProps {
  pnr: string;
  trainNumber: string;
  passengerCount: number;
  totalFare: number;
}

const TicketQRCode = ({ pnr, trainNumber, passengerCount, totalFare }: TicketQRCodeProps) => {
  const generateQRData = () => {
    return `PNR:${pnr}|TRAIN:${trainNumber}|PASSENGERS:${passengerCount}|FARE:${totalFare}`;
  };

  return (
    <div className="mb-6 text-center">
      <div className="inline-block border-2 border-gray-300 p-6 rounded-lg bg-white">
        <div className="flex flex-col items-center">
          <QrCode className="h-24 w-24 text-gray-700 mb-2" />
          <div className="text-xs text-gray-600 max-w-48 break-all bg-gray-100 p-2 rounded">
            {generateQRData()}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3 font-medium">Scan for ticket verification</p>
        <p className="text-xs text-gray-500">Present this QR code to TTE</p>
      </div>
    </div>
  );
};

export default TicketQRCode;

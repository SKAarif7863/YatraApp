
import React from 'react';

interface TicketInstructionsProps {
  coachNumber: string;
}

const TicketInstructions = ({ coachNumber }: TicketInstructionsProps) => {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h4 className="font-semibold text-yellow-800 mb-2">Important Journey Instructions:</h4>
      <ul className="text-sm text-yellow-700 space-y-1">
        <li>• Carry a valid government-issued photo ID during journey</li>
        <li>• Report to the station at least 30 minutes before departure</li>
        <li>• Both passengers are seated in coach {coachNumber}</li>
        <li>• Cancellation charges apply as per IRCTC policy</li>
        <li>• Present this e-ticket and ID proof to the Ticket Examiner (TTE)</li>
        <li>• Keep the QR code visible for quick verification</li>
      </ul>
    </div>
  );
};

export default TicketInstructions;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TicketHeader from './TicketHeader';
import TrainDetails from './TrainDetails';
import PassengerDetails from './PassengerDetails';
import BookingSummary from './BookingSummary';
import TicketQRCode from './TicketQRCode';
import TicketActions from './TicketActions';
import TicketInstructions from './TicketInstructions';
import SuccessMessage from './SuccessMessage';

const TicketDisplay = () => {
  const { pnr } = useParams<{ pnr: string }>();
  const { bookingData } = useBooking();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!bookingData.train || !bookingData.pnr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find a ticket with PNR: {pnr}
            </p>
            <Link to="/search">
              <Button>Search New Trains</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SuccessMessage />

        <Card className="shadow-xl">
          <TicketHeader 
            pnr={bookingData.pnr}
            selectedClass={bookingData.selectedClass}
            currentTime={currentTime}
          />

          <CardContent className="p-6">
            <TrainDetails 
              train={bookingData.train}
              selectedClass={bookingData.selectedClass}
            />

            <Separator className="my-6" />

            <PassengerDetails 
              passengers={bookingData.passengers}
              trainSource={bookingData.train.source}
            />

            <Separator className="my-6" />

            <BookingSummary 
              selectedClass={bookingData.selectedClass}
              passengerCount={bookingData.passengers.length}
              coachNumber={bookingData.passengers[0]?.coachNumber || 'B1'}
              totalFare={bookingData.totalFare}
            />

            <TicketQRCode 
              pnr={bookingData.pnr}
              trainNumber={bookingData.train.number}
              passengerCount={bookingData.passengers.length}
              totalFare={bookingData.totalFare}
            />

            <TicketActions 
              pnr={bookingData.pnr}
              trainName={bookingData.train.name}
            />

            <TicketInstructions 
              coachNumber={bookingData.passengers[0]?.coachNumber || 'B1'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDisplay;

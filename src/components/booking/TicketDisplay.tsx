
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ticket, Download, Share2, Train, Calendar, Clock, MapPin } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

  const handleDownload = () => {
    // Simulate ticket download
    console.log('Downloading ticket...');
  };

  const handleShare = () => {
    // Simulate ticket sharing
    if (navigator.share) {
      navigator.share({
        title: `Train Ticket - PNR: ${bookingData.pnr}`,
        text: `My train booking details for ${bookingData.train.name}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
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

        {/* E-Ticket */}
        <Card className="shadow-xl">
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
                <div className="text-2xl font-bold">PNR: {bookingData.pnr}</div>
                <div className="text-sm text-blue-100">
                  Booked on: {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Train Information */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Train Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Train className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-lg">
                      {bookingData.train.number} - {bookingData.train.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>{bookingData.train.source} → {bookingData.train.destination}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>Departure: {bookingData.train.departureTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>Arrival: {bookingData.train.arrivalTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span>Duration: {bookingData.train.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Passenger Details */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Passenger Details</h3>
              <div className="space-y-4">
                {bookingData.passengers.map((passenger, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
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
                        <label className="text-sm font-medium text-gray-600">Destination</label>
                        <p className="font-semibold">{passenger.destination}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Seat</label>
                        <p className="font-semibold">
                          {passenger.coachNumber}-{passenger.seatNumber}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fare</label>
                        <p className="font-semibold text-green-600">₹{passenger.fare}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Booking Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Booking Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Class</label>
                  <p className="font-semibold">{bookingData.selectedClass}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Passengers</label>
                  <p className="font-semibold">{bookingData.passengers.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Fare</label>
                  <p className="font-semibold text-green-600 text-xl">₹{bookingData.totalFare}</p>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="mb-6 text-center">
              <div className="inline-block border-2 border-dashed border-gray-300 p-8 rounded-lg">
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500 text-sm">QR Code</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Scan for ticket verification</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Ticket
              </Button>
              <Link to="/search" className="flex-1">
                <Button variant="outline" className="w-full">
                  Book Another Ticket
                </Button>
              </Link>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please carry a valid ID proof during journey</li>
                <li>• Report to the station at least 30 minutes before departure</li>
                <li>• Both passengers will be seated in the same coach (B1)</li>
                <li>• Cancellation charges apply as per IRCTC policy</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDisplay;

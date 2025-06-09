
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ticket, Download, Share2, Train, Calendar, Clock, MapPin, QrCode, FileText } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const TicketDisplay = () => {
  const { pnr } = useParams<{ pnr: string }>();
  const { bookingData } = useBooking();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

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
    toast({
      title: "Download Started",
      description: "Your ticket PDF is being generated...",
    });
    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Ticket downloaded successfully",
      });
    }, 2000);
  };

  const handleShare = () => {
    const shareData = {
      title: `Train Ticket - PNR: ${bookingData.pnr}`,
      text: `My train booking details for ${bookingData.train.name}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((error) => {
        console.log('Error sharing:', error);
        toast({
          title: "Share Failed",
          description: "Unable to share ticket. You can copy the URL instead.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Ticket link copied to clipboard",
        });
      }).catch(() => {
        toast({
          title: "Share Failed",
          description: "Unable to copy link. Please copy the URL manually.",
          variant: "destructive",
        });
      });
    }
  };

  const generateQRData = () => {
    return `PNR:${bookingData.pnr}|TRAIN:${bookingData.train.number}|PASSENGERS:${bookingData.passengers.length}|FARE:${bookingData.totalFare}`;
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
                  Booked on: {currentTime.toLocaleDateString('en-IN')}
                </div>
                <div className="text-sm text-blue-100">
                  Class: {bookingData.selectedClass}
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
                  <div className="text-sm text-gray-600">
                    Travel Class: <span className="font-semibold text-blue-600">{bookingData.selectedClass}</span>
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
                        <p className="font-semibold text-blue-600">{bookingData.train.source}</p>
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

            <Separator className="my-6" />

            {/* Booking Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Booking Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Travel Class</label>
                  <p className="font-semibold text-blue-600">{bookingData.selectedClass}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Passengers</label>
                  <p className="font-semibold">{bookingData.passengers.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Coach Number</label>
                  <p className="font-semibold text-blue-600">{bookingData.passengers[0]?.coachNumber || 'B1'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Fare</label>
                  <p className="font-semibold text-green-600 text-xl">₹{bookingData.totalFare}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Ticket
              </Button>
              <Link to="/search" className="flex-1">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Book Another
                </Button>
              </Link>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Journey Instructions:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Carry a valid government-issued photo ID during journey</li>
                <li>• Report to the station at least 30 minutes before departure</li>
                <li>• Both passengers are seated in coach {bookingData.passengers[0]?.coachNumber || 'B1'}</li>
                <li>• Cancellation charges apply as per IRCTC policy</li>
                <li>• Present this e-ticket and ID proof to the Ticket Examiner (TTE)</li>
                <li>• Keep the QR code visible for quick verification</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDisplay;

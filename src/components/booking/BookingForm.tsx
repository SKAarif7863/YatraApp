
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2 } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BookingForm = () => {
  const { bookingData, setPassengers, createBooking, calculateFare } = useBooking();
  const [passengers, setPassengersState] = useState([
    { name: '', age: '', gender: 'Male' as const, destination: '' }
  ]);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const stations = [
    'New Delhi',
    'Mumbai Central',
    'Chennai Central',
    'Kolkata',
    'Bangalore',
    'Hyderabad',
    'Pune'
  ];

  if (!bookingData.train) {
    navigate('/search');
    return null;
  }

  const addPassenger = () => {
    if (passengers.length < 2) {
      setPassengersState([
        ...passengers,
        { name: '', age: '', gender: 'Male' as const, destination: '' }
      ]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengersState(newPassengers);
    }
  };

  const updatePassenger = (index: number, field: string, value: string) => {
    const newPassengers = passengers.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setPassengersState(newPassengers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validPassengers = passengers.filter(p => 
      p.name && p.age && p.destination
    );

    if (validPassengers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all passenger details",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      // Calculate fares and update context
      const passengersWithFare = validPassengers.map(p => ({
        name: p.name,
        age: Number(p.age),
        gender: p.gender,
        destination: p.destination,
        fare: calculateFare({
          name: p.name,
          age: Number(p.age),
          gender: p.gender,
          destination: p.destination,
          fare: 0
        })
      }));

      setPassengers(passengersWithFare);
      
      // Create booking
      const pnr = await createBooking();
      
      toast({
        title: "Booking Successful!",
        description: `Your PNR is ${pnr}`,
      });
      
      navigate(`/ticket/${pnr}`);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Train Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Train Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg text-blue-900">
                  {bookingData.train.number} - {bookingData.train.name}
                </h3>
                <p className="text-gray-600">
                  {bookingData.train.source} → {bookingData.train.destination}
                </p>
                <p className="text-sm text-gray-600">
                  Departure: {bookingData.train.departureTime} | 
                  Arrival: {bookingData.train.arrivalTime}
                </p>
              </div>
              <div>
                <p className="font-medium">Selected Class: {bookingData.selectedClass}</p>
                <p className="text-sm text-gray-600">Duration: {bookingData.train.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Passenger Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-lg">Passenger {index + 1}</h4>
                    {passengers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePassenger(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Full Name *</Label>
                      <Input
                        id={`name-${index}`}
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`age-${index}`}>Age *</Label>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                        placeholder="Age"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gender-${index}`}>Gender *</Label>
                      <Select 
                        value={passenger.gender}
                        onValueChange={(value) => updatePassenger(index, 'gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`destination-${index}`}>Destination *</Label>
                      <Select 
                        value={passenger.destination}
                        onValueChange={(value) => updatePassenger(index, 'destination', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.filter(s => s !== bookingData.train?.source).map((station) => (
                            <SelectItem key={station} value={station}>{station}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {passenger.destination && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        Estimated Fare: ₹{calculateFare({
                          name: passenger.name,
                          age: Number(passenger.age),
                          gender: passenger.gender,
                          destination: passenger.destination,
                          fare: 0
                        })}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {passengers.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPassenger}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Passenger
                </Button>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total Estimated Fare:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{passengers.reduce((total, p) => {
                      if (p.destination) {
                        return total + calculateFare({
                          name: p.name,
                          age: Number(p.age),
                          gender: p.gender,
                          destination: p.destination,
                          fare: 0
                        });
                      }
                      return total;
                    }, 0)}
                  </span>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3"
                  disabled={isBooking}
                >
                  {isBooking ? 'Processing Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;

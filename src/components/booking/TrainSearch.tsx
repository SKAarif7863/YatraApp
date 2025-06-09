
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, ArrowRight } from 'lucide-react';
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

const TrainSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    class: ''
  });
  const [trains, setTrains] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setTrain, setClass } = useBooking();
  const navigate = useNavigate();

  const stations = [
    'New Delhi',
    'Mumbai Central',
    'Chennai Central',
    'Kolkata',
    'Bangalore',
    'Hyderabad',
    'Pune'
  ];

  const classes = [
    { value: '1A', label: 'First AC (1A)' },
    { value: '2A', label: 'Second AC (2A)' },
    { value: '3A', label: 'Third AC (3A)' },
    { value: 'SL', label: 'Sleeper (SL)' },
    { value: 'CC', label: 'Chair Car (CC)' }
  ];

  // Mock train data
  const mockTrains = [
    {
      id: '1',
      number: '12951',
      name: 'Mumbai Rajdhani',
      source: 'New Delhi',
      destination: 'Mumbai Central',
      departureTime: '16:55',
      arrivalTime: '08:35',
      duration: '15h 40m',
      classes: [
        { type: '1A', name: 'First AC', fare: 4500, available: 25, total: 50 },
        { type: '2A', name: 'Second AC', fare: 3200, available: 45, total: 100 },
        { type: '3A', name: 'Third AC', fare: 2200, available: 62, total: 150 }
      ]
    },
    {
      id: '2',
      number: '12002',
      name: 'Bhopal Shatabdi',
      source: 'New Delhi',
      destination: 'Mumbai Central',
      departureTime: '06:00',
      arrivalTime: '22:30',
      duration: '16h 30m',
      classes: [
        { type: '2A', name: 'Second AC', fare: 2800, available: 23, total: 80 },
        { type: '3A', name: 'Third AC', fare: 1800, available: 87, total: 120 },
        { type: 'CC', name: 'Chair Car', fare: 1200, available: 156, total: 200 }
      ]
    }
  ];

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setTrains(mockTrains);
      setIsSearching(false);
    }, 1000);
  };

  const handleBookTrain = (train: any, selectedClass: string) => {
    setTrain(train);
    setClass(selectedClass);
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Trains</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Select value={searchParams.from} onValueChange={(value) => setSearchParams({...searchParams, from: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Select value={searchParams.to} onValueChange={(value) => setSearchParams({...searchParams, to: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.filter(s => s !== searchParams.from).map((station) => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Journey Date</Label>
                <Input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isSearching ? 'Searching...' : 'Search Trains'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {trains.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Available Trains</h2>
            {trains.map((train) => (
              <Card key={train.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-xl font-bold text-blue-900">
                          {train.number} - {train.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{train.source}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{train.destination}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Departure: {train.departureTime}</span>
                        <span>Arrival: {train.arrivalTime}</span>
                        <span>Duration: {train.duration}</span>
                      </div>
                    </div>
                    
                    <div className="lg:ml-8">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {train.classes.map((cls: any) => (
                          <div key={cls.type} className="border rounded-lg p-3 text-center">
                            <div className="font-medium text-sm">{cls.name}</div>
                            <div className="text-lg font-bold text-green-600">₹{cls.fare}</div>
                            <div className="text-xs text-gray-600">{cls.available} Available</div>
                            <Button 
                              size="sm" 
                              className="mt-2 w-full"
                              onClick={() => handleBookTrain(train, cls.type)}
                              disabled={cls.available === 0}
                            >
                              {cls.available > 0 ? 'Book Now' : 'Waitlist'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainSearch;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, ArrowRight } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrainSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    class: '',
    trainQuery: ''
  });
  const [trains, setTrains] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setTrain, setClass } = useBooking();
  const navigate = useNavigate();

  // A proper listing of stations - in production this should come from an API
  const stations = useMemo(() => [
    'New Delhi',
    'Mumbai Central',
    'Chennai Central',
    'Kolkata',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Jaipur',
    'Lucknow',
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Nagpur'
  ], []);

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

  // Suggestion dropdown state
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromRef = useRef<HTMLInputElement | null>(null);
  const toRef = useRef<HTMLInputElement | null>(null);

  const filteredFrom = useMemo(() => {
    if (!fromQuery) return [];
    const q = fromQuery.toLowerCase();
    return stations.filter(s => s.toLowerCase().includes(q));
  }, [fromQuery, stations]);

  const filteredTo = useMemo(() => {
    if (!toQuery) return [];
    const q = toQuery.toLowerCase();
    return stations.filter(s => s.toLowerCase().includes(q) && s !== searchParams.from);
  }, [toQuery, stations, searchParams.from]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setShowFromSuggestions(false);
      if (toRef.current && !toRef.current.contains(e.target as Node)) setShowToSuggestions(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Date restrictions: min today, max two months from now
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date(today);
  maxDateObj.setMonth(maxDateObj.getMonth() + 2);
  // If adding 2 months lands on invalid date (e.g., 31 -> shorter month), adjust
  if (maxDateObj.getDate() !== today.getDate()) {
    maxDateObj.setDate(0); // go to last day of previous month
  }
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const handleSearch = async () => {
    // Basic validations
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      alert('Please select source, destination and journey date');
      return;
    }
    if (searchParams.from === searchParams.to) {
      alert('Source and destination cannot be the same');
      return;
    }
    // Date range check
    if (searchParams.date < minDate || searchParams.date > maxDate) {
      alert(`Please select a date between ${minDate} and ${maxDate}`);
      return;
    }

    setIsSearching(true);
    // Simulate API call and filter mock trains by query
    setTimeout(() => {
      const q = searchParams.trainQuery.trim().toLowerCase();
      let results = mockTrains.filter(t => t.source === searchParams.from && t.destination === searchParams.to);
      if (q) {
        results = results.filter(t => t.name.toLowerCase().includes(q) || t.number.includes(q));
      }
      setTrains(results);
      setIsSearching(false);
    }, 800);
  };

  const handleSelectFrom = (val: string) => {
    setSearchParams({ ...searchParams, from: val });
    setFromQuery('');
    setShowFromSuggestions(false);
  };

  const handleSelectTo = (val: string) => {
    setSearchParams({ ...searchParams, to: val });
    setToQuery('');
    setShowToSuggestions(false);
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-1" ref={fromRef}>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  placeholder="Type source"
                  value={searchParams.from || fromQuery}
                  onChange={(e) => { setFromQuery(e.target.value); setSearchParams({ ...searchParams, from: '' }); setShowFromSuggestions(true); }}
                  onFocus={() => fromQuery && setShowFromSuggestions(true)}
                />
                {showFromSuggestions && filteredFrom.length > 0 && (
                  <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-48 overflow-auto">
                    {filteredFrom.map(s => (
                      <div key={s} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectFrom(s)}>{s}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative md:col-span-1" ref={toRef}>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="Type destination"
                  value={searchParams.to || toQuery}
                  onChange={(e) => { setToQuery(e.target.value); setSearchParams({ ...searchParams, to: '' }); setShowToSuggestions(true); }}
                  onFocus={() => toQuery && setShowToSuggestions(true)}
                />
                {showToSuggestions && filteredTo.length > 0 && (
                  <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-48 overflow-auto">
                    {filteredTo.map(s => (
                      <div key={s} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectTo(s)}>{s}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <Label htmlFor="date">Journey Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  min={minDate}
                  max={maxDate}
                />
                <div className="text-xs text-gray-500 mt-1">Select a date between {minDate} and {maxDate}</div>
              </div>

              <div className="md:col-span-1">
                <Label htmlFor="class">Class</Label>
                <select
                  id="class"
                  className="w-full rounded-md border bg-white px-3 py-2"
                  value={searchParams.class}
                  onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
                >
                  <option value="">Any</option>
                  {classes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="trainQuery">Train name or number</Label>
                <Input
                  id="trainQuery"
                  placeholder="Search by train name or number"
                  value={searchParams.trainQuery}
                  onChange={(e) => setSearchParams({ ...searchParams, trainQuery: e.target.value })}
                />
              </div>

              <div className="flex items-end md:col-span-6">
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

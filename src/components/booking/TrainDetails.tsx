
import React from 'react';
import { Train, MapPin, Clock, Calendar } from 'lucide-react';

interface Train {
  number: string;
  name: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

interface TrainDetailsProps {
  train: Train;
  selectedClass: string;
}

const TrainDetails = ({ train, selectedClass }: TrainDetailsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">Train Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Train className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg">
              {train.number} - {train.name}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <MapPin className="h-4 w-4" />
            <span>{train.source} → {train.destination}</span>
          </div>
          <div className="text-sm text-gray-600">
            Travel Class: <span className="font-semibold text-blue-600">{selectedClass}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4 text-gray-600" />
            <span>Departure: {train.departureTime}</span>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4 text-gray-600" />
            <span>Arrival: {train.arrivalTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span>Duration: {train.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;

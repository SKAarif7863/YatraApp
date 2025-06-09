
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Train, Users, Ticket, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 15420,
    totalRevenue: 2847650,
    activeTrains: 156,
    totalPassengers: 28340
  });

  // Mock data for charts
  const bookingTrends = [
    { month: 'Jan', bookings: 1200, revenue: 240000 },
    { month: 'Feb', bookings: 1350, revenue: 275000 },
    { month: 'Mar', bookings: 1100, revenue: 220000 },
    { month: 'Apr', bookings: 1450, revenue: 290000 },
    { month: 'May', bookings: 1600, revenue: 325000 },
    { month: 'Jun', bookings: 1380, revenue: 280000 },
  ];

  const routeStats = [
    { route: 'Delhi-Mumbai', bookings: 3420, color: '#3B82F6' },
    { route: 'Mumbai-Chennai', bookings: 2850, color: '#EF4444' },
    { route: 'Delhi-Kolkata', bookings: 2340, color: '#10B981' },
    { route: 'Bangalore-Chennai', bookings: 1890, color: '#F59E0B' },
    { route: 'Delhi-Bangalore', bookings: 1650, color: '#8B5CF6' },
  ];

  const classDistribution = [
    { name: '3A', value: 35, color: '#3B82F6' },
    { name: '2A', value: 25, color: '#EF4444' },
    { name: '1A', value: 15, color: '#10B981' },
    { name: 'SL', value: 20, color: '#F59E0B' },
    { name: 'CC', value: 5, color: '#8B5CF6' },
  ];

  const recentBookings = [
    { pnr: 'PNR123456', passenger: 'John Doe', train: '12951 Mumbai Rajdhani', fare: 4500, status: 'Confirmed' },
    { pnr: 'PNR123457', passenger: 'Jane Smith', train: '12002 Bhopal Shatabdi', fare: 2800, status: 'Confirmed' },
    { pnr: 'PNR123458', passenger: 'Mike Johnson', train: '12951 Mumbai Rajdhani', fare: 3200, status: 'Waitlisted' },
    { pnr: 'PNR123459', passenger: 'Sarah Wilson', train: '12002 Bhopal Shatabdi', fare: 1800, status: 'Confirmed' },
    { pnr: 'PNR123460', passenger: 'David Brown', train: '12951 Mumbai Rajdhani', fare: 4500, status: 'Confirmed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage railway bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trains</CardTitle>
              <Train className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTrains}</div>
              <p className="text-xs text-muted-foreground">+3 new routes added</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passengers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPassengers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Monthly booking and revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Class Distribution</CardTitle>
                  <CardDescription>Booking distribution by class</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={classDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {classDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest ticket bookings in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">PNR</th>
                        <th className="text-left p-2">Passenger</th>
                        <th className="text-left p-2">Train</th>
                        <th className="text-left p-2">Fare</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{booking.pnr}</td>
                          <td className="p-2">{booking.passenger}</td>
                          <td className="p-2">{booking.train}</td>
                          <td className="p-2">₹{booking.fare}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'Confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>Most booked train routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routeStats.map((route, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{route.route}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(route.bookings / 3500) * 100}%`, 
                              backgroundColor: route.color 
                            }}
                          />
                        </div>
                        <span className="font-bold">{route.bookings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Bookings'
                      ]}
                    />
                    <Bar dataKey="revenue" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

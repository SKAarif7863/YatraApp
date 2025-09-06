import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Train } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signInWithGooglePopup } from '@/firebase/auth';
import { firebaseSignOut } from '@/firebase/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast({ title: 'Login Successful', description: 'Welcome back to IRCTC!' });
        navigate('/search');
      } else {
        toast({ title: 'Login Failed', description: 'Invalid credentials. Please try again.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      const { idToken } = await signInWithGooglePopup();
      const ok = await googleSignIn(idToken);
      if (ok) {
        navigate('/search');
      } else {
        // If backend exchange failed, sign out from firebase
        await firebaseSignOut();
      }
    } catch (e) {
      console.error('Google sign in error', e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-900 p-3 rounded-lg">
              <Train className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription>Sign in to your IRCTC account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
          </form>

          <div className="mt-4">
            <Button onClick={handleGoogleSignIn} className="w-full bg-white border text-gray-800">Sign in with Google</Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="font-medium text-blue-900 hover:text-blue-800">Register here</Link></p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">Demo Login: Use any email and password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

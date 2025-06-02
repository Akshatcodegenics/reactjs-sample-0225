import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useTasks } from '@/hooks/useTasks';
import Web3Wallet from '@/components/Web3Wallet';
import Task3DScene from '@/components/Task3DScene';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
}

const Profile = () => {
  const { tasks } = useTasks();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate project manager with 5+ years of experience in agile development and team leadership.',
    avatar: '',
    joinDate: '2024-01-15'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('taskboard-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load random avatar from Picsum API
    loadRandomAvatar();
  }, []);

  const loadRandomAvatar = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1000);
      const response = await fetch(`https://picsum.photos/id/${randomId}/info`);
      const data = await response.json();
      
      if (data.download_url) {
        const avatarUrl = `https://picsum.photos/id/${randomId}/200/200`;
        setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      }
    } catch (error) {
      console.error('Failed to load avatar:', error);
      // Use a fallback avatar
      setProfile(prev => ({ ...prev, avatar: `https://picsum.photos/id/77/200/200` }));
    }
  };

  const saveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('taskboard-profile', JSON.stringify(profile));
      setIsEditing(false);
      setLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully!"
      });
    }, 1000);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 animate-fade-in">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-text">Profile</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">Dashboard</Link>
              <Link to="/board" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">Board</Link>
              <Link to="/profile" className="text-blue-600 font-medium">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 glass hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative animate-float">
                  <Avatar className="w-24 h-24 ring-4 ring-blue-200">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 hover:scale-110 transition-transform duration-200"
                    onClick={loadRandomAvatar}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl gradient-text">{profile.name}</CardTitle>
              <p className="text-gray-600">{profile.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{profile.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{profile.location}</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">Member since</p>
                <p className="text-sm font-medium">{new Date(profile.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card className="lg:col-span-2 glass hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl gradient-text">Profile Information</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveProfile} disabled={loading} className="bg-gradient-to-r from-green-500 to-blue-500">
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <Input
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.location}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="transition-all duration-200 focus:scale-105"
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Web3 Wallet */}
          <div className="lg:col-span-1 space-y-6">
            <Web3Wallet />
            
            {/* 3D Task Visualization */}
            <Card className="glass hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="gradient-text">Task Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense fallback={<div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg animate-pulse" />}>
                  <Task3DScene tasks={tasks} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Overview */}
        <Card className="mt-8 glass hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="gradient-text">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-blue-600 animate-pulse-glow">{tasks.filter(t => t.status === 'completed').length}</div>
                <p className="text-gray-600 mt-2">Tasks Completed</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-green-600 animate-pulse-glow">8</div>
                <p className="text-gray-600 mt-2">Projects Managed</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-purple-600 animate-pulse-glow">24</div>
                <p className="text-gray-600 mt-2">Team Collaborations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;

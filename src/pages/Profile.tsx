
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link to="/board" className="text-gray-600 hover:text-blue-600 transition-colors">Board</Link>
              <Link to="/profile" className="text-blue-600 font-medium">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={loadRandomAvatar}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Profile Information</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveProfile} disabled={loading}>
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
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-gray-600">Tasks Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <p className="text-gray-600">Projects Managed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24</div>
                <p className="text-gray-600">Team Collaborations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;

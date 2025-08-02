'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, isValid } from 'date-fns';
import { UserProfile } from '@/lib/auth';
import { 
  Mail, 
  Calendar, 
  FileText, 
  Award, 
  TrendingUp, 
  Users, 
  Heart,
  MessageCircle,
  Share2,
  Edit3,
  MapPin,
  Link as LinkIcon,
  Briefcase
} from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  postsCount: number;
  isOwnProfile?: boolean;
}

export default function ProfileCard({ profile, postsCount, isOwnProfile = false }: ProfileCardProps) {
  let createdAt: Date;

  if (profile.createdAt instanceof Date) {
    createdAt = profile.createdAt;
  } else {
    createdAt = new Date(profile.createdAt); // If it's a string or timestamp
  }

  const memberSince = isValid(createdAt)
    ? formatDistanceToNow(createdAt, { addSuffix: true })
    : 'Unknown';


  // Mock engagement stats
  const engagementStats = {
    totalLikes: Math.floor(Math.random() * 500) + 50,
    totalComments: Math.floor(Math.random() * 200) + 20,
    totalShares: Math.floor(Math.random() * 100) + 10,
    followers: Math.floor(Math.random() * 1000) + 100,
    following: Math.floor(Math.random() * 500) + 50,
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 right-4">
            {isOwnProfile && (
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                <Edit3 className="w-3 h-3 mr-1" />
                Edit Cover
              </Button>
            )}
          </div>
        </div>

        <CardHeader className="text-center pb-4 relative -mt-16">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl ring-4 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                  {profile.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <Button 
                  size="sm" 
                  className="absolute bottom-2 right-2 w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{profile.email}</span>
            </div>
            
            {/* Mock additional info */}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-3">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-3 h-3" />
                <span>Software Engineer</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Bio Section */}
          {profile.bio && (
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                About
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-md mx-auto">{profile.bio}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{postsCount}</div>
              <div className="text-sm text-blue-700">Posts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{engagementStats.followers}</div>
              <div className="text-sm text-green-700">Followers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{engagementStats.following}</div>
              <div className="text-sm text-purple-700">Following</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{engagementStats.totalLikes}</div>
              <div className="text-sm text-orange-700">Total Likes</div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Engagement
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Likes Received</span>
                </div>
                <Badge className="bg-red-100 text-red-700">
                  {engagementStats.totalLikes}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">Comments</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {engagementStats.totalComments}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Shares</span>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  {engagementStats.totalShares}
                </Badge>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                <Award className="w-3 h-3 mr-1" />
                Early Adopter
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Users className="w-3 h-3 mr-1" />
                Community Builder
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending Creator
              </Badge>
            </div>
          </div>

          {/* Member Since */}
          <div className="text-center pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Member {memberSince}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="flex space-x-2">
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
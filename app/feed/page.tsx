'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/lib/auth';
import { getPostsRealtime, Post } from '@/lib/posts';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import { Loader2, RefreshCw, Sparkles, TrendingUp, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FeedPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    activeUsers: 0,
    trending: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          
          if (profile) {
            setUser(profile);
            setupRealtimePosts();
          } else {
            // If profile doesn't exist, create a basic one
            const basicProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              bio: '',
              createdAt: new Date()
            };
            setUser(basicProfile);
            setupRealtimePosts();
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const setupRealtimePosts = useCallback(() => {
    const unsubscribe = getPostsRealtime((newPosts) => {
      setPosts(newPosts);
      setStats({
        totalPosts: newPosts.length,
        activeUsers: new Set(newPosts.map(p => p.authorId)).size,
        trending: newPosts.filter(p => (p.likesCount || 0) > 5).length
      });
      setLoading(false);
      setRefreshing(false);
    });

    return unsubscribe;
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh will be handled by realtime listener
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePostUpdate = useCallback(() => {
    // Posts will update automatically via realtime listener
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading SocialSphere</h3>
            <p className="text-gray-600">Preparing your personalized feed...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header user={user} onSignOut={() => window.location.reload()} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-blue-600" />
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Posts</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {stats.totalPosts}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {stats.activeUsers}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trending</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {stats.trending}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Find People
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending Topics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <CreatePost user={user} onPostCreated={handlePostUpdate} />
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Feed</h2>
                <p className="text-gray-600">Stay connected with your community</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>

            {posts.length === 0 ? (
              <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to SocialSphere!</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Be the first to share something amazing with the community. Your thoughts and insights matter!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create Your First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={user}
                    onPostUpdate={handlePostUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
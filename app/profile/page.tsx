'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/lib/auth';
import { getUserPosts, Post } from '@/lib/posts';
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { Heart } from 'lucide-react';
import { Bookmark } from 'lucide-react';

import PostCard from '@/components/PostCard';
import { Loader2, Grid3X3, List, Filter, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(profile);
        if (profile) {
          const userPosts = await getUserPosts(profile.id);
          setPosts(userPosts);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h3>
            <p className="text-gray-600">Preparing your personal space...</p>
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <ProfileCard profile={user} postsCount={posts.length} isOwnProfile={true} />
            </div>
            
            {/* Posts Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <Tabs defaultValue="posts" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
                        <TabsTrigger value="liked">Liked</TabsTrigger>
                        <TabsTrigger value="saved">Saved</TabsTrigger>
                      </TabsList>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                        >
                          {viewMode === 'list' ? (
                            <Grid3X3 className="w-4 h-4" />
                          ) : (
                            <List className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <SortDesc className="w-4 h-4 mr-2" />
                          Sort
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="posts" className="space-y-6">
                      {posts.length === 0 ? (
                        <Card className="bg-gradient-to-br from-gray-50 to-blue-50/30 border-0">
                          <CardContent className="text-center py-16">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Grid3X3 className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No posts yet</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                              Start sharing your thoughts and insights with the community. Your voice matters!
                            </p>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Create Your First Post
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-6'}>
                          {posts.map((post) => (
                            <PostCard 
                              key={post.id} 
                              post={post} 
                              currentUser={user}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="liked" className="space-y-6">
                      <Card className="bg-gradient-to-br from-red-50 to-pink-50/30 border-0">
                        <CardContent className="text-center py-16">
                          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-red-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Liked Posts</h3>
                          <p className="text-gray-600">Posts you've liked will appear here</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="saved" className="space-y-6">
                      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50/30 border-0">
                        <CardContent className="text-center py-16">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bookmark className="w-10 h-10 text-yellow-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Saved Posts</h3>
                          <p className="text-gray-600">Posts you've saved will appear here</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
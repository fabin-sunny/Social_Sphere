'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { createPost } from '@/lib/posts';
import { 
  Send, 
  Loader2, 
  Hash, 
  Smile, 
  Sparkles, 
  Brain, 
  Trophy, 
  Heart,
  Zap,
  X,
  Plus
} from 'lucide-react';

interface CreatePostProps {
  user: any;
  onPostCreated: () => void;
}

const moods = [
  { id: 'excited', label: 'Excited', icon: Sparkles, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'thoughtful', label: 'Thoughtful', icon: Brain, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'celebrating', label: 'Celebrating', icon: Trophy, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'grateful', label: 'Grateful', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'motivated', label: 'Motivated', icon: Zap, color: 'bg-blue-100 text-blue-700 border-blue-200' },
];

export default function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await createPost(content, user.id, user.name, user.email, tags, selectedMood);
      setContent('');
      setSelectedMood('');
      setTags([]);
      setIsExpanded(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const wordCount = content.split(' ').filter(word => word.length > 0).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 ring-2 ring-blue-100">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">Share something inspiring...</p>
          </div>
          {!isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          )}
        </div>
      </CardHeader>
      
      {(isExpanded || content) && (
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's inspiring you today? Share your thoughts, insights, or achievements..."
                className="min-h-[120px] resize-none border-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-base leading-relaxed"
                disabled={isLoading}
                onFocus={() => setIsExpanded(true)}
              />
              {content && (
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                  {readTime} min read
                </div>
              )}
            </div>

            {/* Mood Selection */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Smile className="w-4 h-4" />
                <span>How are you feeling?</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <Button
                      key={mood.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMood(selectedMood === mood.id ? '' : mood.id)}
                      className={`transition-all duration-200 ${
                        selectedMood === mood.id 
                          ? mood.color + ' border-2' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {mood.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Hash className="w-4 h-4" />
                <span>Add tags (max 5)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              {tags.length < 5 && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{content.length}/2000 characters</span>
                {wordCount > 0 && <span>{wordCount} words</span>}
              </div>
              <div className="flex space-x-2">
                {isExpanded && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setSelectedMood('');
                      setTags([]);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={!content.trim() || isLoading || content.length > 2000}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Share Post
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Post, likePost, unlikePost, addComment, getComments, Comment } from '@/lib/posts';
import { 
  Clock, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  Sparkles,
  Brain,
  Trophy,
  Zap,
  Send,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: any;
  onPostUpdate?: () => void;
}

const moodIcons = {
  excited: { icon: Sparkles, color: 'text-yellow-600' },
  thoughtful: { icon: Brain, color: 'text-purple-600' },
  celebrating: { icon: Trophy, color: 'text-green-600' },
  grateful: { icon: Heart, color: 'text-pink-600' },
  motivated: { icon: Zap, color: 'text-blue-600' },
};

export default function PostCard({ post, currentUser, onPostUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.id) || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getFormattedDate = () => {
    try {
      let date: Date;
      
      if (post.createdAt instanceof Date) {
        date = post.createdAt;
      } else if (typeof post.createdAt === 'string' || typeof post.createdAt === 'number') {
        date = new Date(post.createdAt);
      } else {
        // Fallback to current date if createdAt is invalid
        date = new Date();
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  const formattedDate = getFormattedDate();

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id, currentUser.id);
        setLikesCount(prev => prev - 1);
      } else {
        await likePost(post.id, currentUser.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      onPostUpdate?.();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    setIsCommenting(true);
    try {
      const comment = await addComment(
        post.id, 
        newComment, 
        currentUser.id, 
        currentUser.name, 
        currentUser.email
      );
      setComments([comment, ...comments]);
      setNewComment('');
      onPostUpdate?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      try {
        const fetchedComments = await getComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const shouldTruncate = post.content.length > 300;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.substring(0, 300) + '...' 
    : post.content;

  const MoodIcon = post.mood ? moodIcons[post.mood as keyof typeof moodIcons]?.icon : null;
  const moodColor = post.mood ? moodIcons[post.mood as keyof typeof moodIcons]?.color : '';

  return (
    <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-200">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                {post.authorName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {post.authorName}
                </h3>
                {post.mood && MoodIcon && (
                  <div className="flex items-center space-x-1">
                    <MoodIcon className={`w-4 h-4 ${moodColor}`} />
                    <span className={`text-xs font-medium ${moodColor}`}>
                      {post.mood}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{post.authorEmail}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {shouldTruncate && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {likesCount > 0 && (
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              </div>
            )}
            {post.commentsCount > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
              </div>
            )}
          </div>
          {(likesCount > 10 || post.commentsCount > 5) && (
            <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>Trending</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-all duration-200 ${
                isLiked 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              Like
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={loadComments}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Add Comment */}
            <div className="flex space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                  {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a thoughtful comment..."
                  className="min-h-[60px] resize-none text-sm"
                  disabled={isCommenting}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!newComment.trim() || isCommenting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCommenting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="w-3 h-3 mr-2" />
                    )}
                    Comment
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 bg-gray-50 p-3 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                        {comment.authorName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(() => {
                            try {
                              let commentDate: Date;
                              
                              if (comment.createdAt instanceof Date) {
                                commentDate = comment.createdAt;
                              } else if (typeof comment.createdAt === 'string' || typeof comment.createdAt === 'number') {
                                commentDate = new Date(comment.createdAt);
                              } else {
                                commentDate = new Date();
                              }
                              
                              if (isNaN(commentDate.getTime())) {
                                return 'Recently';
                              }
                              
                              return formatDistanceToNow(commentDate, { addSuffix: true });
                            } catch (error) {
                              return 'Recently';
                            }
                          })()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { signOut } from '@/lib/auth';
import { 
  User, 
  LogOut, 
  Home, 
  UserIcon, 
  Search, 
  Bell, 
  MessageSquare,
  TrendingUp,
  Settings,
  Moon,
  Sun,
  Wifi,
  WifiOff
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  const navItems = [
    { href: '/feed', icon: Home, label: 'Feed', active: pathname === '/feed' },
    { href: '/trending', icon: TrendingUp, label: 'Trending', active: pathname === '/trending' },
    { href: '/messages', icon: MessageSquare, label: 'Messages', active: pathname === '/messages' },
    { href: '/profile', icon: UserIcon, label: 'Profile', active: pathname === '/profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-105">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SocialSphere
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search posts, people, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={item.active ? 'default' : 'ghost'}
                  size="sm" 
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Network Status */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isOnline ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-blue-50">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3">
              <Link href="/profile">
                <Avatar className="w-9 h-9 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200 cursor-pointer hover:scale-105">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link href="/profile" className="hidden lg:block cursor-pointer hover:opacity-80 transition-opacity">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost"
                  size="sm" 
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    item.active 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
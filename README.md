# 🚀 SocialSphere

A modern, real-time social media platform built with Next.js 13, Firebase, and TypeScript. Connect, share, and inspire with a beautiful, responsive design.

![SocialSphere](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Modern UI/UX**
- Beautiful gradient designs and glass morphism effects
- Smooth animations and micro-interactions
- Responsive design for all devices
- Custom scrollbars and hover effects
- Loading states and skeleton screens

### 📝 **Post Management**
- Create posts with text, images, videos, and links
- Mood selection with emojis and visual feedback
- Tag system with real-time validation
- Character counter and read time estimation
- Rich text formatting and content truncation

### 🔄 **Real-time Features**
- Live post updates with Firebase real-time listeners
- Instant like/unlike functionality
- Real-time comment system
- Live engagement statistics
- Online status indicators

### 👤 **User Profiles**
- Comprehensive profile cards with engagement analytics
- Achievement and badge system
- Recent activity feed
- Profile customization options
- User statistics and growth metrics

### 🔍 **Advanced Search & Filter**
- Real-time search across posts, users, and tags
- Filter by mood and content type
- Sort by latest, popular, trending, or oldest
- Grid and list view modes
- Advanced filtering options

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts for all screen sizes
- Progressive Web App ready

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date manipulation utilities

### **Backend & Database**
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User authentication
- **Firebase Real-time Listeners** - Live data updates

### **UI Components**
- **Shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **Custom Animations** - CSS animations and transitions

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase CLI** (optional, for deployment)

## 🚀 Quick Start

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd mini_lin
```

### 2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

### 3. **Firebase Setup**

#### **Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password)

#### **Configure Firebase**
1. Get your Firebase config from Project Settings
2. Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. **Create Required Indexes**

To avoid Firebase index errors, create these composite indexes in Firebase Console:

#### **Comments Collection Index**
- Collection: `comments`
- Fields: `postId` (Ascending) + `createdAt` (Descending)

#### **Posts Collection Index**
- Collection: `posts`
- Fields: `authorId` (Ascending) + `createdAt` (Descending)

### 5. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👤 Demo User Accounts

### **Test Account 1**
- **Email**: `fabin@gmail.com`
- **Password**: `12345678`
- **Name**: Demo User

### **Test Account 2**
- **Email**: `test@gmail.com`
- **Password**: `1234567`
- **Name**: Test User

### **Creating New Accounts**
1. Click "Sign Up" on the landing page
2. Enter your email and password
3. Complete the registration process
4. Start creating posts and interacting with the community

## 📁 Project Structure

```
mini_lin/
├── app/                    # Next.js 13 App Router
│   ├── feed/              # Feed page
│   ├── profile/           # Profile page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── AuthForm.tsx      # Authentication form
│   ├── CreatePost.tsx    # Post creation component
│   ├── Header.tsx        # Navigation header
│   ├── PostCard.tsx      # Post display component
│   └── ProfileCard.tsx   # Profile display component
├── lib/                  # Utility libraries
│   ├── auth.ts           # Firebase authentication
│   ├── firebase.ts       # Firebase configuration
│   ├── posts.ts          # Post management functions
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔧 Key Features Explained

### **Real-time Post System**
- Posts are stored in Firebase Firestore
- Real-time updates using Firebase listeners
- Automatic timestamp conversion and validation
- Optimistic UI updates for better UX

### **Authentication System**
- Firebase Authentication integration
- Email/password authentication
- User profile management
- Secure session handling

### **Content Management**
- Rich text posts with character limits
- Image upload with preview
- Video URL support
- External link sharing
- Tag system with validation

### **Engagement Features**
- Like/unlike posts with real-time counters
- Comment system with threading
- Share functionality with native API
- Bookmark posts (placeholder)
- Report posts (placeholder)

### **Profile System**
- Comprehensive user profiles
- Engagement analytics
- Achievement badges
- Recent activity feed
- Profile customization

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradients
- **Secondary**: Green, Orange, Red for different states
- **Background**: Light gradients with glass morphism
- **Text**: Gray scale for readability

### **Typography**
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts
- **Responsive**: Adaptive font sizes

### **Animations**
- **Hover Effects**: Scale, glow, and lift animations
- **Transitions**: Smooth 300ms transitions
- **Loading States**: Skeleton screens and spinners
- **Micro-interactions**: Button feedback and form validation
```

### **Environment Variables**
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🐛 Troubleshooting

### **Firebase Index Errors**
If you encounter index errors:
1. Go to Firebase Console → Firestore → Indexes
2. Create the required composite indexes
3. Wait for indexes to build (1-2 minutes)

### **Authentication Issues**
1. Check Firebase Authentication settings
2. Ensure email/password sign-in is enabled
3. Verify environment variables are correct

### **Real-time Updates Not Working**
1. Check Firebase security rules
2. Verify real-time listeners are properly set up
3. Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Firebase Team** - For the powerful backend services
- **Tailwind CSS** - For the utility-first CSS framework
- **Shadcn/ui** - For the beautiful component library
- **Lucide** - For the beautiful icons

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the troubleshooting section
- Review the Firebase documentation

---

**Made using Next.js, Firebase, and TypeScript** 
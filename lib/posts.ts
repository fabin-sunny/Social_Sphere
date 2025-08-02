import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs, 
  doc,
  getDoc,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  createdAt: Date;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  tags: string[];
  mood?: 'excited' | 'thoughtful' | 'celebrating' | 'grateful' | 'motivated';
  readTime?: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
}
export const createPost = async (
  content: string, 
  authorId: string, 
  authorName: string, 
  authorEmail: string,
  tags: string[] = [],
  mood?: string
) => {
  // Calculate estimated read time (average 200 words per minute)
  const wordCount = content.split(' ').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const postData = {
    content,
    authorId,
    authorName,
    authorEmail,
    createdAt: new Date(),
    likes: [],
    likesCount: 0,
    commentsCount: 0,
    tags,
    mood,
    readTime
  };
  
  const docRef = await addDoc(collection(db, 'posts'), postData);
  return { id: docRef.id, ...postData };
};

export const getPosts = async (limitCount = 10, lastDoc?: DocumentSnapshot): Promise<{ posts: Post[], lastDoc?: DocumentSnapshot }> => {
  let q = query(
    collection(db, 'posts'), 
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const querySnapshot = await getDocs(q);
  
  const posts = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...convertTimestampToDate(data)
    } as Post;
  });
  
  const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  
  return { posts, lastDoc: newLastDoc };
};

// Helper function to convert Firestore timestamp to Date
const convertTimestampToDate = (data: any) => {
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    // It's a Firestore Timestamp
    return { ...data, createdAt: data.createdAt.toDate() };
  }
  return data;
};

export const getPostsRealtime = (callback: (posts: Post[]) => void, limitCount = 10) => {
  const q = query(
    collection(db, 'posts'), 
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestampToDate(data)
      } as Post;
    });
    callback(posts);
  });
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, 'posts'), 
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestampToDate(data)
      } as Post;
    });
  } catch (error: any) {
    // If index doesn't exist, fall back to simple query and sort in memory
    if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
      console.log('Index not found for getUserPosts, using fallback query');
      const q = query(
        collection(db, 'posts'), 
        where('authorId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampToDate(data)
        } as Post;
      });
      
      // Sort in memory
      return posts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    throw error;
  }
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
    likesCount: increment(1)
  });
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
    likesCount: increment(-1)
  });
};

export const addComment = async (postId: string, content: string, authorId: string, authorName: string, authorEmail: string) => {
  const commentData = {
    postId,
    content,
    authorId,
    authorName,
    authorEmail,
    createdAt: new Date()
  };
  
  // Add comment
  const docRef = await addDoc(collection(db, 'comments'), commentData);
  
  // Update post comment count
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    commentsCount: increment(1)
  });
  
  return { id: docRef.id, ...commentData };
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    console.log('Getting comments for postId:', postId);
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const comments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...convertTimestampToDate(data)
      } as Comment;
    });
    
    console.log('Successfully fetched comments:', comments.length);
    return comments;
  } catch (error: any) {
    console.error('Error in getComments:', error);
    // If index doesn't exist, fall back to simple query and sort in memory
    if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
      console.log('Index not found, using fallback query');
      try {
        const q = query(
          collection(db, 'comments'),
          where('postId', '==', postId)
        );
        const querySnapshot = await getDocs(q);
        
        const comments = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...convertTimestampToDate(data)
          } as Comment;
        });
        
        // Sort in memory
        const sortedComments = comments.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        console.log('Fallback query successful, comments:', sortedComments.length);
        return sortedComments;
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
};
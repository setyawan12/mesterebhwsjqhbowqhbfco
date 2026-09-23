import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  onSnapshot,
  setDoc,
  deleteDoc,
  collection,
  writeBatch,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ProductItem, ALL_PRODUCTS } from './data/mscellData.ts';
import { BlogPost, DEFAULT_BLOG_POSTS } from './data/blogData.ts';

export const firebaseConfig = {
  apiKey: "AIzaSyBBuJnclmKJiYdhzVaGIH83pCOeRxzpYns",
  authDomain: "webmestere-f2406.firebaseapp.com",
  projectId: "webmestere-f2406",
  storageBucket: "webmestere-f2406.firebasestorage.app",
  messagingSenderId: "1002922412385",
  appId: "1:1002922412385:web:7780155357eab807231d20",
  measurementId: "G-H4K2FCTEQ2"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Test Firestore connection on boot
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'settings', 'global'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline. Operating with local fallback data.");
    }
    return false;
  }
}

export interface SiteSettings {
  headerMarquee: string;
  headerMarqueeSpeed?: number;
  footerMarquee: string;
  footerMarqueeSpeed?: number;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  instagramHandle: string;
  storeStatus: 'Buka' | 'Tutup' | 'Istirahat';
  lastUpdated: string;
  blogPosts?: BlogPost[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  headerMarquee: 'Ayo Bergabung dengan kami, kamu bisa jualan pulsa dan kouta hanya dengan hpmu, harga mantap pasti untung! Hubungi WhatsApp: 085156482636',
  headerMarqueeSpeed: 20,
  footerMarquee: 'Harga Sewaktu-Waktu Dapat Berubah Tanpa Pemberitahuan',
  footerMarqueeSpeed: 25,
  whatsappNumber: '085156482636',
  phone: '085156482636',
  email: 'mestersartono1975@gmail.com',
  address: 'Jl.Tegal Ngandong no 18, Tegal Ngandong, Ngandong, Gantiwarno, Klaten, Jawa Tengah, 57455',
  instagram: 'https://instagram.com/mestere_cell',
  instagramHandle: '@mestere_cell',
  storeStatus: 'Buka',
  lastUpdated: '13 Desember 2020 11:59',
};

// Listen to Global Settings in Real-Time
export function subscribeSiteSettings(
  callback: (settings: SiteSettings) => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, 'settings', 'global');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<SiteSettings>;
        callback({ ...DEFAULT_SETTINGS, ...data });
      } else {
        // Document does not exist yet; provide defaults
        callback(DEFAULT_SETTINGS);
      }
    },
    (err) => {
      console.error('Failed to subscribe to settings:', err);
      callback(DEFAULT_SETTINGS);
      if (onError) onError(err);
    }
  );
}

// Sanitize product object to prevent Firestore "Unsupported field value: undefined" errors
export function sanitizeProductForFirestore(item: Partial<ProductItem>): Record<string, any> {
  const clean: Record<string, any> = {
    id: item.id || `prod-${Date.now()}`,
    category: item.category || 'internet',
    name: item.name || '',
    amount: item.amount || '',
    price: item.price || 'Rp 0',
    isAvailable: item.isAvailable !== false,
  };

  if (item.subCategory !== undefined && item.subCategory !== null && item.subCategory !== '') {
    clean.subCategory = item.subCategory;
  }
  if (item.provider !== undefined && item.provider !== null && item.provider !== '') {
    clean.provider = item.provider;
  }
  if (item.period !== undefined && item.period !== null && item.period !== '') {
    clean.period = item.period;
  }
  if (item.info !== undefined && item.info !== null && item.info !== '') {
    clean.info = item.info;
  }
  if (item.badge !== undefined && item.badge !== null && item.badge !== '') {
    clean.badge = item.badge;
  }
  if (item.priceNumber !== undefined && item.priceNumber !== null && !isNaN(item.priceNumber)) {
    clean.priceNumber = item.priceNumber;
  }

  return clean;
}

// Update Global Settings
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'global');
  const payload: Record<string, any> = {};
  Object.entries(settings).forEach(([k, v]) => {
    if (v !== undefined) {
      payload[k] = v;
    }
  });
  payload.lastUpdated = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  await setDoc(docRef, payload, { merge: true });
}

// Listen to All Products in Real-Time
export function subscribeProducts(
  callback: (products: ProductItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: ProductItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as DocumentData;
          const item: ProductItem = {
            id: docSnap.id,
            category: data.category || 'internet',
            name: data.name || '',
            amount: data.amount || '',
            price: data.price || 'Rp 0',
            isAvailable: data.isAvailable !== false,
          };
          if (data.subCategory) item.subCategory = data.subCategory;
          if (data.provider) item.provider = data.provider;
          if (data.period) item.period = data.period;
          if (data.info) item.info = data.info;
          if (data.badge) item.badge = data.badge;
          if (data.priceNumber !== undefined) item.priceNumber = data.priceNumber;
          list.push(item);
        });
        callback(list);
      } else {
        // Collection empty; use local defaults
        callback(ALL_PRODUCTS);
      }
    },
    (err) => {
      console.error('Failed to subscribe to products:', err);
      callback(ALL_PRODUCTS);
      if (onError) onError(err);
    }
  );
}

// Save or Update a Single Product
export async function saveProductToFirebase(product: ProductItem): Promise<void> {
  const docRef = doc(db, 'products', product.id);
  const payload = sanitizeProductForFirestore(product);
  await setDoc(docRef, payload, { merge: true });
}

// Delete a Product from Firebase
export async function deleteProductFromFirebase(productId: string): Promise<void> {
  try {
    const colRef = collection(db, 'products');
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // If Firestore collection has not been seeded yet, populate with all products except the deleted one
      const remaining = ALL_PRODUCTS.filter((p) => p.id !== productId);
      const batch = writeBatch(db);
      remaining.forEach((item) => {
        const dRef = doc(db, 'products', item.id);
        batch.set(dRef, sanitizeProductForFirestore({ ...item, isAvailable: true }), { merge: true });
      });
      await batch.commit();
    } else {
      // Document exists in Firestore; delete directly
      const docRef = doc(db, 'products', productId);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error(`Failed to delete product ${productId}:`, error);
    throw error;
  }
}

// Seed All Initial Products to Firebase in Batches (1-Click Initialization)
export async function seedAllProductsToFirebase(): Promise<number> {
  const total = ALL_PRODUCTS.length;
  // Firestore batches support up to 500 operations per batch
  const chunkSize = 400;
  for (let i = 0; i < total; i += chunkSize) {
    const chunk = ALL_PRODUCTS.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach((item) => {
      const docRef = doc(db, 'products', item.id);
      const payload = sanitizeProductForFirestore({ ...item, isAvailable: true });
      batch.set(docRef, payload, { merge: true });
    });
    await batch.commit();
  }

  // Also seed default settings
  await updateSiteSettings(DEFAULT_SETTINGS);

  // Also seed default blog articles
  await seedDefaultBlogPostsToFirebase();
  return total;
}

// Sanitize blog post to avoid Firestore undefined value errors
export function sanitizeBlogPostForFirestore(post: Partial<BlogPost>): Record<string, any> {
  const clean: Record<string, any> = {
    id: post.id || `post-${Date.now()}`,
    title: post.title || 'Tanpa Judul',
    slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`),
    category: post.category || 'Tips & Panduan',
    author: post.author || 'Admin MsCell',
    date: post.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    createdAt: post.createdAt || Date.now(),
    summary: post.summary || '',
    content: post.content || '',
    isPublished: post.isPublished !== false,
  };

  if (post.imageUrl !== undefined && post.imageUrl !== null && post.imageUrl !== '') {
    clean.imageUrl = post.imageUrl;
  }
  if (post.readTime !== undefined && post.readTime !== null && post.readTime !== '') {
    clean.readTime = post.readTime;
  }
  if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
    clean.tags = post.tags;
  }

  return clean;
}

// Subscribe to Blog Posts in Real-Time via settings/global (and fallback)
export function subscribeBlogPosts(
  callback: (posts: BlogPost[]) => void,
  onError?: (err: unknown) => void
) {
  const settingsDocRef = doc(db, 'settings', 'global');
  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.blogPosts) && data.blogPosts.length > 0) {
          const list: BlogPost[] = data.blogPosts.map((raw: any) => ({
            id: String(raw.id || `post-${Date.now()}`),
            title: String(raw.title || ''),
            slug: String(raw.slug || raw.id || ''),
            category: (raw.category as any) || 'Tips & Panduan',
            author: String(raw.author || 'Admin MsCell'),
            date: String(raw.date || ''),
            createdAt: Number(raw.createdAt || 0),
            imageUrl: String(raw.imageUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80'),
            readTime: raw.readTime ? String(raw.readTime) : undefined,
            summary: String(raw.summary || ''),
            content: String(raw.content || ''),
            tags: Array.isArray(raw.tags) ? raw.tags : ['MsCell'],
            isPublished: raw.isPublished !== false,
          }));

          // Sort newest first
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          callback(list);
          return;
        }
      }
      // If not yet saved in Firestore, return default blog posts
      callback(DEFAULT_BLOG_POSTS);
    },
    (err) => {
      console.warn('Note: Live blog subscription fallback active:', err);
      callback(DEFAULT_BLOG_POSTS);
      if (onError) onError(err);
    }
  );
}

// Save or Update a Blog Post in Firestore
export async function saveBlogPostToFirebase(post: BlogPost): Promise<void> {
  const cleanPost = sanitizeBlogPostForFirestore(post) as BlogPost;

  // 1. Primary reliable storage: update settings/global's blogPosts array
  try {
    const globalDocRef = doc(db, 'settings', 'global');
    const snap = await getDocFromServer(globalDocRef);
    let currentPosts: BlogPost[] = [...DEFAULT_BLOG_POSTS];
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.blogPosts) && data.blogPosts.length > 0) {
        currentPosts = [...data.blogPosts];
      }
    }

    const idx = currentPosts.findIndex((p) => p.id === cleanPost.id);
    if (idx >= 0) {
      currentPosts[idx] = cleanPost;
    } else {
      currentPosts.unshift(cleanPost);
    }

    await setDoc(globalDocRef, { blogPosts: currentPosts }, { merge: true });
  } catch (err) {
    console.warn('Could not save blog post to settings/global:', err);
  }

  // 2. Also attempt saving to 'articles' collection if remote security rules permit
  try {
    const docRef = doc(db, 'articles', cleanPost.id);
    await setDoc(docRef, cleanPost, { merge: true });
  } catch (err) {
    // Graceful skip if /articles permission is restricted on remote console
    console.warn('Note: direct /articles collection save skipped:', err);
  }
}

// Delete a Blog Post from Firebase
export async function deleteBlogPostFromFirebase(postId: string): Promise<void> {
  // 1. Primary reliable storage: remove from settings/global blogPosts array
  try {
    const globalDocRef = doc(db, 'settings', 'global');
    const snap = await getDocFromServer(globalDocRef);
    let currentPosts: BlogPost[] = [...DEFAULT_BLOG_POSTS];
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.blogPosts)) {
        currentPosts = [...data.blogPosts];
      }
    }

    const filtered = currentPosts.filter((p) => p.id !== postId);
    await setDoc(globalDocRef, { blogPosts: filtered }, { merge: true });
  } catch (err) {
    console.warn('Could not remove blog post from settings/global:', err);
  }

  // 2. Also attempt deleting from 'articles' collection if permitted
  try {
    const docRef = doc(db, 'articles', postId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Note: direct /articles collection delete skipped:', err);
  }
}

// Seed Default Blog Posts to Firebase
export async function seedDefaultBlogPostsToFirebase(): Promise<number> {
  // 1. Save to settings/global
  try {
    const globalDocRef = doc(db, 'settings', 'global');
    await setDoc(globalDocRef, { blogPosts: DEFAULT_BLOG_POSTS }, { merge: true });
  } catch (err) {
    console.warn('Could not seed blog posts to settings/global:', err);
  }

  // 2. Also attempt writing to articles collection if permitted
  try {
    const batch = writeBatch(db);
    DEFAULT_BLOG_POSTS.forEach((post) => {
      const docRef = doc(db, 'articles', post.id);
      const payload = sanitizeBlogPostForFirestore(post);
      batch.set(docRef, payload, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Note: batch seed to /articles collection skipped:', err);
  }

  return DEFAULT_BLOG_POSTS.length;
}

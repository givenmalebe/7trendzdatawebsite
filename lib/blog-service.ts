import { db } from "./firebase"
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore"

function serializeTimestamp(data: Record<string, any>): Record<string, any> {
  const serialized: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString()
    } else {
      serialized[key] = value
    }
  }
  return serialized
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  status: "published" | "draft"
  published_at: string
  created_at: string
  views: number
  tags: string[]
  image_url?: string
}

export async function fetchBlogPosts(filters?: { status?: string; category?: string; search?: string }): Promise<BlogPost[]> {
  const constraints: any[] = []

  if (filters?.status) {
    constraints.push(where("status", "==", filters.status))
  }

  if (filters?.category) {
    constraints.push(where("category", "==", filters.category))
  }

  constraints.push(orderBy("created_at", "desc"))

  const q = query(collection(db, "blog_posts"), ...constraints)
  const snapshot = await getDocs(q)

  let posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeTimestamp(doc.data() as Record<string, any>),
  })) as BlogPost[]

  if (filters?.search) {
    const lower = filters.search.toLowerCase()
    posts = posts.filter(
      (post) =>
        (post.title && post.title.toLowerCase().includes(lower)) ||
        (post.content && post.content.toLowerCase().includes(lower)) ||
        (post.author && post.author.toLowerCase().includes(lower)),
    )
  }

  return posts
}

export async function fetchBlogPost(id: string): Promise<BlogPost | null> {
  const snapshot = await getDoc(doc(db, "blog_posts", id))

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...serializeTimestamp(snapshot.data() as Record<string, any>),
  } as BlogPost
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "created_at" | "views">): Promise<string> {
  const docRef = await addDoc(collection(db, "blog_posts"), {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: post.category,
    status: post.status,
    published_at: post.published_at || null,
    tags: post.tags || [],
    image_url: post.image_url || null,
    views: 0,
    created_at: serverTimestamp(),
  })

  return docRef.id
}

export async function updateBlogPost(id: string, post: Omit<BlogPost, "id" | "created_at" | "views">): Promise<void> {
  const docRef = doc(db, "blog_posts", id)
  await updateDoc(docRef, {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: post.category,
    status: post.status,
    published_at: post.published_at || null,
    tags: post.tags || [],
    image_url: post.image_url || null,
  })
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "blog_posts", id))
}

export async function incrementViews(id: string): Promise<void> {
  const docRef = doc(db, "blog_posts", id)
  await updateDoc(docRef, {
    views: increment(1),
  })
}

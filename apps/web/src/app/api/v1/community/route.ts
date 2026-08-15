import { DatabaseSync } from 'node:sqlite';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Initialize Database
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'community_posts.db');

const db = new DatabaseSync(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    authorName TEXT NOT NULL,
    authorLocation TEXT NOT NULL,
    avatarColor TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    tags TEXT NOT NULL, -- Stored as JSON string
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS replies (
    id TEXT PRIMARY KEY,
    postId TEXT NOT NULL,
    authorName TEXT NOT NULL,
    authorType TEXT NOT NULL, -- 'farmer', 'expert', 'ai'
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(postId) REFERENCES posts(id)
  );
`);

// Seed initial data if the tables are empty
const checkEmpty = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
if (checkEmpty.count === 0) {
  const insertPost = db.prepare(`
    INSERT INTO posts (id, authorName, authorLocation, avatarColor, content, likes, tags, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 hours'))
  `);
  
  const insertReply = db.prepare(`
    INSERT INTO replies (id, postId, authorName, authorType, content, likes, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 hours'))
  `);

  // Post 1
  insertPost.run('p1', 'Ramesh Patel', 'Nashik, Maharashtra', 'bg-orange-500', 'Just harvested my first batch of organic tomatoes using the new drip irrigation system! Yield is up by 20% compared to last season. Happy to share tips with anyone looking to transition.', 45, JSON.stringify(['Organic', 'Harvest', 'Success Story']));
  insertReply.run('r1', 'p1', 'Suresh Kumar', 'farmer', 'Bhai, which brand of drip pipes did you use? Did you get any government subsidy?', 5);

  // Post 2
  insertPost.run('p2', 'Vikram Singh', 'Ludhiana, Punjab', 'bg-emerald-500', 'My wheat crop is showing yellowing on the lower leaves. The soil moisture is optimal. Could this be a Nitrogen deficiency or something else?', 12, JSON.stringify(['Crop Health', 'Wheat', 'Help Required']));
  insertReply.run('r2', 'p2', 'KisanSeva AI Expert', 'ai', 'Yellowing of lower/older leaves in wheat is a classic symptom of **Nitrogen (N) deficiency**, as the plant moves mobile nutrients to new growth. \n\n**Action Plan:**\n1. Apply a top dressing of Urea (around 20-25 kg/acre) before your next irrigation.\n2. Alternatively, spray a 2% Urea solution directly on the leaves for faster absorption.\n3. Verify soil pH; if too high/low, Nitrogen uptake may be locked out.', 38);
}

export async function GET() {
  try {
    const postsStmt = db.prepare(`SELECT * FROM posts ORDER BY createdAt DESC`);
    const repliesStmt = db.prepare(`SELECT * FROM replies ORDER BY createdAt ASC`);
    
    const allPosts = postsStmt.all() as any[];
    const allReplies = repliesStmt.all() as any[];

    // Structure the data for the frontend
    const structuredPosts = allPosts.map(post => {
      const postReplies = allReplies
        .filter(r => r.postId === post.id)
        .map(r => ({
          id: r.id,
          authorName: r.authorName,
          authorType: r.authorType,
          content: r.content,
          likes: r.likes,
          timestamp: new Date(r.createdAt + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric' })
        }));

      return {
        id: post.id,
        authorName: post.authorName,
        authorLocation: post.authorLocation,
        avatarColor: post.avatarColor,
        content: post.content,
        likes: post.likes,
        tags: JSON.parse(post.tags),
        timestamp: new Date(post.createdAt + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric' }),
        replies: postReplies
      };
    });

    return NextResponse.json({ success: true, posts: structuredPosts });
  } catch (error: any) {
    console.error("Community GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, postId, content, isQuestion } = body;

    if (action === 'create_post') {
      const id = `p${Date.now()}`;
      const tags = isQuestion ? ['Question'] : ['General'];
      
      const insertStmt = db.prepare(`
        INSERT INTO posts (id, authorName, authorLocation, avatarColor, content, tags)
        VALUES (?, 'You (Farmer)', 'Your Farm', 'bg-indigo-600', ?, ?)
      `);
      
      insertStmt.run(id, content, JSON.stringify(tags));
      
      return NextResponse.json({ success: true, postId: id, message: 'Post created' });
    }

    if (action === 'like') {
       const type = body.type; // 'post' or 'reply'
       const targetId = body.targetId;
       const table = type === 'post' ? 'posts' : 'replies';
       
       const updateStmt = db.prepare(`UPDATE ${table} SET likes = likes + 1 WHERE id = ?`);
       updateStmt.run(targetId);
       
       return NextResponse.json({ success: true, message: 'Liked' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error("Community POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { sql } from '@vercel/postgres';

const isVercel = !!process.env.POSTGRES_URL;
let localDb: DatabaseSync | null = null;

if (!isVercel) {
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  localDb = new DatabaseSync(path.join(dbDir, 'community_posts.db'));

  localDb.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      authorName TEXT NOT NULL,
      authorLocation TEXT NOT NULL,
      avatarColor TEXT NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      tags TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      postId TEXT NOT NULL,
      authorName TEXT NOT NULL,
      authorType TEXT NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(postId) REFERENCES posts(id)
    );
  `);

  const checkEmpty = localDb.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  if (checkEmpty.count === 0) {
    const insertPost = localDb.prepare(`
      INSERT INTO posts (id, authorName, authorLocation, avatarColor, content, likes, tags, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 hours'))
    `);
    const insertReply = localDb.prepare(`
      INSERT INTO replies (id, postId, authorName, authorType, content, likes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 hours'))
    `);

    insertPost.run('p1', 'Ramesh Patel', 'Nashik, Maharashtra', 'bg-orange-500', 'Just harvested my first batch of organic tomatoes using the new drip irrigation system! Yield is up by 20% compared to last season. Happy to share tips with anyone looking to transition.', 45, JSON.stringify(['Organic', 'Harvest', 'Success Story']));
    insertReply.run('r1', 'p1', 'Suresh Kumar', 'farmer', 'Bhai, which brand of drip pipes did you use? Did you get any government subsidy?', 5);

    insertPost.run('p2', 'Vikram Singh', 'Ludhiana, Punjab', 'bg-emerald-500', 'My wheat crop is showing yellowing on the lower leaves. The soil moisture is optimal. Could this be a Nitrogen deficiency or something else?', 12, JSON.stringify(['Crop Health', 'Wheat', 'Help Required']));
    insertReply.run('r2', 'p2', 'KisanSeva AI Expert', 'ai', 'Yellowing of lower/older leaves in wheat is a classic symptom of **Nitrogen (N) deficiency**, as the plant moves mobile nutrients to new growth. \n\n**Action Plan:**\n1. Apply a top dressing of Urea (around 20-25 kg/acre) before your next irrigation.\n2. Alternatively, spray a 2% Urea solution directly on the leaves for faster absorption.\n3. Verify soil pH; if too high/low, Nitrogen uptake may be locked out.', 38);
  }
}

async function seedVercelDbIfNeeded() {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(255) PRIMARY KEY,
      authorName VARCHAR(255) NOT NULL,
      authorLocation VARCHAR(255) NOT NULL,
      avatarColor VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      tags TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS replies (
      id VARCHAR(255) PRIMARY KEY,
      postId VARCHAR(255) NOT NULL,
      authorName VARCHAR(255) NOT NULL,
      authorType VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const countRes = await sql`SELECT COUNT(*) as count FROM posts`;
  const count = parseInt(countRes.rows[0].count, 10);
  
  if (count === 0) {
    await sql`
      INSERT INTO posts (id, authorName, authorLocation, avatarColor, content, likes, tags, createdAt)
      VALUES 
      ('p1', 'Ramesh Patel', 'Nashik, Maharashtra', 'bg-orange-500', 'Just harvested my first batch of organic tomatoes using the new drip irrigation system! Yield is up by 20% compared to last season. Happy to share tips with anyone looking to transition.', 45, ${JSON.stringify(['Organic', 'Harvest', 'Success Story'])}, NOW() - INTERVAL '2 hours'),
      ('p2', 'Vikram Singh', 'Ludhiana, Punjab', 'bg-emerald-500', 'My wheat crop is showing yellowing on the lower leaves. The soil moisture is optimal. Could this be a Nitrogen deficiency or something else?', 12, ${JSON.stringify(['Crop Health', 'Wheat', 'Help Required'])}, NOW() - INTERVAL '2 hours')
    `;
    await sql`
      INSERT INTO replies (id, postId, authorName, authorType, content, likes, createdAt)
      VALUES 
      ('r1', 'p1', 'Suresh Kumar', 'farmer', 'Bhai, which brand of drip pipes did you use? Did you get any government subsidy?', 5, NOW() - INTERVAL '1 hours'),
      ('r2', 'p2', 'KisanSeva AI Expert', 'ai', 'Yellowing of lower/older leaves in wheat is a classic symptom of **Nitrogen (N) deficiency**, as the plant moves mobile nutrients to new growth. \n\n**Action Plan:**\n1. Apply a top dressing of Urea (around 20-25 kg/acre) before your next irrigation.\n2. Alternatively, spray a 2% Urea solution directly on the leaves for faster absorption.\n3. Verify soil pH; if too high/low, Nitrogen uptake may be locked out.', 38, NOW() - INTERVAL '1 hours')
    `;
  }
}

export async function GET() {
  try {
    let allPosts: any[] = [];
    let allReplies: any[] = [];

    if (isVercel) {
      await seedVercelDbIfNeeded();
      const pRes = await sql`SELECT * FROM posts ORDER BY createdAt DESC`;
      const rRes = await sql`SELECT * FROM replies ORDER BY createdAt ASC`;
      allPosts = pRes.rows.map(r => ({...r, authorName: r.authorname, authorLocation: r.authorlocation, avatarColor: r.avatarcolor, createdAt: r.createdat }));
      allReplies = rRes.rows.map(r => ({...r, postId: r.postid, authorName: r.authorname, authorType: r.authortype, createdAt: r.createdat}));
    } else {
      const postsStmt = localDb!.prepare(`SELECT * FROM posts ORDER BY createdAt DESC`);
      const repliesStmt = localDb!.prepare(`SELECT * FROM replies ORDER BY createdAt ASC`);
      allPosts = postsStmt.all() as any[];
      allReplies = repliesStmt.all() as any[];
    }

    const structuredPosts = allPosts.map(post => {
      const postReplies = allReplies
        .filter(r => r.postId === post.id)
        .map(r => ({
          id: r.id,
          authorName: r.authorName,
          authorType: r.authorType,
          content: r.content,
          likes: r.likes,
          timestamp: new Date((isVercel ? r.createdAt : r.createdAt + 'Z')).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric' })
        }));

      return {
        id: post.id,
        authorName: post.authorName,
        authorLocation: post.authorLocation,
        avatarColor: post.avatarColor,
        content: post.content,
        likes: post.likes,
        tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
        timestamp: new Date((isVercel ? post.createdAt : post.createdAt + 'Z')).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric' }),
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
      const id = \`p\${Date.now()}\`;
      const tags = isQuestion ? ['Question'] : ['General'];
      
      if (isVercel) {
        await seedVercelDbIfNeeded();
        await sql`
          INSERT INTO posts (id, authorName, authorLocation, avatarColor, content, tags)
          VALUES (${id}, 'You (Farmer)', 'Your Farm', 'bg-indigo-600', ${content}, ${JSON.stringify(tags)})
        `;
      } else {
        const insertStmt = localDb!.prepare(`
          INSERT INTO posts (id, authorName, authorLocation, avatarColor, content, tags)
          VALUES (?, 'You (Farmer)', 'Your Farm', 'bg-indigo-600', ?, ?)
        `);
        insertStmt.run(id, content, JSON.stringify(tags));
      }
      
      return NextResponse.json({ success: true, postId: id, message: 'Post created' });
    }

    if (action === 'like') {
       const type = body.type; 
       const targetId = body.targetId;
       
       if (isVercel) {
         await seedVercelDbIfNeeded();
         if (type === 'post') {
            await sql`UPDATE posts SET likes = likes + 1 WHERE id = ${targetId}`;
         } else {
            await sql`UPDATE replies SET likes = likes + 1 WHERE id = ${targetId}`;
         }
       } else {
         const table = type === 'post' ? 'posts' : 'replies';
         const updateStmt = localDb!.prepare(`UPDATE ${table} SET likes = likes + 1 WHERE id = ?`);
         updateStmt.run(targetId);
       }
       
       return NextResponse.json({ success: true, message: 'Liked' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error("Community POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

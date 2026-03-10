import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  type: 'reading-note' | 'enrichment';
  content: string;
}

const writingsDirectory = path.join(process.cwd(), 'content/writings');

function getPostsFromDirectory(dir: string, type: 'reading-note' | 'enrichment'): WritingPost[] {
  const fullPath = path.join(writingsDirectory, dir);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(fullPath).filter(name => name.endsWith('.md'));

  return fileNames.map(fileName => {
    const filePath = path.join(fullPath, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || fileName.replace(/\.md$/, ''),
      title: data.title || 'Untitled',
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      type: type,
      content,
    };
  });
}

export function getAllPosts(): WritingPost[] {
  const readingNotes = getPostsFromDirectory('reading-notes', 'reading-note');
  const enrichment = getPostsFromDirectory('enrichment', 'enrichment');

  return [...readingNotes, ...enrichment].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostsByType(type: 'reading-note' | 'enrichment'): WritingPost[] {
  const dir = type === 'reading-note' ? 'reading-notes' : 'enrichment';
  return getPostsFromDirectory(dir, type).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): WritingPost | null {
  const allPosts = getAllPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

interface WritingPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  type: 'reading-note' | 'enrichment';
  content: string;
}

type ViewState =
  | { type: 'list' }
  | { type: 'post'; post: WritingPost; mdxSource: MDXRemoteSerializeResult };

export default function WritingsContent() {
  const [view, setView] = useState<ViewState>({ type: 'list' });
  const [posts, setPosts] = useState<WritingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/writings')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePostClick = async (post: WritingPost) => {
    try {
      const mdxSource = await serialize(post.content);
      setView({ type: 'post', post, mdxSource });
    } catch (error) {
      console.error('Error serializing MDX:', error);
    }
  };

  const handleBack = () => {
    setView({ type: 'list' });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Group posts by type
  const readingNotes = posts.filter(p => p.type === 'reading-note');
  const enrichment = posts.filter(p => p.type === 'enrichment');

  return (
    <div>
      <AnimatePresence mode="wait">
        {/* List View */}
        {view.type === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-crystal-text tracking-tight">
                Writings
              </h2>
              <p className="text-crystal-muted text-sm mt-2 italic opacity-70">
                Notes on things I read, events I attend, and thoughts in between.
              </p>
            </div>

            {loading ? (
              <p className="text-crystal-muted text-sm">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-crystal-muted text-sm italic">
                Nothing here yet.
              </p>
            ) : (
              <div className="space-y-10">
                {/* Reading Notes */}
                {readingNotes.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-crystal-muted mb-4">
                      Reading Notes
                    </h3>
                    <div className="space-y-3">
                      {readingNotes.map((post) => (
                        <button
                          key={post.slug}
                          onClick={() => handlePostClick(post)}
                          className="group block w-full text-left"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-crystal-text group-hover:text-crystal-atom transition-colors">
                              {post.title}
                            </span>
                            <span className="text-crystal-muted text-sm shrink-0 opacity-60">
                              {formatDate(post.date)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enrichment */}
                {enrichment.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-crystal-muted mb-4">
                      Enrichment
                    </h3>
                    <div className="space-y-3">
                      {enrichment.map((post) => (
                        <button
                          key={post.slug}
                          onClick={() => handlePostClick(post)}
                          className="group block w-full text-left"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-crystal-text group-hover:text-crystal-atom transition-colors">
                              {post.title}
                            </span>
                            <span className="text-crystal-muted text-sm shrink-0 opacity-60">
                              {formatDate(post.date)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Post View */}
        {view.type === 'post' && (
          <motion.div
            key="post"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Back link */}
            <button
              onClick={handleBack}
              className="text-crystal-muted hover:text-crystal-text text-sm mb-6 transition-colors"
            >
              &larr; back
            </button>

            {/* Post header */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-crystal-text tracking-tight">
                {view.post.title}
              </h2>
              <p className="text-crystal-muted text-sm mt-1 opacity-60">
                {view.post.date}
              </p>
              {view.post.description && (
                <p className="text-crystal-muted text-sm mt-3 italic">
                  {view.post.description}
                </p>
              )}
            </div>

            {/* Post content */}
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:text-crystal-text prose-headings:font-medium prose-headings:tracking-tight
              prose-p:text-crystal-muted prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-crystal-atom prose-a:no-underline hover:prose-a:underline
              prose-strong:text-crystal-text prose-strong:font-medium
              prose-ul:text-crystal-muted prose-li:text-crystal-muted
              prose-blockquote:border-crystal-atom/30 prose-blockquote:text-crystal-muted prose-blockquote:italic
              prose-code:text-crystal-atom prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
              [&>p]:mb-6">
              <MDXRemote {...view.mdxSource} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

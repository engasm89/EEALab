"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Post = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  author: { name: string | null; email: string | null };
  comments: { id: string; body: string; author: { name: string | null } }[];
};

export function MomentumCommunityPanel({ canPost }: { canPost: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/momentum/community/posts");
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createPost() {
    await fetch("/api/momentum/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, category: "general" }),
    });
    setTitle("");
    setBody("");
    load();
  }

  async function addComment(postId: string, text: string) {
    await fetch("/api/momentum/community/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body: text }),
    });
    load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      {canPost ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="text-sm font-medium">New post</div>
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Body</Label>
            <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <Button type="button" onClick={createPost}>
            Publish
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Upgrade to Pro to start threads. You can still read the forum.</p>
      )}
      <div className="space-y-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} canComment={canPost} onComment={addComment} />
        ))}
        {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}

function PostCard({
  post,
  canComment,
  onComment,
}: {
  post: Post;
  canComment: boolean;
  onComment: (postId: string, body: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="font-medium text-foreground">{post.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {post.author.name ?? post.author.email ?? "Learner"} · {post.category}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{post.body}</p>
      <ul className="mt-4 space-y-2 border-t border-white/10 pt-3">
        {post.comments.map((c) => (
          <li key={c.id} className="text-sm text-muted-foreground">
            <span className="text-foreground">{c.author.name ?? "Member"}:</span> {c.body}
          </li>
        ))}
      </ul>
      {canComment ? (
        <div className="mt-3 flex gap-2">
          <Input
            className="flex-1"
            placeholder="Reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              if (!text.trim()) return;
              onComment(post.id, text);
              setText("");
            }}
          >
            Reply
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">Pro members can reply.</p>
      )}
    </article>
  );
}

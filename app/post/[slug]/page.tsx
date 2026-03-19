export const dynamic = "force-dynamic";

import { getPostBySlug } from "../../../lib/posts";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div
        style={{
          display: "flex",
          gap: "10px",
          fontSize: "13px",
          color: "#777",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            background: "#111",
            color: "#fff",
            borderRadius: "999px",
            padding: "4px 10px",
            fontWeight: 600,
          }}
        >
          {post.category}
        </span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <h1 style={{ fontSize: "34px", margin: "0 0 18px" }}>{post.title}</h1>

      <div style={{ color: "#222", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {post.content}
      </div>
    </article>
  );
}
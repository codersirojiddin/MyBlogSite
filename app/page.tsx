export const dynamic = "force-dynamic";

import { getAllPosts } from "../lib/posts";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 style={{ fontSize: "34px", margin: "0 0 12px" }}>
        Essays, news, and code.
      </h1>

      <p style={{ color: "#666", margin: "0 0 28px", lineHeight: 1.6 }}>
        A minimal coding blog.
      </p>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/post/${post.slug}`}
              style={{
                display: "block",
                border: "1px solid #dddddd",
                borderRadius: "12px",
                padding: "18px",
                background: "#ffffff",
                textDecoration: "none",
                color: "#111",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  fontSize: "13px",
                  color: "#777",
                  marginBottom: "8px",
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

              <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>
                {post.title}
              </h2>

              <p style={{ margin: 0, color: "#444", lineHeight: 1.7 }}>
                {post.content.slice(0, 140)}
                {post.content.length > 140 ? "..." : ""}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
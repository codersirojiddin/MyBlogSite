export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, logoutAdmin } from "../../../lib/auth";
import {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
} from "../../../lib/posts";

export default async function AdminPanelPage({
  searchParams,
}: {
  searchParams?: { edit?: string };
}) {
  await requireAdmin();

  const posts = await getAllPosts();
  const editId = Number(searchParams?.edit || 0);
  const editingPost = posts.find((post) => post.id === editId);

  async function handleCreate(formData: FormData) {
  "use server";

  try {
    await requireAdmin();

    const title = String(formData.get("title") || "");
    const category = String(formData.get("category") || "essay") as
      | "essay"
      | "news"
      | "code";
    const content = String(formData.get("content") || "");

    console.log("HANDLE CREATE:", { title, category, content });

    await createPost({ title, category, content });

    revalidatePath("/");
    revalidatePath("/iamadmin/panel");

    redirect("/iamadmin/panel");
  } catch (err) {
    console.error("HANDLE CREATE ERROR:", err);
    throw err;
  }
}

  async function handleUpdate(formData: FormData) {
    "use server";

    await requireAdmin();

    const id = Number(formData.get("id"));
    const title = String(formData.get("title") || "");
    const category = String(formData.get("category") || "essay") as
      | "essay"
      | "news"
      | "code";
    const content = String(formData.get("content") || "");

    await updatePost(id, { title, category, content });
    redirect("/iamadmin/panel");
    revalidatePath("/");
revalidatePath("/iamadmin/panel");
  }

  async function handleDelete(formData: FormData) {
    "use server";

    await requireAdmin();

    const id = Number(formData.get("id"));
    await deletePost(id);
    redirect("/iamadmin/panel");
    revalidatePath("/");
revalidatePath("/iamadmin/panel");
  }

  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/iamadmin");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #d5d5d5",
    background: "#ffffff",
    color: "#111111",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "15px",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "34px", margin: "0 0 6px", color: "#111" }}>
            Admin Panel
          </h1>
          <p style={{ color: "#666", margin: 0 }}>
            Create, edit, and delete posts.
          </p>
        </div>

        <form action={handleLogout}>
          <button
            type="submit"
            style={{
              border: "1px solid #d5d5d5",
              borderRadius: "10px",
              padding: "10px 14px",
              background: "#ffffff",
              color: "#111111",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </form>
      </div>

      <div
        style={{
          border: "1px solid #dddddd",
          borderRadius: "12px",
          padding: "18px",
          background: "#ffffff",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: "24px", color: "#111" }}>
          {editingPost ? "Edit Post" : "New Post"}
        </h2>

        <form action={editingPost ? handleUpdate : handleCreate}>
          {editingPost ? (
            <input type="hidden" name="id" value={editingPost.id} />
          ) : null}

          <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
            <label htmlFor="title" style={{ color: "#222" }}>
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={editingPost?.title || ""}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
            <label htmlFor="category" style={{ color: "#222" }}>
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={editingPost?.category || "essay"}
              style={inputStyle}
            >
              <option value="essay">essay</option>
              <option value="news">news</option>
              <option value="code">code</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
            <label htmlFor="content" style={{ color: "#222" }}>
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              defaultValue={editingPost?.content || ""}
              style={{
                ...inputStyle,
                minHeight: "220px",
                resize: "vertical",
                lineHeight: 1.6,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "10px 14px",
                background: "#111111",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {editingPost ? "Save Changes" : "Publish Post"}
            </button>

            {editingPost ? (
              <a
                href="/iamadmin/panel"
                style={{
                  display: "inline-block",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  background: "#f2f2f2",
                  color: "#111111",
                  textDecoration: "none",
                  fontWeight: 600,
                  border: "1px solid #dddddd",
                }}
              >
                Cancel
              </a>
            ) : null}
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #dddddd",
              borderRadius: "12px",
              padding: "16px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div>
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

                <h3 style={{ margin: "0 0 8px", fontSize: "20px", color: "#111" }}>
                  {post.title}
                </h3>

                <p style={{ margin: 0, color: "#666" }}>/post/{post.slug}</p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a
                  href={`/iamadmin/panel?edit=${post.id}`}
                  style={{
                    display: "inline-block",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    background: "#f2f2f2",
                    color: "#111111",
                    textDecoration: "none",
                    fontWeight: 600,
                    border: "1px solid #dddddd",
                  }}
                >
                  Edit
                </a>

                <form action={handleDelete}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    style={{
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      background: "#c62828",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
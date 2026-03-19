import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "./supabase";

export type Post = {
  id: number;
  title: string;
  slug: string;
  category: "essay" | "news" | "code";
  content: string;
  created_at: string;
  updated_at: string;
};

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getAllPosts(): Promise<Post[]> {
  noStore();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("GET ALL POSTS DATA:", data);
  console.log("GET ALL POSTS ERROR:", error);

  if (error) {
    return [];
  }

  return (data || []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  noStore();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  console.log("GET POST BY SLUG DATA:", data);
  console.log("GET POST BY SLUG ERROR:", error);

  if (error) {
    return null;
  }

  return data as Post;
}

export async function createPost(input: {
  title: string;
  category: "essay" | "news" | "code";
  content: string;
}) {
  const title = input.title.trim();
  const content = input.content.trim();
  const category = input.category;
  const slug = makeSlug(title);

  console.log("CREATE INPUT:", { title, slug, category, content });

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    category,
    content,
  });

  console.log("CREATE ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePost(
  id: number,
  input: {
    title: string;
    category: "essay" | "news" | "code";
    content: string;
  }
) {
  const title = input.title.trim();
  const content = input.content.trim();
  const category = input.category;
  const slug = makeSlug(title);

  console.log("UPDATE INPUT:", { id, title, slug, category, content });

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      category,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  console.log("UPDATE ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(id: number) {
  console.log("DELETE INPUT:", { id });

  const { error } = await supabase.from("posts").delete().eq("id", id);

  console.log("DELETE ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }
}
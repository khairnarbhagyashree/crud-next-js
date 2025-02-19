import PostsTable from "@/components/PostsTable";

export default async function Home() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();

  return <PostsTable initialPosts={posts} />;
}

import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function Page() {
  const posts = await prisma.post.findMany({
    take: 5,
  });
  return (
    <main className="text-center pt-20 px-5">
      <h1 className="text-4xl font-bold mb-5">All posts</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="mb-3">
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

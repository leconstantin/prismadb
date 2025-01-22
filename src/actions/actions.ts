"use server";

import { prisma } from "@/lib/db";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("body") as string;

  await prisma.post.create({
    data: {
      title,
      content,
      slug: title.toLowerCase().replace(/ /g, "-"),
    },
    select: {
      content: true,
      slug: true,
      title: true,
    },
  });
}

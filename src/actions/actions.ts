"use server";

import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData): Promise<void> {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const title = formData.get("title") as string;
  const content = formData.get("body") as string;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  try {
    const user = await getUser();
    if (!user || !user.email) {
      redirect("/api/auth/login");
    }

    const existingUser = await prisma.user.findUnique({
      where: { userid: user.id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          userid: user.id,
          email: user.email,
          name: user.given_name || "",
        },
      });
    }

    const slugBase = title.toLowerCase().replace(/ /g, "-");
    const existingSlugs = await prisma.post.findMany({
      where: { slug: { startsWith: slugBase } },
      select: { slug: true },
    });

    const slug =
      existingSlugs.length > 0
        ? `${slugBase}-${existingSlugs.length + 1}`
        : slugBase;

    await prisma.post.create({
      data: {
        title,
        content,
        slug,
        userId: user.id,
      },
      select: {
        content: true,
        slug: true,
        title: true,
      },
    });

    revalidatePath("/posts"); // Revalidate as needed
  } catch (error) {
    console.error("Error creating post:", error);
    redirect("/error");
  }
}

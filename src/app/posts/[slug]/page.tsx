import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

type Tparams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
    },
  });

  return posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));
}

export async function generateMetadata({ params }: Tparams): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getPost(slug);
  if (!post) return notFound();
  return {
    title: post.title,
  };
}
export const getPost = async (slug: string) => {
  return await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    select: {
      title: true,
      content: true,
      userId: true,
    },
  });
};
export const getUser = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      userid: id,
    },
    select: {
      email: true,
      name: true,
    },
  });
};
export default async function Page({ params }: Tparams) {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post || post.userId == null) return notFound();
  const creator = await getUser(post.userId);
  return (
    <main className="text-center pt-24 px-7">
      <h1 className="text-5xl font-semibold mb-7">{post.title}</h1>
      <p className="max-w-[700px] mx-auto">{post.content}</p>
      <p className="">
        Created By {creator?.name ? creator.name : creator?.email}
      </p>
    </main>
  );
}

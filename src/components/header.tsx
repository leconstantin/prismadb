"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/posts",
    label: "Posts",
  },
  {
    href: "/create-post",
    label: "Create Post",
  },
];
export default function Header() {
  const pathName = usePathname();
  const { isAuthenticated, getUser } = useKindeBrowserClient();

  const user = getUser();
  return (
    <header className="flex justify-between items-center py-4 px-7 border-b">
      <Link href="/">
        <Image
          src="https://bytegrad.com/course-assets/youtube/example-logo.png"
          alt="logo"
          width={35}
          height={35}
          className="w-8 h-8"
        />
      </Link>

      <nav>
        <ul className="flex gap-x-5 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  pathName === link.href ? "text-zinc-900" : "text-zinc-400"
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-x-3">
        {user ? (
          <>
            <Image
              className="rounded-full ml-auto"
              src={user.picture!}
              alt="User Avatar"
              width={35}
              height={35}
            />
          </>
        ) : (
          "Not logged in"
        )}
        {isAuthenticated && (
          <LogoutLink className="ml-auto my-3">Logout</LogoutLink>
        )}
      </div>
    </header>
  );
}

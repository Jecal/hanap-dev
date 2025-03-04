import Link from "next/link";
import Image from "next/image";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

type NavbarProps = {
  currentPage: "home" | "jobs" | "laws" | "resume" | "login";
};

export default function Navbar({ currentPage }: NavbarProps) {
  return (
    <nav className="w-full max-w-5xl mx-auto pt-4 px-4 z-10">
      <div className="border rounded-xl px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>
        <div className="flex gap-8">
          <Link
            href="/jobs"
            className={`text-gray-400 hover:text-gray-900 transition-colors ${
              currentPage === "jobs" ? "text-gray-900" : ""
            }`}
          >
            opportunity!
          </Link>
        </div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>{" "}
        {/* modify this button so that when hovered it does the same effect as the jobs button*/}
      </div>
    </nav>
  );
}

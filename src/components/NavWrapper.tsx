"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null; // không render NavBar
  }

  return <NavBar />;
}

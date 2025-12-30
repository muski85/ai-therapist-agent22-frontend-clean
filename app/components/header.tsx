"use client";

import Link from "next/link";
import { Zap, X, Menu, MessageCircle, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SignInButton } from "./auth/sign-in-button";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/contexts/session-contexts";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // console.log("Header: isAuthenticated =", isAuthenticated, "user =", user);
  const navItems = [
    { href: "/about", label: "About Lumina" },
    { href: "/features", label: "Features" },
  ];

  return (
    <div className="w-full fixed top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <header className="relative max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-primary animate-pulse-gentle" />
            <div className="flex flex-col">
              <span className="font-semibold text-base sm:text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Lumina
              </span>
            </div>
          </Link>

          {/* navitems */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href; //check current page
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground
                   transition-colors relative group
                   ${
                     isActive
                       ? "text-primary bg-primary/10" // Active styles
                       : "text-muted-foreground hover:text-foreground" // Inactive styles
                   }
                `}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-200 origin-left ${
                        isActive
                          ? "scale-x-100" // Always show when active
                          : "scale-x-0 group-hover:scale-x-100" // Show on hover when inactive
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    className="hidden md:flex gap-2 bg-primary/90 hover:bg-primary text-sm"
                  >
                    <Link href="/dashboard">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Start Chat
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logout}
                    size="sm"
                    className="hidden sm:flex text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden lg:inline">Sign out</span>
                    <span className="lg:hidden">Out</span>
                  </Button>
                </>
              ) : (
                <SignInButton />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="flex flex-col space-y-1 py-4 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return(
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium text-muted-foreground
                 hover:text-foreground hover:bg-accent rounded-md transition-colors
                 ${
                  isActive
                    ?  "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                 }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
            })}
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-3 text-sm font-medium bg-primary/90 hover:bg-primary text-primary-foreground rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Start Chat
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-2 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Scan, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
] as const;

export function SharedHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-7 items-center justify-center rounded-md border border-foreground/15 group-hover:border-accent/50 transition-colors">
            <Shield className="size-3.5 text-foreground/80 group-hover:text-accent transition-colors" />
          </div>
          <span className="text-xs font-medium tracking-wide text-foreground">
            CitizenAudit
          </span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {label}
                {isActive && (
                  <span className="absolute bottom-[-9px] left-3 right-3 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

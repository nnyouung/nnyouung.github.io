"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/portfolio", label: "포트폴리오" },
];

export default function NavPill() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="sticky top-6 z-50 flex justify-center">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-3 py-1 text-xs font-medium transition sm:px-4 sm:text-sm ${
                isActive(tab.href)
                  ? "bg-slate-100 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(15,23,42,0.12)]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              aria-current={isActive(tab.href) ? "page" : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

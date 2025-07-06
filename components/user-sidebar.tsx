"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Optional utility function for conditional classNames
import { useAuth } from "@/contexts/auth-context";

const navItems = [
    { label: "My Orders", href: "/dashboard/orders" },
    { label: "My Dresses", href: "/dashboard/dress" },
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Subscription", href: "/dashboard/subscription" },
    { label: "Shop", href: "/dashboard/shop" },
];

export default function UserSidebar() {

    const { logout } = useAuth()
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-white border-r border-t shadow-sm hidden md:block">
            {/* <div className="p-4">
      </div> */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100",
                                    pathname === item.href && "bg-gray-100 font-semibold"
                                )}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => logout()}
                            className={cn(
                                "block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100",

                            )}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

"use client"

import { Calendar, LayoutDashboard, Car, Cog } from 'lucide-react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react'
import {cn} from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        label: "Cars",
        icon: Car,
        href: "/admin/cars",
    },
    {
        label: "Test Drives",
        icon: Calendar,
        href: "/admin/test-drives",
    },
    {
        label: "Settings",
        icon: Cog,
        href: "/admin/settings",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    return (
        <>
            {/* Sidebar for Desktop screens */}
            <div className='hidden md:flex  h-full flex-col overflow-y-auto bg-white shadow-sm border-r'>
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href} 
                        className={cn(
                            "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50 ",
                            pathname === route.href ? "bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700" : "",
                            "h-12"
                        )}
                    >
                        <route.icon className="h-5 w-5" />
                        {route.label}
                    </Link>
                ))}
            </div>

            {/* Sidebar for Mobile screens */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16'>
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex flex-col items-center justify-center text-slate-500 text-xs font-medium transition-all",
                            pathname === route.href ? "text-blue-700" : ""
                        )}
                    >
                        <route.icon className="h-5 w-5" />
                        {route.label}
                    </Link>
                ))}
            </div>
        </>
    );
};



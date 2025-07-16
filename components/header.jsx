import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CarFront } from "lucide-react";

const Header = async ({ isAdminPage = false }) => {
    const isAdmin = false;
    return (<header className="fixed top-0 w-full  bg-white/80 backdrop-blur-md z-50  border-b ">
        <nav className="mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={isAdminPage ? "/admin" : "/"}>
                <Image src="/logo.png" alt="Vehiql Logo" width={200} height={60} className="h-12 w-auto object-contain" />
                {isAdminPage && (
                    <span className="text-xs font-extralight">admin</span>
                )}
            </Link>
            <div>
                <SignedIn>
                    <Link href="/saved-cars">
                        <Button>
                            <CarFront size={18} />
                            <span className="hidden md:inline">Saved Cars</span>
                        </Button>
                    </Link>
                </SignedIn>
            </div>
        </nav>
    </header>)
};

export default Header;

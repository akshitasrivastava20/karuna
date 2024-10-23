
        "use client";
        import React, { useState } from "react";
        import Link from "next/link";
        import Image from "next/image";
        export default function Navbar() {
            return (
                <>
                    <nav className="bg-white dark:bg-neutral-900  h-16">
                        <div className="container mx-auto flex justify-between items-center p-0.5 h-full">
                            <div className="flex items-center">
                                <Image src="/images/logo.svg" alt="Logo" width={130} height={150} />
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-[3px] relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                        <Link href="/login"> Login</Link>
                                    </div>
                                </button>
                                <button className="p-[3px] relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                                       <Link href="/signup">Sign up</Link>
                                    </div>         </button>
                            </div>   
                        </div>      
                    </nav>
                </>
            );
        }
          
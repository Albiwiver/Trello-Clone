"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import { RegisterDialog } from "../auth/RegisterDialog";
import { LoginDialog } from "../auth/LoginDialog";
import { useState } from "react";

export const Navbar =() => {
  const [openReg, setOpenReg] = useState(false);
  const [openLog, setOpenLog] = useState(false);
  const { currentUser, isAuthenticated, logout } = useUserStore();

  return (
    <header className="w-full h-12 bg-zinc-900 sm:h-14 sm:px-2 lg:px-6 lg:h-16">
      <nav className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/trello_clone_logo.svg"   
              alt="Trello Clone"
              width={28}
              height={28}
              priority
            />
          </Link>
          <span className="hidden sm:inline text-white font-semibold sm:text-base lg:text-xl">Trello Clone</span>
        </div>

      
        {isAuthenticated && (
          <p className="text-white text-sm sm:text-base lg:text-lg lg:mr-4">Welcome, {currentUser?.fullName}!!</p>
        )}

        
        <div className="flex items-center gap-2">
        
          <div className="hidden sm:flex gap-2">
            {!isAuthenticated ? (
              <>
                <Button className="hover:cursor-pointer sm:text-base" onClick={() => setOpenReg(true)}>Sign up</Button>
                <Button variant="secondary" className="hover:cursor-pointer sm:text-base" onClick={() => setOpenLog(true)}>Log in</Button>
              </>
            ) : (
              <Button variant="secondary" className="hover:cursor-pointer" onClick={logout}>Logout</Button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden text-purple-800" aria-label="Open menu">
                <Menu className="size-6"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem disabled>Welcome, {currentUser?.fullName}!!</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setOpenReg(true)}>Sign up</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenLog(true)}>Log in</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <RegisterDialog open={openReg} onOpenChange={setOpenReg} />
      <LoginDialog open={openLog} onOpenChange={setOpenLog} />
    </header>
  );
}

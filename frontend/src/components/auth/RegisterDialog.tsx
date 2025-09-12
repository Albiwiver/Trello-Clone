"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { userService } from "@/services/userService";

export function RegisterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Aqui se postea a la DB
    const user = await userService.create({email,fullName,password});
    
    useUserStore.setState({ currentUser: user, isAuthenticated: true });
    onOpenChange(false);
  } catch (error) {
    setError("Register could not possible");
    console.log(error)
  }
};

  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent >
        <DialogHeader><DialogTitle>Create account</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button className="hover:cursor-pointer" type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="hover:cursor-pointer" type="submit">Sign up</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

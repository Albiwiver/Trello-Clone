// src/components/auth/LoginDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { userService } from "@/services/userService";

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setUser = useUserStore(s => s.setUser)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    try {
        const user = await userService.login(email, password)
        setUser(user)
        onOpenChange(false)
    } catch {
        setError('Invalid Credentials')  
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Login</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
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
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Go in</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col bg-gradient-to-br from-black to-purple-950"
      > <Toaster richColors/>
        <Navbar/>     
        {children}  
        <Footer className={'mt-auto'}/>
      </body>
    </html>
  );
}

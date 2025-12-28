import { Navbar } from "@/components/landing/Navbar";
import { HomeContent } from "@/components/landing/HomeContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Navbar />
      <HomeContent />
    </div>
  );
}


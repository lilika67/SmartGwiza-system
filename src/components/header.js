"use client";
import Link from "next/link";
import { Leaf, BarChart3 } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-green-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8" />
          <span className="text-2xl font-bold"> EzanaAI</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="#predict" className="hover:text-earth-amber transition-colors">
            Predict
          </Link>
          <Link href="#visualizations" className="hover:text-earth-amber transition-colors">
            Visualizations
          </Link>
          <Link href="#upload" className="hover:text-earth-amber transition-colors">
            Upload Data
          </Link>
          <button className="bg-earth-amber text-earth-green px-4 py-2 rounded-md hover:bg-opacity-80 transition">
           API
          </button>
        </nav>
      </div>
    </header>
  );
}
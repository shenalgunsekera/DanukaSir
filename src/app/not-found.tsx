import Link from "next/link";
import { GraduationCap, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center px-5 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-grad text-black"><GraduationCap size={26} /></span>
        <p className="mt-8 font-display text-7xl font-bold text-sage-grad">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-cloud">Page not found</h1>
        <p className="mt-2 text-mist">The page you're looking for doesn't exist or has moved.</p>
        <Link href="/" className="btn-gold mt-8"><Home size={16} /> Back home</Link>
      </div>
    </main>
  );
}

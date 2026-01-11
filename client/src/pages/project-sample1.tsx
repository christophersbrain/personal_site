import { Link } from "wouter";

export default function ProjectSample1() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary/20">
      
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm pt-8 pb-4 px-6 md:px-12 flex items-start justify-between">
        <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12">
          <Link href="/" className="text-lg font-bold tracking-tight text-primary">CHRIS WHITE</Link>
          
          <nav className="flex gap-6 text-sm underline-offset-4">
            <Link href="/#about" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">ABOUT</Link>
            <Link href="/#clients" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">CLIENTS</Link>
            <Link href="/#shelf" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">SHELF</Link>
            <Link href="/#shelf" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">PROJECTS</Link>
          </nav>
        </div>
        
        <div className="border border-primary w-10 h-10 flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors cursor-pointer">
          <span className="text-2xl leading-none pt-2">*</span>
        </div>
      </header>

      <main className="min-h-[calc(100vh-120px)]">
      </main>
    </div>
  );
}

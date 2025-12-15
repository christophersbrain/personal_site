import { useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import heroImage from "@assets/generated_images/minimalist_desk_setup_with_plants.png";
import { cn } from "@/lib/utils";
import { NOW_ITEMS, PREVIOUSLY_ITEMS, LORE_ITEMS, CLIENT_ITEMS, BOOKS } from "@/data";

// --- Components ---

const BookCard = ({ book }: { book: typeof BOOKS[0] }) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className={cn(
        "aspect-[2/3] w-full cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm border border-foreground/10 p-4 flex flex-col justify-between overflow-hidden relative",
        book.color
      )}>
        <div className="z-10 relative">
          <h3 className={cn("font-bold text-lg leading-tight mb-2", book.color.includes("text-white") ? "text-white" : "text-foreground")}>
            {book.title}
          </h3>
          <p className={cn("text-xs opacity-80 uppercase tracking-widest", book.color.includes("text-white") ? "text-white" : "text-foreground")}>
            {book.author}
          </p>
        </div>
        
        {book.subtitle && (
           <p className={cn("text-xs leading-tight mt-4 line-clamp-4", book.color.includes("text-white") ? "text-white/90" : "text-foreground/80")}>
             {book.subtitle}
           </p>
        )}
        
        {/* Placeholder decorative element for book spine/texture */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/5" />
      </div>
    </DialogTrigger>
    
    <DialogContent className="sm:max-w-2xl bg-background border-none shadow-none p-0 overflow-hidden gap-0">
      <div className="grid md:grid-cols-2 h-full">
        {/* Modal Left: Book Cover */}
        <div className={cn("p-12 flex items-center justify-center", book.color)}>
           <div className="aspect-[2/3] w-2/3 shadow-xl border border-black/10 flex flex-col justify-between p-6 relative bg-inherit">
              <div>
                <h2 className={cn("font-bold text-2xl leading-tight mb-2", book.color.includes("text-white") ? "text-white" : "text-foreground")}>{book.title}</h2>
                <p className={cn("text-sm uppercase tracking-widest opacity-80", book.color.includes("text-white") ? "text-white" : "text-foreground")}>{book.author}</p>
              </div>
              <p className={cn("text-sm opacity-90", book.color.includes("text-white") ? "text-white" : "text-foreground")}>{book.subtitle}</p>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10" />
           </div>
        </div>
        
        {/* Modal Right: Details */}
        <div className="p-8 md:p-12 flex flex-col bg-background">
          <h2 className="text-xl font-bold uppercase tracking-wide text-primary mb-2">{book.title}</h2>
          <p className="text-sm text-muted-foreground mb-8">{book.author}</p>
          
          <div className="prose prose-sm prose-green max-w-none text-foreground/80 leading-relaxed font-mono">
             <p>{book.description || "No description available for this book yet. It's on my shelf because it made an impact."}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("bookshelf");

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary/20">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm pt-8 pb-4 px-6 md:px-12 flex items-start justify-between">
        <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12">
          <h1 className="text-lg font-bold tracking-tight text-primary">CHRIS WHITE</h1>
          
          <nav className="flex gap-6 text-sm underline-offset-4">
            <a href="#about" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">ABOUT</a>
            <a href="#clients" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">CLIENTS</a>
            <a href="#shelf" className="hover:underline decoration-1 decoration-primary/50 text-primary font-medium">SHELF</a>
          </nav>
        </div>
        
        {/* The Box with Asterisk */}
        <div className="border border-primary w-10 h-10 flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors cursor-pointer">
          <span className="text-2xl leading-none pt-2">*</span>
        </div>
      </header>

      <main className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        
        {/* --- Hero Image --- */}
        <section className="mb-20 mt-8">
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
             <img 
               src={heroImage} 
               alt="Desk Setup" 
               className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
             />
          </div>
        </section>

        {/* --- Two Column Layout --- */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-32 mb-32" id="about">
          
          {/* Left Col: About/Now/Lore */}
          <div className="space-y-12">
            <div>
               <h2 className="text-sm font-bold tracking-wider uppercase mb-6 text-primary border-b border-primary/20 pb-2">ABOUT ME</h2>
            </div>

            <div className="space-y-4">
               <h3 className="text-muted-foreground text-xs uppercase tracking-widest mb-4">//NOW//</h3>
               <ul className="space-y-3">
                 {NOW_ITEMS.map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm leading-relaxed">
                     <span className="text-primary">-</span>
                     <span>{item.replace("Base", "")} <span className="underline decoration-1">Base</span></span> 
                   </li>
                 ))}
               </ul>
            </div>

            <div className="space-y-4">
               <h3 className="text-muted-foreground text-xs uppercase tracking-widest mb-4">//PREVIOUSLY//</h3>
               <ul className="space-y-3">
                 {PREVIOUSLY_ITEMS.map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm leading-relaxed">
                     <span className="text-primary">-</span>
                     {item}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="space-y-4">
               <h3 className="text-muted-foreground text-xs uppercase tracking-widest mb-4">//LORE//</h3>
               <ul className="space-y-3">
                 {LORE_ITEMS.map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm leading-relaxed">
                     <span className="text-primary">-</span>
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* Right Col: Clients */}
          <div id="clients">
             <h2 className="text-sm font-bold tracking-wider uppercase mb-6 text-primary border-b border-primary/20 pb-2">CLIENTS</h2>
             
             <div className="space-y-8">
               {CLIENT_ITEMS.map((item, i) => (
                 <div key={i} className="group cursor-pointer">
                   <h3 className="text-lg decoration-1 underline-offset-4 group-hover:underline text-primary mb-1">
                     {item.source}
                   </h3>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider flex flex-col gap-1">
                     <span>{item.year}</span>
                     <span>{item.title}</span>
                   </div>
                   {i < CLIENT_ITEMS.length - 1 && (
                     <div className="border-b border-primary/10 border-dashed mt-6 w-full" />
                   )}
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* --- Bookshelf Section --- */}
        <section id="shelf" className="mb-24">
          <Tabs defaultValue="bookshelf" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-primary pb-0">
               <TabsList className="bg-transparent h-auto p-0 gap-8 rounded-none">
                 <TabsTrigger 
                   value="bookshelf" 
                   className="rounded-none bg-transparent p-0 pb-4 text-sm font-bold tracking-wider uppercase text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-[0_2px_0_0_currentcolor]"
                 >
                   BOOKSHELF
                 </TabsTrigger>
                 <TabsTrigger 
                   value="movie" 
                   className="rounded-none bg-transparent p-0 pb-4 text-sm font-bold tracking-wider uppercase text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-[0_2px_0_0_currentcolor]"
                 >
                   MOVIE SHELF
                 </TabsTrigger>
                 <TabsTrigger 
                   value="essays" 
                   className="rounded-none bg-transparent p-0 pb-4 text-sm font-bold tracking-wider uppercase text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-[0_2px_0_0_currentcolor]"
                 >
                   ESSAYS
                 </TabsTrigger>
               </TabsList>
            </div>

            <div className="mb-8">
               <Input 
                 placeholder="Search books by title or author..." 
                 className="bg-[#F0F2EA] border-primary/20 focus-visible:ring-primary h-12 text-base font-mono placeholder:text-muted-foreground/50"
               />
               <div className="flex gap-4 mt-4 text-xs font-bold tracking-wider uppercase">
                 <span className="text-muted-foreground pt-1">FILTER:</span>
                 <button className="bg-primary text-background px-3 py-1 hover:opacity-90">ALL</button>
                 <button className="border border-primary/20 text-primary px-3 py-1 hover:bg-primary/5">• LIFE-CHANGING</button>
                 <button className="border border-primary/20 text-primary px-3 py-1 hover:bg-primary/5">♥ LIKED</button>
                 <span className="ml-auto text-muted-foreground">{BOOKS.length} BOOKS</span>
               </div>
            </div>

            <TabsContent value="bookshelf" className="mt-0">
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                 {BOOKS.map((book) => (
                   <BookCard key={book.id} book={book} />
                 ))}
               </div>
            </TabsContent>
            
            <TabsContent value="movie" className="mt-0">
               <div className="h-64 flex items-center justify-center border border-dashed border-primary/20 text-muted-foreground text-sm uppercase tracking-widest">
                 Movie shelf content goes here
               </div>
            </TabsContent>

            <TabsContent value="essays" className="mt-0">
               <div className="h-64 flex items-center justify-center border border-dashed border-primary/20 text-muted-foreground text-sm uppercase tracking-widest">
                 Essays content goes here
               </div>
            </TabsContent>

          </Tabs>
        </section>

      </main>

      <footer className="px-6 md:px-12 py-12 border-t border-primary/10">
         <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
           <span>© 2025 Chris White</span>
           <span>Made with Replit</span>
         </div>
      </footer>
    </div>
  );
}

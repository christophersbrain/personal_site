import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import heroImage from "@assets/generated_images/minimalist_desk_setup_with_plants.png";
import { cn } from "@/lib/utils";
import { NOW_ITEMS, PREVIOUSLY_ITEMS, LORE_ITEMS, CLIENT_ITEMS, BOOKS } from "@/data";
import { Heart } from "lucide-react";

// --- Components ---

const BookCard = ({ book }: { book: typeof BOOKS[0] }) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className="group relative cursor-pointer">
        <div className="aspect-[2/3] w-full overflow-hidden bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md border border-black/5">
          <img 
            src={book.cover} 
            alt={book.title} 
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {/* Overlay gradient for text legibility if needed, but we rely on the cover art mostly */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          
          {/* Heart icon if liked */}
          {book.liked && (
            <div className="absolute top-2 right-2 text-red-500">
               <Heart className="w-4 h-4 fill-current" />
            </div>
          )}
        </div>
      </div>
    </DialogTrigger>
    
    <DialogContent className="sm:max-w-3xl bg-background border-none shadow-2xl p-0 overflow-hidden gap-0">
      <div className="grid md:grid-cols-2 h-full max-h-[80vh] overflow-y-auto md:overflow-hidden">
        {/* Modal Left: Book Cover */}
        <div className="p-8 md:p-12 flex items-center justify-center bg-muted/30">
           <div className="aspect-[2/3] w-2/3 shadow-2xl relative">
              <img 
                src={book.cover} 
                alt={book.title} 
                className="h-full w-full object-cover"
              />
           </div>
        </div>
        
        {/* Modal Right: Details */}
        <div className="p-8 md:p-12 flex flex-col bg-background overflow-y-auto">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-primary mb-2 leading-tight">{book.title}</h2>
          <p className="text-sm text-muted-foreground mb-6 font-medium tracking-widest uppercase">{book.author}</p>
          <div className="w-12 h-0.5 bg-primary/20 mb-8" />
          
          <div className="prose prose-sm prose-neutral max-w-none text-foreground/80 leading-relaxed font-mono">
             <p>Published in {book.year}</p>
             <p className="mt-4">
               {/* Description placeholder since the TSV didn't have descriptions */}
               "A book that has earned its place on the shelf."
             </p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("bookshelf");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "liked">("all");

  // Filter and Group Books
  const filteredBooks = useMemo(() => {
    return BOOKS.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "all" ? true : book.liked;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  const booksByYear = useMemo(() => {
    const grouped = filteredBooks.reduce((acc, book) => {
      const year = book.year || "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(book);
      return acc;
    }, {} as Record<string, typeof BOOKS>);

    // Sort years descending
    return Object.entries(grouped).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filteredBooks]);

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
             <h2 className="text-sm font-bold tracking-wider uppercase mb-0 text-primary border-b border-primary/20 pb-2">CLIENTS</h2>
             
             <div className="divide-y divide-primary/10 divide-dashed">
               {CLIENT_ITEMS.map((item, i) => (
                 <div key={i} className="group cursor-pointer py-6">
                   <div className="flex justify-between items-center gap-4">
                     <div>
                       <h3 className="text-lg decoration-1 underline-offset-4 group-hover:underline text-primary mb-1">
                         {item.source}
                       </h3>
                       <div className="text-xs text-muted-foreground uppercase tracking-wider flex flex-col gap-1">
                         <span>{item.title}</span>
                         <span>{item.year}</span>
                       </div>
                     </div>
                     
                     {item.logo && (
                       <div className="w-24 h-24 border border-primary shrink-0 overflow-hidden bg-white flex items-center justify-center">
                         <img 
                           src={item.logo} 
                           alt={item.source} 
                           className={cn(
                             "w-full h-full",
                             item.source === "Brighter Electrical" ? "object-cover object-center scale-[1.25]" : 
                             item.source === "Black Court" ? "object-cover object-center scale-[1.1]" : "object-contain"
                           )}
                         />
                       </div>
                     )}
                   </div>
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
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <div className="flex gap-4 mt-4 text-xs font-bold tracking-wider uppercase">
                 <span className="text-muted-foreground pt-1">FILTER:</span>
                 <button 
                   onClick={() => setFilter("all")}
                   className={cn(
                     "px-3 py-1 transition-colors text-[10px] tracking-widest font-bold",
                     filter === "all" ? "bg-primary text-background" : "hover:bg-primary/5 text-primary border border-primary/20"
                   )}
                 >
                   ALL
                 </button>
                 <button className="border border-primary/20 text-primary px-3 py-1 hover:bg-primary/5 opacity-50 cursor-not-allowed text-[10px] tracking-widest font-bold">* LIFE-CHANGING</button>
                 <button 
                   onClick={() => setFilter("liked")}
                   className={cn(
                     "px-3 py-1 transition-colors border border-primary/20 text-[10px] tracking-widest font-bold",
                     filter === "liked" ? "bg-primary text-background border-primary" : "hover:bg-primary/5 text-primary"
                   )}
                 >
                   ♥ LIKED
                 </button>
                 <span className="ml-auto text-muted-foreground">{filteredBooks.length} BOOKS</span>
               </div>
            </div>

            <TabsContent value="bookshelf" className="mt-0 space-y-16">
              {booksByYear.map(([year, books]) => (
                <div key={year}>
                  <h3 className="text-lg font-bold text-primary mb-6 border-b border-primary/10 pb-2 sticky top-24 bg-background/95 backdrop-blur z-20 w-fit pr-4">
                    {year}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-x-4 gap-y-8">
                    {books.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              ))}
              
              {booksByYear.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                  No books found matching your criteria.
                </div>
              )}
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

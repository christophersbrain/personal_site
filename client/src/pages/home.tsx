import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import heroImage from "@assets/unnamed_1768325434712.jpg";
import { cn } from "@/lib/utils";
import { NOW_ITEMS, PREVIOUSLY_ITEMS, LORE_ITEMS, CLIENT_ITEMS, BOOKS } from "@/data";
import { Heart } from "lucide-react";
import { CryptoChartCard } from "@/components/crypto-chart";

// --- Components ---

const BookCard = ({ book }: { book: typeof BOOKS[0] }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(book.cover);
  const [retryCount, setRetryCount] = useState(0);

  // Generate a consistent color based on book title
  const bookColor = useMemo(() => {
    const colors = [
      "bg-red-700", "bg-orange-700", "bg-amber-700", "bg-yellow-700", 
      "bg-lime-700", "bg-green-700", "bg-emerald-700", "bg-teal-700", 
      "bg-cyan-700", "bg-sky-700", "bg-blue-700", "bg-indigo-700", 
      "bg-violet-700", "bg-purple-700", "bg-fuchsia-700", "bg-pink-700", 
      "bg-rose-700", "bg-slate-600", "bg-stone-600", "bg-zinc-600"
    ];
    let hash = 0;
    for (let i = 0; i < book.title.length; i++) {
      hash = book.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [book.title]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.naturalWidth === 1) {
      // Treat 1x1 images (tracking pixels/placeholders) as errors
      handleImageError();
    } else {
      setImageLoaded(true);
    }
  };

  const handleImageError = () => {
    // Try to recover using ISBN if we have it
    // We can extract ISBN from the original book.cover if it's an OpenLibrary URL
    let isbn = null;
    if (book.cover.includes("covers.openlibrary.org/b/isbn/")) {
       const match = book.cover.match(/isbn\/(\d+)/);
       if (match) isbn = match[1];
    }
    
    // Attempt to extract ISBN from Amazon URL if present (10-digit ASIN is often the ISBN-10)
    // Amazon URL pattern: https://m.media-amazon.com/images/I/[ID].jpg (This is an internal ID, not ISBN)
    // But sometimes people use https://images-na.ssl-images-amazon.com/images/P/[ISBN].01...
    if (!isbn && book.cover.includes("/images/P/")) {
       const match = book.cover.match(/\/images\/P\/([a-zA-Z0-9]+)\./);
       if (match) isbn = match[1];
    }
    
    if (isbn) {
       if (retryCount === 0) {
         // Try Amazon (standard ISBN endpoint)
         setImgSrc(`https://images-na.ssl-images-amazon.com/images/P/${isbn}.01.LZZZZZZZ.jpg`);
         setRetryCount(1);
         return;
       } 
       if (retryCount === 1) {
         // Try Google Books as last resort
         setImgSrc(`https://books.google.com/books?vid=ISBN${isbn}&printsec=frontcover&img=1`);
         setRetryCount(2);
         return;
       }
    }
    
    // If it's a generic "image not available" from Amazon, we want to force fallback
    // But we can't easily detect the content. 
    // However, if we've already tried Amazon and failed (or it was the original source and we are here),
    // and we don't have an ISBN to try elsewhere, we should just show the nice fallback.
    
    setImageError(true);
  };

  return (
  <Dialog>
    <DialogTrigger asChild>
      <div className="group relative cursor-pointer">
        <div className="aspect-[2/3] w-full overflow-hidden bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md border border-black/5 relative">
          
          {/* Skeleton Loader */}
          {!imageLoaded && !imageError && (
             <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <span className="text-muted-foreground/20 text-xs">Loading...</span>
             </div>
          )}

          {/* Fallback for Error */}
          {imageError ? (
            <div className={`absolute inset-0 ${bookColor} flex flex-col items-center justify-center p-4 text-center text-white/90`}>
               <div className="border-2 border-white/20 p-2 w-full h-full flex flex-col items-center justify-center">
                 <h3 className="text-xs font-bold uppercase tracking-widest line-clamp-4 leading-relaxed">{book.title}</h3>
                 <div className="w-8 h-px bg-white/40 my-3"></div>
                 <span className="text-[10px] uppercase tracking-widest line-clamp-2 opacity-80">{book.author}</span>
               </div>
            </div>
          ) : (
            <img 
              src={imgSrc} 
              alt={book.title} 
              className={cn(
                "h-full w-full object-cover transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Overlay gradient for text legibility if needed, but we rely on the cover art mostly */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
          
          {/* Heart icon if liked */}
          {book.liked && (
            <div className="absolute top-2 right-2 text-red-500 z-10">
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
           <div className="aspect-[2/3] w-2/3 shadow-2xl relative bg-muted">
              {imageError ? (
                <div className={`w-full h-full flex flex-col items-center justify-center p-8 text-center border border-black/5 ${bookColor} text-white`}>
                   <h3 className="text-xl font-bold uppercase tracking-wide mb-4">{book.title}</h3>
                   <div className="w-12 h-px bg-white/40 mb-4"></div>
                   <p className="text-sm font-medium tracking-widest uppercase opacity-90">{book.author}</p>
                </div>
              ) : (
                <img 
                  src={imgSrc} 
                  alt={book.title} 
                  className="h-full w-full object-cover"
                />
              )}
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
)};

export default function Home() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "bookshelf";
  });
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);
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

  const booksByDecade = useMemo(() => {
    const grouped = filteredBooks.reduce((acc, book) => {
      const year = parseInt(book.year);
      let decade = "Unknown";
      
      if (!isNaN(year)) {
        if (year < 1970) {
          decade = "0-1969";
        } else {
          decade = `${Math.floor(year / 10) * 10}s`;
        }
      }
      
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(book);
      return acc;
    }, {} as Record<string, typeof BOOKS>);

    // Sort decades descending
    return Object.entries(grouped).sort((a, b) => {
      if (a[0] === "Unknown") return 1;
      if (b[0] === "Unknown") return -1;
      if (a[0] === "0-1969") return 1;
      if (b[0] === "0-1969") return -1;
      return parseInt(b[0]) - parseInt(a[0]);
    });
  }, [filteredBooks]);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary/20">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm pt-8 pb-4 px-6 md:px-12 flex items-start justify-between">
        <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12">
           <h1 className="text-lg font-bold tracking-tight text-primary flex flex-col leading-none items-center">
             <span>chris</span>
             <span>white</span>
           </h1>
        </div>
        
      </header>

      <main className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        
        {/* --- Hero Image --- */}
        <section className="mb-20 mt-8">
          <div className="w-full overflow-hidden bg-muted">
             <img 
               src={heroImage} 
               alt="Desk Setup" 
               className="w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all duration-700"
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
                     <span>{item}</span> 
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

          </div>

          {/* Right Col: Clients */}
          <div id="clients">
             <h2 className="text-sm font-bold tracking-wider uppercase mb-0 text-primary border-b border-primary/20 pb-2">CLIENTS</h2>
             
             <div className="divide-y divide-primary/10 divide-dashed">
               {CLIENT_ITEMS.map((item, i) => (
                 <div key={i} className="group cursor-pointer py-4">
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
              {booksByDecade.map(([decade, books]) => (
                <div key={decade}>
                  <h3 className="text-lg font-bold text-primary mb-6 border-b border-primary/10 pb-2 sticky top-24 bg-background/95 backdrop-blur z-20 w-fit pr-4">
                    {decade}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-x-4 gap-y-8">
                    {books.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              ))}
              
              {booksByDecade.length === 0 && (
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

          </Tabs>
        </section>

        {/* --- Projects Section --- */}
        <section id="projects" className="mb-24">
          <h2 className="text-lg font-bold text-primary mb-8 border-b border-primary pb-4 uppercase tracking-wider">
            PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
              { id: "ethereum", symbol: "ETH", name: "Ethereum" },
              { id: "solana", symbol: "SOL", name: "Solana" },
              { id: "pepe", symbol: "PEPE", name: "Pepe" },
              { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
              { id: "uniswap", symbol: "UNI", name: "Uniswap" },
            ].map((coin) => (
              <CryptoChartCard 
                key={coin.id}
                id={coin.id}
                symbol={coin.symbol}
                name={coin.name}
              />
            ))}
          </div>
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

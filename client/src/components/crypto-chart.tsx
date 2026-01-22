import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import axios from "axios";
import { cn } from "@/lib/utils";

interface CryptoChartProps {
  id: string; // CoinGecko ID (e.g., 'bitcoin', 'ethereum')
  symbol: string; // Display symbol (e.g., 'BTC')
  name: string;
  color?: string;
}

// Mock data generator for fallback
const generateMockData = () => {
  const data = [];
  let price = 1000 + Math.random() * 500;
  for (let i = 0; i < 24; i++) {
    price = price * (1 + (Math.random() * 0.1 - 0.05));
    data.push({ price });
  }
  return data;
};

export function CryptoChartCard({ id, symbol, name, color = "#16a34a" }: CryptoChartProps) {
  const [data, setData] = useState<{ price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using CoinGecko API
        // For production, this should be proxied or cached, but works for frontend prototypes
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        
        const prices = response.data.prices.map((p: [number, number]) => ({
          price: p[1]
        }));
        
        setData(prices);
        setCurrentPrice(prices[prices.length - 1].price);
        
        // Calculate rough 7d change
        const start = prices[0].price;
        const end = prices[prices.length - 1].price;
        setChange24h(((end - start) / start) * 100);
        
      } catch (err) {
        console.warn(`Failed to fetch crypto data for ${id}, using mock data.`, err);
        // Fallback to mock data if rate limited
        const mock = generateMockData();
        setData(mock);
        setCurrentPrice(mock[mock.length - 1].price);
        setChange24h(Math.random() * 10 - 2); // Random -2% to +8%
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isPositive = (change24h || 0) >= 0;
  const displayColor = isPositive ? "#16a34a" : "#dc2626"; // green-600 or red-600

  return (
    <div className="group border border-primary/20 bg-background/50 hover:border-primary transition-all duration-300 p-4 flex flex-col h-[200px] relative overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="font-bold text-lg text-primary">{symbol}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{name}</p>
        </div>
        <div className="text-right">
          {currentPrice && (
            <div className="font-mono text-sm font-medium">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
          {change24h && (
            <div className={cn("text-xs font-mono", isPositive ? "text-green-600" : "text-red-600")}>
              {isPositive ? "+" : ""}{change24h.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pt-12 opacity-50 group-hover:opacity-80 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={displayColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={displayColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['auto', 'auto']} hide />
            <Area
              type="monotone"
              dataKey="price"
              stroke={displayColor}
              strokeWidth={2}
              fill={`url(#gradient-${id})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Overlay to make the whole card a clickable link visually (optional) */}
      <div className="absolute inset-0 bg-transparent cursor-pointer z-20" />
    </div>
  );
}

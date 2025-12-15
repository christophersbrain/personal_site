import fs from 'fs';

const tsv = fs.readFileSync('attached_assets/book_covers_urls_(1)_1765837199767.tsv', 'utf-8');
const lines = tsv.trim().split('\n').slice(1); // Skip header

const books = lines.map((line, index) => {
  const parts = line.split('\t');
  // Handle cases where there might be extra tabs or missing columns, though the file looks clean
  const title = parts[0] || "";
  const author = parts[1] || "";
  const year = parts[2] || "";
  const isbn = parts[3] || "";
  const cover = parts[4] || "";
  
  return {
    id: index + 1,
    title: title.trim(),
    author: author.trim(),
    year: year.trim(),
    cover: cover.trim(),
    liked: false
  };
});

const dataContent = `export const NOW_ITEMS = [
  "thinking deeply about social and storytelling at Base",
  "building Noun, a coffee and wine bar in LA"
];

export const PREVIOUSLY_ITEMS = [
  "contributed to membership models of FWB",
  "fostered partnerships with Gitcoin",
  "pioneered a better decentralized web w/ Aave",
  "cultivated community for Unsplash and Creative Market"
];

export const LORE_ITEMS = [
  "picked up 50k followers on tiktok and diverted the crowd into watching me assemble a coffee and wine bar in LA",
  "passed prop 450 in NounsDAO, 78 votes for and 32 against",
  "posted about HyperCard so much that I accidentally got Kevin Kelly to upload the Whole Earth Catalog to archive.org",
  "shared some bad outer space news about a falling rocket (10M views)",
  "tweeted a sushi plate video that Patton Oswalt called \\"simple and perfect\\" (26M views,)",
  "made a series of YouTube videos about Roam Research"
];

export const CLIENT_ITEMS = [
  { title: "Fractional CFO", source: "Polymarket", year: "2024 - 2025" },
  { title: "Fractional CFO", source: "Ambush", year: "2023 - Present" },
  { title: "Ambassador", source: "Pear Protocol", year: "2025 - Present" },
  { title: "Director, Strategic Revenue", source: "Flipside Crypto", year: "2024" },
  { title: "Fractional CFO", source: "Coram AI", year: "2023 - 2024" },
  { title: "Advisor", source: "Everybody Eats", year: "2023 - Present" },
  { title: "Fractional CFO", source: "Brighter Electrical", year: "2022 - 2023" },
  { title: "Fractional CFO", source: "Black Court", year: "2022 - 2023" },
  { title: "Head of Finance and Operations", source: "Jet Protocol", year: "2020 - 2022" }
];

export const BOOKS = ${JSON.stringify(books, null, 2)};
`;

fs.writeFileSync('client/src/data.ts', dataContent);
console.log('Updated client/src/data.ts');

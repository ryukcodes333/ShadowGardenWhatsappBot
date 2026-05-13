/**
 * Shoob.gg Card Scraper
 * =====================
 * Scrapes all cards from shoob.gg and upserts them into Supabase (sg_cards table).
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run scrape-shoob
 *   pnpm --filter @workspace/scripts run scrape-shoob -- --tier T1
 *   pnpm --filter @workspace/scripts run scrape-shoob -- --dry-run
 *
 * Environment variables required:
 *   SUPABASE_URL          — your Supabase project URL
 *   SUPABASE_SERVICE_KEY  — Supabase service role key (for write access)
 *   SHOOB_TOKEN           — (optional) your shoob.gg bot token for authenticated API access
 *                           Get this by logging into shoob.gg and copying the Authorization
 *                           header from any authenticated request in DevTools.
 *
 * How it works:
 *   1. Tries the authenticated shoob.gg API (api.shoob.gg/api/cards) if SHOOB_TOKEN is set
 *   2. Falls back to scraping card pages by iterating IDs & the public cardr endpoint
 *   3. Maps shoob.gg tiers (T1-T6) to our rarities (common→god)
 *   4. Stores card image URLs from cdn.shoob.gg (GIFs included)
 *   5. Upserts into sg_cards in batches of 500
 */

import { createClient } from "@supabase/supabase-js";

// ── Config ────────────────────────────────────────────────────────────────────

const SUPABASE_URL        = process.env.SUPABASE_URL        || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "";
const SHOOB_TOKEN         = process.env.SHOOB_TOKEN         || "";
const DRY_RUN             = process.argv.includes("--dry-run");
const TIER_FILTER         = (() => {
  const idx = process.argv.indexOf("--tier");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

const SHOOB_API  = "https://api.shoob.gg";
const SHOOB_CDN  = "https://cdn.shoob.gg";
const PAGE_SIZE  = 32;
const BATCH_SIZE = 500;
const RATE_DELAY = 350; // ms between requests to be polite

// Shoob tier → our rarity
const TIER_RARITY: Record<string, string> = {
  T1: "common",
  T2: "uncommon",
  T3: "rare",
  T4: "epic",
  T5: "legendary",
  T6: "god",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface ShoobCard {
  id: string | number;
  name: string;
  tier?: string;
  series?: string;
  source?: string;
  image?: string;
  imageUrl?: string;
  gif?: boolean;
  description?: string;
  [key: string]: unknown;
}

interface SgCard {
  id: string;
  name: string;
  rarity: string;
  image_url: string;
  anime: string | null;
  description: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildImageUrl(card: ShoobCard): string {
  if (card.image) return card.image.startsWith("http") ? card.image : `${SHOOB_CDN}/images/cards/${card.image}`;
  if (card.imageUrl) return card.imageUrl.startsWith("http") ? card.imageUrl : `${SHOOB_CDN}/images/cards/${card.imageUrl}`;
  // Derive from card name — shoob uses slug-style names
  const slug = String(card.id || card.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${SHOOB_CDN}/images/cards/${slug}.gif`;
}

function mapCard(raw: ShoobCard): SgCard {
  const tier = raw.tier || "T1";
  const rarity = TIER_RARITY[tier] || "common";
  const anime = raw.series || raw.source || null;
  return {
    id: `shoob_${raw.id || raw.name}`,
    name: String(raw.name || "Unknown"),
    rarity,
    image_url: buildImageUrl(raw),
    anime,
    description: raw.description ? String(raw.description) : null,
  };
}

// ── Authenticated API scraper ─────────────────────────────────────────────────

async function fetchAuthenticatedPage(tier: string, page: number): Promise<ShoobCard[]> {
  const url = `${SHOOB_API}/api/cards?page=${page}&limit=${PAGE_SIZE}&tier=${tier}`;
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "User-Agent": "ShadowGardenScraper/1.0",
  };
  if (SHOOB_TOKEN) headers["Authorization"] = `Bearer ${SHOOB_TOKEN}`;

  const res = await fetch(url, { headers });
  if (res.status === 401) throw new Error("SHOOB_TOKEN required for authenticated API");
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);

  const data = await res.json() as any;
  // Handle both array and paginated response
  if (Array.isArray(data)) return data as ShoobCard[];
  if (Array.isArray(data.cards)) return data.cards as ShoobCard[];
  if (Array.isArray(data.data))  return data.data as ShoobCard[];
  return [];
}

async function scrapeWithAuth(): Promise<SgCard[]> {
  const tiers = TIER_FILTER ? [TIER_FILTER] : Object.keys(TIER_RARITY);
  const allCards: SgCard[] = [];

  for (const tier of tiers) {
    console.log(`\n[AUTH] Scraping tier ${tier} (${TIER_RARITY[tier]})...`);
    let page = 1;
    let fetched = 0;

    while (true) {
      try {
        const cards = await fetchAuthenticatedPage(tier, page);
        if (cards.length === 0) break;

        for (const c of cards) allCards.push(mapCard({ ...c, tier }));
        fetched += cards.length;
        process.stdout.write(`\r  Page ${page}: +${cards.length} cards (total this tier: ${fetched})`);

        if (cards.length < PAGE_SIZE) break;
        page++;
        await sleep(RATE_DELAY);
      } catch (err) {
        console.error(`\n  Error on tier ${tier} page ${page}:`, err);
        break;
      }
    }
    console.log(`\n  ✓ Tier ${tier}: ${fetched} cards`);
  }

  return allCards;
}

// ── Public CDN scraper (fallback) ─────────────────────────────────────────────

/**
 * Fallback: iterate through cardr IDs. Shoob uses numeric IDs.
 * We probe up to MAX_ID stopping after too many consecutive 404s.
 */
async function scrapePublicFallback(): Promise<SgCard[]> {
  console.log("\n[PUBLIC] No SHOOB_TOKEN — using public card catalog fallback.");
  console.log("  This method yields card metadata from the shoob.gg public site API.");

  const allCards: SgCard[] = [];
  const MAX_ID = 50_000;
  const CONSECUTIVE_MISS_THRESHOLD = 200;
  let consecutiveMisses = 0;

  for (let id = 1; id <= MAX_ID; id++) {
    if (consecutiveMisses >= CONSECUTIVE_MISS_THRESHOLD) {
      console.log(`\n  Stopping after ${CONSECUTIVE_MISS_THRESHOLD} consecutive misses at ID ${id}`);
      break;
    }

    try {
      const res = await fetch(`${SHOOB_API}/site/api/cardr/${id}`, {
        headers: { Accept: "application/json", "User-Agent": "ShadowGardenScraper/1.0" },
        redirect: "follow",
      });

      if (res.status === 404) { consecutiveMisses++; continue; }
      if (res.status === 400) { consecutiveMisses++; continue; }
      if (!res.ok) { consecutiveMisses++; continue; }

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("json")) { consecutiveMisses++; continue; }

      const data = await res.json() as any;
      const cardData: ShoobCard = data.card || data;
      if (!cardData || !cardData.name) { consecutiveMisses++; continue; }

      consecutiveMisses = 0;
      allCards.push(mapCard({ ...cardData, id }));

      if (id % 100 === 0) {
        process.stdout.write(`\r  Probed IDs 1-${id}, found ${allCards.length} cards`);
      }
      await sleep(RATE_DELAY);
    } catch {
      consecutiveMisses++;
    }
  }

  console.log(`\n  ✓ Public scrape complete: ${allCards.length} cards found`);
  return allCards;
}

// ── Upsert to Supabase ────────────────────────────────────────────────────────

async function upsertCards(supabase: ReturnType<typeof createClient>, cards: SgCard[]) {
  if (DRY_RUN) {
    console.log(`\n[DRY RUN] Would upsert ${cards.length} cards. First 5:`);
    for (const c of cards.slice(0, 5)) console.log(" ", JSON.stringify(c));
    return;
  }

  console.log(`\n[SUPABASE] Upserting ${cards.length} cards in batches of ${BATCH_SIZE}...`);
  let upserted = 0;
  let errors = 0;

  for (let i = 0; i < cards.length; i += BATCH_SIZE) {
    const batch = cards.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("sg_cards")
      .upsert(batch, { onConflict: "id", ignoreDuplicates: false });

    if (error) {
      console.error(`  Batch ${i / BATCH_SIZE + 1} error:`, error.message);
      errors += batch.length;
    } else {
      upserted += batch.length;
      process.stdout.write(`\r  Upserted: ${upserted}/${cards.length}`);
    }
    await sleep(100);
  }

  console.log(`\n\n✅ Done! Upserted: ${upserted}, Errors: ${errors}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🃏 Shadow Garden — Shoob.gg Card Scraper");
  console.log("=========================================");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`Token: ${SHOOB_TOKEN ? "✓ provided" : "✗ not set (public fallback)"}`);
  console.log(`Tier filter: ${TIER_FILTER || "all tiers"}`);
  console.log(`Target DB: ${SUPABASE_URL || "(not set)"}\n`);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    if (!DRY_RUN) {
      console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_KEY are required (or use --dry-run)");
      process.exit(1);
    }
  }

  const supabase = createClient(SUPABASE_URL || "http://localhost", SUPABASE_SERVICE_KEY || "anon");

  let cards: SgCard[];

  if (SHOOB_TOKEN) {
    cards = await scrapeWithAuth();
  } else {
    cards = await scrapePublicFallback();
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique = cards.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  console.log(`\n📊 Total unique cards found: ${unique.length}`);

  if (unique.length > 0) {
    await upsertCards(supabase, unique);
  } else {
    console.log("⚠️  No cards found. If you have a shoob.gg account, set SHOOB_TOKEN and try again.");
    console.log("   To get your token: login at shoob.gg, open DevTools → Network → any /api/ request → copy Authorization header value.");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

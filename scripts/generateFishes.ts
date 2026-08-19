import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ITEMS_LUA_PATH = path.join(__dirname, '../raw_data/items.lua');
const ITEM_DESCRIPTIONS_LUA_PATH = path.join(__dirname, '../raw_data/item_descriptions.lua');
const WIKI_DATA_PATH = path.join(__dirname, '../raw_data/fish_skill_wiki.data');
const OUTPUT_PATH = path.join(__dirname, '../src/data/fishes.ts');

type FishEntry = {
  id: number;
  ja: string;
  en: string;
  description: string;
  maxSkill: number;
  sizeType: 'small' | 'large';
  harakiri: boolean;
  ebisu: boolean;
  taikobou: boolean;
  zoneIds: number[];
  notes?: string;
};

type WikiFishData = {
  name: string;
  maxSkill: number;
  baits: string[];
  notes: string;
  harakiri: boolean;
  ebisu: boolean;
};

// 1. Wikiデータのパース関数
function parseWikiData(filePath: string): WikiFishData[] {
  const wikiList: WikiFishData[] = [];
  if (!fs.existsSync(filePath)) {
    console.warn(`Wiki data file not found: ${filePath}`);
    return wikiList;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }

  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim() || line.startsWith('スキル')) continue;

    const parts = line.split('\t');
    if (parts.length < 2) continue;

    const rawSkill = parts[0].trim();
    const name = parts[1].trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
    const baitStr = parts[2] ? parts[2].trim() : '';
    const notes = parts[3] ? parts[3].trim() : '';

    if (!name) continue;

    let maxSkill = 0;
    const skillMatch = rawSkill.match(/\d+/g);
    if (skillMatch) {
      maxSkill = Math.max(...skillMatch.map(Number));
    }

    const harakiri = notes.includes('ハラキリ');
    const ebisu = notes.includes('恵比寿') || notes.includes('真恵比寿');
    const baits = baitStr ? baitStr.split(/[、\n]/).map((b) => b.trim()).filter(Boolean) : [];

    wikiList.push({
      name,
      maxSkill,
      baits,
      notes,
      harakiri,
      ebisu,
    });
  }

  return wikiList;
}

// 2. items.lua のパース関数
function parseItemsLua(filePath: string): Map<string, { id: number; en: string }> {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return new Map();
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const result = new Map<string, { id: number; en: string }>();

  const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(content)) !== null) {
    const id = Number(match[1]);
    const body = match[2];

    const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
    const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

    if (jaMatch) {
      const jaName = jaMatch[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      const enName = enMatch ? enMatch[1].trim() : '';
      result.set(jaName, { id, en: enName });
    }
  }

  return result;
}

// 3. item_descriptions.lua のパース関数
function parseItemDescriptionsLua(filePath: string): Record<number, string> {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, 'utf-8');
  const result: Record<number, string> = {};

  const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(content)) !== null) {
    const id = Number(match[1]);
    const body = match[2];

    const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
    if (jaMatch) {
      result[id] = jaMatch[1];
    }
  }

  return result;
}

function main() {
  console.log('Generating fishes.ts from Wiki Data and Windower Resources...');

  const wikiList = parseWikiData(WIKI_DATA_PATH);
  const itemsMap = parseItemsLua(ITEMS_LUA_PATH);
  const itemDescriptions = parseItemDescriptionsLua(ITEM_DESCRIPTIONS_LUA_PATH);

  console.log(`Loaded ${wikiList.length} wiki fish entries.`);
  console.log(`Loaded ${itemsMap.size} items from items.lua.`);

  const fishList: FishEntry[] = [];

  for (const wikiData of wikiList) {
    const item = itemsMap.get(wikiData.name);
    if (!item) {
      console.warn(`Item not found in items.lua: ${wikiData.name}`);
      continue;
    }

    const description = itemDescriptions[item.id] || '';

    fishList.push({
      id: item.id,
      ja: wikiData.name,
      en: item.en,
      description,
      maxSkill: wikiData.maxSkill,
      sizeType: description.includes('大型') ? 'large' : 'small',
      harakiri: wikiData.harakiri,
      ebisu: wikiData.ebisu,
      taikobou: false,
      zoneIds: [],
      notes: wikiData.notes || undefined,
    });
  }

  const fileContent = `import type { FishMaster } from '@/types/fish';

export const FISHES: FishMaster[] = ${JSON.stringify(fishList, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
  console.log(`Successfully generated ${OUTPUT_PATH} with ${fishList.length} fish entries!`);
}

main();
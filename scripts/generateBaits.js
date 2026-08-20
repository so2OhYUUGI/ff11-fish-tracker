/**
 * ============================================================================
 * [FilePath] scripts/generateBaits.ts
 * [Role] items.lua および item_descriptions.lua から baits.ts を自動生成するビルドスクリプト
 *
 * [概要]
 * - item_descriptions.lua から「釣り餌」「擬餌」が含まれるテキストを抽出
 * - items.lua から対象アイテムの名称（和名・英名）を取得して紐付け
 * - 型定義（BaitMaster）に準拠した baits.ts を自動生成
 * ============================================================================
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ITEMS_LUA_PATH = path.join(__dirname, '../raw_data/items.lua');
const ITEM_DESCRIPTIONS_LUA_PATH = path.join(__dirname, '../raw_data/item_descriptions.lua');
const OUTPUT_PATH = path.join(__dirname, '../src/data/baits.ts');
// 1. item_descriptions.lua から「釣り餌」「擬餌」が含まれるアイテムIDを抽出
function parseBaitDescriptionIds(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return new Map();
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const baitDescriptions = new Map();
    const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
        const id = Number(match[1]);
        const body = match[2];
        const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
        if (jaMatch) {
            const description = jaMatch[1];
            if (description.includes('釣り餌') || description.includes('擬餌')) {
                baitDescriptions.set(id, description);
            }
        }
    }
    return baitDescriptions;
}
// 2. items.lua から対象IDのアイテム（名前・英語名）を取得
function parseBaitsLua(itemsPath, baitDescriptions) {
    if (!fs.existsSync(itemsPath)) {
        console.warn(`File not found: ${itemsPath}`);
        return [];
    }
    const content = fs.readFileSync(itemsPath, 'utf-8');
    const baits = [];
    const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
        const id = Number(match[1]);
        if (baitDescriptions.has(id)) {
            const body = match[2];
            const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
            const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
            baits.push({
                id,
                ja: jaMatch ? jaMatch[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : '',
                en: enMatch ? enMatch[1].trim() : '',
                description: baitDescriptions.get(id) || '',
            });
        }
    }
    return baits.sort((a, b) => a.id - b.id);
}
function main() {
    console.log('Generating baits.ts from items.lua and item_descriptions.lua...');
    const baitDescriptions = parseBaitDescriptionIds(ITEM_DESCRIPTIONS_LUA_PATH);
    console.log(`Found ${baitDescriptions.size} bait description entries.`);
    const baitList = parseBaitsLua(ITEMS_LUA_PATH, baitDescriptions);
    const fileContent = `/**
 * ============================================================================
 * [FilePath] src/data/baits.ts
 * [Role] 全餌マスターデータ（自動生成ファイル）
 * ============================================================================
 */

import type { BaitMaster } from '@/types/fish';

export const BAITS: BaitMaster[] = ${JSON.stringify(baitList, null, 2)};
`;
    fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
    console.log(`Successfully generated ${OUTPUT_PATH} with ${baitList.length} bait entries!`);
}
main();

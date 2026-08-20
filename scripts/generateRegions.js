/**
 * ============================================================================
 * [FilePath] scripts/generateRegions.ts
 * [Role] regions.lua から regions.ts を自動生成するビルドスクリプト
 *
 * [概要]
 * - Windower Resources の `regions.lua` をパースし、型定義に準拠した `regions.ts` を出力します。
 * ============================================================================
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGIONS_LUA_PATH = path.join(__dirname, '../raw_data/regions.lua');
const OUTPUT_PATH = path.join(__dirname, '../src/data/regions.ts');
// regions.lua のパース関数
function parseRegionsLua(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const list = [];
    const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
        const id = Number(match[1]);
        const body = match[2];
        const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
        const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
        list.push({
            id,
            ja: jaMatch ? jaMatch[1] : `Region_${id}`,
            en: enMatch ? enMatch[1] : `Region_${id}`,
        });
    }
    return list.sort((a, b) => a.id - b.id);
}
function main() {
    console.log('Generating regions.ts from regions.lua...');
    const regionList = parseRegionsLua(REGIONS_LUA_PATH);
    const fileContent = `/**
 * ============================================================================
 * [FilePath] src/data/regions.ts
 * [Role] 全リージョンマスターデータ（自動生成ファイル）
 * ============================================================================
 */

import type { RegionMaster } from '@/types/fish';

export const REGIONS: RegionMaster[] = ${JSON.stringify(regionList, null, 2)};
`;
    fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
    console.log(`Successfully generated ${OUTPUT_PATH} with ${regionList.length} region entries!`);
}
main();

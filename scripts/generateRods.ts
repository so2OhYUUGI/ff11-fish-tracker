/**
 * ============================================================================
 * [FilePath] scripts/generateRods.ts
 * [Role] items.lua および item_descriptions.lua から rods.ts を自動生成するビルドスクリプト
 * 
 * [概要]
 * - items.lua をパースし、`range_type="Fishing Rod"` が指定された釣り竿アイテムを抽出
 * - item_descriptions.lua から対応するアイテムIDの日本語説明文（ja）を取得
 * - 抽出した釣り竿のID、和名、英名、説明文（description）を取得
 * - 型定義（FishingRodMaster）に準拠した rods.ts を自動生成
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ITEMS_LUA_PATH = path.join(__dirname, '../raw_data/items.lua');
const DESCRIPTIONS_LUA_PATH = path.join(__dirname, '../raw_data/item_descriptions.lua');
const OUTPUT_PATH = path.join(__dirname, '../src/data/rods.ts');

type FishingRodEntry = {
	id: number;
	ja: string;
	en: string;
	description?: string;
};

// item_descriptions.lua から [id] = { ja = "説明文" } のマッピングを作成する関数
function parseItemDescriptionsLua(filePath: string): Map<number, string> {
	const descriptions = new Map<number, string>();

	if (!fs.existsSync(filePath)) {
		console.warn(`File not found: ${filePath}`);
		return descriptions;
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
		if (jaMatch) {
			const cleanDesc = jaMatch[1]
				.replace(/[\u200B-\u200D\uFEFF]/g, '')
				.trim();
			descriptions.set(id, cleanDesc);
		}
	}

	return descriptions;
}

// items.lua から range_type="Fishing Rod" のアイテムを抽出する関数
function parseFishingRodsLua(itemsFilePath: string, descMap: Map<number, string>): FishingRodEntry[] {
	if (!fs.existsSync(itemsFilePath)) {
		console.warn(`File not found: ${itemsFilePath}`);
		return [];
	}

	const content = fs.readFileSync(itemsFilePath, 'utf-8');
	const rods: FishingRodEntry[] = [];

	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		if (/range_type\s*=\s*"Fishing Rod"/.test(body)) {
			const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
			const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

			const rod: FishingRodEntry = {
				id,
				ja: jaMatch ? jaMatch[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : '',
				en: enMatch ? enMatch[1].trim() : '',
			};

			const description = descMap.get(id);
			if (description) {
				rod.description = description;
			}

			rods.push(rod);
		}
	}

	return rods.sort((a, b) => a.id - b.id);
}

function main() {
	console.log('Generating rods.ts from items.lua and item_descriptions.lua...');

	const descMap = parseItemDescriptionsLua(DESCRIPTIONS_LUA_PATH);
	const rodList = parseFishingRodsLua(ITEMS_LUA_PATH, descMap);

	const fileContent = `/**
 * ============================================================================
 * [FilePath] src/data/rods.ts
 * [Role] 全釣竿マスターデータ（自動生成ファイル）
 * ============================================================================
 */

import type { FishingRodMaster } from '@/types/fish';

export const RODS: FishingRodMaster[] = ${JSON.stringify(rodList, null, 2)};
`;

	fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
	console.log(`Successfully generated ${OUTPUT_PATH} with ${rodList.length} rod entries!`);
}

main();
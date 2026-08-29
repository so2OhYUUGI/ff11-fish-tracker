/**
 * ============================================================================
 * [FilePath] scripts/generateTrusts.ts
 * [Role] spells.lua、item.lua (または items.lua)、item_descriptions.lua、trust.csv から
 *        統合されたフェイス（Trust）マスターデータを自動生成するビルドスクリプト
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPELLS_LUA_PATH = path.join(__dirname, '../raw_data/spells.lua');
const ITEM_DESC_LUA_PATH = path.join(__dirname, '../raw_data/item_descriptions.lua');
const TRUST_CSV_PATH = path.join(__dirname, '../raw_data/trust.csv');
const OUTPUT_PATH = path.join(__dirname, '../src/data/trusts.ts');

const ITEMS_LUA_PATH = fs.existsSync(path.join(__dirname, '../raw_data/item.lua'))
	? path.join(__dirname, '../raw_data/item.lua')
	: path.join(__dirname, '../raw_data/items.lua');

interface TrustCsvRow {
	flag: boolean;
	name: string;
	job: string;
	combatType: string;
	isLimited: boolean;
	acquireInfo: string;
}

interface ItemInfo {
	id: number;
	en: string;
	ja: string;
}

function cleanString(str: string): string {
	if (!str) return '';
	return str
		.replace(/\\"/g, '"')
		.replace(/\\'/g, "'")
		.replace(/\\n/g, '\n')
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.trim();
}

function parseTrustCsv(filePath: string): Map<string, TrustCsvRow> {
	const map = new Map<string, TrustCsvRow>();
	if (!fs.existsSync(filePath)) {
		console.warn(`CSV file not found: ${filePath}`);
		return map;
	}

	let content = fs.readFileSync(filePath, 'utf-8');
	if (content.charCodeAt(0) === 0xfeff) {
		content = content.slice(1);
	}

	const lines = content.split(/\r?\n/);

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		const cols = line.split('\t');
		if (cols.length >= 2) {
			const name = cleanString(cols[1]);
			map.set(name, {
				flag: cols[0] ? cols[0].trim() === 'TRUE' : false,
				name,
				job: cols[2] ? cols[2].trim() : '',
				combatType: cols[3] ? cols[3].trim() : '',
				isLimited: cols[4] ? cols[4].trim() === 'TRUE' : false,
				acquireInfo: cols[5] ? cols[5].trim() : '',
			});
		}
	}

	return map;
}

function parseItemsLua(filePath: string): Map<string, ItemInfo> {
	const map = new Map<string, ItemInfo>();
	if (!fs.existsSync(filePath)) {
		console.warn(`Item lua not found: ${filePath}`);
		return map;
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	// アイテム単位のブロック取得（IDとそのブロック本体）
	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\}(?=\s*(?:,\s*\[|\s*\}$|\s*$))/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
		const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

		if (jaMatch) {
			const jaName = cleanString(jaMatch[1]);
			const enName = enMatch ? cleanString(enMatch[1]) : '';
			map.set(jaName, { id, en: enName, ja: jaName });
		}
	}

	return map;
}

function parseItemDescriptionsLua(filePath: string): Map<number, { jp: string; en: string }> {
	const map = new Map<number, { jp: string; en: string }>();
	if (!fs.existsSync(filePath)) {
		console.warn(`Item descriptions lua not found: ${filePath}`);
		return map;
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\}(?=\s*(?:,\s*\[|\s*\}$|\s*$))/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
		const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

		const jp = jaMatch ? cleanString(jaMatch[1]) : '';
		const en = enMatch ? cleanString(enMatch[1]) : '';

		map.set(id, { jp, en });
	}

	return map;
}

function parseSpellsLua(filePath: string) {
	if (!fs.existsSync(filePath)) {
		console.warn(`File not found: ${filePath}`);
		return [];
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	const trustList = [];
	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\}(?=\s*(?:,\s*\[|\s*\}$|\s*$))/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		// type="Trust" または type='Trust'
		const typeMatch = body.match(/\btype\s*=\s*["']?Trust["']?/i);
		if (!typeMatch) {
			continue;
		}

		const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
		const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
		const iconIdMatch = body.match(/\bicon_id\s*=\s*(-?\d+)/);
		const partyNameMatch = body.match(/\bparty_name\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bparty_name\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

		const en = enMatch ? cleanString(enMatch[1]) : '';
		const ja = jaMatch ? cleanString(jaMatch[1]) : '';
		const icon_id = iconIdMatch ? Number(iconIdMatch[1]) : 0;
		const party_name = partyNameMatch ? cleanString(partyNameMatch[1]) : '';

		trustList.push({
			id,
			en,
			ja,
			icon_id,
			party_name,
		});
	}

	return trustList;
}

function main() {
	console.log('Generating trusts.ts from spells.lua, items.lua, item_descriptions.lua, and trust.csv...');

	const trustCsvMap = parseTrustCsv(TRUST_CSV_PATH);
	const itemsMap = parseItemsLua(ITEMS_LUA_PATH);
	const itemDescMap = parseItemDescriptionsLua(ITEM_DESC_LUA_PATH);
	const spellsList = parseSpellsLua(SPELLS_LUA_PATH);

	console.log(`Loaded ${spellsList.length} spells from spells.lua.`);
	console.log(`Loaded ${itemsMap.size} items from items.lua.`);
	console.log(`Loaded ${itemDescMap.size} item descriptions.`);
	console.log(`Loaded ${trustCsvMap.size} rows from trust.csv.`);

	const trustList = spellsList.map((spell) => {
		const csvData = trustCsvMap.get(spell.ja);

		const job = csvData ? csvData.job : '';
		const combatType = csvData ? csvData.combatType : '';
		const isLimited = csvData ? csvData.isLimited : false;
		const acquireInfo = csvData ? csvData.acquireInfo : '';

		const itemJaName = `盟-${spell.ja}`;
		const itemInfo = itemsMap.get(itemJaName);

		const itemEn = itemInfo ? itemInfo.en : '';
		const itemId = itemInfo ? itemInfo.id : 0;

		const desc = itemDescMap.get(itemId) || { jp: '', en: '' };

		return {
			id: spell.id,
			en: spell.en,
			ja: spell.ja,
			icon_id: spell.icon_id,
			party_name: spell.party_name,
			job,
			combatType,
			isLimited,
			acquireInfo,
			item: {
				id: itemId,
				en: itemEn,
				ja: itemJaName,
				desc_jp: desc.jp,
				desc_en: desc.en,
			},
		};
	});

	const fileContent = `/**
 * ============================================================================
 * [FilePath] src/data/trusts.ts
 * [Role] フェイスマスターデータ（自動生成ファイル）
 * ============================================================================
 */

export interface TrustItemMaster {
    id: number;
    en: string;
    ja: string;
    desc_jp: string;
    desc_en: string;
}

export interface TrustMaster {
    id: number;
    en: string;
    ja: string;
    icon_id: number;
    party_name: string;
    job: string;
    combatType: string;
    isLimited: boolean;
    acquireInfo: string;
    item: TrustItemMaster;
}

export const TRUSTS: TrustMaster[] = ${JSON.stringify(trustList, null, 2)};
`;

	fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
	console.log(`Successfully generated ${OUTPUT_PATH} with ${trustList.length} trust entries!`);
}

main();
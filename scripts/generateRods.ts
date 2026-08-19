import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ITEMS_LUA_PATH = path.join(__dirname, '../raw_data/items.lua');
const OUTPUT_PATH = path.join(__dirname, '../src/data/rods.ts');

type FishingRodEntry = {
	id: number;
	ja: string;
	en: string;
};

// items.lua から range_type="Fishing Rod" のアイテムを抽出する関数
function parseFishingRodsLua(filePath: string): FishingRodEntry[] {
	if (!fs.existsSync(filePath)) {
		console.warn(`File not found: ${filePath}`);
		return [];
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	const rods: FishingRodEntry[] = [];

	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		if (/range_type\s*=\s*"Fishing Rod"/.test(body)) {
			const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
			const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

			rods.push({
				id,
				ja: jaMatch ? jaMatch[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : '',
				en: enMatch ? enMatch[1].trim() : '',
			});
		}
	}

	return rods.sort((a, b) => a.id - b.id);
}

function main() {
	console.log('Generating rods.ts from items.lua...');

	const rodList = parseFishingRodsLua(ITEMS_LUA_PATH);

	const fileContent = `import type { FishingRodMaster } from '@/types/fish';

export const RODS: FishingRodMaster[] = ${JSON.stringify(rodList, null, 2)};
`;

	fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
	console.log(`Successfully generated ${OUTPUT_PATH} with ${rodList.length} rod entries!`);
}

main();
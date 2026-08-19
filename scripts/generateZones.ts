import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ZONES_LUA_PATH = path.join(__dirname, '../raw_data/zones.lua');
const OUTPUT_PATH = path.join(__dirname, '../src/data/zones.ts');

type ZoneEntry = {
	id: number;
	ja: string;
	en: string;
};

// zones.lua のパース関数
function parseZonesLua(filePath: string): ZoneEntry[] {
	if (!fs.existsSync(filePath)) {
		console.warn(`File not found: ${filePath}`);
		return [];
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	const list: ZoneEntry[] = [];

	const entryRegex = /\[(\d+)\]\s*=\s*\{([\s\S]*?)\},?/g;
	let match: RegExpExecArray | null;

	while ((match = entryRegex.exec(content)) !== null) {
		const id = Number(match[1]);
		const body = match[2];

		const jaMatch = body.match(/\bja\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\bja\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);
		const enMatch = body.match(/\ben\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || body.match(/\ben\s*=\s*'([^'\\]*(?:\\.[^'\\]*)*)'/);

		list.push({
			id,
			ja: jaMatch ? jaMatch[1] : `Zone_${id}`,
			en: enMatch ? enMatch[1] : `Zone_${id}`,
		});
	}

	return list.sort((a, b) => a.id - b.id);
}

function main() {
	console.log('Generating zones.ts from zones.lua...');

	const zoneList = parseZonesLua(ZONES_LUA_PATH);

	const fileContent = `import type { ZoneMaster } from '@/types/fish';

export const ZONES: ZoneMaster[] = ${JSON.stringify(zoneList, null, 2)};
`;

	fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf-8');
	console.log(`Successfully generated ${OUTPUT_PATH} with ${zoneList.length} zone entries!`);
}

main();
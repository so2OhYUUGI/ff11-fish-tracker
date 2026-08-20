/**
 * ============================================================================
 * [FilePath] vite/vite-plugin-save-fish-data.ts
 * [Role] 魚関連マスターデータおよび中間リレーション保存用の Vite プラグイン
 * ============================================================================
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export function saveFishDataPlugin(): Plugin {
	return {
		name: 'save-fish-data-plugin',
		configureServer(server) {
			server.middlewares.use('/api/save-fish-data', async (req, res) => {
				if (req.method !== 'POST') {
					res.statusCode = 404;
					res.end();
					return;
				}

				let body = '';
				req.on('data', (chunk) => (body += chunk));
				req.on('end', () => {
					try {
						const { fishList, zoneList, baitList, fishBaitRelations, fishRodRelations } = JSON.parse(body);

						// 1. 中間リレーションデータの抽出 (FishLocation)
						const locations: Array<{ id: string; fishId: number; zoneId: number }> = [];
						const cleanFishList = fishList.map((fish: any) => {
							// 魚マスターから一時的なUI用ID配列や過去の旧プロパティを除去
							const {
								zoneIds,
								impossibleRodIds,
								brokenRodIds,
								brokenLineRodIds,
								tooSmallRodIds,
								...restFish
							} = fish;

							if (Array.isArray(zoneIds)) {
								zoneIds.forEach((zoneId: number) => {
									locations.push({
										id: `${fish.id}-${zoneId}`,
										fishId: fish.id,
										zoneId,
									});
								});
							}
							return restFish;
						});

						// 2. src/data/fishLocations.ts の保存
						const locationsFilePath = path.resolve(process.cwd(), 'src/data/fishLocations.ts');
						const locationsContent = `import type { FishLocation } from '@/types/fish';

export const FISH_LOCATIONS: FishLocation[] = ${JSON.stringify(locations, null, 2)};
`;
						fs.writeFileSync(locationsFilePath, locationsContent, 'utf-8');

						// 3. src/data/fishes.ts の保存（純粋な魚マスター）
						const fishesFilePath = path.resolve(process.cwd(), 'src/data/fishes.ts');
						const fishesContent = `import type { FishMaster } from '@/types/fish';

export const FISHES: FishMaster[] = ${JSON.stringify(cleanFishList, null, 2)};
`;
						fs.writeFileSync(fishesFilePath, fishesContent, 'utf-8');

						// 4. src/data/zones.ts の保存
						if (zoneList) {
							const zonesFilePath = path.resolve(process.cwd(), 'src/data/zones.ts');
							const zonesContent = `import type { ZoneMaster } from '@/types/fish';

export const ZONES: ZoneMaster[] = ${JSON.stringify(zoneList, null, 2)};
`;
							fs.writeFileSync(zonesFilePath, zonesContent, 'utf-8');
						}

						// 5. src/data/baits.ts の保存（餌マスター）
						if (baitList) {
							const baitsFilePath = path.resolve(process.cwd(), 'src/data/baits.ts');
							const baitsContent = `import type { BaitMaster } from '@/types/fish';

export const BAITS: BaitMaster[] = ${JSON.stringify(baitList, null, 2)};
`;
							fs.writeFileSync(baitsFilePath, baitsContent, 'utf-8');
						}

						// 6. src/data/fishBaitRelations.ts の保存
						if (fishBaitRelations) {
							const baitRelFilePath = path.resolve(process.cwd(), 'src/data/fishBaitRelations.ts');
							const baitRelContent = `import type { FishBaitRelation } from '@/types/fish';

export const FISH_BAIT_RELATIONS: FishBaitRelation[] = ${JSON.stringify(fishBaitRelations, null, 2)};
`;
							fs.writeFileSync(baitRelFilePath, baitRelContent, 'utf-8');
						}

						// 7. src/data/fishRodRelations.ts の保存
						if (fishRodRelations) {
							const rodRelFilePath = path.resolve(process.cwd(), 'src/data/fishRodRelations.ts');
							const rodRelContent = `import type { FishRodRelation } from '@/types/fish';

export const FISH_ROD_RELATIONS: FishRodRelation[] = ${JSON.stringify(fishRodRelations, null, 2)};
`;
							fs.writeFileSync(rodRelFilePath, rodRelContent, 'utf-8');
						}

						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ success: true }));
					} catch (error) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ success: false, error: String(error) }));
					}
				});
			});
		},
	};
}
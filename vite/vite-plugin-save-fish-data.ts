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
			server.middlewares.use((req, res, next) => {
				// パスとメソッドの厳格な判定
				if (req.url === '/api/save-fish-data') {
					if (req.method !== 'POST') {
						res.statusCode = 405; // Method Not Allowed
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
						return;
					}

					let body = '';
					req.on('data', (chunk) => {
						body += chunk;
					});

					req.on('end', () => {
						res.setHeader('Content-Type', 'application/json');

						// 空ボディの検証
						if (!body.trim()) {
							res.statusCode = 400;
							res.end(JSON.stringify({ success: false, error: 'Empty request body' }));
							return;
						}

						try {
							const {
								fishList,
								zoneList,
								baitList,
								fishBaitRelations,
								fishRodRelations,
							} = JSON.parse(body);

							// 1. 中間リレーションデータの抽出 (FishLocation)
							const locations: Array<{ id: string; fishId: number; zoneId: number }> = [];
							let cleanFishList = [];

							if (Array.isArray(fishList)) {
								cleanFishList = fishList.map((fish: any) => {
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
								const locationsContent = `import type { FishLocation } from '@/types/fish';\n\nexport const FISH_LOCATIONS: FishLocation[] = ${JSON.stringify(locations, null, 2)};\n`;
								fs.writeFileSync(locationsFilePath, locationsContent, 'utf-8');

								// 3. src/data/fishes.ts の保存（純粋な魚マスター）
								const fishesFilePath = path.resolve(process.cwd(), 'src/data/fishes.ts');
								const fishesContent = `import type { FishMaster } from '@/types/fish';\n\nexport const FISHES: FishMaster[] = ${JSON.stringify(cleanFishList, null, 2)};\n`;
								fs.writeFileSync(fishesFilePath, fishesContent, 'utf-8');
							}

							// 4. src/data/zones.ts の保存
							if (zoneList) {
								const zonesFilePath = path.resolve(process.cwd(), 'src/data/zones.ts');
								const zonesContent = `import type { ZoneMaster } from '@/types/fish';\n\nexport const ZONES: ZoneMaster[] = ${JSON.stringify(zoneList, null, 2)};\n`;
								fs.writeFileSync(zonesFilePath, zonesContent, 'utf-8');
							}

							// 5. src/data/baits.ts の保存（餌マスター）
							if (baitList) {
								const baitsFilePath = path.resolve(process.cwd(), 'src/data/baits.ts');
								const baitsContent = `import type { BaitMaster } from '@/types/fish';\n\nexport const BAITS: BaitMaster[] = ${JSON.stringify(baitList, null, 2)};\n`;
								fs.writeFileSync(baitsFilePath, baitsContent, 'utf-8');
							}

							// 6. src/data/fishBaitRelations.ts の保存
							if (fishBaitRelations) {
								const baitRelFilePath = path.resolve(process.cwd(), 'src/data/fishBaitRelations.ts');
								const baitRelContent = `import type { FishBaitRelation } from '@/types/fish';\n\nexport const FISH_BAIT_RELATIONS: FishBaitRelation[] = ${JSON.stringify(fishBaitRelations, null, 2)};\n`;
								fs.writeFileSync(baitRelFilePath, baitRelContent, 'utf-8');
							}

							// 7. src/data/fishRodRelations.ts の保存
							if (fishRodRelations) {
								const rodRelFilePath = path.resolve(process.cwd(), 'src/data/fishRodRelations.ts');
								const rodRelContent = `import type { FishRodRelation } from '@/types/fish';\n\nexport const FISH_ROD_RELATIONS: FishRodRelation[] = ${JSON.stringify(fishRodRelations, null, 2)};\n`;
								fs.writeFileSync(rodRelFilePath, rodRelContent, 'utf-8');
							}

							res.statusCode = 200;
							res.end(JSON.stringify({ success: true }));
						} catch (error) {
							res.statusCode = 500;
							res.end(JSON.stringify({ success: false, error: String(error) }));
						}
					});
					return;
				}
				next();
			});
		},
	};
}
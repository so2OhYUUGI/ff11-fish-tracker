/**
 * ============================================================================
 * [FilePath] vite/vite-plugin-save-fish-data.ts
 * [Role] 魚関連マスターデータおよび中間リレーション保存用の Vite プラグイン
 * ============================================================================
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

type InputFish = {
  id: number;
  zoneIds?: number[];
  subLocationIds?: number[];
  impossibleRodIds?: unknown;
  brokenRodIds?: unknown;
  brokenLineRodIds?: unknown;
  tooSmallRodIds?: unknown;
  [key: string]: unknown;
};

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

          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');

            // Bufferを一括結合してutf-8文字列に変換
            const body = Buffer.concat(chunks).toString('utf-8');

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

              // 1. サブロケーションとゾーンの紐付けマップを取得
              const subLocationsFilePath = path.resolve(process.cwd(), 'src/data/subLocations.ts');
              const subLocationToZoneMap: Record<number, number> = {};

              if (fs.existsSync(subLocationsFilePath)) {
                const subLocContent = fs.readFileSync(subLocationsFilePath, 'utf-8');
                const matches = subLocContent.matchAll(/id:\s*(\d+).*?zoneId:\s*(\d+)/gs);
                for (const match of matches) {
                  subLocationToZoneMap[Number(match[1])] = Number(match[2]);
                }
              }

              // 2. 中間リレーションデータの抽出 (FishLocation)
              const locations: Array<{
                id: string;
                fishId: number;
                zoneId: number;
                subLocationIds?: number[];
              }> = [];
              let cleanFishList = [];

              if (Array.isArray(fishList)) {
                cleanFishList = fishList.map((fish: InputFish) => {
                  const { zoneIds, subLocationIds } = fish;
                  const restFish = { ...fish };
                  delete restFish.zoneIds;
                  delete restFish.subLocationIds;
                  delete restFish.impossibleRodIds;
                  delete restFish.brokenRodIds;
                  delete restFish.brokenLineRodIds;
                  delete restFish.tooSmallRodIds;

                  if (Array.isArray(zoneIds)) {
                    const fishSubIds: number[] = Array.isArray(subLocationIds) ? subLocationIds : [];

                    zoneIds.forEach((zoneId: number) => {
                      // 対象ゾーンに所属する subLocationId を抽出
                      const relevantSubIds = fishSubIds.filter(
                        (subId) => subLocationToZoneMap[subId] === zoneId
                      );

                      const locationRecord: {
                        id: string;
                        fishId: number;
                        zoneId: number;
                        subLocationIds?: number[];
                      } = {
                        id: `${fish.id}-${zoneId}`,
                        fishId: fish.id,
                        zoneId,
                      };

                      if (relevantSubIds.length > 0) {
                        locationRecord.subLocationIds = relevantSubIds;
                      }

                      locations.push(locationRecord);
                    });
                  }
                  return restFish;
                });

                // 3. src/data/fishLocations.ts の保存
                const locationsFilePath = path.resolve(process.cwd(), 'src/data/fishLocations.ts');
                const locationsContent = `import type { FishLocation } from '@/types/fishtracker';\n\nexport const FISH_LOCATIONS: FishLocation[] = ${JSON.stringify(locations, null, 2)};\n`;
                fs.writeFileSync(locationsFilePath, locationsContent, 'utf-8');

                // 4. src/data/fishes.ts の保存（純粋な魚マスター）
                const fishesFilePath = path.resolve(process.cwd(), 'src/data/fishes.ts');
                const fishesContent = `import type { FishMaster } from '@/types/fishtracker';\n\nexport const FISHES: FishMaster[] = ${JSON.stringify(cleanFishList, null, 2)};\n`;
                fs.writeFileSync(fishesFilePath, fishesContent, 'utf-8');
              }

              // 5. src/data/zones.ts の保存
              if (zoneList) {
                const zonesFilePath = path.resolve(process.cwd(), 'src/data/zones.ts');
                const zonesContent = `import type { ZoneMaster } from '@/types/fishtracker';\n\nexport const ZONES: ZoneMaster[] = ${JSON.stringify(zoneList, null, 2)};\n`;
                fs.writeFileSync(zonesFilePath, zonesContent, 'utf-8');
              }

              // 6. src/data/baits.ts の保存（餌マスター）
              if (baitList) {
                const baitsFilePath = path.resolve(process.cwd(), 'src/data/baits.ts');
                const baitsContent = `import type { BaitMaster } from '@/types/fishtracker';\n\nexport const BAITS: BaitMaster[] = ${JSON.stringify(baitList, null, 2)};\n`;
                fs.writeFileSync(baitsFilePath, baitsContent, 'utf-8');
              }

              // 7. src/data/fishBaitRelations.ts の保存
              if (fishBaitRelations) {
                const baitRelFilePath = path.resolve(process.cwd(), 'src/data/fishBaitRelations.ts');
                const baitRelContent = `import type { FishBaitRelation } from '@/types/fishtracker';\n\nexport const FISH_BAIT_RELATIONS: FishBaitRelation[] = ${JSON.stringify(fishBaitRelations, null, 2)};\n`;
                fs.writeFileSync(baitRelFilePath, baitRelContent, 'utf-8');
              }

              // 8. src/data/fishRodRelations.ts の保存
              if (fishRodRelations) {
                const rodRelFilePath = path.resolve(process.cwd(), 'src/data/fishRodRelations.ts');
                const rodRelContent = `import type { FishRodRelation } from '@/types/fishtracker';\n\nexport const FISH_ROD_RELATIONS: FishRodRelation[] = ${JSON.stringify(fishRodRelations, null, 2)};\n`;
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
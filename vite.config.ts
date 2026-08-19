import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'save-fish-data-plugin',
      configureServer(server) {
        server.middlewares.use('/api/save-fish-data', async (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              try {
                const { fishList, zoneList } = JSON.parse(body);

                // 1. 中間リレーションデータの抽出 (FishLocation)
                const locations: Array<{ id: string; fishId: number; zoneId: number }> = [];
                const cleanFishList = fishList.map((fish: any) => {
                  const { zoneIds, ...restFish } = fish;
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
                const locationsFilePath = path.resolve(__dirname, 'src/data/fishLocations.ts');
                const locationsContent = `import type { FishLocation } from '@/types/fish';

export const FISH_LOCATIONS: FishLocation[] = ${JSON.stringify(locations, null, 2)};
`;
                fs.writeFileSync(locationsFilePath, locationsContent, 'utf-8');

                // 3. src/data/fishes.ts の保存（zoneIds を含まない純粋な魚マスター）
                const fishesFilePath = path.resolve(__dirname, 'src/data/fishes.ts');
                const fishesContent = `import type { FishMaster } from '@/types/fish';

export const FISHES: FishMaster[] = ${JSON.stringify(cleanFishList, null, 2)};
`;
                fs.writeFileSync(fishesFilePath, fishesContent, 'utf-8');

                // 4. src/data/zones.ts の保存（ゾーンデータも独立）
                if (zoneList) {
                  const zonesFilePath = path.resolve(__dirname, 'src/data/zones.ts');
                  const zonesContent = `import type { ZoneMaster } from '@/types/fish';

export const ZONES: ZoneMaster[] = ${JSON.stringify(zoneList, null, 2)};
`;
                  fs.writeFileSync(zonesFilePath, zonesContent, 'utf-8');
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: String(error) }));
              }
            });
          } else {
            res.statusCode = 404;
            res.end();
          }
        });
      },
    },
  ],
});
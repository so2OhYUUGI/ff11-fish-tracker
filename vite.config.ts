import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ←追加 (`@/` を `src/` にマッピング)
    },
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

                const filePath = path.resolve(__dirname, 'src/data/fishes.ts');
                const fileContent = `import type { FishMaster, ZoneMaster } from '@/types/fish';

export const ZONES: ZoneMaster[] = ${JSON.stringify(zoneList, null, 2)};

export const FISHES: FishMaster[] = ${JSON.stringify(fishList, null, 2)};
`;

                fs.writeFileSync(filePath, fileContent, 'utf-8');
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

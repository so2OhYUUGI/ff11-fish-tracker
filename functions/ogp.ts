/**
 * ============================================================================
 * [FilePath] functions/ogp.ts
 * [Role] OGP画像の生成（本番用最終コード）
 * ============================================================================
 */

import { buildShareCardData } from '../src/utils/shareDataBuilder';
import { decodeSharedProgress } from '../src/utils/shareEncoding';

interface Env {
	ASSETS: {
		fetch: (request: Request | string) => Promise<Response>;
	};
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (!url.pathname.startsWith('/api/ogp')) {
			return env.ASSETS.fetch(request);
		}

		try {
			const shareParam = url.searchParams.get('share');
			let characterName = 'Unknown Angler';
			let checkedFishIds: number[] = [];

			if (shareParam) {
				const decoded = decodeSharedProgress(shareParam);
				if (decoded) {
					characterName = decoded.characterName;
					checkedFishIds = decoded.checkedFishIds;
				}
			}

			const cardData = buildShareCardData(characterName, checkedFishIds);

			const svgContent = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
          <style>
            .bg { fill: #0f172a; }
            .border { fill: none; stroke: #38bdf8; stroke-width: 6; }
            .title { fill: #ffffff; font-family: sans-serif; font-weight: bold; font-size: 44px; }
            .char { fill: #94a3b8; font-family: sans-serif; font-size: 48px; }
            .percent { fill: #38bdf8; font-family: sans-serif; font-weight: bold; font-size: 120px; }
            .summary { fill: #e2e8f0; font-family: sans-serif; font-size: 32px; }
            .highlight-title { fill: #cbd5e1; font-family: sans-serif; font-weight: bold; font-size: 24px; }
            .fish-name { fill: #ffffff; font-family: sans-serif; font-weight: bold; font-size: 28px; }
            .fish-skill { fill: #94a3b8; font-family: sans-serif; font-size: 20px; }
            .footer { fill: #64748b; font-family: sans-serif; font-size: 22px; }
          </style>
          <rect width="1200" height="630" class="bg" />
          <rect x="30" y="30" width="1140" height="570" class="border" rx="12" />
          <text x="80" y="110" class="title">FF11 釣魚チェッカーレポート</text>
          <text x="80" y="190" class="char">【${cardData.characterName}】</text>
          <text x="80" y="340" class="percent">${cardData.percentage}%</text>
          <text x="80" y="420" class="summary">釣獲種数: ${cardData.checkedCount} / ${cardData.totalCount} 種</text>
          <text x="660" y="160" class="highlight-title">★ 主な釣獲ハイライト（スキル順）</text>
          ${cardData.topFishList && cardData.topFishList.length > 0
					? cardData.topFishList
						.map((fish, index) => {
							const startY = 220 + index * 85;
							const medals = ['🥇', '🥈', '🥉'];
							return `
                  <text x="660" y="${startY}" font-size="28">${medals[index] || ''}</text>
                  <text x="720" y="${startY - 5}" class="fish-name">${fish.ja}</text>
                  <text x="720" y="${startY + 30}" class="fish-skill">上限スキル: ${fish.maxSkill}</text>
                `;
						})
						.join('')
					: '<text x="660" y="230" fill="#64748b" font-family: sans-serif; font-size: 24">まだ記録がありません</text>'
				}
          <text x="80" y="550" class="footer">FF11 釣魚チェッカー</text>
        </svg>
      `;

			return new Response(svgContent, {
				headers: {
					'Content-Type': 'image/svg+xml; charset=utf-8',
					'Cache-Control': 'public, max-age=86400',
				},
			});
		} catch (error: any) {
			const errorMessage = error?.stack || error?.message || String(error);
			return new Response(`OGP Generation Error:\n\n${errorMessage}`, {
				status: 500,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' },
			});
		}
	},
};
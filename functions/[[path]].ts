/**
 * ============================================================================
 * [FilePath] functions/[[path]].ts
 * [Role]     OGP画像生成（SVG->PNG変換）およびSNSクローラー向けHTMLメタタグの動的書き換え（SSR/エッジ処理）
 * 
 * [概要]
 * - /api/ogp: 共有パラメータから釣獲/フェイス進捗データを生成し、svg2png-wasm を用いて PNG 画像としてレスポンス返却
 * - クローラー対応: URLのパスおよび share パラメータを解釈し、HTMLRewriter で OGP メタタグを動的置換
 * 
 * [依存関係・関連ファイル]
 * - 型定義   : functions/env.d.ts (*.wasm のモジュール型定義)
 * - ユーティリティ: src/utils/shareDataBuilder.ts, src/utils/shareEncoding.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【WASMの二重初期化防止】 initialized フラグを用い、Worker プロセス生存期間中に initialize() を1度のみ実行すること。
 * 2. 【レスポンス形式】 SNS (X/Twitter等) 互換性のため /api/ogp の Content-Type は必ず image/png を維持すること。
 * 3. 【描画サイズ】 OGP 標準規格に合わせ 1200 x 630 ピクセルを指定すること。
 * 4. 【既存互換性】 魚チェッカー（デフォルトおよび /fishtracker）の挙動・出力結果を変更しないこと。
 * ============================================================================
 **/
/// <reference types="@cloudflare/workers-types" />

import { initialize, svg2png } from 'svg2png-wasm';
import wasmModule from 'svg2png-wasm/svg2png_wasm_bg.wasm';
import { buildShareCardData } from '../src/utils/shareDataBuilder';
import { decodeSharedProgress } from '../src/utils/shareEncoding';

interface Env {
	ASSETS: {
		fetch: (request: Request | string) => Promise<Response>;
	};
}

let initialized = false;
let fontCache: Uint8Array | null = null; // フォントデータをメモリに保持

async function ensureInitialized(env: Env, requestUrl: string) {
	if (!initialized) {
		await initialize(wasmModule);
		initialized = true;
	}
	// 初回リクエスト時のみ public/ からフォントを取得してキャッシュ
	if (!fontCache) {
		const fontRes = await env.ASSETS.fetch(new URL('/NotoSansJP-Regular.ttf', requestUrl).href);
		if (!fontRes.ok) {
			throw new Error(`Failed to load font: ${fontRes.status}`);
		}
		fontCache = new Uint8Array(await fontRes.arrayBuffer());
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const isTrustTracker = url.pathname.startsWith('/trusttracker');

		// 1. OGP画像生成エンドポイントの処理 (/api/ogp)
		if (url.pathname.startsWith('/api/ogp')) {
			try {
				// WASM と フォントデータの初期化・読み込み
				await ensureInitialized(env, request.url);

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

				// 魚チェッカー用 SVG カード描画
				const svgContent = `
          <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景と外枠 -->
            <rect width="1200" height="630" fill="#0f172a" />
            <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#38bdf8" stroke-width="6" rx="12" />
            
            <!-- タイトル・キャラクター名・進捗 -->
            <text x="80" y="110" fill="#ffffff" font-family="Noto Sans JP" font-weight="bold" font-size="44">FF11 釣魚チェッカーレポート</text>
            <text x="80" y="190" fill="#94a3b8" font-family="Noto Sans JP" font-size="48">【${cardData.characterName}】</text>
            <text x="80" y="340" fill="#38bdf8" font-family="Noto Sans JP" font-weight="bold" font-size="120">${cardData.percentage}%</text>
            <text x="80" y="420" fill="#e2e8f0" font-family="Noto Sans JP" font-size="32">釣獲種数: ${cardData.checkedCount} / ${cardData.totalCount} 種</text>
            
            <!-- ハイライトタイトル -->
            <text x="660" y="160" fill="#cbd5e1" font-family="Noto Sans JP" font-weight="bold" font-size="24">★ 主な釣獲ハイライト（スキル順）</text>
            
            <!-- 魚リスト -->
            ${cardData.topFishList && cardData.topFishList.length > 0
						? cardData.topFishList
							.map((fish, index) => {
								const startY = 220 + index * 85;
								const badgeColors = ['#f59e0b', '#94a3b8', '#b45309']; // 金・銀・銅
								const rankNumbers = ['1', '2', '3'];
								const badgeColor = badgeColors[index] || '#64748b';
								const rankNum = rankNumbers[index] || `${index + 1}`;

								return `
                    <!-- メダル風丸バッジ -->
                    <circle cx="680" cy="${startY - 8}" r="20" fill="${badgeColor}" />
                    <text x="680" y="${startY - 1}" fill="#ffffff" font-family="Noto Sans JP" font-weight="bold" font-size="20" text-anchor="middle" dominant-baseline="middle">${rankNum}</text>
                    
                    <!-- 魚情報 -->
                    <text x="720" y="${startY}" fill="#ffffff" font-family="Noto Sans JP" font-weight="bold" font-size="28">${fish.ja}</text>
                    <text x="720" y="${startY + 32}" fill="#94a3b8" font-family="Noto Sans JP" font-size="20">上限スキル: ${fish.maxSkill}</text>
                  `;
							})
							.join('')
						: '<text x="660" y="230" fill="#64748b" font-family="Noto Sans JP" font-size="24">まだ記録がありません</text>'
					}
            <!-- フッター -->
            <text x="80" y="550" fill="#64748b" font-family="Noto Sans JP" font-size="22">FF11 釣魚チェッカー</text>
          </svg>
        `;

				// キャッシュされたフォントデータを渡して SVG -> PNG 変換
				const pngBuffer = await svg2png(svgContent, {
					width: 1200,
					height: 630,
					fonts: [fontCache!],
				});

				return new Response(pngBuffer as unknown as BodyInit, {
					headers: {
						'Content-Type': 'image/png',
						'Cache-Control': 'public, max-age=86400, s-maxage=86400',
					},
				});

			} catch (error: unknown) {
				const errorMessage = error instanceof Error ? error.stack || error.message : String(error);
				return new Response(`OGP Generation Error:\n\n${errorMessage}`, {
					status: 500,
					headers: { 'Content-Type': 'text/plain; charset=utf-8' },
				});
			}
		}

		// 2. 通常ページへのリクエスト（静的アセットの取得およびHTMLRewrite）
		const response = await env.ASSETS.fetch(request);
		const shareParam = url.searchParams.get('share');

		// 進捗共有パラメータが無い場合：パス別にデフォルト OGP を差し替え
		if (!shareParam) {
			if (isTrustTracker) {
				const trustTitle = 'FF11 フェイス取得チェッカー';
				const trustDescription = 'FF11のフェイス取得状況・修得クエスト情報を一覧で管理・チェックできるツールです。';
				const trustImageUrl = `${url.origin}/ogp-trust-default.png`;

				return new HTMLRewriter()
					.on('title', { element(e) { e.setInnerContent(trustTitle); } })
					.on('meta[name="description"]', { element(e) { e.setAttribute('content', trustDescription); } })
					.on('meta[property="og:title"]', { element(e) { e.setAttribute('content', trustTitle); } })
					.on('meta[property="og:description"]', { element(e) { e.setAttribute('content', trustDescription); } })
					.on('meta[property="og:image"]', { element(e) { e.setAttribute('content', trustImageUrl); } })
					.on('meta[name="twitter:title"]', { element(e) { e.setAttribute('content', trustTitle); } })
					.on('meta[name="twitter:description"]', { element(e) { e.setAttribute('content', trustDescription); } })
					.on('meta[name="twitter:image"]', { element(e) { e.setAttribute('content', trustImageUrl); } })
					.transform(response);
			}
			return response;
		}

		// 進捗共有パラメータがある場合
		const decoded = decodeSharedProgress(shareParam);
		if (!decoded) {
			return response;
		}

		const cardData = buildShareCardData(decoded.characterName, decoded.checkedFishIds);
		const topFish = cardData.topFishList[0];
		const fishText = topFish ? ` #${topFish.ja.replace(/\s+/g, '')}` : '';

		const ogTitle = `【FF11 釣獲記録】${cardData.characterName} (${cardData.percentage}%)`;
		const ogDescription = `達成率: ${cardData.percentage}% (${cardData.checkedCount}/${cardData.totalCount}種)${fishText}`;
		const ogImageUrl = `${url.origin}/api/ogp?share=${shareParam}`;

		return new HTMLRewriter()
			.on('title', {
				element(element) {
					element.setInnerContent(ogTitle);
				},
			})
			.on('meta[name="description"]', {
				element(element) {
					element.setAttribute('content', ogDescription);
				},
			})
			.on('meta[property="og:title"]', {
				element(element) {
					element.setAttribute('content', ogTitle);
				},
			})
			.on('meta[property="og:description"]', {
				element(element) {
					element.setAttribute('content', ogDescription);
				},
			})
			.on('meta[property="og:image"]', {
				element(element) {
					element.setAttribute('content', ogImageUrl);
				},
			})
			.on('meta[name="twitter:title"]', {
				element(element) {
					element.setAttribute('content', ogTitle);
				},
			})
			.on('meta[name="twitter:description"]', {
				element(element) {
					element.setAttribute('content', ogDescription);
				},
			})
			.on('meta[name="twitter:image"]', {
				element(element) {
					element.setAttribute('content', ogImageUrl);
				},
			})
			.transform(response);
	},
};
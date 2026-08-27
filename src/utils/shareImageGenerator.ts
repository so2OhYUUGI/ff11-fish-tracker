/**
 * ============================================================================
 * [FilePath] src/utils/shareImageGenerator.ts
 * [Role]     Canvas APIを用いたSNS共有用OGP・進捗カード画像動的生成ユーティリティ
 * 
 * [概要]
 * - キャラクター名、釣獲達成数、総種数、達成率を受け取り、SNS投稿用画像（1200x630px）をCanvas描画
 * - 画像データ（Blob）およびData URLを返却し、Web Share APIやダウンロード・プレビュー表示で利用可能にする
 * 
 * [依存関係・関連ファイル]
 * - 参照先 : src/components/share/ShareModal.tsx 等
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【パフォーマンス】 Canvas処理は同期重い描画を含むため Promise / async 化して非同期で呼び出すこと
 * 2. 【クロスブラウザ】  フォント指定（sans-serifフォールバック）を確実に指定し、描画文字化けを防ぐこと
 * ============================================================================
 */

export interface ShareImageParams {
	characterName: string;
	checkedCount: number;
	totalCount: number;
	createdAt?: number;
}

/**
 * SNS共有用の進捗カード画像（1200x630px PNG Blob）を生成します。
 */
export async function generateProgressImage(params: ShareImageParams): Promise<Blob | null> {
	const { characterName, checkedCount, totalCount, createdAt = Date.now() } = params;

	const width = 1200;
	const height = 630;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	// 1. 背景描画（ダークブルーグラデーション）
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, '#0f172a'); // slate-900
	gradient.addColorStop(0.5, '#1e1b4b'); // indigo-950
	gradient.addColorStop(1, '#0284c7'); // sky-600
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// 2. 枠線描画
	ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; // sky-400 opacity
	ctx.lineWidth = 12;
	ctx.strokeRect(24, 24, width - 48, height - 48);

	ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.lineWidth = 2;
	ctx.strokeRect(36, 36, width - 72, height - 72);

	// 3. アプリタイトル・ロゴ表記
	ctx.fillStyle = '#38bdf8'; // sky-400
	ctx.font = 'bold 32px sans-serif';
	ctx.textAlign = 'left';
	ctx.fillText('FF11 FISH TRACKER', 70, 95);

	// 4. キャラクター名
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 52px sans-serif';
	const nameText = characterName.trim() ? characterName : 'Unknown Angler';
	ctx.fillText(nameText, 70, 185);

	// 5. プログレスバー背景
	const percentage = totalCount > 0 ? Math.min(100, Math.round((checkedCount / totalCount) * 100)) : 0;
	const barX = 70;
	const barY = 240;
	const barWidth = width - 140;
	const barHeight = 28;

	ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
	ctx.beginPath();
	ctx.roundRect(barX, barY, barWidth, barHeight, 14);
	ctx.fill();

	// プログレスバー本体
	if (percentage > 0) {
		const fillWidth = Math.max(28, (barWidth * percentage) / 100);
		const barGradient = ctx.createLinearGradient(barX, 0, barX + fillWidth, 0);
		barGradient.addColorStop(0, '#06b6d4'); // cyan-500
		barGradient.addColorStop(1, '#38bdf8'); // sky-400
		ctx.fillStyle = barGradient;
		ctx.beginPath();
		ctx.roundRect(barX, barY, fillWidth, barHeight, 14);
		ctx.fill();
	}

	// 6. メイン釣獲数スコア表示
	ctx.textAlign = 'left';
	ctx.fillStyle = '#e2e8f0'; // slate-200
	ctx.font = 'bold 36px sans-serif';
	ctx.fillText('釣獲進捗', 70, 360);

	// 数字強調
	ctx.fillStyle = '#38bdf8';
	ctx.font = 'bold 120px sans-serif';
	ctx.fillText(`${checkedCount}`, 70, 480);

	const checkedWidth = ctx.measureText(`${checkedCount}`).width;
	ctx.fillStyle = '#94a3b8'; // slate-400
	ctx.font = 'bold 50px sans-serif';
	ctx.fillText(` / ${totalCount} 種類`, 70 + checkedWidth + 15, 480);

	// 7. 達成率バッジ表示
	ctx.textAlign = 'right';
	ctx.fillStyle = '#f59e0b'; // amber-500
	ctx.font = 'bold 88px sans-serif';
	ctx.fillText(`${percentage}%`, width - 70, 480);

	// 8. フッター注記・日付
	const dateStr = new Date(createdAt).toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	ctx.fillStyle = '#64748b'; // slate-500
	ctx.font = '24px sans-serif';
	ctx.textAlign = 'right';
	ctx.fillText(`RECORDED AT: ${dateStr}`, width - 70, 560);

	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			resolve(blob);
		}, 'image/png');
	});
}
/**
 * ============================================================================
 * [FilePath] src/components/AdBanner.tsx
 * [Role] 広告バナー表示エリア（プレースホルダー / AdSense枠）コンポーネント
 * 
 * [概要]
 * - 広告枠（スポンサーリンク）の表示レイアウトコンポーネント
 * - 開発環境・初期実装時はプレースホルダー枠として機能
 * - 将来的に Google AdSense や各種アフィリエイト広告タグを埋め込むための領域を提供
 * 
 * [編集・改修時の注意事項]
 * 1. 【広告枠の置き換え】
 *    本番運用時に AdSense 等を導入する場合は、本コンポーネント内のプレースホルダー部分を
 *    `window.adsbygoogle` 等のスクリプト実行ロジックに置き換えてください。
 * 2. 【レイアウトサイズ】
 *    レスポンシブ対応のため `h-16 sm:h-20` の高さを確保しています。
 *    広告フォーマット（レスポンシブ / アンカー等）に応じてアスペクト比や高さを調整してください。
 * ============================================================================
 */

import React from 'react';

type AdBannerProps = {
	slotId?: string; // AdSenseの広告スロットID等
};

export const AdBanner: React.FC<AdBannerProps> = ({ slotId }) => {
	return (
		<div className="my-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-lg p-3 text-center">
				<p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">スポンサーリンク</p>

				{/* 開発時プレースホルダー領域（本番時に Google AdSense 等のタグを配置） */}
				<div className="h-16 sm:h-20 bg-slate-900/60 rounded flex items-center justify-center text-xs text-slate-500">
					{slotId ? `Ad Space (Slot: ${slotId})` : '広告枠エリア'}
				</div>
			</div>
		</div>
	);
};
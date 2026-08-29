/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContainer.tsx
 * [Role] フェイスチェッカーのメイン画面用コンテナコンポーネント（仮実装版）
 * 
 * [概要]
 * - フェイス管理機能の実装準備用プロトタイプ画面
 * - UserDataContext から選択中のキャラクター情報を参照し表示
 * - layoutTokens の最新クラス構造に対応したデザインを配置
 * 
 * [依存関係・関連ファイル]
 * - Context     : src/contexts/UserDataContext.tsx
 * - コンポーネント: src/components/common/SeoHead.tsx
 * - トークン    : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * ============================================================================
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Scroll, Construction } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { SeoHead } from '@/components/common/SeoHead';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export function TrustTrackerContainer() {
	const location = useLocation();
	const { activeCharacter } = useUserDataContext();

	return (
		<>
			<SeoHead
				title="FF11 フェイスチェッカー"
				description="FF11のフェイス（Trust）修得状況を管理・共有できるチェッカーツールです。"
				path={location.pathname}
			/>

			<div className={LAYOUT_TOKENS.page.mainContainer}>
				<div className={LAYOUT_TOKENS.view.emptyContainer}>
					<div className="flex flex-col items-center justify-center min-h-[360px] text-center p-4 sm:p-8">
						<div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 shadow-inner">
							<Scroll className="w-8 h-8 text-amber-400" />
						</div>

						<h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
							<Construction className="w-5 h-5 text-amber-400 shrink-0" />
							FF11 フェイスチェッカー（開発中）
						</h2>

						<p className={`${COMMON_TOKENS.text.subText} max-w-md mb-6 leading-relaxed`}>
							フェイスの修得管理機能を順次追加予定です。<br />
							現在表示中のキャラクター: <span className="text-slate-200 font-semibold">{activeCharacter?.name ?? 'ゲスト'}</span>
						</p>

						<div className="p-4 sm:p-5 bg-slate-900/80 rounded-xl border border-slate-700/80 text-xs sm:text-sm text-slate-300 max-w-sm text-left leading-relaxed shadow-lg">
							<div className="font-bold text-slate-200 mb-2 text-xs uppercase tracking-wider text-amber-400/90 border-b border-slate-800 pb-1">
								【予定している機能】
							</div>
							<ul className="list-disc list-inside space-y-1.5 text-slate-400">
								<li>フェイスの属性・種別フィルター</li>
								<li>入手条件（ミッション/クエスト等）別表示</li>
								<li>キャラクターごとの修得状況記録＆共有</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContainer.tsx
 * [Role] フェイスチェッカーのメイン画面用コンテナコンポーネント（仮実装版）
 * 
 * [概要]
 * - フェイス管理機能の実装準備用プロトタイプ画面
 * - UserDataContext から選択中のキャラクター情報を参照し表示
 * - スタイル定義はすべて layoutTokens / commonTokens を使用して統一
 * 
 * [依存関係・関連ファイル]
 * - Context     : src/contexts/UserDataContext.tsx
 * - コンポーネント: src/components/common/SeoHead.tsx
 * - トークン    : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * ============================================================================
 */

import { useLocation } from 'react-router-dom';
import { Scroll, Construction } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { SeoHead } from '@/components/common/SeoHead';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export function TrustTrackerContainer() {
	const location = useLocation();
	const { activeCharacter } = useUserDataContext();
	const { emptyState } = LAYOUT_TOKENS;

	return (
		<>
			<SeoHead
				title="FF11 フェイスチェッカー"
				description="FF11のフェイス（Trust）修得状況を管理・共有できるチェッカーツールです。"
				path={location.pathname}
			/>

			<div className={LAYOUT_TOKENS.page.mainContainer}>
				<div className={LAYOUT_TOKENS.view.emptyContainer}>
					<div className={emptyState.wrapper}>

						{/* メインアイコン */}
						<div className={emptyState.iconBadge}>
							<Scroll className={emptyState.iconLarge} />
						</div>

						{/* タイトル */}
						<h2 className={emptyState.title}>
							<Construction className={emptyState.titleIcon} />
							FF11 フェイスチェッカー（開発中）
						</h2>

						{/* サブテキスト */}
						<p className={`${COMMON_TOKENS.text.subText} ${emptyState.description}`}>
							フェイスの修得管理機能を順次追加予定です。<br />
							現在表示中のキャラクター: <span className={emptyState.characterName}>{activeCharacter?.name ?? 'ゲスト'}</span>
						</p>

						{/* 予定機能カード */}
						<div className={emptyState.cardContainer}>
							<div className={emptyState.cardHeader}>
								【予定している機能】
							</div>
							<ul className={emptyState.cardList}>
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
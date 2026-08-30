/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContent.tsx
 * [Role] フェイスチェッカーのメインコンテンツ制御・データフィルタリング層
 * 
 * [概要]
 * - フィルター条件（アクティブタブ、修得ステータス、検索クエリ）に基づくマスターデータの抽出
 * - アクティブタブ（'trust' | 'wishlist' | 'macro'）に応じたビューの切り替え
 * - LAYOUT_TOKENS.page.mainContainer による魚チェッカーと共通の外周レイアウトパディング適用
 * - DETAIL_STYLES による準備中画面（ウィッシュリスト・マクロ管理）のスタイル標準化
 * - ナビゲーションスタック（navStack）の下位コンポーネント（TrustView）への伝達
 * 
 * [依存関係・関連ファイル]
 * - スタイル      : src/styles/tokens/layoutTokens.ts, src/styles/components/detailStyles.ts
 * - 型定義        : src/types/trusttracker.ts
 * - フック        : src/hooks/useTrackerNavigation.ts
 * - ビュー        : src/features/trusttracker/trust/TrustView.tsx
 * - フィルター    : src/features/trusttracker/FilterBar.tsx
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Heart, Terminal } from 'lucide-react';
import type { TrustMaster, TrustSubtype, StatusFilter } from '@/types/trusttracker';
import type { TrackerNavStack } from '@/hooks/useTrackerNavigation';
import { TrustView } from './trust/TrustView';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';

type Props = {
	activeType: TrustSubtype;
	statusFilter: StatusFilter;
	searchQuery: string;
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
	navStack?: TrackerNavStack<TrustMaster>;
};

export const TrustTrackerContent: React.FC<Props> = ({
	activeType,
	statusFilter,
	searchQuery,
	trusts,
	checkedTrustIds,
	onToggleCheck,
	navStack,
}) => {
	// 修得済みIDの高速参照用 Set
	const checkedSet = useMemo(() => new Set(checkedTrustIds), [checkedTrustIds]);

	// 検索クエリおよびステータスフィルターによるデータの絞り込み
	const filteredTrusts = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return trusts.filter((trust) => {
			const isChecked = checkedSet.has(trust.id);

			// 1. ステータスフィルター判定
			if (statusFilter === 'checked' && !isChecked) return false;
			if (statusFilter === 'unchecked' && isChecked) return false;

			// 2. 検索キーワード判定（日本語名・英語名・ジョブ・入手方法）
			if (query) {
				const matchJa = trust.ja.toLowerCase().includes(query);
				const matchEn = trust.en.toLowerCase().includes(query);
				const matchJob = trust.job.toLowerCase().includes(query);
				const matchAcquire = trust.acquireInfo?.toLowerCase().includes(query) || false;

				if (!matchJa && !matchEn && !matchJob && !matchAcquire) {
					return false;
				}
			}

			return true;
		});
	}, [trusts, checkedSet, statusFilter, searchQuery]);

	return (
		<div className={LAYOUT_TOKENS.page.mainContainer}>
			{activeType === 'trust' && (
				<TrustView
					trusts={filteredTrusts}
					checkedTrustIds={checkedTrustIds}
					onToggleCheck={onToggleCheck}
					navStack={navStack}
				/>
			)}

			{activeType === 'wishlist' && (
				<div className={DETAIL_STYLES.emptyDetailWrapper}>
					<Heart className={DETAIL_STYLES.emptyDetailPulseIcon} />
					<h3 className={DETAIL_STYLES.emptyDetailTitle}>ウィッシュリスト機能</h3>
					<p className={DETAIL_STYLES.emptyDetailSubText}>
						これから集めたいフェイスを目標リストとして整理できる機能を準備中です。
					</p>
				</div>
			)}

			{activeType === 'macro' && (
				<div className={DETAIL_STYLES.emptyDetailWrapper}>
					<Terminal className={DETAIL_STYLES.emptyDetailPulseIcon} />
					<h3 className={DETAIL_STYLES.emptyDetailTitle}>マクロ管理機能</h3>
					<p className={DETAIL_STYLES.emptyDetailSubText}>
						パーティ編成に応じたフェイス呼び出しマクロの管理・セットアップ機能を準備中です。
					</p>
				</div>
			)}
		</div>
	);
};
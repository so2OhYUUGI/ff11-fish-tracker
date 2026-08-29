/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContent.tsx
 * [Role] フェイスチェッカーのメインコンテンツ制御・データフィルタリング層
 * 
 * [概要]
 * - フィルター条件（アクティブタブ、修得ステータス、検索クエリ）に基づくマスターデータの抽出
 * - アクティブタブ（'trust' | 'wishlist' | 'macro'）に応じたビューの切り替え
 * 
 * [依存関係・関連ファイル]
 * - 型定義      : src/types/trusttracker.ts
 * - ビュー      : src/features/trusttracker/trust/TrustView.tsx
 * - フィルター  : src/features/trusttracker/FilterBar.tsx
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Heart, Terminal } from 'lucide-react';
import type { TrustMaster, TrustSubtype, StatusFilter } from '@/types/trusttracker';
import { TrustView } from './trust/TrustView';

type Props = {
	activeType: TrustSubtype;
	statusFilter: StatusFilter;
	searchQuery: string;
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
};

export const TrustTrackerContent: React.FC<Props> = ({
	activeType,
	statusFilter,
	searchQuery,
	trusts,
	checkedTrustIds,
	onToggleCheck,
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

	// メインタブに応じたビューの描画
	switch (activeType) {
		case 'trust':
			return (
				<TrustView
					trusts={filteredTrusts}
					checkedTrustIds={checkedTrustIds}
					onToggleCheck={onToggleCheck}
				/>
			);

		case 'wishlist':
			return (
				<div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-xl">
					<Heart className="w-12 h-12 text-slate-600 mb-3" />
					<h3 className="text-lg font-bold text-slate-300">ウィッシュリスト機能</h3>
					<p className="text-xs text-slate-500 mt-1 max-w-sm">
						これから集めたいフェイスを目標リストとして整理できる機能を準備中です。
					</p>
				</div>
			);

		case 'macro':
			return (
				<div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-xl">
					<Terminal className="w-12 h-12 text-slate-600 mb-3" />
					<h3 className="text-lg font-bold text-slate-300">マクロ管理機能</h3>
					<p className="text-xs text-slate-500 mt-1 max-w-sm">
						パーティ編成に応じたフェイス呼び出しマクロの管理・セットアップ機能を準備中です。
					</p>
				</div>
			);

		default:
			return null;
	}
};
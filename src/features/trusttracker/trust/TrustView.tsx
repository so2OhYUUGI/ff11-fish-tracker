/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/trust/TrustView.tsx
 * [Role] フェイス一覧（リスト）および選択中フェイス詳細（サイドバー）の統合ビュー
 * 
 * [概要]
 * - フィルタリング済みフェイス一覧のリスト表示および選択状態の管理
 * - 初期状態は未選択（null）とし、選択時にのみ詳細を表示
 * - LAYOUT_TOKENS を使用した魚チェッカー準拠の標準レイアウト（リスト + サイドバー詳細）
 * - PC画面（1024px以上）: 左右2カラム（リスト + 右側サイドバー詳細）
 * - モバイル・タブレット画面（1024px未満）: 選択時に詳細画面をオーバーレイ表示
 * - navStack（共通ナビゲーション）の受領および DetailView やアイテム選択処理への伝播
 * ============================================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import { X, Users } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import type { TrackerNavStack } from '@/hooks/useTrackerNavigation';
import { TrustListItem } from './TrustListItem';
import { TrustDetailView } from './TrustDetailView';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type Props = {
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
	navStack?: TrackerNavStack<TrustMaster>;
};

export const TrustView: React.FC<Props> = ({
	trusts,
	checkedTrustIds,
	onToggleCheck,
	navStack,
}) => {
	// 初期状態は未選択（null）
	const [selectedTrustId, setSelectedTrustId] = useState<number | null>(null);

	// モバイル・タブレット表示用: 詳細モーダル/オーバーレイの開閉フラグ
	const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

	// 高速参照用 Set
	const checkedSet = useMemo(() => new Set(checkedTrustIds), [checkedTrustIds]);

	// 選択中のフェイスオブジェクト
	const selectedTrust = useMemo(
		() => trusts.find((t) => t.id === selectedTrustId) || null,
		[trusts, selectedTrustId]
	);

	// 詳細表示の選択ハンドラ
	const handleSelectTrust = useCallback(
		(trust: TrustMaster) => {
			setSelectedTrustId(trust.id);
			setIsMobileDetailOpen(true);
			navStack?.selectFromList({ type: 'trust', item: trust });
		},
		[navStack]
	);

	// 詳細画面を閉じるハンドラ（選択解除およびモバイルオーバーレイを閉じる）
	const handleCloseDetail = useCallback(() => {
		setSelectedTrustId(null);
		setIsMobileDetailOpen(false);
		navStack?.clear();
	}, [navStack]);

	const isSelected = selectedTrust !== null;

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 1. 左側: フェイス一覧リスト */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				{trusts.length === 0 ? (
					<div className={LAYOUT_TOKENS.view.emptyContainer}>
						<Users className="w-12 h-12 text-slate-600 mb-3" />
						<p className={LAYOUT_TOKENS.view.emptyText}>該当するフェイスが見つかりません</p>
						<p className="text-xs text-slate-500 mt-1">
							検索ワードや修得ステータスフィルターの条件を変更してください。
						</p>
					</div>
				) : (
					<div className={LAYOUT_TOKENS.view.flexColGap2}>
						{trusts.map((trust) => {
							const isChecked = checkedSet.has(trust.id);
							const isSelectedItem = trust.id === selectedTrustId;

							return (
								<TrustListItem
									key={trust.id}
									trust={trust}
									isChecked={isChecked}
									isSelected={isSelectedItem}
									onToggleCheck={onToggleCheck}
									onClickDetail={handleSelectTrust}
								/>
							);
						})}
					</div>
				)}
			</div>

			{/* 2. 右側: PC用 サイドバー詳細パネル (1024px以上のみ表示) */}
			<div className={`hidden lg:flex ${LAYOUT_TOKENS.sidebar.stickyContainer}`}>
				<TrustDetailView
					trust={selectedTrust}
					isChecked={selectedTrust ? checkedSet.has(selectedTrust.id) : false}
					onToggleCheck={onToggleCheck}
					canGoBack={navStack?.canGoBack ?? false}
					onBack={navStack?.pop}
					onClose={selectedTrust ? handleCloseDetail : undefined}
				/>
			</div>

			{/* 3. モバイル・タブレット用: フル画面オーバーレイ詳細パネル (1024px未満) */}
			{isMobileDetailOpen && selectedTrust && (
				<div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-200">
					<div className="flex justify-end mb-2">
						<button
							type="button"
							onClick={handleCloseDetail}
							className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-full"
							aria-label="詳細を閉じる"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
					<div className="flex-1 overflow-hidden">
						<TrustDetailView
							trust={selectedTrust}
							isChecked={checkedSet.has(selectedTrust.id)}
							onToggleCheck={onToggleCheck}
							canGoBack={navStack?.canGoBack ?? false}
							onBack={navStack?.pop}
							onClose={handleCloseDetail}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
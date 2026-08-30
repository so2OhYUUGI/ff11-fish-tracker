/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/trust/TrustView.tsx
 * [Role] フェイス一覧（リスト）および選択中フェイス詳細（サイドバー）の統合ビュー
 * 
 * [概要]
 * - URLパラメータ（slug）に連動した選択状態の自動特定・復元
 * - 魚チェッカー準拠のレスポンシブレイアウト（PC: 左右2カラム, モバイル: 詳細オーバーレイ）
 * - useScrollLock によるモバイル選択時の背景スクロール抑制
 * ============================================================================
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import type { TrackerNavStack } from '@/hooks/useTrackerNavigation';
import { TrustListItem } from './TrustListItem';
import { TrustDetailView } from './TrustDetailView';
import { findBySlug } from '@/utils/slug';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type Props = {
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
	navStack?: TrackerNavStack<TrustMaster>;
};

const useScrollLock = (isLocked: boolean) => {
	useEffect(() => {
		const handleScrollLock = () => {
			const isMobile = window.innerWidth < 1024;
			if (isLocked && isMobile) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		};

		handleScrollLock();
		window.addEventListener('resize', handleScrollLock);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('resize', handleScrollLock);
		};
	}, [isLocked]);
};

export const TrustView: React.FC<Props> = ({
	trusts,
	checkedTrustIds,
	onToggleCheck,
	navStack,
}) => {
	const { slug } = useParams<{ slug?: string }>();

	// URLの slug から対象のフェイスオブジェクトを特定・復元
	const selectedTrust = useMemo(() => {
		if (!slug) return null;
		return findBySlug(trusts, slug) || null;
	}, [slug, trusts]);

	// 高速参照用 Set
	const checkedSet = useMemo(() => new Set(checkedTrustIds), [checkedTrustIds]);

	const isSelected = selectedTrust !== null;

	// モバイル表示時の背景スクロール制御
	useScrollLock(isSelected);

	// 一覧リストからの選択ハンドラ
	const handleSelectTrust = useCallback(
		(trust: TrustMaster) => {
			navStack?.selectFromList({ type: 'trust', item: trust });
		},
		[navStack]
	);

	if (trusts.length === 0) {
		return (
			<div className={LAYOUT_TOKENS.view.emptyContainer}>
				<Users className="w-12 h-12 text-slate-600 mb-3" />
				<p className={LAYOUT_TOKENS.view.emptyText}>該当するフェイスが見つかりません</p>
				<p className="text-xs text-slate-500 mt-1">
					検索ワードや修得ステータスフィルターの条件を変更してください。
				</p>
			</div>
		);
	}

	return (
		<div className={LAYOUT_TOKENS.view.mainGrid}>
			{/* 1. 左側: フェイス一覧リスト */}
			<div className={LAYOUT_TOKENS.view.leftColumn(isSelected)}>
				<div className={LAYOUT_TOKENS.view.flexColGap2}>
					{trusts.map((trust) => {
						const isChecked = checkedSet.has(trust.id);
						const isSelectedItem = selectedTrust?.id === trust.id;

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
			</div>

			{/* 2. 右側: 詳細表示領域（PCサイドバー / モバイル全画面オーバーレイ制御） */}
			{isSelected && selectedTrust && (
				<div className={LAYOUT_TOKENS.sidebar.stickyContainer}>
					<TrustDetailView
						trust={selectedTrust}
						isChecked={checkedSet.has(selectedTrust.id)}
						onToggleCheck={onToggleCheck}
						canGoBack={navStack?.canGoBack ?? false}
						onBack={navStack?.pop}
						onClose={navStack?.clear}
					/>
				</div>
			)}
		</div>
	);
};
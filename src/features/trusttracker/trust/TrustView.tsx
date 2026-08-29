/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/trust/TrustView.tsx
 * [Role] フェイス一覧（リスト）および選択中フェイス詳細（サイドバー）の統合ビュー
 * 
 * [概要]
 * - フィルタリング済みフェイス一覧のリスト表示および選択状態の管理
 * - PC画面（1024px以上）: 左右2カラム（リスト + 右側サイドバー詳細）
 * - モバイル画面（1024px未満）: 選択時に詳細画面をモーダル/オーバーレイ表示
 * ============================================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import { X, Users } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import { TrustListItem } from './TrustListItem';
import { TrustDetailView } from './TrustDetailView';

type Props = {
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
};

export const TrustView: React.FC<Props> = ({
	trusts,
	checkedTrustIds,
	onToggleCheck,
}) => {
	// 現在選択されているフェイスのID
	const [selectedTrustId, setSelectedTrustId] = useState<number | null>(
		trusts.length > 0 ? trusts[0].id : null
	);

	// モバイル表示用: 詳細モーダル/オーバーレイの開閉フラグ
	const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

	// 高速参照用 Set
	const checkedSet = useMemo(() => new Set(checkedTrustIds), [checkedTrustIds]);

	// 選択中のフェイスオブジェクト
	const selectedTrust = useMemo(
		() => trusts.find((t) => t.id === selectedTrustId) || null,
		[trusts, selectedTrustId]
	);

	// 詳細表示の選択ハンドラ
	const handleSelectTrust = useCallback((trust: TrustMaster) => {
		setSelectedTrustId(trust.id);
		setIsMobileDetailOpen(true);
	}, []);

	// モバイル詳細閉じるハンドラ
	const handleCloseMobileDetail = useCallback(() => {
		setIsMobileDetailOpen(false);
	}, []);

	return (
		<div className="w-full h-full flex flex-col lg:flex-row gap-4 relative">
			{/* 1. 左側: フェイス一覧リスト */}
			<div className="flex-1 flex flex-col min-w-0 bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
				{trusts.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
						<Users className="w-12 h-12 text-slate-600 mb-3" />
						<p className="text-slate-400 font-medium">該当するフェイスが見つかりません</p>
						<p className="text-xs text-slate-500 mt-1">
							検索ワードや修得ステータスフィルターの条件を変更してください。
						</p>
					</div>
				) : (
					<div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
						{trusts.map((trust) => {
							const isChecked = checkedSet.has(trust.id);
							const isSelected = trust.id === selectedTrustId;

							return (
								<TrustListItem
									key={trust.id}
									trust={trust}
									isChecked={isChecked}
									isSelected={isSelected}
									onToggleCheck={onToggleCheck}
									onClickDetail={handleSelectTrust}
								/>
							);
						})}
					</div>
				)}
			</div>

			{/* 2. 右側: PC用 サイドバー詳細パネル (1024px以上) */}
			<div className="hidden lg:block w-[380px] xl:w-[420px] shrink-0 h-[calc(100vh-220px)] sticky top-4">
				<TrustDetailView
					trust={selectedTrust}
					isChecked={selectedTrust ? checkedSet.has(selectedTrust.id) : false}
					onToggleCheck={onToggleCheck}
				/>
			</div>

			{/* 3. モバイル用: フル画面オーバーレイ詳細パネル (1024px未満) */}
			{isMobileDetailOpen && selectedTrust && (
				<div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-200">
					<div className="flex justify-end mb-2">
						<button
							type="button"
							onClick={handleCloseMobileDetail}
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
							onClose={handleCloseMobileDetail}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
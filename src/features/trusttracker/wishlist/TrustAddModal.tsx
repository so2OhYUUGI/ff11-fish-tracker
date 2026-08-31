/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/TrustAddModal.tsx
 * [Role] ウィッシュリストへのフェイス追加検索ダイアログコンポーネント
 * 
 * [概要]
 * - マスターデータからのキーワード検索およびウィッシュリストへの登録・解除トグル操作
 * - 限定フェイス（isLimited === true）の選択リストからの除外処理
 * - モーダルの高さを固定し、検索時のガタつき（ぴょこぴょこ動く現象）を防止
 * - モーダル全体にテーマ変数（--theme-*）を適用し、テーマ切替に対応
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, Plus, Check, Users } from 'lucide-react';
import type { TrustMaster, Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { JobBadge, CombatTypeBadge } from '../common/TrustBadges';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	trusts: TrustMaster[];
	activeWishlist: Wishlist;
	onToggleWishlistTrust: (wishlistId: string, trustId: number) => void;
};

export const TrustAddModal: React.FC<Props> = ({
	isOpen,
	onClose,
	trusts,
	activeWishlist,
	onToggleWishlistTrust,
}) => {
	const [searchQuery, setSearchQuery] = useState('');

	const registeredSet = useMemo(
		() => new Set(activeWishlist.trustIds),
		[activeWishlist.trustIds]
	);

	const filteredTrusts = useMemo(() => {
		// 限定フラグ（isLimited）が true のフェイスを一覧から除外
		const nonLimitedTrusts = trusts.filter((t) => !t.isLimited);

		const query = searchQuery.trim().toLowerCase();
		if (!query) return nonLimitedTrusts;

		return nonLimitedTrusts.filter(
			(t) =>
				t.ja.toLowerCase().includes(query) ||
				t.en.toLowerCase().includes(query) ||
				t.job.toLowerCase().includes(query) ||
				(t.acquireInfo?.toLowerCase().includes(query) ?? false)
		);
	}, [trusts, searchQuery]);

	const handleToggle = useCallback(
		(trustId: number) => {
			if (
				!registeredSet.has(trustId) &&
				activeWishlist.trustIds.length >= WISHLIST_LIMITS.MAX_ITEMS
			) {
				return;
			}
			onToggleWishlistTrust(activeWishlist.id, trustId);
		},
		[activeWishlist.id, activeWishlist.trustIds.length, registeredSet, onToggleWishlistTrust]
	);

	if (!isOpen) return null;

	const isLimitReached = activeWishlist.trustIds.length >= WISHLIST_LIMITS.MAX_ITEMS;

	return (
		<div className={LAYOUT_TOKENS.modalShare.overlay}>
			{/* モーダル外枠：高さを 85vh に固定し、検索時のガタつきを防止 */}
			<div className="w-full max-w-2xl h-[85vh] my-auto bg-(--theme-container-bg) border border-(--theme-container-border) rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">

				{/* ヘッダー：インナー背景変数を指定 */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-(--theme-container-border) bg-(--theme-inner-bg) shrink-0">
					<div className={LAYOUT_TOKENS.header.titleWrapper}>
						<Users className={`${LAYOUT_TOKENS.header.icon.md} ${LAYOUT_TOKENS.header.icon.active()}`} />
						<h3 className={LAYOUT_TOKENS.header.titleText}>
							フェイスを追加 ({activeWishlist.trustIds.length} / {WISHLIST_LIMITS.MAX_ITEMS})
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className={LAYOUT_TOKENS.modalShare.closeButton}
						aria-label="閉じる"
					>
						<X className={LAYOUT_TOKENS.header.icon.md} />
					</button>
				</div>

				{/* 検索入力欄エリア */}
				<div className="px-6 py-3 border-b border-(--theme-container-border) bg-(--theme-inner-bg) shrink-0">
					<div className="relative">
						<Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${LAYOUT_TOKENS.header.icon.md} ${LAYOUT_TOKENS.header.icon.muted}`} />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="名前・ジョブ・入手方法で検索..."
							className={`${LIST_STYLES.searchInput} pl-9`}
							autoFocus
						/>
					</div>
				</div>

				{/* フェイス選択リストエリア（flex-1 で残りの高さを埋める） */}
				<div className="p-6 space-y-2 overflow-y-auto flex-1">
					{filteredTrusts.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center">
							<p className={LAYOUT_TOKENS.view.emptyText}>
								該当するフェイスが見つかりません
							</p>
						</div>
					) : (
						filteredTrusts.map((trust) => {
							const isAdded = registeredSet.has(trust.id);
							const isDisabled = !isAdded && isLimitReached;

							const buttonStateStyle = isAdded
								? COMMON_TOKENS.state.checked
								: isDisabled
									? 'opacity-50 cursor-not-allowed'
									: '';

							return (
								<div
									key={trust.id}
									className={LIST_STYLES.inlineBase}
								>
									<div className={LIST_STYLES.leftGroupContainer}>
										<div className={LIST_STYLES.titleGroup}>
											<span className={LIST_STYLES.titleInlineJa}>
												{trust.ja}
											</span>
											<span className={LIST_STYLES.titleInlineEn}>
												{trust.en}
											</span>
										</div>
										<div className={LIST_STYLES.badgeGroupContainer}>
											<JobBadge job={trust.job} />
											<CombatTypeBadge combatType={trust.combatType} />
										</div>
									</div>

									<button
										type="button"
										onClick={() => handleToggle(trust.id)}
										disabled={isDisabled}
										className={`${LAYOUT_TOKENS.control.button} ${buttonStateStyle}`}
									>
										{isAdded ? (
											<>
												<Check className={LAYOUT_TOKENS.header.icon.sm} />
												<span>追加済み</span>
											</>
										) : (
											<>
												<Plus className={LAYOUT_TOKENS.header.icon.sm} />
												<span>追加</span>
											</>
										)}
									</button>
								</div>
							);
						})
					)}
				</div>

				{/* フッター：インナー背景変数を指定 */}
				<div className="px-6 py-3 bg-(--theme-inner-bg) border-t border-(--theme-container-border) flex justify-end shrink-0">
					<button
						type="button"
						onClick={onClose}
						className={LAYOUT_TOKENS.control.button}
					>
						完了
					</button>
				</div>
			</div>
		</div>
	);
};
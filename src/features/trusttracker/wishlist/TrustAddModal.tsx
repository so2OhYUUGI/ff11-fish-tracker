/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/TrustAddModal.tsx
 * [Role] ウィッシュリストへのフェイス追加検索ダイアログコンポーネント
 * 
 * [概要]
 * - マスターデータからのキーワード検索およびウィッシュリストへの登録・解除トグル操作
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, Plus, Check, Users } from 'lucide-react';
import type { TrustMaster, Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { JobBadge, CombatTypeBadge } from '../common/TrustBadges';
import { LIST_STYLES } from '@/styles/components/listStyles';

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
		const query = searchQuery.trim().toLowerCase();
		if (!query) return trusts;

		return trusts.filter(
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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
			<div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
				{/* ヘッダー */}
				<div className="p-4 border-b border-slate-800 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Users className="w-5 h-5 text-emerald-400" />
						<h3 className="text-base font-bold text-slate-100">
							フェイスを追加 ({activeWishlist.trustIds.length} / {WISHLIST_LIMITS.MAX_ITEMS})
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* 検索入力欄 */}
				<div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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

				{/* フェイス選択リスト */}
				<div className="flex-1 overflow-y-auto p-4 space-y-2">
					{filteredTrusts.length === 0 ? (
						<p className="text-center text-sm text-slate-500 py-8">
							該当するフェイスが見つかりません
						</p>
					) : (
						filteredTrusts.map((trust) => {
							const isAdded = registeredSet.has(trust.id);
							const isDisabled = !isAdded && isLimitReached;

							return (
								<div
									key={trust.id}
									className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all gap-3"
								>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<span className="font-bold text-sm text-slate-200 truncate">
												{trust.ja}
											</span>
											<span className="text-xs text-slate-500 hidden sm:inline">
												{trust.en}
											</span>
										</div>
										<div className="flex items-center gap-2 mt-1">
											<JobBadge job={trust.job} />
											<CombatTypeBadge combatType={trust.combatType} />
										</div>
									</div>

									<button
										type="button"
										onClick={() => handleToggle(trust.id)}
										disabled={isDisabled}
										className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${isAdded
												? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
												: isDisabled
													? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'
													: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
											}`}
									>
										{isAdded ? (
											<>
												<Check className="w-3.5 h-3.5" />
												<span>追加済み</span>
											</>
										) : (
											<>
												<Plus className="w-3.5 h-3.5" />
												<span>追加</span>
											</>
										)}
									</button>
								</div>
							);
						})
					)}
				</div>

				{/* フッター */}
				<div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 shadow-sm"
					>
						完了
					</button>
				</div>
			</div>
		</div>
	);
};
/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistView.tsx
 * [Role] ウィッシュリスト（Wishlist）の3スロット閲覧・共有統合ビューコンポーネント
 * 
 * [概要]
 * - 選択中スロットに登録されたフェイスの一覧描画
 * - ヘッダーにテキスト明示の「フェイス追加」ボタンを設置
 * - リスト表示要素の整理（タイプ・アイテム表示削除、入手方法を名称と同列化）
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, Share2, Heart, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';

import type { TrustMaster, Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { TrustAddModal } from './TrustAddModal';
import { JobBadge } from '../common/TrustBadges';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';

type Props = {
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
	searchQuery: string;
	activeWishlistIndex: number;
	onWishlistIndexChange: (index: number) => void;
};

const WISHLIST_STYLES = {
	headerCard: 'bg-slate-900/80 border border-slate-800 rounded-xl p-4 md:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md backdrop-blur-sm',
	headerTitleGroup: 'flex items-center gap-3',
	headerTitle: 'text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2.5',

	// テキスト付き追加ボタン
	addButton: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-sm',

	deleteIconButton: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 hover:border-rose-500/50',

	itemRow: 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 transition-all',
} as const;

export const WishlistView: React.FC<Props> = ({
	trusts,
	checkedTrustIds,
	onToggleCheck,
	searchQuery,
	activeWishlistIndex,
	onWishlistIndexChange,
}) => {
	const {
		activeCharacter,
		addWishlist,
		updateWishlist,
		deleteWishlist,
		toggleWishlistTrust,
	} = useUserDataContext();

	const wishlists = useMemo<Wishlist[]>(() => {
		return activeCharacter?.wishlists || [];
	}, [activeCharacter?.wishlists]);

	// モーダル状態管理
	const [isNameModalOpen, setIsNameModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [editingName, setEditingName] = useState('');

	const activeWishlist = wishlists[activeWishlistIndex] || null;

	const trustMap = useMemo(() => new Map(trusts.map((t) => [t.id, t])), [trusts]);
	const checkedSet = useMemo(() => new Set(checkedTrustIds), [checkedTrustIds]);

	const wishlistTrusts = useMemo(() => {
		if (!activeWishlist) return [];
		const query = searchQuery.trim().toLowerCase();

		return activeWishlist.trustIds
			.map((id) => trustMap.get(id))
			.filter((t): t is TrustMaster => {
				if (!t) return false;
				if (!query) return true;

				return (
					t.ja.toLowerCase().includes(query) ||
					t.en.toLowerCase().includes(query) ||
					t.job.toLowerCase().includes(query) ||
					(t.acquireInfo?.toLowerCase().includes(query) ?? false)
				);
			});
	}, [activeWishlist, trustMap, searchQuery]);

	const handleCreateSlot = useCallback(() => {
		if (wishlists.length >= WISHLIST_LIMITS.MAX_SLOTS) {
			toast.error(`ウィッシュリストは最大 ${WISHLIST_LIMITS.MAX_SLOTS} つまで作成できます。`);
			return;
		}
		const defaultName = `ウィッシュリスト ${wishlists.length + 1}`;
		const success = addWishlist(defaultName);
		if (success) {
			onWishlistIndexChange(wishlists.length);
			toast.success(`「${defaultName}」を作成しました`);
		}
	}, [wishlists.length, addWishlist, onWishlistIndexChange]);

	const handleOpenEditNameModal = useCallback(() => {
		if (!activeWishlist) return;
		setEditingName(activeWishlist.name);
		setIsNameModalOpen(true);
	}, [activeWishlist]);

	const handleSaveName = useCallback(() => {
		if (!activeWishlist) return;
		const trimmed = editingName.trim();
		if (!trimmed) {
			toast.error('リスト名を入力してください');
			return;
		}
		updateWishlist(activeWishlist.id, trimmed);
		setIsNameModalOpen(false);
		toast.success('リスト名を変更しました');
	}, [activeWishlist, editingName, updateWishlist]);

	const handleDeleteSlot = useCallback(() => {
		if (!activeWishlist) return;
		if (window.confirm(`「${activeWishlist.name}」を削除してもよろしいですか？`)) {
			deleteWishlist(activeWishlist.id);
			onWishlistIndexChange(0);
			toast.success('ウィッシュリストを削除しました');
		}
	}, [activeWishlist, deleteWishlist, onWishlistIndexChange]);

	const handleRemoveFromWishlist = useCallback(
		(trustId: number) => {
			if (!activeWishlist) return;
			toggleWishlistTrust(activeWishlist.id, trustId);
			toast.info('リストから解除しました');
		},
		[activeWishlist, toggleWishlistTrust]
	);

	const handleShare = useCallback(() => {
		if (!activeWishlist) return;
		const url = new URL(window.location.href);
		url.searchParams.set('wishlist', activeWishlist.id);
		navigator.clipboard.writeText(url.toString());
		toast.success('共有用URLをクリップボードにコピーしました');
	}, [activeWishlist]);

	return (
		<div className={LAYOUT_TOKENS.view.flexColGap4}>
			{!activeWishlist ? (
				<div className={DETAIL_STYLES.emptyDetailWrapper}>
					<Heart className={DETAIL_STYLES.emptyDetailPulseIcon} />
					<h3 className={DETAIL_STYLES.emptyDetailTitle}>ウィッシュリストがありません</h3>
					<p className={DETAIL_STYLES.emptyDetailSubText}>
						FilterBar の「作成」ボタンから目標のフェイスリストを作成してください。
					</p>
					<button
						type="button"
						onClick={handleCreateSlot}
						className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-sm mt-3"
					>
						<Plus className="w-4 h-4" />
						ウィッシュリストを作成
					</button>
				</div>
			) : (
				<>
					{/* ヘッダーカード */}
					<div className={WISHLIST_STYLES.headerCard}>
						<div className={WISHLIST_STYLES.headerTitleGroup}>
							<div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
								<Heart className="w-5 h-5 fill-emerald-400/20" />
							</div>
							<div>
								<h2 className={WISHLIST_STYLES.headerTitle}>
									{activeWishlist.name}
									<span className="text-xs font-normal text-slate-400">
										({activeWishlist.trustIds.length} / {WISHLIST_LIMITS.MAX_ITEMS} 個)
									</span>
								</h2>
							</div>
						</div>

						{/* アクションボタン群 */}
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setIsAddModalOpen(true)}
								className={WISHLIST_STYLES.addButton}
							>
								<Plus className="w-4 h-4" />
								<span>フェイス追加</span>
							</button>

							<button
								type="button"
								onClick={handleOpenEditNameModal}
								className={COMMON_TOKENS.button.shareIcon}
								title="リスト名を変更"
								aria-label="リスト名を変更"
							>
								<Edit2 className="w-5 h-5 text-slate-300" />
							</button>

							<button
								type="button"
								onClick={handleShare}
								className={COMMON_TOKENS.button.shareIcon}
								title="ウィッシュリストを共有"
								aria-label="ウィッシュリストを共有"
							>
								<Share2 className={`w-5 h-5 ${COMMON_TOKENS.entity.fish.text}`} />
							</button>

							<button
								type="button"
								onClick={handleDeleteSlot}
								className={`${COMMON_TOKENS.button.shareIcon} ${WISHLIST_STYLES.deleteIconButton}`}
								title="リストを削除"
								aria-label="リストを削除"
							>
								<Trash2 className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* フェイスリスト表示部分 */}
					{wishlistTrusts.length === 0 ? (
						<div className={LAYOUT_TOKENS.view.emptyContainer}>
							<AlertCircle className="w-10 h-10 text-slate-600 mb-2" />
							<p className={LAYOUT_TOKENS.view.emptyText}>登録されているフェイスがありません</p>
							<p className="text-xs text-slate-500 mt-1">
								ヘッダーの「フェイス追加」ボタンから登録してください。
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-2">
							{wishlistTrusts.map((trust) => {
								const isChecked = checkedSet.has(trust.id);

								return (
									<div key={trust.id} className={WISHLIST_STYLES.itemRow}>
										{/* 修得チェックボタン */}
										<button
											type="button"
											onClick={() => onToggleCheck(trust.id)}
											className="text-slate-500 hover:text-emerald-400 transition-colors p-1 shrink-0"
											title={isChecked ? '未修得にする' : '修得済みにする'}
										>
											{isChecked ? (
												<CheckSquare className="w-5 h-5 text-emerald-400" />
											) : (
												<Square className="w-5 h-5" />
											)}
										</button>

										{/* メイン情報：ジョブ、名前、入手方法 */}
										<div className="flex-1 min-w-0 flex items-center gap-3">
											<JobBadge job={trust.job} />

											<div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
												<span className={`font-bold text-sm truncate ${isChecked ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
													{trust.ja}
												</span>

												{trust.acquireInfo && (
													<span className="text-xs text-slate-400 truncate">
														<span className="text-slate-500 mr-1">入手:</span>
														{trust.acquireInfo}
													</span>
												)}
											</div>
										</div>

										{/* リスト解除ボタン */}
										<button
											type="button"
											onClick={() => handleRemoveFromWishlist(trust.id)}
											className="text-slate-500 hover:text-rose-400 transition-colors p-1 shrink-0"
											title="リストから外す"
											aria-label={`${trust.ja}をリストから解除`}
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								);
							})}
						</div>
					)}
				</>
			)}

			{/* リスト追加モーダル */}
			{activeWishlist && (
				<TrustAddModal
					isOpen={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					trusts={trusts}
					activeWishlist={activeWishlist}
					onToggleWishlistTrust={toggleWishlistTrust}
				/>
			)}

			{/* 名称編集モーダル */}
			{isNameModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
					<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-md shadow-2xl">
						<h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
							<Edit2 className="w-4 h-4 text-emerald-400" />
							ウィッシュリスト名の変更
						</h3>
						<input
							type="text"
							value={editingName}
							onChange={(e) => setEditingName(e.target.value)}
							maxLength={20}
							placeholder="例: 目標フェイスリスト"
							className={LIST_STYLES.searchInput}
							autoFocus
						/>
						<div className="flex justify-end gap-2 mt-4">
							<button
								type="button"
								onClick={() => setIsNameModalOpen(false)}
								className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800"
							>
								キャンセル
							</button>
							<button
								type="button"
								onClick={handleSaveName}
								className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-sm"
							>
								保存
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
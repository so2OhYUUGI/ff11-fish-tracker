/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistView.tsx
 * [Role] アカウント共通ウィッシュリスト（Wishlist）閲覧・全キャラ一括修得管理ビューコンポーネント
 * 
 * [概要]
 * - 選択中スロットに登録されたフェイスの一覧描画
 * - アカウント配下の全キャラクターの修得状況をマトリクス（テーブル）形式で横並び表示・トグル操作
 * - 全キャラ修得完了（コンプリート）行の視覚的ハイライト表示（背景強調・アイコン付与）
 * - 戦闘タイプバッジ（CombatTypeBadge）を使用（幅固定コンテナ配置でレイアウトズレを防止）
 * - 大量キャラ・フェイス登録時でも俯瞰性と可読性を維持するレスポンシブテーブルレイアウト
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, Share, Heart, AlertCircle, CheckSquare, Square, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import type { TrustMaster, Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { TrustAddModal } from './TrustAddModal';
import { CombatTypeBadge } from '../common/TrustBadges';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';

const WISHLIST_STYLES = {
	headerCard: 'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl p-4 md:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md backdrop-blur-sm',
	headerTitleGroup: 'flex items-center gap-3',
	headerTitle: 'text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2.5',
	headerSubTitle: 'text-xs font-normal text-slate-400',
	headerIconWrapper: 'p-2 rounded-lg bg-[var(--theme-inner-bg)] border border-[var(--theme-container-border)] text-[var(--theme-text-accent)]',

	// テキスト付き追加ボタン
	addButton: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--theme-text-accent)] bg-[var(--theme-inner-bg)] hover:bg-[var(--theme-active-item-bg)] border border-[var(--theme-accent-border)] transition-all shadow-sm',

	// 汎用アクションボタン
	actionButton: 'p-2 rounded-lg text-slate-300 hover:text-slate-100 bg-[var(--theme-inner-bg)] hover:bg-[var(--theme-active-item-bg)] border border-[var(--theme-container-border)] transition-colors',
	deleteIconButton: 'p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 transition-colors',

	// テーブルコンテナ・レイアウト
	tableCard: 'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl overflow-hidden shadow-md backdrop-blur-sm',
	table: 'w-full text-left border-collapse min-w-[600px]',
	thead: 'border-b border-[var(--theme-container-border)] bg-[var(--theme-inner-bg)] text-xs font-semibold text-slate-400',
	thTrust: 'p-3 min-w-[260px]',
	thChar: 'p-3 text-center w-28 min-w-[112px]',
	thAction: 'p-3 text-center w-12 min-w-[48px]',
	tbody: 'divide-y divide-[var(--theme-container-border)]/60 text-sm',

	// 行ステート
	trNormal: 'hover:bg-[var(--theme-active-item-bg)] transition-colors',
	trCompleted: 'bg-emerald-950/20 hover:bg-emerald-950/30 transition-colors',

	// トグルボタン
	checkButtonChecked: 'inline-flex items-center justify-center p-1.5 rounded-lg border transition-all bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
	checkButtonUnchecked: 'inline-flex items-center justify-center p-1.5 rounded-lg border transition-all bg-[var(--theme-inner-bg)] text-slate-500 border-[var(--theme-container-border)] hover:text-slate-300 hover:bg-[var(--theme-active-item-bg)]',

	// モーダル関連
	modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm',
	modalCard: 'bg-[var(--theme-container-bg)] border border-[var(--theme-container-border)] rounded-xl p-5 w-full max-w-md shadow-2xl',
	modalTitle: 'text-base font-bold text-slate-100 mb-3 flex items-center gap-2',
	modalCancelBtn: 'px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-[var(--theme-active-item-bg)] transition-colors',
	modalSaveBtn: 'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-sm transition-colors',
	createBtn: 'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 shadow-sm mt-3 transition-colors',
} as const;

type Props = {
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
	searchQuery: string;
	activeWishlistIndex: number;
	onWishlistIndexChange: (index: number) => void;
};

export const WishlistView: React.FC<Props> = ({
	trusts,
	searchQuery,
	activeWishlistIndex,
	onWishlistIndexChange,
}) => {
	const {
		userData,
		addWishlist,
		updateWishlist,
		deleteWishlist,
		toggleWishlistTrust,
		toggleCharacterTrustCheck,
	} = useUserDataContext();

	const wishlists = useMemo<Wishlist[]>(() => {
		return userData.wishlists || [];
	}, [userData.wishlists]);

	const characters = useMemo(() => {
		return userData.characters || [];
	}, [userData.characters]);

	// モーダル状態管理
	const [isNameModalOpen, setIsNameModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [editingName, setEditingName] = useState('');

	const activeWishlist = wishlists[activeWishlistIndex] || null;

	const trustMap = useMemo(() => new Map(trusts.map((t) => [t.id, t])), [trusts]);

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
					(t.combatType?.toLowerCase().includes(query) ?? false) ||
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
		<div className={LAYOUT_TOKENS.view.flexColGap2}>
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
						className={WISHLIST_STYLES.createBtn}
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
							<div className={WISHLIST_STYLES.headerIconWrapper}>
								<Heart className="w-5 h-5 fill-current" />
							</div>
							<div>
								<h2 className={WISHLIST_STYLES.headerTitle}>
									{activeWishlist.name}
									<span className={WISHLIST_STYLES.headerSubTitle}>
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
								className={WISHLIST_STYLES.actionButton}
								title="リスト名を変更"
								aria-label="リスト名を変更"
							>
								<Edit2 className="w-5 h-5 text-slate-300" />
							</button>

							<button
								type="button"
								onClick={handleShare}
								className={WISHLIST_STYLES.actionButton}
								title="ウィッシュリストを共有"
								aria-label="ウィッシュリストを共有"
							>
								<Share className={`w-5 h-5 ${COMMON_TOKENS.entity.fish.text}`} />
							</button>

							<button
								type="button"
								onClick={handleDeleteSlot}
								className={WISHLIST_STYLES.deleteIconButton}
								title="リストを削除"
								aria-label="リストを削除"
							>
								<Trash2 className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* フェイスリスト表示部分 (マトリクス・テーブルUI) */}
					{wishlistTrusts.length === 0 ? (
						<div className={LAYOUT_TOKENS.view.emptyContainer}>
							<AlertCircle className="w-10 h-10 text-slate-600 mb-2" />
							<p className={LAYOUT_TOKENS.view.emptyText}>登録されているフェイスがありません</p>
							<p className={DETAIL_STYLES.emptyDetailSubText}>
								ヘッダーの「フェイス追加」ボタンから登録してください。
							</p>
						</div>
					) : (
						<div className={WISHLIST_STYLES.tableCard}>
							<div className="overflow-x-auto">
								<table className={WISHLIST_STYLES.table}>
									<thead>
										<tr className={WISHLIST_STYLES.thead}>
											<th className={WISHLIST_STYLES.thTrust}>フェイス</th>
											{characters.map((char) => (
												<th key={char.id} className={WISHLIST_STYLES.thChar}>
													<div className="flex items-center justify-center gap-1.5 truncate" title={char.name}>
														<User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
														<span className="truncate">{char.name}</span>
													</div>
												</th>
											))}
											<th className={WISHLIST_STYLES.thAction}>操作</th>
										</tr>
									</thead>
									<tbody className={WISHLIST_STYLES.tbody}>
										{wishlistTrusts.map((trust) => {
											// 全キャラクターが修得済みか判定
											const isAllCompleted =
												characters.length > 0 &&
												characters.every((char) => char.checkedTrustIds.includes(trust.id));

											return (
												<tr
													key={trust.id}
													className={isAllCompleted ? WISHLIST_STYLES.trCompleted : WISHLIST_STYLES.trNormal}
												>
													{/* フェイス基本情報 */}
													<td className="p-3">
														<div className="flex items-center gap-2.5">
															{/* バッジの表示幅を w-[5.25rem] (84px) に固定 */}
															<div className="w-[5.25rem] shrink-0 flex justify-center">
																<CombatTypeBadge combatType={trust.combatType} />
															</div>
															<div className="min-w-0 flex-1">
																<div className="font-bold text-slate-100 truncate flex items-center gap-1.5">
																	<span>{trust.ja}</span>
																	{isAllCompleted && (
																		<CheckCircle2
																			className="w-4 h-4 text-emerald-400 shrink-0"
																		/>
																	)}
																</div>
																{trust.acquireInfo && (
																	<div className="text-xs text-slate-400 truncate max-w-xs">
																		<span className="text-slate-500 mr-1">入手:</span>
																		{trust.acquireInfo}
																	</div>
																)}
															</div>
														</div>
													</td>

													{/* 各キャラクターの修得チェックセル */}
													{characters.map((char) => {
														const isChecked = char.checkedTrustIds.includes(trust.id);
														return (
															<td key={char.id} className="p-3 text-center">
																<button
																	type="button"
																	onClick={() => toggleCharacterTrustCheck(char.id, trust.id)}
																	className={isChecked ? WISHLIST_STYLES.checkButtonChecked : WISHLIST_STYLES.checkButtonUnchecked}
																	title={`${char.name}: ${isChecked ? '未修得にする' : '修得済みにする'}`}
																>
																	{isChecked ? (
																		<CheckSquare className="w-5 h-5" />
																	) : (
																		<Square className="w-5 h-5" />
																	)}
																</button>
															</td>
														);
													})}

													{/* リスト解除操作 */}
													<td className="p-3 text-center">
														<button
															type="button"
															onClick={() => handleRemoveFromWishlist(trust.id)}
															className="text-slate-500 hover:text-rose-400 transition-colors p-1"
															title="リストから外す"
															aria-label={`${trust.ja}をリストから解除`}
														>
															<Trash2 className="w-4 h-4" />
														</button>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
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
				<div className={WISHLIST_STYLES.modalOverlay}>
					<div className={WISHLIST_STYLES.modalCard}>
						<h3 className={WISHLIST_STYLES.modalTitle}>
							<Edit2 className="w-4 h-4 text-[var(--theme-text-accent)]" />
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
								className={WISHLIST_STYLES.modalCancelBtn}
							>
								キャンセル
							</button>
							<button
								type="button"
								onClick={handleSaveName}
								className={WISHLIST_STYLES.modalSaveBtn}
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
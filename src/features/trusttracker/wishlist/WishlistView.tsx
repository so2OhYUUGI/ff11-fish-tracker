/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistView.tsx
 * [Role] アカウント共通ウィッシュリスト（Wishlist）閲覧・全キャラ一括修得管理ビューコンポーネント
 * 
 * [概要]
 * - 選択中スロット（ID管理）に登録されたフェイスの一覧描画
 * - アカウント配下の全キャラクターの修得状況をマトリクス（テーブル）形式で横並び表示・トグル操作
 * - 全キャラ修得完了（コンプリート）行の視覚的ハイライト表示（背景強調・アイコン付与）
 * - 戦闘タイプバッジ（CombatTypeBadge）を使用（幅固定コンテナ配置でレイアウトズレを防止）
 * - 大量キャラ・フェイス登録時でも俯瞰性と可読性を維持するレスポンシブテーブルレイアウト
 * - ウィッシュリストの複製（コピー）機能
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, Share, Heart, AlertCircle, CheckSquare, Square, User, CheckCircle2, Copy, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import type { TrustMaster, Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { TrustAddModal } from './TrustAddModal';
import { CombatTypeBadge } from '../common/TrustBadges';
import { shareContent } from '@/utils/share';
import { encodeSharedWishlistProgress } from '@/utils/shareEncoding';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { WISHLIST_STYLES } from '@/styles/components/wishlistStyles';

type Props = {
	trusts: TrustMaster[];
	checkedTrustIds: number[];
	onToggleCheck: (trustId: number) => void;
	searchQuery: string;
	wishlists?: Wishlist[];
	activeWishlistId: string;
	onWishlistIdChange: (id: string) => void;
};

export const WishlistView: React.FC<Props> = ({
	trusts,
	searchQuery,
	wishlists: propWishlists,
	activeWishlistId,
	onWishlistIdChange,
}) => {
	const {
		userData,
		wishlists: contextWishlists, // 共有リストがマージされたContext側のリスト
		addWishlist,
		updateWishlist,
		deleteWishlist,
		toggleWishlistTrust,
		toggleCharacterTrustCheck,
	} = useUserDataContext();

	// Props経由のリスト一覧を優先し、無ければContextの合成済みリストを使用
	const wishlists = useMemo<Wishlist[]>(() => {
		return propWishlists || contextWishlists || [];
	}, [propWishlists, contextWishlists]);

	const characters = useMemo(() => {
		return userData.characters || [];
	}, [userData.characters]);

	// モーダル状態管理
	const [isNameModalOpen, setIsNameModalOpen] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

	const [editingName, setEditingName] = useState('');
	const [copyTargetId, setCopyTargetId] = useState<string>('NEW');

	const activeWishlist = useMemo(() => {
		return wishlists.find((w) => w.id === activeWishlistId) || null;
	}, [wishlists, activeWishlistId]);

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
		const newId = addWishlist(defaultName);
		if (newId) {
			onWishlistIdChange(newId);
			toast.success(`「${defaultName}」を作成しました`);
		}
	}, [wishlists.length, addWishlist, onWishlistIdChange]);

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

	const handleOpenCopyModal = useCallback(() => {
		if (!activeWishlist) return;
		if (wishlists.length < WISHLIST_LIMITS.MAX_SLOTS) {
			setCopyTargetId('NEW');
		} else {
			const availableList = wishlists.find((w) => w.id !== activeWishlistId);
			setCopyTargetId(availableList ? availableList.id : wishlists[0]?.id || 'NEW');
		}
		setIsCopyModalOpen(true);
	}, [activeWishlist, wishlists, activeWishlistId]);

	const handleCopyWishlist = useCallback(() => {
		if (!activeWishlist) return;

		if (copyTargetId === 'NEW') {
			if (wishlists.length >= WISHLIST_LIMITS.MAX_SLOTS) {
				toast.error(`ウィッシュリストは最大 ${WISHLIST_LIMITS.MAX_SLOTS} つまで作成できます。`);
				return;
			}
			const newListName = `${activeWishlist.name} のコピー`;
			const newId = addWishlist(newListName);
			if (newId) {
				updateWishlist(newId, newListName, [...activeWishlist.trustIds]);
				onWishlistIdChange(newId);
				setIsCopyModalOpen(false);
				toast.success(`「${newListName}」として複製しました`);
			}
		} else {
			const targetWishlist = wishlists.find((w) => w.id === copyTargetId);
			if (!targetWishlist) return;

			updateWishlist(targetWishlist.id, targetWishlist.name, [...activeWishlist.trustIds]);
			onWishlistIdChange(copyTargetId);
			setIsCopyModalOpen(false);
			toast.success(`「${targetWishlist.name}」へコピーしました`);
		}
	}, [activeWishlist, copyTargetId, wishlists, addWishlist, updateWishlist, onWishlistIdChange]);

	const handleDeleteSlot = useCallback(() => {
		if (!activeWishlist) return;
		if (window.confirm(`「${activeWishlist.name}」を削除してもよろしいですか？`)) {
			const remainingList = wishlists.filter((w) => w.id !== activeWishlist.id);
			deleteWishlist(activeWishlist.id);
			onWishlistIdChange(remainingList[0]?.id || '');
			toast.success('ウィッシュリストを削除しました');
		}
	}, [activeWishlist, wishlists, deleteWishlist, onWishlistIdChange]);

	const handleRemoveFromWishlist = useCallback(
		(trustId: number) => {
			if (!activeWishlist) return;
			toggleWishlistTrust(activeWishlist.id, trustId);
			toast.info('リストから解除しました');
		},
		[activeWishlist, toggleWishlistTrust]
	);

	// shareContent ユーティリティを使用した共有処理
	const handleShare = useCallback(async () => {
		if (!activeWishlist) return;

		const encodedData = encodeSharedWishlistProgress(activeWishlist);
		const url = new URL(window.location.href);

		// クエリ文字列の整形（既存パラメータのクリアと新規追加）
		url.search = '';
		if (encodedData) {
			url.searchParams.set('wishlist_share', encodedData);
		}

		await shareContent({
			title: `FF11 フェイスウィッシュリスト - ${activeWishlist.name}`,
			text: `【FF11 フェイスウィッシュリスト】\nリスト名: ${activeWishlist.name}\n登録数: ${activeWishlist.trustIds.length}個`,
			url: url.toString(),
		});
	}, [activeWishlist]);

	// 共有リスト（isShared または shared- ID）かどうか
	const isSharedWishlist = activeWishlist
		? (activeWishlist as { isShared?: boolean }).isShared || activeWishlist.id.startsWith('shared-')
		: false;

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
						<div className={WISHLIST_STYLES.actionsGroup}>
							{!isSharedWishlist && (
								<>
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
										<Edit2 className="w-5 h-5" />
									</button>
								</>
							)}

							<button
								type="button"
								onClick={handleOpenCopyModal}
								className={WISHLIST_STYLES.actionButton}
								title="ウィッシュリストをコピー"
								aria-label="ウィッシュリストをコピー"
							>
								<Copy className="w-5 h-5" />
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

							{!isSharedWishlist && (
								<button
									type="button"
									onClick={handleDeleteSlot}
									className={WISHLIST_STYLES.deleteIconButton}
									title="リストを削除"
									aria-label="リストを削除"
								>
									<Trash2 className="w-5 h-5" />
								</button>
							)}
						</div>
					</div>

					{/* フェイスリスト表示部分 (マトリクス・テーブルUI) */}
					{wishlistTrusts.length === 0 ? (
						<div className={LAYOUT_TOKENS.view.emptyContainer}>
							<AlertCircle className="w-10 h-10 text-slate-600 mb-2" />
							<p className={LAYOUT_TOKENS.view.emptyText}>登録されているフェイスがありません</p>
							{!isSharedWishlist && (
								<p className={DETAIL_STYLES.emptyDetailSubText}>
									ヘッダーの「フェイス追加」ボタンから登録してください。
								</p>
							)}
						</div>
					) : (
						<div className={WISHLIST_STYLES.tableCard}>
							<div className={WISHLIST_STYLES.tableWrapper}>
								<table className={WISHLIST_STYLES.table}>
									<thead>
										<tr className={WISHLIST_STYLES.thead}>
											<th className={WISHLIST_STYLES.thTrust}>フェイス</th>
											{characters.map((char) => (
												<th key={char.id} className={WISHLIST_STYLES.thChar}>
													<div className={WISHLIST_STYLES.charHeaderContainer} title={char.name}>
														<User className={WISHLIST_STYLES.charHeaderIcon} />
														<span className="truncate">{char.name}</span>
													</div>
												</th>
											))}
											{!isSharedWishlist && <th className={WISHLIST_STYLES.thAction}>操作</th>}
										</tr>
									</thead>
									<tbody className={WISHLIST_STYLES.tbody}>
										{wishlistTrusts.map((trust) => {
											const isAllCompleted =
												characters.length > 0 &&
												characters.every((char) => char.checkedTrustIds.includes(trust.id));

											return (
												<tr
													key={trust.id}
													className={isAllCompleted ? WISHLIST_STYLES.trCompleted : WISHLIST_STYLES.trNormal}
												>
													{/* フェイス基本情報 */}
													<td className={WISHLIST_STYLES.trustCellContainer}>
														<div className={WISHLIST_STYLES.trustCellWrapper}>
															<div className={WISHLIST_STYLES.badgeWrapper}>
																<CombatTypeBadge combatType={trust.combatType} />
															</div>
															<div className={WISHLIST_STYLES.trustInfoGroup}>
																<div className={WISHLIST_STYLES.trustTitle}>
																	<span>{trust.ja}</span>
																	{isAllCompleted && (
																		<CheckCircle2 className={WISHLIST_STYLES.trustCompletedIcon} />
																	)}
																</div>
																{trust.acquireInfo && (
																	<div className={WISHLIST_STYLES.acquireInfo}>
																		<span className={WISHLIST_STYLES.acquireLabel}>入手:</span>
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
															<td key={char.id} className={WISHLIST_STYLES.centerCell}>
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

													{/* リスト解除操作（共有リスト閲覧時は非表示） */}
													{!isSharedWishlist && (
														<td className={WISHLIST_STYLES.centerCell}>
															<button
																type="button"
																onClick={() => handleRemoveFromWishlist(trust.id)}
																className={WISHLIST_STYLES.removeButton}
																title="リストから外す"
																aria-label={`${trust.ja}をリストから解除`}
															>
																<Trash2 className="w-4 h-4" />
															</button>
														</td>
													)}
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
			{activeWishlist && !isSharedWishlist && (
				<TrustAddModal
					isOpen={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					trusts={trusts}
					activeWishlist={activeWishlist}
					onToggleWishlistTrust={toggleWishlistTrust}
				/>
			)}

			{/* 名称編集モーダル */}
			{isNameModalOpen && activeWishlist && !isSharedWishlist && (
				<div className={WISHLIST_STYLES.modalOverlay}>
					<div className={WISHLIST_STYLES.modalCard}>
						<h3 className={WISHLIST_STYLES.modalTitle}>
							<Edit2 className="w-4 h-4 text-(--theme-text-accent)" />
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
						<div className={WISHLIST_STYLES.modalActionsGroup}>
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

			{/* リストコピーモーダル */}
			{isCopyModalOpen && activeWishlist && (
				<div className={WISHLIST_STYLES.modalOverlay}>
					<div className={WISHLIST_STYLES.modalCard}>
						<h3 className={WISHLIST_STYLES.modalTitle}>
							<Copy className="w-4 h-4 text-(--theme-text-accent)" />
							ウィッシュリストのコピー
						</h3>

						<div className={WISHLIST_STYLES.copyModalContent}>
							<div className={WISHLIST_STYLES.copyFlowCard}>
								<div>
									<span className={WISHLIST_STYLES.copyFlowLabel}>コピー元リスト</span>
									<span className={WISHLIST_STYLES.copyFlowValue}>{activeWishlist.name}</span>
								</div>

								<div className={WISHLIST_STYLES.copyArrowWrapper}>
									<ArrowRight className={WISHLIST_STYLES.copyArrowIcon} />
								</div>

								<div>
									<label className={WISHLIST_STYLES.copyFlowLabelBold}>コピー先</label>
									<select
										value={copyTargetId}
										onChange={(e) => setCopyTargetId(e.target.value)}
										className={`${LIST_STYLES.searchInput} w-full`}
									>
										{wishlists.filter((w) => !(w as { isShared?: boolean }).isShared).length < WISHLIST_LIMITS.MAX_SLOTS && (
											<option value="NEW">新規スロットとして追加</option>
										)}
										{wishlists
											.filter((w) => !(w as { isShared?: boolean }).isShared)
											.map((w, idx) => (
												<option key={w.id} value={w.id}>
													スロット {idx + 1}: {w.name} {w.id === activeWishlistId ? '(現在のリスト)' : ''}
												</option>
											))}
									</select>
								</div>
							</div>

							{copyTargetId !== 'NEW' && (
								<p className={WISHLIST_STYLES.copyWarningText}>
									※ 既存のスロットへ上書きコピーされます。対象スロットの登録済みフェイスは上書きされます。
								</p>
							)}
						</div>

						<div className={WISHLIST_STYLES.modalActionsGroup}>
							<button
								type="button"
								onClick={() => setIsCopyModalOpen(false)}
								className={WISHLIST_STYLES.modalCancelBtn}
							>
								キャンセル
							</button>
							<button
								type="button"
								onClick={handleCopyWishlist}
								className={WISHLIST_STYLES.modalSaveBtn}
							>
								コピー実行
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
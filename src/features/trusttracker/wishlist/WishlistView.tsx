/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistView.tsx
 * [Role] アカウント共通ウィッシュリスト（Wishlist）閲覧・全キャラ一括修得管理ビューコンポーネント
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Heart, AlertCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

import type { TrustMaster, Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { TrustAddModal } from './TrustAddModal';
import { WishlistHeader } from './WishlistHeader';
import { WishlistTable } from './WishlistTable';
import { WishlistNameEditModal, WishlistCopyModal } from './WishlistModals';
import { shareContent } from '@/utils/share';
import { encodeSharedWishlistProgress } from '@/utils/shareEncoding';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
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
		isRegistered,
		userData,
		wishlists: contextWishlists,
		addWishlist,
		updateWishlist,
		deleteWishlist,
		toggleWishlistTrust,
		toggleCharacterTrustCheck,
	} = useUserDataContext();

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
		if (!isRegistered) return;
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
	}, [isRegistered, wishlists.length, addWishlist, onWishlistIdChange]);

	const handleOpenEditNameModal = useCallback(() => {
		if (!activeWishlist || !isRegistered) return;
		setEditingName(activeWishlist.name);
		setIsNameModalOpen(true);
	}, [activeWishlist, isRegistered]);

	const handleSaveName = useCallback(() => {
		if (!activeWishlist || !isRegistered) return;
		const trimmed = editingName.trim();
		if (!trimmed) {
			toast.error('リスト名を入力してください');
			return;
		}
		updateWishlist(activeWishlist.id, trimmed);
		setIsNameModalOpen(false);
		toast.success('リスト名を変更しました');
	}, [activeWishlist, editingName, isRegistered, updateWishlist]);

	const handleOpenCopyModal = useCallback(() => {
		if (!activeWishlist || !isRegistered) return;
		if (wishlists.length < WISHLIST_LIMITS.MAX_SLOTS) {
			setCopyTargetId('NEW');
		} else {
			const availableList = wishlists.find((w) => w.id !== activeWishlistId);
			setCopyTargetId(availableList ? availableList.id : wishlists[0]?.id || 'NEW');
		}
		setIsCopyModalOpen(true);
	}, [activeWishlist, isRegistered, wishlists, activeWishlistId]);

	const handleCopyWishlist = useCallback(() => {
		if (!activeWishlist || !isRegistered) return;

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
	}, [activeWishlist, isRegistered, copyTargetId, wishlists, addWishlist, updateWishlist, onWishlistIdChange]);

	const handleDeleteSlot = useCallback(() => {
		if (!activeWishlist || !isRegistered) return;
		if (window.confirm(`「${activeWishlist.name}」を削除してもよろしいですか？`)) {
			const remainingList = wishlists.filter((w) => w.id !== activeWishlist.id);
			deleteWishlist(activeWishlist.id);
			onWishlistIdChange(remainingList[0]?.id || '');
			toast.success('ウィッシュリストを削除しました');
		}
	}, [activeWishlist, isRegistered, wishlists, deleteWishlist, onWishlistIdChange]);

	const handleRemoveFromWishlist = useCallback(
		(trustId: number) => {
			if (!activeWishlist || !isRegistered) return;
			toggleWishlistTrust(activeWishlist.id, trustId);
			toast.info('リストから解除しました');
		},
		[activeWishlist, isRegistered, toggleWishlistTrust]
	);

	const handleShare = useCallback(async () => {
		if (!activeWishlist) return;

		const encodedData = encodeSharedWishlistProgress(activeWishlist);
		const url = new URL(window.location.href);

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
						disabled={!isRegistered}
						title={!isRegistered ? 'キャラクター登録を行うと作成できます' : undefined}
						className={`${WISHLIST_STYLES.createBtn} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
							}`}
					>
						{!isRegistered ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
						ウィッシュリストを作成
					</button>
				</div>
			) : (
				<>
					<WishlistHeader
						activeWishlist={activeWishlist}
						isRegistered={isRegistered}
						isSharedWishlist={isSharedWishlist}
						onOpenAddModal={() => setIsAddModalOpen(true)}
						onOpenEditNameModal={handleOpenEditNameModal}
						onOpenCopyModal={handleOpenCopyModal}
						onShare={handleShare}
						onDeleteSlot={handleDeleteSlot}
					/>

					{wishlistTrusts.length === 0 ? (
						<div className={LAYOUT_TOKENS.view.emptyContainer}>
							<AlertCircle className="w-10 h-10 text-slate-600 mb-2" />
							<p className={LAYOUT_TOKENS.view.emptyText}>登録されているフェイスがありません</p>
							{!isSharedWishlist && isRegistered && (
								<p className={DETAIL_STYLES.emptyDetailSubText}>
									ヘッダーの「フェイス追加」ボタンから登録してください。
								</p>
							)}
						</div>
					) : (
						<WishlistTable
							wishlistTrusts={wishlistTrusts}
							characters={characters}
							isRegistered={isRegistered}
							isSharedWishlist={isSharedWishlist}
							onToggleCharacterTrustCheck={toggleCharacterTrustCheck}
							onRemoveFromWishlist={handleRemoveFromWishlist}
						/>
					)}
				</>
			)}

			{/* フェイス追加モーダル */}
			{activeWishlist && !isSharedWishlist && isRegistered && (
				<TrustAddModal
					isOpen={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					trusts={trusts}
					activeWishlist={activeWishlist}
					onToggleWishlistTrust={toggleWishlistTrust}
				/>
			)}

			{/* リスト名変更モーダル */}
			<WishlistNameEditModal
				isOpen={isNameModalOpen && Boolean(activeWishlist) && !isSharedWishlist && isRegistered}
				editingName={editingName}
				onEditingNameChange={setEditingName}
				onSave={handleSaveName}
				onClose={() => setIsNameModalOpen(false)}
			/>

			{/* リストコピーモーダル */}
			{activeWishlist && (
				<WishlistCopyModal
					isOpen={isCopyModalOpen && isRegistered}
					activeWishlist={activeWishlist}
					wishlists={wishlists}
					activeWishlistId={activeWishlistId}
					copyTargetId={copyTargetId}
					onCopyTargetIdChange={setCopyTargetId}
					onCopy={handleCopyWishlist}
					onClose={() => setIsCopyModalOpen(false)}
				/>
			)}
		</div>
	);
};
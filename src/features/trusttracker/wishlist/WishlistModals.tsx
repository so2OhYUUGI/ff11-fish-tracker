/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistModals.tsx
 * [Role] ウィッシュリストで使用するモーダルダイアログ群（名前変更・コピー）
 * ============================================================================
 */

import React from 'react';
import { Edit2, Copy, ArrowRight } from 'lucide-react';
import type { Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { WISHLIST_STYLES } from '@/styles/components/wishlistStyles';

type NameEditModalProps = {
	isOpen: boolean;
	editingName: string;
	onEditingNameChange: (name: string) => void;
	onSave: () => void;
	onClose: () => void;
};

export const WishlistNameEditModal: React.FC<NameEditModalProps> = ({
	isOpen,
	editingName,
	onEditingNameChange,
	onSave,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div className={WISHLIST_STYLES.modalOverlay}>
			<div className={WISHLIST_STYLES.modalCard}>
				<h3 className={WISHLIST_STYLES.modalTitle}>
					<Edit2 className="w-4 h-4 text-(--theme-text-accent)" />
					ウィッシュリスト名の変更
				</h3>
				<input
					type="text"
					value={editingName}
					onChange={(e) => onEditingNameChange(e.target.value)}
					maxLength={20}
					placeholder="例: 目標フェイスリスト"
					className={LIST_STYLES.searchInput}
					autoFocus
				/>
				<div className={WISHLIST_STYLES.modalActionsGroup}>
					<button type="button" onClick={onClose} className={WISHLIST_STYLES.modalCancelBtn}>
						キャンセル
					</button>
					<button type="button" onClick={onSave} className={WISHLIST_STYLES.modalSaveBtn}>
						保存
					</button>
				</div>
			</div>
		</div>
	);
};

type CopyModalProps = {
	isOpen: boolean;
	activeWishlist: Wishlist;
	wishlists: Wishlist[];
	activeWishlistId: string;
	copyTargetId: string;
	onCopyTargetIdChange: (id: string) => void;
	onCopy: () => void;
	onClose: () => void;
};

export const WishlistCopyModal: React.FC<CopyModalProps> = ({
	isOpen,
	activeWishlist,
	wishlists,
	activeWishlistId,
	copyTargetId,
	onCopyTargetIdChange,
	onCopy,
	onClose,
}) => {
	if (!isOpen) return null;

	const selectableWishlists = wishlists.filter((w) => !(w as { isShared?: boolean }).isShared);

	return (
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
								onChange={(e) => onCopyTargetIdChange(e.target.value)}
								className={`${LIST_STYLES.searchInput} w-full`}
							>
								{selectableWishlists.length < WISHLIST_LIMITS.MAX_SLOTS && (
									<option value="NEW">新規スロットとして追加</option>
								)}
								{selectableWishlists.map((w, idx) => (
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
					<button type="button" onClick={onClose} className={WISHLIST_STYLES.modalCancelBtn}>
						キャンセル
					</button>
					<button type="button" onClick={onCopy} className={WISHLIST_STYLES.modalSaveBtn}>
						コピー実行
					</button>
				</div>
			</div>
		</div>
	);
};
/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistHeader.tsx
 * [Role] ウィッシュリストのヘッダーカード（タイトル表示・各種操作ボタン群）
 * ============================================================================
 */

import React from 'react';
import { Heart, Plus, Edit2, Copy, Share, Trash2, Lock } from 'lucide-react';
import type { Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { WISHLIST_STYLES } from '@/styles/components/wishlistStyles';

type Props = {
	activeWishlist: Wishlist;
	isRegistered: boolean;
	isSharedWishlist: boolean;
	onOpenAddModal: () => void;
	onOpenEditNameModal: () => void;
	onOpenCopyModal: () => void;
	onShare: () => void;
	onDeleteSlot: () => void;
};

export const WishlistHeader: React.FC<Props> = ({
	activeWishlist,
	isRegistered,
	isSharedWishlist,
	onOpenAddModal,
	onOpenEditNameModal,
	onOpenCopyModal,
	onShare,
	onDeleteSlot,
}) => {
	return (
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
							onClick={onOpenAddModal}
							disabled={!isRegistered}
							title={!isRegistered ? 'キャラクター登録を行うと追加できます' : undefined}
							className={`${WISHLIST_STYLES.addButton} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
								}`}
						>
							{!isRegistered ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
							<span>フェイス追加</span>
						</button>

						<button
							type="button"
							onClick={onOpenEditNameModal}
							disabled={!isRegistered}
							className={`${WISHLIST_STYLES.actionButton} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							title={!isRegistered ? 'キャラクター登録を行うと編集できます' : 'リスト名を変更'}
							aria-label="リスト名を変更"
						>
							{!isRegistered ? <Lock className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
						</button>
					</>
				)}

				{/* コピーボタン */}
				<button
					type="button"
					onClick={onOpenCopyModal}
					disabled={!isRegistered}
					className={`${WISHLIST_STYLES.actionButton} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					title={!isRegistered ? 'キャラクター登録を行うとコピーできます' : 'ウィッシュリストをコピー'}
					aria-label="ウィッシュリストをコピー"
				>
					{!isRegistered ? <Lock className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
				</button>

				{/* 共有ボタン */}
				<button
					type="button"
					onClick={onShare}
					className={WISHLIST_STYLES.actionButton}
					title="ウィッシュリストを共有"
					aria-label="ウィッシュリストを共有"
				>
					<Share className={`w-5 h-5 ${COMMON_TOKENS.entity.fish.text}`} />
				</button>

				{!isSharedWishlist && (
					<button
						type="button"
						onClick={onDeleteSlot}
						disabled={!isRegistered}
						className={`${WISHLIST_STYLES.deleteIconButton} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
							}`}
						title={!isRegistered ? 'キャラクター登録を行うと削除できます' : 'リストを削除'}
						aria-label="リストを削除"
					>
						{!isRegistered ? <Lock className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
					</button>
				)}
			</div>
		</div>
	);
};
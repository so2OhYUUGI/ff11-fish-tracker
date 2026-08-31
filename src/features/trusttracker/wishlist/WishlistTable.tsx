/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/wishlist/WishlistTable.tsx
 * [Role] ウィッシュリストのフェイス一覧および全キャラ修得状況マトリクステーブル
 * ============================================================================
 */

import React from 'react';
import { User, CheckCircle2, CheckSquare, Square, Trash2, Lock } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import type { NormalizedCharacterProgress } from '@/types/user';
import { CombatTypeBadge } from '../common/TrustBadges';
import { WISHLIST_STYLES } from '@/styles/components/wishlistStyles';

type Props = {
	wishlistTrusts: TrustMaster[];
	characters: NormalizedCharacterProgress[];
	isRegistered: boolean;
	isSharedWishlist: boolean;
	onToggleCharacterTrustCheck: (charId: string, trustId: number) => void;
	onRemoveFromWishlist: (trustId: number) => void;
};

export const WishlistTable: React.FC<Props> = ({
	wishlistTrusts,
	characters,
	isRegistered,
	isSharedWishlist,
	onToggleCharacterTrustCheck,
	onRemoveFromWishlist,
}) => {
	return (
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
													onClick={isRegistered ? () => onToggleCharacterTrustCheck(char.id, trust.id) : undefined}
													disabled={!isRegistered}
													className={`${isChecked ? WISHLIST_STYLES.checkButtonChecked : WISHLIST_STYLES.checkButtonUnchecked} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
														}`}
													title={!isRegistered ? 'キャラクター登録を行うと操作できます' : `${char.name}: ${isChecked ? '未修得にする' : '修得済みにする'}`}
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
									{!isSharedWishlist && (
										<td className={WISHLIST_STYLES.centerCell}>
											<button
												type="button"
												onClick={isRegistered ? () => onRemoveFromWishlist(trust.id) : undefined}
												disabled={!isRegistered}
												className={`${WISHLIST_STYLES.removeButton} ${!isRegistered ? 'opacity-50 cursor-not-allowed' : ''
													}`}
												title={!isRegistered ? 'キャラクター登録を行うと操作できます' : 'リストから外す'}
												aria-label={`${trust.ja}をリストから解除`}
											>
												{!isRegistered ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
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
	);
};
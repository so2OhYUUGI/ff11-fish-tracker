import React from 'react';
import { ArrowLeft, CheckSquare, Square, X } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type FishDetailViewProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	onToggleCheck: (fishId: number) => void;
	onClose: () => void;
};

export const FishDetailView: React.FC<FishDetailViewProps> = ({
	fish,
	zones,
	isChecked,
	onToggleCheck,
	onClose,
}) => {
	// 釣れる釣り場の一覧
	const targetZones = zones.filter((zone) =>
		fish.zoneIds?.includes(zone.id)
	);

	return (
		<div className={DETAIL_STYLES.container}>
			{/* ヘッダー領域 */}
			<div className={DETAIL_STYLES.header}>
				<div className={DETAIL_STYLES.headerLeft}>
					{/* モバイル用：一覧へ戻るボタン */}
					<button
						type="button"
						onClick={onClose}
						className={DETAIL_STYLES.backButton}
					>
						<ArrowLeft className="w-4 h-4" />
						<span>一覧へ戻る</span>
					</button>
					<div>
						<h2 className={DETAIL_STYLES.titleJa}>{fish.ja}</h2>
						<p className={DETAIL_STYLES.titleEn}>{fish.en}</p>
					</div>
				</div>

				<div className={DETAIL_STYLES.headerRight}>
					{/* チェック判定切り替えボタン */}
					<button
						type="button"
						onClick={() => onToggleCheck(fish.id)}
						className={`${DETAIL_STYLES.checkButtonBase} ${isChecked
								? DETAIL_STYLES.checkButtonChecked
								: DETAIL_STYLES.checkButtonUnchecked
							}`}
					>
						{isChecked ? (
							<>
								<CheckSquare className="w-4 h-4 text-emerald-400" />
								<span>釣獲済み</span>
							</>
						) : (
							<>
								<Square className="w-4 h-4 text-slate-400" />
								<span>未釣獲</span>
							</>
						)}
					</button>

					{/* 横長（PC）表示時用：詳細閉じる（X）ボタン */}
					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className={DETAIL_STYLES.closeButton}
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* 生息エリア・釣り場 */}
			<div>
				<h3 className={DETAIL_STYLES.sectionTitle}>
					生息エリア ({targetZones.length} 箇所)
				</h3>
				{targetZones.length > 0 ? (
					<div className={DETAIL_STYLES.tagList}>
						{targetZones.map((zone) => (
							<span key={zone.id} className={DETAIL_STYLES.tagItem}>
								{zone.ja}
							</span>
						))}
					</div>
				) : (
					<p className={DETAIL_STYLES.emptyText}>生息エリア情報がありません</p>
				)}
			</div>

			{/* 説明・特記事項 */}
			{fish.description && (
				<div className={DETAIL_STYLES.descriptionBox}>
							{fish.description.split('\\n').map((line, index) => (
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
				</div>
			)}
		</div>
	);
};
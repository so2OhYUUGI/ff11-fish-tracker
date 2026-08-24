/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/common/DetailHeader.tsx
 * [Role] 詳細画面用共通ヘッダーコンポーネント
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { ShareDetailButton } from '@/components/common/ShareDetailButton';

type DetailHeaderProps = {
	titleJa: string;
	titleEn: string;
	categoryName: string;
	icon: React.ReactNode;
	canGoBack?: boolean;
	onBack?: () => void;
	onClose: () => void;
	actions?: React.ReactNode; // チェックボタンなどの固有アクション
};

export const DetailHeader: React.FC<DetailHeaderProps> = ({
	titleJa,
	titleEn,
	categoryName,
	icon,
	canGoBack = false,
	onBack,
	onClose,
	actions,
}) => {
	return (
		<div className={DETAIL_STYLES.stickyHeader}>
			{/* 左側：戻るボタン ＋ アイコン ＋ タイトル */}
			<div className={DETAIL_STYLES.stickyHeaderLeft}>
				{canGoBack && onBack && (
					<button
						type="button"
						onClick={onBack}
						className={DETAIL_STYLES.headerBackButton}
						title="前の画面へ戻る"
						aria-label="前の画面へ戻る"
					>
						<ArrowLeft className="w-4 h-4 shrink-0" />
						<span>戻る</span>
					</button>
				)}
				<div className={DETAIL_STYLES.stickyHeaderTitleGroup}>
					<div className="shrink-0">{icon}</div>
					<div className="min-w-0 flex-1">
						<h2 className={DETAIL_STYLES.stickyHeaderTitle}>{titleJa}</h2>
						<p className={DETAIL_STYLES.stickyHeaderSubTitle}>{titleEn}</p>
					</div>
				</div>
			</div>

			{/* 右側：固有アクション ＋ 共有 ＋ 閉じるボタン */}
			<div className={DETAIL_STYLES.stickyHeaderRight}>
				{actions}
				<ShareDetailButton
					categoryName={categoryName}
					nameJa={titleJa}
					nameEn={titleEn}
				/>
				<button
					type="button"
					onClick={onClose}
					title="詳細を閉じる"
					aria-label="詳細を閉じる"
					className={DETAIL_STYLES.iconCloseButton}
				>
					<X className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};
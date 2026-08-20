/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitCard.tsx
 * [Role] 餌データ（個別）のカード表示コンポーネント
 * 
 * [概要]
 * - 餌の基本情報（和名、英名、説明文）のカード形式表示
 * - 改行コード（\n）を含む説明文の複数行レンダリング対応
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/cardStyles` の `CARD_STYLES` を定数参照しています。
 * ============================================================================
 */

import type { BaitMaster } from '@/types/fish';
import { CARD_STYLES } from '@/styles/cardStyles';

type BaitCardProps = {
	bait: BaitMaster;
	onClickDetail: (bait: BaitMaster) => void;
};

export const BaitCard = ({ bait, onClickDetail }: BaitCardProps) => {
	return (
		<div
			className={`${CARD_STYLES.base} ${CARD_STYLES.default}`}
			onClick={() => onClickDetail(bait)}
		>
			<div>
				<div className="flex items-center gap-2 flex-wrap">
					<h3 className={`${CARD_STYLES.titleJa} ${CARD_STYLES.titleJaDefault}`}>
						{bait.ja}
					</h3>
					<span className={CARD_STYLES.titleEn}>({bait.en})</span>
				</div>

				{bait.description && (
					<div className={`mt-3 ${CARD_STYLES.boxBlock}`}>
						{bait.description.split('\\n').map((line, index) => (
							<span key={index} className="block">
								{line}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
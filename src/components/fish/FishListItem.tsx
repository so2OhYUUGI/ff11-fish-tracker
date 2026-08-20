/**
 * ============================================================================
 * [FilePath] src/components/fish/FishListItem.tsx
 * [Role] 魚データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名）のリスト形式（高密度レイアウト）表示
 * - 獲得/達成状態（チェック状態）のチェックボックス描画およびトグル操作
 * - チェック済・選択中（アクティブ）・デフォルト状態に応じた行全体のスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【イベントバブリングの防止】
 *    チェックボックス操作（`onToggleCheck`）時は、行全体のクリックイベント（`onClickDetail`）が
 *    発火しないよう `e.stopPropagation()` を実行しています。
 * 2. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * 3. 【アクセシビリティ】
 *    チェックボタンには `type="button"` を明記しています。
 * ============================================================================
 */

import type { FishMaster, ZoneMaster } from '@/types/fish';
import { LIST_STYLES } from '@/styles/listStyles';
import { Check } from 'lucide-react';

type Props = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (fishId: number) => void;
	onClickDetail: (fish: FishMaster) => void;
};

export const FishListItem = ({
	fish,
	isChecked,
	isSelected,
	onToggleCheck,
	onClickDetail,
}: Props) => {
	return (
		<div
			onClick={() => onClickDetail(fish)}
			className={`${LIST_STYLES.base} ${isChecked
				? LIST_STYLES.checked
				: isSelected
					? LIST_STYLES.selected
					: LIST_STYLES.default
				}`}
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				{/* チェックボックス領域（クリックイベントを伝播させない） */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onToggleCheck(fish.id);
					}}
					className={`${LIST_STYLES.checkboxBase} ${isChecked ? LIST_STYLES.checkboxChecked : LIST_STYLES.checkboxDefault
						}`}
				>
					{isChecked && <Check className="w-4 h-4 stroke-[3]" />}
				</button>

				<div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
					<div className="flex items-center gap-2">
						<span
							className={`${LIST_STYLES.titleJa} ${isChecked
								? LIST_STYLES.titleJaChecked
								: isSelected
									? 'text-cyan-300'
									: LIST_STYLES.titleJaDefault
								}`}
						>
							{fish.ja}
						</span>
						<span className={LIST_STYLES.titleEn}>({fish.en})</span>
					</div>
				</div>
			</div>
		</div>
	);
};
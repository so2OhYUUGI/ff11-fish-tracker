/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitListView.tsx
 * [Role] 餌一覧表示および詳細ビュー切り替え用コンテナコンポーネント
 * 
 * [概要]
 * - `useNavigationStack`（`navStack`）の最前面データ（`current`）に基づき、詳細パネルの切り替え・スタック遷移を描画
 * - 表示モード（`viewMode`: 'card' | 'list'）に基づく `BaitCard` / `BaitListItem` の切替描画
 * - モバイル表示時の画面切替（一覧/詳細）およびPC表示時の `sticky` 追従レイアウト制御
 * - 詳細表示領域に画面高に応じた上限サイズ（calc）と独立スクロール領域を設定
 * 
 * [編集・改修時の注意事項]
 * 1. 【レスポンシブレイアウト】
 *    詳細表示選択時（`current !== null`）、モバイル環境（`lg` 未満）では一覧を非表示 (`hidden`) にし、
 *    詳細ビューのみを全幅で表示するレスポンシブ仕様になっています。
 * ============================================================================
 */

import type { BaitMaster, FishMaster, ViewMode } from '@/types/fish';
import type { useNavigationStack } from '@/hooks/useNavigationStack';
import { BaitCard } from './BaitCard';
import { BaitListItem } from './BaitListItem';
import { BaitDetailView } from './BaitDetailView';
import { FishDetailView } from '@/components/fish/FishDetailView';
import { AreaDetailView } from '@/components/area/AreaDetailView';
import { ZONES } from '@/data';

type Props = {
	baits: BaitMaster[];
	allFishes: FishMaster[];
	viewMode: ViewMode;
	navStack: ReturnType<typeof useNavigationStack>;
};

export const BaitListView = ({
	baits,
	allFishes,
	viewMode,
	navStack,
}: Props) => {
	const { current, push, pop, clear, canGoBack } = navStack;

	// 閉じるボタン押下時の制御（スタックが残っていれば1つ戻り、無ければクリア）
	const handleCloseDetail = () => {
		if (canGoBack) {
			pop();
		} else {
			clear();
		}
	};

	if (baits.length === 0) {
		return (
			<div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
				<p className="text-slate-400 text-sm">該当する餌が見つかりませんでした。</p>
			</div>
		);
	}

	// 選択中のアイテムが存在するかどうか
	const isSelected = current !== null;

	// 現在選択中の餌（スタックの最前面が餌の場合）
	const selectedBaitId = current?.type === 'bait' ? current.item.id : null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			{/* 
        左側：一覧表示領域
        - 未選択時: lg:col-span-12（全幅）
        - 選択中: lg:col-span-7（7列）
        - モバイル時: 詳細選択中なら非表示（hidden）
      */}
			<div
				className={`${isSelected ? 'lg:col-span-7' : 'lg:col-span-12'
					} ${isSelected ? 'hidden lg:block' : 'block'}`}
			>
				{viewMode === 'card' ? (
					<div
						className={`grid grid-cols-1 gap-3 ${isSelected
							? 'sm:grid-cols-2 md:grid-cols-3'
							: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
							}`}
					>
						{baits.map((bait) => (
							<BaitCard
								key={bait.id}
								bait={bait}
								isSelected={selectedBaitId === bait.id}
								onClickDetail={(b) => push({ type: 'bait', item: b })}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{baits.map((bait) => (
							<BaitListItem
								key={bait.id}
								bait={bait}
								isSelected={selectedBaitId === bait.id}
								onClickDetail={(b) => push({ type: 'bait', item: b })}
							/>
						))}
					</div>
				)}
			</div>

			{/* 
        右側：詳細表示領域
        - 選択中のみ表示（isSelected === true）
        - スタックの型に応じて動的にコンテンツを切り替え
      */}
			{isSelected && (
				<div className="lg:col-span-5 lg:sticky lg:top-[160px] w-full max-h-[calc(100vh-180px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
					{current.type === 'bait' && (
						<BaitDetailView
							bait={current.item}
							allFishes={allFishes}
							onClose={handleCloseDetail}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}

					{current.type === 'fish' && (
						<FishDetailView
							fish={current.item}
							zones={ZONES}
							isChecked={false}
							onToggleCheck={() => { }}
							onClose={handleCloseDetail}
							onClickAreaDetail={(area) => push({ type: 'area', item: area })}
							onClickBaitDetail={(bait) => push({ type: 'bait', item: bait })}
						/>
					)}

					{current.type === 'area' && (
						<AreaDetailView
							area={current.item}
							allFishes={allFishes}
							regionList={[]}
							onClose={handleCloseDetail}
							onClickFishDetail={(fish) => push({ type: 'fish', item: fish })}
						/>
					)}
				</div>
			)}
		</div>
	);
};
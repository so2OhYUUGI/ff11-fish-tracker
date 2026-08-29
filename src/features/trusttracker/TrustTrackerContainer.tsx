/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContainer.tsx
 * [Role]     フェイスチェッカーのメイン画面用コンテナコンポーネント
 * 
 * [概要]
 * - フェイスチェッカーの3モード（フェイス一覧 / ウィッシュリスト / マクロ管理）のルーティング切替および状態管理
 * - URLパラメータ (:type) に基づく表示モード判定およびクエリ引き継ぎナビゲーション
 * - 魚チェッカー (FishTrackerContainer) の構造・規約に完全準拠
 * 
 * [依存関係・関連ファイル]
 * - Context     : src/contexts/UserDataContext.tsx
 * - コンポーネント: src/components/common/SeoHead.tsx, src/features/trusttracker/FilterBar.tsx
 * - トークン    : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【サブタイプ判定】 URLパラメータ (:type) を正とし、不正値は 'trust' に安全にフォールバックすること
 * 2. 【クエリパラメータ保持】 モード切替時は location.search を引き継ぎ、検索状態やフィルタークエリを維持すること
 * 3. 【レイアウト一貫性】 stickyFilterBar 領域内で FilterBar コンポーネントを呼び出す構造を守ること
 * ============================================================================
 */

import { useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { SeoHead } from '@/components/common/SeoHead';
import { FilterBar, SUBTYPE_CONFIG, type TrustSubtype } from '@/features/trusttracker/FilterBar';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export function TrustTrackerContainer() {
	const { type } = useParams<{ type?: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const { activeCharacter } = useUserDataContext();
	const { emptyState } = LAYOUT_TOKENS;

	// 有効なサブタイプか判定し、不正な場合は 'trust' にフォールバック
	const activeType: TrustSubtype =
		type && type in SUBTYPE_CONFIG ? (type as TrustSubtype) : 'trust';

	const currentConfig = SUBTYPE_CONFIG[activeType];
	const CurrentIcon = currentConfig.icon;

	// タブ切替ハンドラー（クエリパラメータ location.search を保持して遷移）
	const handleTypeChange = useCallback(
		(newType: TrustSubtype) => {
			navigate(`/trusttracker/${newType}${location.search}`);
		},
		[navigate, location.search]
	);

	return (
		<>
			<SeoHead
				title={`FF11 フェイスチェッカー - ${currentConfig.label}`}
				description="FF11のフェイス（Trust）修得状況を管理・共有できるチェッカーツールです。"
				path={location.pathname}
			/>

			{/* 追従フィルターバー領域 */}
			<div className={LAYOUT_TOKENS.header.stickyFilterBar}>
				<FilterBar
					activeType={activeType}
					onTypeChange={handleTypeChange}
				/>
			</div>

			{/* メインコンテンツ表示エリア（将来的に TrustTrackerContent へ分離） */}
			<div className={LAYOUT_TOKENS.page.mainContainer}>
				<div className={LAYOUT_TOKENS.view.emptyContainer}>
					<div className={emptyState.wrapper}>
						{/* メインアイコン */}
						<div className={emptyState.iconBadge}>
							<CurrentIcon className={emptyState.iconLarge} />
						</div>

						{/* タイトル */}
						<h2 className={emptyState.title}>
							<Construction className={emptyState.titleIcon} />
							{currentConfig.label}（開発中）
						</h2>

						{/* サブテキスト */}
						<p className={`${COMMON_TOKENS.text.subText} ${emptyState.description}`}>
							{currentConfig.description}
							<br />
							現在選択中のモード: <span className="font-bold text-[var(--theme-text-accent)]">{activeType}</span> /
							キャラクター: <span className={emptyState.characterName}>{activeCharacter?.name ?? 'ゲスト'}</span>
						</p>

						{/* モード別プロトタイプカード */}
						<div className={emptyState.cardContainer}>
							<div className={emptyState.cardHeader}>
								【{currentConfig.label} モードの機能】
							</div>
							<ul className={emptyState.cardList}>
								{activeType === 'trust' && (
									<>
										<li>全フェイスの修得済みチェック</li>
										<li>ロール別・入手元別フィルタリング</li>
										<li>詳細モーダル表示（入手クエスト・手順）</li>
									</>
								)}
								{activeType === 'wishlist' && (
									<>
										<li>最大3パターンの目標リスト作成</li>
										<li>優先度の高いフェイスの抽出・整理</li>
										<li>URLでのウィッシュリスト共有機能</li>
									</>
								)}
								{activeType === 'macro' && (
									<>
										<li>呼び出しマクロパターンの作成・保存</li>
										<li>マイパーティ（呼出スロット5枠）の構成</li>
										<li>ゲーム内貼り付け用マクロテキスト生成</li>
									</>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
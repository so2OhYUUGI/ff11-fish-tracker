/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/hooks/useTrackerNavigation.ts
 * [Role] 釣魚チェッカーのルーティングおよびJSネイティブの戻る・遷移制御フック
 * 
 * [概要]
 * - 魚・エリア・餌詳細画面への遷移（push, replace, selectFromList）および戻る（pop, clear）の制御
 * - 未登録ユーザーアクセス時における遷移ロックおよび登録誘導モーダルの呼び出し
 * 
 * [依存関係・関連ファイル]
 * - 型定義   : src/types/fishtracker.ts, src/components/layout/Header.ts
 * - 参照元   : src/features/fishtracker/FishTrackerContainer.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【アクセス制御】 未登録ユーザー (isRegistered === false) の場合は詳細の回遊・遷移を拒否し、
 *    必ず onRequestRegistration を実行してガードすること。
 * 2. 【履歴制御】 Browser/React Router のネイティブ履歴操作 (navigate(-1) 等) を基準とすること。
 * ============================================================================
 */

import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobileLayout } from '@/hooks/useIsMobileLayout';
import { toSlug } from '@/utils/slug';
import type { MainTab, CharacterProgress, FishMaster, ZoneMaster, BaitMaster } from '@/types/';

export interface DisplayCharacterProgress extends CharacterProgress {
  isShared?: boolean;
  checkedFishIds: number[];
}

export type NavItem =
  | { type: 'fish'; item: FishMaster }
  | { type: 'area'; item: ZoneMaster }
  | { type: 'bait'; item: BaitMaster };

type UseTrackerNavigationProps = {
  type?: string;
  slug?: string;
  mainTab: MainTab;
  isRegistered: boolean;
  activeCharacter?: CharacterProgress | DisplayCharacterProgress;
  onRequestRegistration: (message: string) => void;
};

export const useTrackerNavigation = ({
  slug,
  mainTab,
  isRegistered,
  onRequestRegistration,
}: UseTrackerNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileLayout = useIsMobileLayout();

  const [depth, setDepth] = useState(0);
  const [prevSlug, setPrevSlug] = useState<string | undefined>(slug);

  // レンダー中に props (slug) の変更を検知して状態を同期（useEffect 不要）
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    if (!slug || !prevSlug) {
      setDepth(0);
    }
  }

  const canGoBackEffective = depth > 0;

  const handleSelectFromList = useCallback(
    (item: NavItem) => {
      if (!isRegistered) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      const targetPath = `/fishtracker/${mainTab}/${itemSlug}${location.search}`;

      setDepth(0);

      navigate(targetPath, { replace: !isMobileLayout });
    },
    [isMobileLayout, navigate, mainTab, isRegistered, onRequestRegistration, location.search]
  );

  const handlePop = useCallback(() => {
    setDepth((prev) => Math.max(0, prev - 1));
    navigate(-1);
  }, [navigate]);

  const handlePush = useCallback(
    (item: NavItem) => {
      if (!isRegistered) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      setDepth((prev) => prev + 1);
      navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`);
    },
    [isRegistered, onRequestRegistration, mainTab, navigate, location.search]
  );

  const handleReplace = useCallback(
    (item: NavItem) => {
      if (!isRegistered) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`, { replace: true });
    },
    [isRegistered, onRequestRegistration, mainTab, navigate, location.search]
  );

  const handleClear = useCallback(() => {
    setDepth(0);
    navigate(`/fishtracker/${mainTab}${location.search}`);
  }, [navigate, mainTab, location.search]);

  const effectiveNavStack = {
    push: handlePush,
    replace: handleReplace,
    pop: handlePop,
    clear: handleClear,
    selectFromList: handleSelectFromList,
    canGoBack: canGoBackEffective,
    current: null,
    stack: [],
  };

  return {
    effectiveNavStack,
  };
};
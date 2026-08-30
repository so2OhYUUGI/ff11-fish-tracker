/**
 * ============================================================================
 * [FilePath] src/hooks/useTrackerNavigation.ts
 * [Role] トラッカー機能全般で共有するナビゲーションおよびスタック管理フック
 * ============================================================================
 */

import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobileLayout } from '@/hooks/useIsMobileLayout';
import { toSlug } from '@/utils/slug';

export type HasEnglishName = {
  en: string;
};

export type TrackerNavItem<T extends HasEnglishName = HasEnglishName> = {
  type: string;
  item: T;
};

export type TrackerNavStack<T extends HasEnglishName = HasEnglishName> = {
  push: (item: TrackerNavItem<T>) => void;
  replace: (item: TrackerNavItem<T>) => void;
  pop: () => void;
  clear: () => void;
  selectFromList: (item: TrackerNavItem<T>) => void;
  canGoBack: boolean;
};

type UseTrackerNavigationProps = {
  basePath: string;
  slug?: string;
  isRegistered?: boolean;
  onRequestRegistration?: (message: string) => void;
};

export function useTrackerNavigation<T extends HasEnglishName>({
  basePath,
  slug,
  isRegistered = true,
  onRequestRegistration,
}: UseTrackerNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileLayout = useIsMobileLayout();

  const [depth, setDepth] = useState(0);
  const [prevSlug, setPrevSlug] = useState<string | undefined>(slug);

  if (slug !== prevSlug) {
    setPrevSlug(slug);
    if (!slug || !prevSlug) {
      setDepth(0);
    }
  }

  const canGoBackEffective = depth > 0;

  const handleSelectFromList = useCallback(
    (item: TrackerNavItem<T>) => {
      if (!isRegistered && onRequestRegistration) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      const targetPath = `${basePath}/${itemSlug}${location.search}`;

      setDepth(0);
      navigate(targetPath, { replace: !isMobileLayout });
    },
    [basePath, isMobileLayout, navigate, isRegistered, onRequestRegistration, location.search]
  );

  const handlePop = useCallback(() => {
    setDepth((prev) => Math.max(0, prev - 1));
    navigate(-1);
  }, [navigate]);

  const handlePush = useCallback(
    (item: TrackerNavItem<T>) => {
      if (!isRegistered && onRequestRegistration) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      setDepth((prev) => prev + 1);
      navigate(`${basePath}/${itemSlug}${location.search}`);
    },
    [isRegistered, onRequestRegistration, basePath, navigate, location.search]
  );

  const handleReplace = useCallback(
    (item: TrackerNavItem<T>) => {
      if (!isRegistered && onRequestRegistration) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      navigate(`${basePath}/${itemSlug}${location.search}`, { replace: true });
    },
    [isRegistered, onRequestRegistration, basePath, navigate, location.search]
  );

  const handleClear = useCallback(() => {
    setDepth(0);
    navigate(`${basePath}${location.search}`);
  }, [navigate, basePath, location.search]);

  const effectiveNavStack: TrackerNavStack<T> = {
    push: handlePush,
    replace: handleReplace,
    pop: handlePop,
    clear: handleClear,
    selectFromList: handleSelectFromList,
    canGoBack: canGoBackEffective,
  };

  return {
    effectiveNavStack,
  };
}
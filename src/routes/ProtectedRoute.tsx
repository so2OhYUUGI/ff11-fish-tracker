/**
 * ============================================================================
 * [FilePath] src/routes/ProtectedRoute.tsx
 * [Role] 一覧ページの閲覧権限ガードコンポーネント
 * 
 * [概要]
 * - 登録済みユーザー、または共有URLアクセス時のみ子要素（一覧画面）を表示
 * - 未登録かつ共有データがない場合は LandingPage を表示する
 * ============================================================================
 */

import { type ReactNode } from 'react';
import { LandingPage } from '@/components/LandingPage';
import type { DisplayCharacterProgress } from '@/components/layout/Header';

type ProtectedRouteProps = {
	canAccess: boolean;
	onCreateCharacter: (name: string) => DisplayCharacterProgress | null;
	children: ReactNode;
};

export function ProtectedRoute({
	canAccess,
	onCreateCharacter,
	children,
}: ProtectedRouteProps) {
	if (!canAccess) {
		return <LandingPage onCreateCharacter={onCreateCharacter} />;
	}

	return <>{children}</>;
}
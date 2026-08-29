/**
 * ============================================================================
 * [FilePath] src/components/LandingPage.tsx
 * [Role] 初回訪問ユーザー向けランディングページ 兼 初期キャラクター作成コンポーネント
 * 
 * [概要]
 * - UserDataContext から addCharacter を取得し、初期キャラクター作成フォームを描画
 * - MainLayout（ヘッダー・フッター等）を伴わない独立したフルスクリーンUIを提供
 * 
 * [依存関係・関連ファイル]
 * - Context   : src/contexts/UserDataContext.tsx
 * - コンポーネント: src/components/common/CharacterCreateContent.tsx
 * - スタイル   : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト構造】 MainLayout の外で独立して描画されるため、LAYOUT_TOKENS.page.fullScreenCentered による全画面中央配置スタイルを維持すること
 * 2. 【状態遷移】 キャラクター作成成功後、UserDataContext の isRegistered / canViewContainer が更新され、AppRouter により自動的に MainLayout 配下へ遷移する仕組みを維持すること
 * ============================================================================
 */

import React from 'react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { CharacterCreateContent } from '@/components/common/CharacterCreateContent';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export const LandingPage: React.FC = () => {
	const { addCharacter } = useUserDataContext();

	return (
		<div className={LAYOUT_TOKENS.page.fullScreenCentered}>
			<div className={`max-w-md w-full ${COMMON_TOKENS.state.default} rounded-2xl shadow-2xl p-8 my-auto`}>
				<CharacterCreateContent onCreateCharacter={addCharacter} />
			</div>
		</div>
	);
};
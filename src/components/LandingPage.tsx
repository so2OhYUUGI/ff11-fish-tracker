/**
 * ============================================================================
 * [FilePath] src/components/LandingPage.tsx
 * [Role] 初回訪問ユーザー向けランディングページ 兼 初期キャラクター作成コンポーネント
 * 
 * [概要]
 * - UserDataContext から addCharacter を直接取得し、Props 伝播を排除
 * - 初期キャラクター作成フォームとアプリの主な機能説明を表示
 * - COMMON_TOKENS および LAYOUT_TOKENS を参照し、統一スタイルを適用
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
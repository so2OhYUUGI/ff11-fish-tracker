/**
 * ============================================================================
 * [FilePath] src/components/LandingPage.tsx
 * [Role] 初回訪問ユーザー向けランディングページ 兼 初期キャラクター作成コンポーネント
 * 
 * [概要]
 * - 初期キャラクター作成フォームとアプリの主な機能説明を表示
 * - COMMON_TOKENS および LAYOUT_TOKENS を参照し、スタイルベタ書きを排除して統一スタイルを適用
 * ============================================================================
 */

import React from 'react';
import { CharacterCreateContent } from '@/components/common/CharacterCreateContent';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type LandingPageProps = {
	onCreateCharacter: (name: string) => void;
};

export const LandingPage: React.FC<LandingPageProps> = ({ onCreateCharacter }) => {
	return (
		<div className={LAYOUT_TOKENS.page.fullScreenCentered}>
			<div className={`max-w-md w-full ${COMMON_TOKENS.state.default} rounded-2xl shadow-2xl p-8 my-auto`}>
				<CharacterCreateContent onCreateCharacter={onCreateCharacter} />
			</div>
		</div>
	);
};
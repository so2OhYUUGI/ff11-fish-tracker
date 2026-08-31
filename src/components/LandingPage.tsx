/**
 * ============================================================================
 * [FilePath] src/components/LandingPage.tsx
 * [Role] 初回訪問ユーザー向けランディングページ 兼 初期キャラクター作成コンポーネント
 * 
 * [概要]
 * - UserDataContext から addCharacter を取得し、初期キャラクター作成フォームを描画
 * - Header 等から渡された location.state（from）を評価し、作成完了後に元の遷移先へ安全に自動リダイレクト
 * - MainLayout（ヘッダー・フッター等）を伴わない独立したフルスクリーンUIを提供
 * 
 * [依存関係・関連ファイル]
 * - Context   : src/contexts/UserDataContext.tsx
 * - コンポーネント: src/components/common/CharacterCreateContent.tsx
 * - ルーティング : react-router-dom (useLocation, useNavigate)
 * - スタイル   : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト構造】 MainLayout の外で独立して描画されるため、LAYOUT_TOKENS.page.fullScreenCentered による全画面中央配置スタイルを維持すること
 * 2. 【リダイレクト処理】 キャラクター作成成功時は location.state.from（無ければデフォルト遷移先）へ navigate(from, { replace: true }) で遷移させること
 * ============================================================================
 */

import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { CharacterCreateContent } from '@/components/common/CharacterCreateContent';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export const LandingPage: React.FC = () => {
	const { addCharacter } = useUserDataContext();
	const location = useLocation();
	const navigate = useNavigate();

	// Header から渡された復帰先 URL を取得（未指定の場合はデフォルトのチェッカー画面へ）
	const from = (location.state as { from?: string })?.from || '/fishtracker/fish';

	const handleCreateCharacter = useCallback(
		(name: string) => {
			const newChar = addCharacter(name);
			if (newChar) {
				// キャラクター登録成功後、元のページへ復帰
				navigate(from, { replace: true });
			}
			return newChar;
		},
		[addCharacter, navigate, from]
	);

	return (
		<div className={LAYOUT_TOKENS.page.fullScreenCentered}>
			<div className={`max-w-md w-full ${COMMON_TOKENS.state.default} rounded-2xl shadow-2xl p-8 my-auto`}>
				<CharacterCreateContent onCreateCharacter={handleCreateCharacter} />
			</div>
		</div>
	);
};
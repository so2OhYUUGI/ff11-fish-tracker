/**
 * ============================================================================
 * [FilePath] src/hooks/useUserData.ts
 * [Role] ユーザー進捗データ（複数キャラクター・魚チェック状態）の永続化管理カスタムフック
 * 
 * [概要]
 * - `LocalStorage` を使用したユーザーデータ（`UserData`）の読み込み・自動保存
 * - アクティブキャラクターの選択・追加・削除ロジック
 * - 選択中キャラクターに対する魚のチェック状態（済/未）のトグル操作
 * 
 * [編集・改修時の注意事項]
 * 1. 【ストレージキー】
 *    `STORAGE_KEY` (`ff11_fish_tracker_user_data`) を変更すると、
 *    既存ユーザーのデータが読み込めなくなるため原則変更禁止です。
 * 2. 【キャラクター削除制約】
 *    `deleteCharacter` にて最後の1キャラの削除を防ぐバリデーションを入れています。
 * 3. 【UUID生成】
 *    新規キャラクター追加時のID生成に `crypto.randomUUID()` を使用しています。
 *    古いブラウザ環境のサポートが必要な場合はフォールバックの検討が必要です。
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import type { UserData, CharacterProgress } from '@/types/fish';

const STORAGE_KEY = 'ff11_fish_tracker_user_data';

// 初期データ（デフォルトキャラクター）
const DEFAULT_USER_DATA: UserData = {
	activeCharacterId: 'default-char-1',
	characters: [
		{
			id: 'default-char-1',
			name: 'メインキャラ',
			checkedFishIds: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		},
	],
};

export const useUserData = () => {
	const [userData, setUserData] = useState<UserData>(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return DEFAULT_USER_DATA;
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Failed to parse user data from localStorage', e);
			return DEFAULT_USER_DATA;
		}
	});

	// データの変更を自動で LocalStorage に保存
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
	}, [userData]);

	// 現在選択中のキャラクターを取得
	const activeCharacter =
		userData.characters.find((c) => c.id === userData.activeCharacterId) ||
		userData.characters[0];

	// キャラクター切り替え
	const setActiveCharacter = (characterId: string) => {
		setUserData((prev) => ({
			...prev,
			activeCharacterId: characterId,
		}));
	};

	// キャラクター追加
	const addCharacter = (name: string) => {
		const newChar: CharacterProgress = {
			id: crypto.randomUUID(),
			name,
			checkedFishIds: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		setUserData((prev) => ({
			...prev,
			activeCharacterId: newChar.id,
			characters: [...prev.characters, newChar],
		}));
	};

	// キャラクター削除
	const deleteCharacter = (characterId: string) => {
		if (userData.characters.length <= 1) return; // 最後の1キャラは削除不可
		setUserData((prev) => {
			const nextChars = prev.characters.filter((c) => c.id !== characterId);
			return {
				...prev,
				activeCharacterId:
					prev.activeCharacterId === characterId ? nextChars[0].id : prev.activeCharacterId,
				characters: nextChars,
			};
		});
	};

	// 魚の【済 / 未】トグル（チェック付け外し）
	const toggleFishCheck = (fishId: number) => {
		setUserData((prev) => {
			const updatedChars = prev.characters.map((char) => {
				if (char.id !== prev.activeCharacterId) return char;

				const isChecked = char.checkedFishIds.includes(fishId);
				const nextChecked = isChecked
					? char.checkedFishIds.filter((id) => id !== fishId)
					: [...char.checkedFishIds, fishId];

				return {
					...char,
					checkedFishIds: nextChecked,
					updatedAt: Date.now(),
				};
			});

			return {
				...prev,
				characters: updatedChars,
			};
		});
	};

	return {
		userData,
		activeCharacter,
		setActiveCharacter,
		addCharacter,
		deleteCharacter,
		toggleFishCheck,
	};
};
/**
 * ============================================================================
 * [FilePath] src/hooks/useUserData.ts
 * [Role] ユーザー進捗データ（複数キャラクター・魚チェック状態）の永続化管理カスタムフック
 * 
 * [概要]
 * - `LocalStorage` を使用したユーザーデータ（`UserData`）の読み込み・自動保存
 * - アクティブキャラクターの選択・追加・削除ロジック
 * - 選択中キャラクターに対する魚のチェック状態（済/未）のトグル操作
 * - JSONファイルのインポート / エクスポート機能（バックアップ・復元）
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
	// 1. 安全な LocalStorage 読み込み処理（初期値生成関数）
	const [userData, setUserData] = useState<UserData>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) return DEFAULT_USER_DATA;

			const parsed = JSON.parse(saved);
			// 最低限の構造チェック（破損データ対策）
			if (!parsed || !Array.isArray(parsed.characters) || parsed.characters.length === 0) {
				return DEFAULT_USER_DATA;
			}
			return parsed;
		} catch (e) {
			console.error('Failed to parse user data from localStorage', e);
			return DEFAULT_USER_DATA;
		}
	});

	// 2. データの変更を自動で LocalStorage に保存（書き込み例外ガードを追加）
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
		} catch (e) {
			console.error('Failed to save user data to localStorage', e);
		}
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

	// 3. データのエクスポート（JSONファイルダウンロード）
	const exportData = () => {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', `ff11_fish_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

	// 4. データのインポート（JSONファイル読み込み）
	const importData = (file: File): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const content = e.target?.result as string;
					const parsedData = JSON.parse(content);

					// データの簡易構造チェック
					if (
						typeof parsedData === 'object' &&
						parsedData !== null &&
						Array.isArray(parsedData.characters) &&
						typeof parsedData.activeCharacterId === 'string'
					) {
						setUserData(parsedData);
						resolve(true);
					} else {
						reject(new Error('無効なデータ形式です。'));
					}
				} catch (err) {
					reject(err);
				}
			};
			reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました。'));
			reader.readAsText(file);
		});
	};

	return {
		userData,
		activeCharacter,
		setActiveCharacter,
		addCharacter,
		deleteCharacter,
		toggleFishCheck,
		exportData,
		importData,
	};
};
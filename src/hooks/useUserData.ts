/**
 * ============================================================================
 * [FilePath] src/hooks/useUserData.ts
 * [Role] ユーザー進捗データ（複数キャラクター・魚チェック状態）の永続化管理カスタムフック
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import type { UserData, CharacterProgress } from '@/types/fish';

const STORAGE_KEY = 'ff11_fish_tracker_user_data';

// デフォルトキャラクターを廃止し、初期状態は空配列に設定
const EMPTY_USER_DATA: UserData = {
	activeCharacterId: '',
	characters: [],
};

// ID生成ヘルパー（非セキュア環境・非対応ブラウザ向けのフォールバック処理付き）
const generateUniqueId = (): string => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `char-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useUserData = () => {
	// 1. 安全な LocalStorage 読み込み処理
	const [userData, setUserData] = useState<UserData>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) return EMPTY_USER_DATA;

			const parsed = JSON.parse(saved);
			if (!parsed || !Array.isArray(parsed.characters)) {
				return EMPTY_USER_DATA;
			}
			return parsed;
		} catch (e) {
			console.error('Failed to parse user data from localStorage', e);
			return EMPTY_USER_DATA;
		}
	});

	// 2. データの変更を自動で LocalStorage に保存
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
		} catch (e) {
			console.error('Failed to save user data to localStorage', e);
		}
	}, [userData]);

	// 現在選択中のキャラクターを取得（キャラクターが存在しない場合は undefined）
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
			id: generateUniqueId(),
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

	// キャラクター名変更
	const renameCharacter = (characterId: string, newName: string) => {
		setUserData((prev) => ({
			...prev,
			characters: prev.characters.map((char) =>
				char.id === characterId
					? { ...char, name: newName, updatedAt: Date.now() }
					: char
			),
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
		renameCharacter,
		deleteCharacter,
		toggleFishCheck,
		exportData,
		importData,
	};
};
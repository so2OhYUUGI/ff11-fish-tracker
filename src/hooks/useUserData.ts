/**
 * ============================================================================
 * [FilePath] src/hooks/useUserData.ts
 * [Role] ユーザー進捗データおよびアプリ設定（表示モード等）の永続化管理カスタムフック
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import type { UserData, CharacterProgress, ViewMode } from '@/types/fishtracker';

const STORAGE_KEY = 'ff11_fish_tracker_user_data';

const EMPTY_USER_DATA: UserData = {
	activeCharacterId: '',
	characters: [],
	viewMode: 'card',
};

const generateUniqueId = (): string => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `char-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useUserData = () => {
	const [userData, setUserData] = useState<UserData>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) return EMPTY_USER_DATA;

			const parsed = JSON.parse(saved);
			if (!parsed || !Array.isArray(parsed.characters)) {
				return EMPTY_USER_DATA;
			}
			return {
				...parsed,
				viewMode: parsed.viewMode ?? 'card',
			};
		} catch (e) {
			console.error('Failed to parse user data from localStorage', e);
			return EMPTY_USER_DATA;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
		} catch (e) {
			console.error('Failed to save user data to localStorage', e);
		}
	}, [userData]);

	const activeCharacter =
		userData.characters.find((c) => c.id === userData.activeCharacterId) ||
		userData.characters[0];

	const setActiveCharacter = (characterId: string) => {
		setUserData((prev) => ({
			...prev,
			activeCharacterId: characterId,
		}));
	};

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

	const deleteCharacter = (characterId: string) => {
		if (userData.characters.length <= 1) return;
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

	// 表示モード（カード / リスト）の変更関数
	const setViewMode = (viewMode: ViewMode) => {
		setUserData((prev) => ({
			...prev,
			viewMode,
		}));
	};

	const exportData = () => {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', `ff11_fish_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

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
						setUserData({
							...parsedData,
							viewMode: parsedData.viewMode ?? 'card',
						});
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
		viewMode: userData.viewMode ?? 'card',
		setViewMode,
		setActiveCharacter,
		addCharacter,
		renameCharacter,
		deleteCharacter,
		toggleFishCheck,
		exportData,
		importData,
	};
};
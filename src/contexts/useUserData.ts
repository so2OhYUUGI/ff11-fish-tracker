/**
 * ============================================================================
 * [FilePath] src/contexts/useUserData.ts
 * [Role] ユーザー進捗データおよびアプリ設定の永続化管理カスタムフック
 * 
 * [概要]
 * - キャラクター一覧、修得進捗（釣魚、フェイス）およびアカウント共通ウィッシュリストの永続化管理
 * - キャラクターID指定でのフェイス修得状態トグル関数（toggleCharacterTrustCheck）を提供
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserData, NormalizedCharacterProgress, ViewMode } from '@/types/user';
import type { Wishlist } from '@/types/trusttracker';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { SHARED_GUEST_CHARACTER_ID } from '@/constants/character';

const STORAGE_KEY = 'ff11_fish_tracker_user_data';

const EMPTY_USER_DATA: UserData = {
	activeCharacterId: '',
	characters: [],
	wishlists: [],
	viewMode: 'card',
};

const generateUniqueId = (): string => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `char-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const normalizeCharacterProgress = (rawChar: unknown): NormalizedCharacterProgress => {
	const char = (typeof rawChar === 'object' && rawChar !== null ? rawChar : {}) as Record<string, unknown>;

	return {
		...char,
		id: typeof char.id === 'string' && char.id ? char.id : generateUniqueId(),
		name: typeof char.name === 'string' && char.name ? char.name : '新規キャラクター',
		checkedFishIds: Array.isArray(char.checkedFishIds) ? char.checkedFishIds.map(Number).filter((id) => !isNaN(id)) : [],
		checkedTrustIds: Array.isArray(char.checkedTrustIds) ? char.checkedTrustIds.map(Number).filter((id) => !isNaN(id)) : [],
		createdAt: typeof char.createdAt === 'number' ? char.createdAt : Date.now(),
		updatedAt: typeof char.updatedAt === 'number' ? char.updatedAt : Date.now(),
	};
};

export const useUserData = () => {
	const [userData, setUserData] = useState<UserData>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (!saved) return EMPTY_USER_DATA;
			const parsed = JSON.parse(saved);
			if (!parsed || !Array.isArray(parsed.characters)) return EMPTY_USER_DATA;

			// 旧形式データ（キャラ配下のウィッシュリスト）の移行処理
			let wishlists: Wishlist[] = Array.isArray(parsed.wishlists) ? parsed.wishlists : [];
			if (wishlists.length === 0) {
				parsed.characters.forEach((char: Record<string, unknown>) => {
					if (Array.isArray(char.wishlists) && char.wishlists.length > 0) {
						wishlists = [...wishlists, ...(char.wishlists as Wishlist[])];
					}
				});
				// 重複ID排除と制限数制御
				const uniqueMap = new Map<string, Wishlist>();
				wishlists.forEach((w) => uniqueMap.set(w.id, w));
				wishlists = Array.from(uniqueMap.values()).slice(0, WISHLIST_LIMITS.MAX_SLOTS);
			}

			return {
				...parsed,
				characters: parsed.characters.map(normalizeCharacterProgress),
				wishlists,
				viewMode: parsed.viewMode ?? 'card',
			};
		} catch {
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
		userData.characters.find((c) => c.id === userData.activeCharacterId) || userData.characters[0];

	const isRegistered = userData.characters.length > 0;

	const setActiveCharacter = useCallback((characterId: string) => {
		setUserData((prev) => ({ ...prev, activeCharacterId: characterId }));
	}, []);

	const addCharacter = useCallback((name: string): NormalizedCharacterProgress => {
		const newChar: NormalizedCharacterProgress = {
			id: generateUniqueId(),
			name,
			checkedFishIds: [],
			checkedTrustIds: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		setUserData((prev) => ({
			...prev,
			activeCharacterId: newChar.id,
			characters: [...prev.characters, newChar],
		}));
		return newChar;
	}, []);

	const renameCharacter = useCallback((characterId: string, newName: string) => {
		setUserData((prev) => ({
			...prev,
			characters: prev.characters.map((char) =>
				char.id === characterId ? { ...char, name: newName, updatedAt: Date.now() } : char
			),
		}));
	}, []);

	const deleteCharacter = useCallback((characterId: string) => {
		setUserData((prev) => {
			if (prev.characters.length <= 1) return prev;
			const nextChars = prev.characters.filter((c) => c.id !== characterId);
			return {
				...prev,
				activeCharacterId: prev.activeCharacterId === characterId ? nextChars[0].id : prev.activeCharacterId,
				characters: nextChars,
			};
		});
	}, []);

	const toggleFishCheck = useCallback((fishId: number) => {
		setUserData((prev) => {
			if (prev.activeCharacterId === SHARED_GUEST_CHARACTER_ID) return prev;
			return {
				...prev,
				characters: prev.characters.map((char) => {
					if (char.id !== prev.activeCharacterId) return char;
					const isChecked = char.checkedFishIds.includes(fishId);
					return {
						...char,
						checkedFishIds: isChecked
							? char.checkedFishIds.filter((id) => id !== fishId)
							: [...char.checkedFishIds, fishId],
						updatedAt: Date.now(),
					};
				}),
			};
		});
	}, []);

	// アクティブキャラクターの修得トグル
	const toggleTrustCheck = useCallback((trustId: number) => {
		setUserData((prev) => {
			if (prev.activeCharacterId === SHARED_GUEST_CHARACTER_ID) return prev;
			return {
				...prev,
				characters: prev.characters.map((char) => {
					if (char.id !== prev.activeCharacterId) return char;
					const raw = char.checkedTrustIds || [];
					const isChecked = raw.includes(trustId);
					return {
						...char,
						checkedTrustIds: isChecked ? raw.filter((id) => id !== trustId) : [...raw, trustId],
						updatedAt: Date.now(),
					};
				}),
			};
		});
	}, []);

	// ★ 任意キャラクターの修得トグル（ウィッシュリスト等での全キャラ横断操作用）
	const toggleCharacterTrustCheck = useCallback((characterId: string, trustId: number) => {
		if (characterId === SHARED_GUEST_CHARACTER_ID) return;
		setUserData((prev) => ({
			...prev,
			characters: prev.characters.map((char) => {
				if (char.id !== characterId) return char;
				const raw = char.checkedTrustIds || [];
				const isChecked = raw.includes(trustId);
				return {
					...char,
					checkedTrustIds: isChecked ? raw.filter((id) => id !== trustId) : [...raw, trustId],
					updatedAt: Date.now(),
				};
			}),
		}));
	}, []);

	// --- ウィッシュリスト（Wishlist: アカウント共通）操作 ---

	const addWishlist = useCallback((name: string): boolean => {
		setUserData((prev) => {
			const current = prev.wishlists || [];
			if (current.length >= WISHLIST_LIMITS.MAX_SLOTS) return prev;

			const newWishlist: Wishlist = {
				id: `wishlist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
				name: name || `ウィッシュリスト ${current.length + 1}`,
				trustIds: [],
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			return {
				...prev,
				wishlists: [...current, newWishlist],
			};
		});
		return true;
	}, []);

	const updateWishlist = useCallback((wishlistId: string, newName: string, trustIds?: number[]) => {
		setUserData((prev) => ({
			...prev,
			wishlists: (prev.wishlists || []).map((w) =>
				w.id === wishlistId
					? {
						...w,
						name: newName,
						trustIds: trustIds ? trustIds.slice(0, WISHLIST_LIMITS.MAX_ITEMS) : w.trustIds,
						updatedAt: Date.now(),
					}
					: w
			),
		}));
	}, []);

	const deleteWishlist = useCallback((wishlistId: string) => {
		setUserData((prev) => ({
			...prev,
			wishlists: (prev.wishlists || []).filter((w) => w.id !== wishlistId),
		}));
	}, []);

	const toggleWishlistTrust = useCallback((wishlistId: string, trustId: number) => {
		setUserData((prev) => ({
			...prev,
			wishlists: (prev.wishlists || []).map((w) => {
				if (w.id !== wishlistId) return w;
				const exists = w.trustIds.includes(trustId);
				if (!exists && w.trustIds.length >= WISHLIST_LIMITS.MAX_ITEMS) return w;
				return {
					...w,
					trustIds: exists ? w.trustIds.filter((id) => id !== trustId) : [...w.trustIds, trustId],
					updatedAt: Date.now(),
				};
			}),
		}));
	}, []);

	const setViewMode = useCallback((viewMode: ViewMode) => {
		setUserData((prev) => ({ ...prev, viewMode }));
	}, []);

	const exportData = useCallback(() => {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', `ff11_fish_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	}, [userData]);

	const importData = useCallback((file: File): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const parsedData = JSON.parse(e.target?.result as string);
					if (typeof parsedData === 'object' && parsedData !== null && Array.isArray(parsedData.characters)) {
						setUserData({
							...parsedData,
							characters: parsedData.characters.map(normalizeCharacterProgress),
							wishlists: Array.isArray(parsedData.wishlists) ? parsedData.wishlists : [],
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
	}, []);

	return {
		userData,
		activeCharacter,
		isRegistered,
		viewMode: userData.viewMode ?? 'card',
		setViewMode,
		setActiveCharacter,
		addCharacter,
		renameCharacter,
		deleteCharacter,
		toggleFishCheck,
		toggleTrustCheck,
		toggleCharacterTrustCheck,
		addWishlist,
		updateWishlist,
		deleteWishlist,
		toggleWishlistTrust,
		exportData,
		importData,
	};
};
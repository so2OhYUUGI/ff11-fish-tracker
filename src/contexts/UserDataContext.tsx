/**
 * ============================================================================
 * [FilePath] src/contexts/UserDataContext.tsx
 * [Role]     ユーザー進捗データ・表示キャラクター状態を一括管理・提供する Context / Provider
 * 
 * [概要]
 * - App.tsx や AppRouter でのバケツリレー (Prop Drilling) を解消する
 * - useUserData / useSharedProgress / useSharedWishlist を集約し、閲覧権限（canViewContainer）判定も含めて管理する
 * - 釣魚（checkedFishIds）、フェイス修得（checkedTrustIds）、ウィッシュリスト（wishlists）のトグル状態および操作関数を提供する
 * - 共有ウィッシュリスト（wishlist_share）をテンポラリデータとして一覧に合成して提供する
 * ============================================================================
 */

import React, { createContext, useContext, useMemo, useEffect, useRef, useState } from 'react';
import type { CharacterProgress, UserData, ViewMode } from '@/types/';
import type { Wishlist } from '@/types/trusttracker';
import { useUserData } from '@/contexts/useUserData';
import { useSharedProgress } from '@/hooks/useSharedProgress';
import { useSharedWishlist } from '@/hooks/useSharedWishlist';
import { SHARED_GUEST_CHARACTER_ID } from '@/constants/character';

export interface DisplayCharacterProgress extends CharacterProgress {
	isShared?: boolean;
}

export interface DisplayWishlist extends Wishlist {
	isShared?: boolean;
}

// 未登録かつ共有データもない場合に表示するフォールバック用のゲストキャラクター
const FALLBACK_GUEST_CHARACTER: DisplayCharacterProgress = {
	id: SHARED_GUEST_CHARACTER_ID,
	name: 'ゲスト',
	checkedFishIds: [],
	checkedTrustIds: [],
	createdAt: Date.now(),
	updatedAt: Date.now(),
	isShared: true,
};

interface UserDataContextType {
	userData: UserData;
	wishlists: DisplayWishlist[];
	activeCharacter: DisplayCharacterProgress;
	displayCharacters: DisplayCharacterProgress[];
	activeCharacterId: string;
	isRegistered: boolean;
	canViewContainer: boolean;
	viewMode: ViewMode;
	registrationMessage: string | null;

	// 操作用メソッド
	setRegistrationMessage: (msg: string | null) => void;
	setActiveCharacter: (characterId: string) => void;
	addCharacter: (name: string) => CharacterProgress;
	renameCharacter: (characterId: string, newName: string) => void;
	deleteCharacter: (characterId: string) => void;

	// チェック操作メソッド
	toggleFishCheck: (fishId: number) => void;
	toggleTrustCheck: (trustId: number) => void;
	toggleCharacterTrustCheck: (characterId: string, trustId: number) => void;

	// ウィッシュリスト操作メソッド（アカウント共通）
	addWishlist: (name: string) => string | null;
	updateWishlist: (wishlistId: string, newName: string, trustIds?: number[]) => void;
	deleteWishlist: (wishlistId: string) => void;
	toggleWishlistTrust: (wishlistId: string, trustId: number) => void;

	setViewMode: (mode: ViewMode) => void;
	exportData: () => void;
	importData: (file: File) => Promise<boolean>;
	handleCreateCharacterAndClose: (name: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const userDataProps = useUserData();
	const {
		userData,
		activeCharacter: localActiveCharacter,
		isRegistered,
		viewMode,
		setViewMode,
		setActiveCharacter: setLocalActiveCharacter,
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
	} = userDataProps;

	const { sharedProgress, clearSharedMode } = useSharedProgress();
	// ※ useSharedWishlist 側にも clearSharedWishlist（または類似のURLクリア関数）が実装されている想定となります
	const { sharedWishlist, clearSharedWishlist } = useSharedWishlist() as ReturnType<typeof useSharedWishlist> & { clearSharedWishlist?: () => void };

	const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

	// 初回自動選択制御フラグ
	const hasAutoSelectedSharedRef = useRef(false);
	const hasAutoSelectedSharedWishlistRef = useRef(false);

	// sharedProgress から共有キャラクターを生成（純粋な派生値）
	const activeSharedCharacter = useMemo<DisplayCharacterProgress | null>(() => {
		if (!sharedProgress) return null;
		return {
			id: SHARED_GUEST_CHARACTER_ID,
			name: sharedProgress.characterName,
			checkedFishIds: sharedProgress.checkedFishIds,
			checkedTrustIds: (sharedProgress as { checkedTrustIds?: number[] }).checkedTrustIds || [],
			createdAt: sharedProgress.createdAt,
			updatedAt: sharedProgress.createdAt,
			isShared: true,
		};
	}, [sharedProgress]);

	// 共有ウィッシュリストをテンポラリデータとして生成
	const activeSharedWishlist = useMemo<DisplayWishlist | null>(() => {
		if (!sharedWishlist) return null;
		return {
			...sharedWishlist,
			isShared: true,
		};
	}, [sharedWishlist]);

	// 表示用キャラクター一覧
	const displayCharacters = useMemo<DisplayCharacterProgress[]>(() => {
		if (activeSharedCharacter) {
			return [...userData.characters, activeSharedCharacter];
		}
		if (userData.characters.length === 0) {
			return [FALLBACK_GUEST_CHARACTER];
		}
		return userData.characters;
	}, [userData.characters, activeSharedCharacter]);

	// 共有URL（魚/フェイス進捗）アクセス時の初回自動選択とURL削除
	useEffect(() => {
		if (sharedProgress && !hasAutoSelectedSharedRef.current) {
			setLocalActiveCharacter(SHARED_GUEST_CHARACTER_ID);
			setViewMode('list');
			hasAutoSelectedSharedRef.current = true;
			clearSharedMode();
		}
	}, [sharedProgress, setLocalActiveCharacter, setViewMode, clearSharedMode]);

	// 共有ウィッシュリストアクセス時のURL削除（テンポラリ化）
	useEffect(() => {
		if (sharedWishlist && !hasAutoSelectedSharedWishlistRef.current) {
			hasAutoSelectedSharedWishlistRef.current = true;
			if (clearSharedWishlist) {
				clearSharedWishlist();
			} else {
				// フォールバックとして直接 URL パラメータから wishlist_share を削除
				const url = new URL(window.location.href);
				if (url.searchParams.has('wishlist_share')) {
					url.searchParams.delete('wishlist_share');
					window.history.replaceState({}, '', url.toString());
				}
			}
		}
	}, [sharedWishlist, clearSharedWishlist]);

	// 現在選択中の表示キャラクター
	const activeCharacter = useMemo<DisplayCharacterProgress>(() => {
		if (userData.activeCharacterId) {
			const found = displayCharacters.find((c) => c.id === userData.activeCharacterId);
			if (found) return found;
		}

		if (localActiveCharacter) {
			const found = displayCharacters.find((c) => c.id === localActiveCharacter.id);
			if (found) return found;
		}

		return displayCharacters[0];
	}, [userData.activeCharacterId, displayCharacters, localActiveCharacter]);

	// アカウント共通のウィッシュリスト一覧を取得（共有ウィッシュリストがあれば安全に合成）
	const wishlists = useMemo<DisplayWishlist[]>(() => {
		const localLists: DisplayWishlist[] = userData.wishlists || [];
		if (activeSharedWishlist) {
			// ローカルリストと sharedId の重複を防止して合成
			const filteredLocal = localLists.filter((w) => w.id !== activeSharedWishlist.id);
			return [...filteredLocal, activeSharedWishlist];
		}
		return localLists;
	}, [userData.wishlists, activeSharedWishlist]);

	// 一覧ページの閲覧権限判定（未登録ユーザでも共有キャラクターまたは共有ウィッシュリストがあれば閲覧可能）
	const canViewContainer = isRegistered || !!activeSharedCharacter || !!activeSharedWishlist;

	const handleCreateCharacterAndClose = (name: string) => {
		const newChar = addCharacter(name);
		if (newChar?.id) {
			setLocalActiveCharacter(newChar.id);
		}
		setRegistrationMessage(null);
	};

	const value: UserDataContextType = {
		userData,
		wishlists,
		activeCharacter,
		displayCharacters,
		activeCharacterId: userData.activeCharacterId,
		isRegistered,
		canViewContainer,
		viewMode,
		registrationMessage,
		setRegistrationMessage,
		setActiveCharacter: setLocalActiveCharacter,
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
		setViewMode,
		exportData,
		importData,
		handleCreateCharacterAndClose,
	};

	return (
		<UserDataContext.Provider value={value}>
			{children}
		</UserDataContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserDataContext = (): UserDataContextType => {
	const context = useContext(UserDataContext);
	if (!context) {
		throw new Error('useUserDataContext must be used within a UserDataProvider');
	}
	return context;
};
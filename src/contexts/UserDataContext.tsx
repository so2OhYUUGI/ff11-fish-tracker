/**
 * ============================================================================
 * [FilePath] src/contexts/UserDataContext.tsx
 * [Role]     ユーザー進捗データ・表示キャラクター状態を一括管理・提供する Context / Provider
 * 
 * [概要]
 * - App.tsx や AppRouter でのバケツリレー (Prop Drilling) を解消する
 * - useUserData / useSharedProgress を集約し、閲覧権限（canViewContainer）判定も含めて管理する
 * - 釣魚（checkedFishIds）、フェイス修得（checkedTrustIds）、ウィッシュリスト（wishlists）のトグル状態および操作関数を提供する
 * - アカウント共通のウィッシュリストおよび各キャラクターごとの進捗トグル操作を提供
 * ============================================================================
 */

import React, { createContext, useContext, useMemo, useEffect, useRef, useState } from 'react';
import type { CharacterProgress, UserData, ViewMode } from '@/types/';
import type { Wishlist } from '@/types/trusttracker';
import { useUserData } from '@/contexts/useUserData';
import { useSharedProgress } from '@/hooks/useSharedProgress';
import { SHARED_GUEST_CHARACTER_ID } from '@/constants/character';

export interface DisplayCharacterProgress extends CharacterProgress {
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
	wishlists: Wishlist[];
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
	toggleCharacterTrustCheck: (characterId: string, trustId: number) => void; // ★ 任意キャラのフェイス修得トグル

	// ウィッシュリスト操作メソッド（アカウント共通）
	addWishlist: (name: string) => boolean;
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
		toggleCharacterTrustCheck, // ★ useUserData 側に追加した関数を受け取る
		addWishlist,
		updateWishlist,
		deleteWishlist,
		toggleWishlistTrust,
		exportData,
		importData,
	} = userDataProps;

	const { sharedProgress, clearSharedMode } = useSharedProgress();

	const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

	// 初回自動選択制御フラグ
	const hasAutoSelectedSharedRef = useRef(false);

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

	// 共有URLアクセス時の初回自動選択とURL削除（クリーンアップ）
	useEffect(() => {
		if (sharedProgress && !hasAutoSelectedSharedRef.current) {
			setLocalActiveCharacter(SHARED_GUEST_CHARACTER_ID);
			setViewMode('list');
			hasAutoSelectedSharedRef.current = true;
			clearSharedMode();
		}
	}, [sharedProgress, setLocalActiveCharacter, setViewMode, clearSharedMode]);

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

	// アカウント共通のウィッシュリスト一覧を取得
	const wishlists = useMemo<Wishlist[]>(() => {
		return userData.wishlists || [];
	}, [userData.wishlists]);

	// 一覧ページの閲覧権限判定（未登録ユーザが共有リンク以外でアクセスした場合はランディングへ遷移させる）
	const canViewContainer = isRegistered || !!activeSharedCharacter;

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
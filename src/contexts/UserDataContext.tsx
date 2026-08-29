/**
 * ============================================================================
 * [FilePath] src/contexts/UserDataContext.tsx
 * [Role] ユーザー進捗データ・表示キャラクター状態を一括管理・提供する Context / Provider
 * 
 * [概要]
 * - App.tsx や AppRouter でのバケツリレー (Prop Drilling) を解消する
 * - useUserData / useSharedProgress を集約し、共有データのキャッシュや閲覧権限判定も含めて管理する
 * 
 * [依存関係・関連ファイル]
 * - フック   : src/hooks/useUserData.ts, src/hooks/useSharedProgress.ts
 * - 型定義   : src/types/fishtracker.ts
 * - 定数     : src/constants/character.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【安全宣言】 Context 非依存の箇所で useUserDataContext を呼び出した場合は安全にエラーを出力させること
 * 2. 【既存挙動の完全維持】 isShared フラグの付与、共有キャラキャッシュ、URLクリーンアップ等の挙動を破壊しないこと
 * ============================================================================
 */

import React, { createContext, useContext, useMemo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CharacterProgress, UserData, ViewMode } from '@/types/fishtracker';
import { useUserData } from '@/hooks/useUserData';
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
	createdAt: Date.now(),
	updatedAt: Date.now(),
	isShared: true,
};

interface UserDataContextType {
	userData: UserData;
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
	toggleFishCheck: (fishId: number) => void;
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
		exportData,
		importData,
	} = userDataProps;

	const { sharedProgress } = useSharedProgress();
	const location = useLocation();
	const navigate = useNavigate();

	const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

	// 初回自動選択制御フラグ
	const hasAutoSelectedSharedRef = useRef(false);

	// 共有キャラクターデータのキャッシュ
	const lastSharedCharRef = useRef<DisplayCharacterProgress | null>(null);

	const currentSharedCharacter = useMemo<DisplayCharacterProgress | null>(() => {
		if (!sharedProgress) return null;
		return {
			id: SHARED_GUEST_CHARACTER_ID,
			name: sharedProgress.characterName,
			checkedFishIds: sharedProgress.checkedFishIds,
			createdAt: sharedProgress.createdAt,
			updatedAt: sharedProgress.createdAt,
			isShared: true,
		};
	}, [sharedProgress]);

	useEffect(() => {
		if (currentSharedCharacter) {
			lastSharedCharRef.current = currentSharedCharacter;
		}
	}, [currentSharedCharacter]);

	const activeSharedCharacter = currentSharedCharacter || lastSharedCharRef.current;

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

			const searchParams = new URLSearchParams(location.search);
			if (searchParams.has('share')) {
				searchParams.delete('share');
				const newSearch = searchParams.toString();
				const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
				navigate(newPath, { replace: true });
			}
		}
	}, [sharedProgress, location.pathname, location.search, navigate, setLocalActiveCharacter, setViewMode]);

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

	// 一覧ページの閲覧権限判定
	const canViewContainer =
		isRegistered ||
		!!sharedProgress ||
		(userData.activeCharacterId === SHARED_GUEST_CHARACTER_ID && !!lastSharedCharRef.current);

	const handleCreateCharacterAndClose = (name: string) => {
		const newChar = addCharacter(name);
		if (newChar?.id) {
			setLocalActiveCharacter(newChar.id);
		}
		setRegistrationMessage(null);
	};

	const value: UserDataContextType = {
		userData,
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

export const useUserDataContext = (): UserDataContextType => {
	const context = useContext(UserDataContext);
	if (!context) {
		throw new Error('useUserDataContext must be used within a UserDataProvider');
	}
	return context;
};
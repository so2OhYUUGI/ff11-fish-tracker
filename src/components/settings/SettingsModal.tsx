/**
 * ============================================================================
 * [FilePath] src/components/settings/SettingsModal.tsx
 * [Role] アプリケーションの環境設定・データ管理モーダル（固定サイズ版）
 * 
 * [概要]
 * - UserDataContext から状態および操作関数を直接参照し、Props 伝播を削除
 * - キャラクターの追加・変更・削除およびデータのインポート/エクスポート制御を提供
 * 
 * [依存関係・関連ファイル]
 * - Context  : src/contexts/UserDataContext.tsx
 * - タブ    : src/components/settings/CharacterTab.tsx, src/components/settings/DataTab.tsx
 * - スタイル : src/styles/components/settingsStyles.ts
 * ============================================================================
 */

import React, { useState } from 'react';
import { X, User, Database } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { CharacterTab } from './CharacterTab';
import { DataTab } from './DataTab';
import { SETTINGS_STYLES } from '@/styles/components/settingsStyles';

type TabType = 'character' | 'data';

type SettingsModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [activeTab, setActiveTab] = useState<TabType>('character');
	const {
		userData,
		activeCharacterId,
		setActiveCharacter,
		addCharacter,
		renameCharacter,
		deleteCharacter,
		exportData,
		importData,
	} = useUserDataContext();

	if (!isOpen) return null;

	return (
		<div className={SETTINGS_STYLES.overlay}>
			<div className={SETTINGS_STYLES.modal}>

				{/* ヘッダー */}
				<div className={SETTINGS_STYLES.header.container}>
					<h2 className={SETTINGS_STYLES.header.title}>環境設定・データ管理</h2>
					<button
						onClick={onClose}
						className={SETTINGS_STYLES.header.closeButton}
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* タブナビゲーション */}
				<div className={SETTINGS_STYLES.tabNav.container}>
					<button
						onClick={() => setActiveTab('character')}
						className={`${SETTINGS_STYLES.tabNav.buttonBase} ${activeTab === 'character'
							? SETTINGS_STYLES.tabNav.active
							: SETTINGS_STYLES.tabNav.inactive
							}`}
					>
						<User className="w-4 h-4" />
						キャラクター管理
					</button>
					<button
						onClick={() => setActiveTab('data')}
						className={`${SETTINGS_STYLES.tabNav.buttonBase} ${activeTab === 'data'
							? SETTINGS_STYLES.tabNav.active
							: SETTINGS_STYLES.tabNav.inactive
							}`}
					>
						<Database className="w-4 h-4" />
						データ管理
					</button>
				</div>

				{/* タブコンテンツ */}
				<div className={SETTINGS_STYLES.content}>
					{activeTab === 'character' && (
						<CharacterTab
							characters={userData.characters}
							activeCharacterId={activeCharacterId}
							onSelectCharacter={setActiveCharacter}
							onAddCharacter={addCharacter}
							onRenameCharacter={renameCharacter}
							onDeleteCharacter={deleteCharacter}
						/>
					)}

					{activeTab === 'data' && (
						<DataTab
							onExport={exportData}
							onImport={importData}
						/>
					)}
				</div>

				{/* フッター */}
				<div className={SETTINGS_STYLES.footer.container}>
					<button
						onClick={onClose}
						className={SETTINGS_STYLES.footer.closeButton}
					>
						閉じる
					</button>
				</div>

			</div>
		</div>
	);
};
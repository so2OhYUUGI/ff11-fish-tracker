/**
 * ============================================================================
 * [FilePath] src/components/settings/SettingsModal.tsx
 * [Role] アプリケーションの環境設定・データ管理モーダル（固定サイズ版）
 * 
 * [概要]
 * - タブ表示の切り替えおよびモーダル自体の開閉処理のみを保持
 * - タブ配下のコンポーネントへの Props 伝播を削除
 * ============================================================================
 */

import React, { useState } from 'react';
import { X, User, Database } from 'lucide-react';
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
					{activeTab === 'character' && <CharacterTab />}
					{activeTab === 'data' && <DataTab />}
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
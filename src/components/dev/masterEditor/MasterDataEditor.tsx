/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/MasterDataEditor.tsx
 * [Role] 開発用マスターデータ編集コンテナ（開発環境専用）
 * 
 * [概要]
 * - 開発環境限定で動作するマスターデータ統合編集コンテナ
 * - タブ選択をドロップダウン方式にし、ツールバーの表示領域を最適化
 * - 魚・ゾーン・餌に加え、フェイス（TRUSTS）マスターデータの編集に対応
 * ============================================================================
 */

import React, { useState } from 'react';
import { isDev } from '@/utils/env';
import {
	FISHES,
	ZONES,
	BAITS,
	TRUSTS,
	FISH_LOCATIONS,
	SUB_LOCATIONS,
	REGIONS,
	FISH_BAIT_RELATIONS,
	FISH_ROD_RELATIONS,
} from '@/data/';
import type {
	FishLocation,
	ZoneMaster,
	BaitMaster,
	FishBaitRelation,
	FishRodRelation,
} from '@/types/fishtracker';
import type { TrustMaster } from '@/types/trusttracker';
import { FishEditTab } from './tabs/FishEditTab/FishEditTab';
import { ZoneEditTab } from './tabs/ZoneEditTab';
import { BaitReorderTab } from './tabs/BaitReorderTab';
import { TrustEditTab } from './tabs/TrustEditTab/TrustEditTab';
import type { EditTab, EditableFish } from './types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

export const MasterDataEditor: React.FC = () => {
	// 1. すべての State / Hook をコンポーネント最上部で宣言
	const [activeTab, setActiveTab] = useState<EditTab>('fish');

	const [fishList, setFishList] = useState<EditableFish[]>(() =>
		FISHES.map((fish) => {
			const matchedLocs = FISH_LOCATIONS.filter((loc) => loc.fishId === fish.id);
			const zoneIds = Array.from(new Set(matchedLocs.map((loc) => loc.zoneId)));
			const subLocationIds = Array.from(
				new Set(matchedLocs.flatMap((loc) => loc.subLocationIds || []))
			);

			return {
				...fish,
				zoneIds,
				subLocationIds: subLocationIds.length > 0 ? subLocationIds : undefined,
			};
		})
	);

	const [zoneList, setZoneList] = useState<ZoneMaster[]>(() => ZONES);
	const [baitList, setBaitList] = useState<BaitMaster[]>(() => BAITS || []);
	const [trustList, setTrustList] = useState<TrustMaster[]>(() => TRUSTS || []);

	// 中間リレーションデータの State
	const [fishBaitRelations, setFishBaitRelations] = useState<FishBaitRelation[]>(
		() => FISH_BAIT_RELATIONS || []
	);
	const [fishRodRelations, setFishRodRelations] = useState<FishRodRelation[]>(
		() => FISH_ROD_RELATIONS || []
	);

	// 2. Hook 宣言の後に早期リターンを配置
	if (!isDev) return null;

	const handleFishChange = (updated: EditableFish) => {
		setFishList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleZoneChange = (updated: ZoneMaster) => {
		setZoneList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleTrustChange = (updated: TrustMaster) => {
		setTrustList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleDirectSave = async () => {
		try {
			const [fishRes, trustRes] = await Promise.all([
				fetch('/api/save-fish-data', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						fishList,
						zoneList,
						baitList,
						fishBaitRelations,
						fishRodRelations,
					}),
				}),
				fetch('/api/save-trust-data', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						trustList,
					}),
				}),
			]);

			if (fishRes.ok && trustRes.ok) {
				alert('マスターデータ（TSファイル）へ直接保存しました！');
			} else {
				alert('保存に失敗しました。');
			}
		} catch (error) {
			console.error(error);
			alert('エラーが発生しました。');
		}
	};

	const handleExport = () => {
		const exportFishes = fishList.map((fish) => {
			const copy = { ...fish };
			delete copy.zoneIds;
			delete copy.subLocationIds;
			return copy;
		});
		const exportLocations: FishLocation[] = fishList.flatMap((fish) =>
			(fish.zoneIds || []).map((zoneId) => {
				const zoneSubLocationIds = (fish.subLocationIds || []).filter((subId) => {
					const subLoc = SUB_LOCATIONS.find((s) => s.id === subId);
					return subLoc?.zoneId === zoneId;
				});

				return {
					id: `${fish.id}-${zoneId}`,
					fishId: fish.id,
					zoneId,
					...(zoneSubLocationIds.length > 0 ? { subLocationIds: zoneSubLocationIds } : {}),
				};
			})
		);

		const exportData = {
			fishes: exportFishes,
			fishLocations: exportLocations,
			zones: zoneList,
			baits: baitList,
			trusts: trustList,
			fishBaitRelations,
			fishRodRelations,
		};

		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', 'updatedMasterData.json');
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

	// ローカルデータ（LocalStorage）の初期化
	const handleResetLocalStorage = () => {
		if (confirm('ローカルに保存されているユーザー進捗データ（LocalStorage）をクリアして初期化しますか？\n（ページが再読み込みされます）')) {
			localStorage.clear();
			window.location.reload();
		}
	};

	return (
		<div className={EDITOR_STYLES.wrapper}>
			{/* ツールバー */}
			<div className={EDITOR_STYLES.toolbar}>
				{/* 左側：ドロップダウン方式の編集カテゴリ切り替え */}
				<div className="flex items-center gap-2">
					<label htmlFor="master-editor-tab-select" className="text-xs font-semibold text-gray-300 whitespace-nowrap">
						編集項目:
					</label>
					<select
						id="master-editor-tab-select"
						value={activeTab}
						onChange={(e) => setActiveTab(e.target.value as EditTab)}
						className="bg-gray-800 text-gray-100 border border-gray-600 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
					>
						<option value="fish">🐟 魚データ編集</option>
						<option value="zone">🗺️ ゾーン（エリア）編集</option>
						<option value="bait">🪱 餌並び順編集</option>
						<option value="trust">👤 フェイスデータ編集</option>
					</select>
				</div>

				{/* 右側：データ保存・出力アクションボタン群 */}
				<div className={EDITOR_STYLES.actionGroup}>
					<button
						type="button"
						onClick={handleResetLocalStorage}
						className={`${EDITOR_STYLES.btnBase} ${EDITOR_STYLES.btnReset}`}
						title="LocalStorageのユーザーデータをクリアして初期状態に戻します"
					>
						🧹 ローカルデータ初期化
					</button>
					<button
						type="button"
						onClick={handleDirectSave}
						className={`${EDITOR_STYLES.btnBase} ${EDITOR_STYLES.btnSave}`}
					>
						TSファイルへ上書き保存
					</button>
					<button
						type="button"
						onClick={handleExport}
						className={`${EDITOR_STYLES.btnBase} ${EDITOR_STYLES.btnExport}`}
					>
						JSONをダウンロード
					</button>
				</div>
			</div>

			{/* 各編集タブコンテンツ */}
			<div className={EDITOR_STYLES.tabPanel}>
				{activeTab === 'fish' && (
					<FishEditTab
						fishList={fishList}
						zoneList={zoneList}
						regionList={REGIONS}
						fishBaitRelations={fishBaitRelations}
						fishRodRelations={fishRodRelations}
						onFishChange={handleFishChange}
						onBaitRelationChange={setFishBaitRelations}
						onRodRelationChange={setFishRodRelations}
					/>
				)}
				{activeTab === 'zone' && (
					<ZoneEditTab zoneList={zoneList} regionList={REGIONS} onZoneChange={handleZoneChange} />
				)}
				{activeTab === 'bait' && (
					<BaitReorderTab baitList={baitList} onBaitListChange={setBaitList} />
				)}
				{activeTab === 'trust' && (
					<TrustEditTab
						trustList={trustList}
						onTrustChange={handleTrustChange}
						onTrustListChange={setTrustList}
					/>
				)}
			</div>
		</div>
	);
};
/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/MasterDataEditor.tsx
 * [Role] 開発用マスターデータ編集コンテナ（開発環境専用）
 * 
 * [概要]
 * - 開発環境限定で動作するマスターデータ統合編集コンテナ
 * - インラインスタイルを排除し、EDITOR_STYLES に定義を集約
 * - FISH_LOCATIONS から zoneIds および subLocationIds を抽出し EditableFish を初期化
 * ============================================================================
 */

import React, { useState } from 'react';
import { isDev } from '@/utils/env';
import {
	FISHES,
	ZONES,
	BAITS,
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
import { FishEditTab } from './tabs/FishEditTab/FishEditTab';
import { ZoneEditTab } from './tabs/ZoneEditTab';
import { BaitReorderTab } from './tabs/BaitReorderTab';
import type { EditTab, EditableFish } from './types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

export const MasterDataEditor: React.FC = () => {
	if (!isDev) return null;

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

	// 餌マスターの State（定義順のまま保持）
	const [baitList, setBaitList] = useState<BaitMaster[]>(() => BAITS || []);

	// 中間リレーションデータの State
	const [fishBaitRelations, setFishBaitRelations] = useState<FishBaitRelation[]>(
		() => FISH_BAIT_RELATIONS || []
	);
	const [fishRodRelations, setFishRodRelations] = useState<FishRodRelation[]>(
		() => FISH_ROD_RELATIONS || []
	);

	const handleFishChange = (updated: EditableFish) => {
		setFishList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleZoneChange = (updated: ZoneMaster) => {
		setZoneList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleDirectSave = async () => {
		try {
			const response = await fetch('/api/save-fish-data', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fishList,
					zoneList,
					baitList,
					fishBaitRelations,
					fishRodRelations,
				}),
			});

			if (response.ok) {
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
		const exportFishes = fishList.map(({ zoneIds, subLocationIds, ...fish }) => fish);
		const exportLocations: FishLocation[] = fishList.flatMap((fish) =>
			(fish.zoneIds || []).map((zoneId) => {
				// 該当ゾーンに対応する subLocationIds の抽出
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
			fishBaitRelations,
			fishRodRelations,
		};

		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', 'updatedFishData.json');
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
				{/* 左側：タブ切り替えボタン群 */}
				<div className={EDITOR_STYLES.tabGroup}>
					<button
						type="button"
						onClick={() => setActiveTab('fish')}
						className={`${EDITOR_STYLES.tabButtonBase} ${activeTab === 'fish'
							? EDITOR_STYLES.tabButtonActive
							: EDITOR_STYLES.tabButtonInactive
							}`}
					>
						🐟 魚データ編集
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('zone')}
						className={`${EDITOR_STYLES.tabButtonBase} ${activeTab === 'zone'
							? EDITOR_STYLES.tabButtonActive
							: EDITOR_STYLES.tabButtonInactive
							}`}
					>
						🗺️ ゾーン（エリア）編集
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('bait')}
						className={`${EDITOR_STYLES.tabButtonBase} ${activeTab === 'bait'
							? EDITOR_STYLES.tabButtonActive
							: EDITOR_STYLES.tabButtonInactive
							}`}
					>
						🪱 餌並び順編集
					</button>
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
			</div>
		</div>
	);
};
import type { FishMaster, ZoneMaster } from '@/types/fish';

// テスト用ゾーンマスター
export const MOCK_ZONES: ZoneMaster[] = [
	{ id: 248, ja: 'セルビナ', en: 'Selbina' },
	{ id: 249, ja: 'ノーグ', en: 'Norg' },
	{ id: 102, ja: 'ラバオ', en: 'Rabao' },
];

// テスト用魚マスター
export const MOCK_FISHES: FishMaster[] = [
	{
		id: 4353,
		ja: 'ネビムコラズ',
		en: 'Nebimonite',
		description: 'test',
		maxSkill: 10,
		sizeType: 'small',
		harakiri: false,
		ebisu: false,
		taikobou: false,
		zoneIds: [248, 249],
		notes: 'セルビナ港・ノーグ等で手軽に釣れる小型魚',
	},
	{
		id: 4401,
		ja: 'ギガントコッド',
		en: 'Gigant Cod',
		description: 'test',
		maxSkill: 45,
		sizeType: 'large',
		harakiri: true,
		ebisu: true,
		taikobou: false,
		zoneIds: [248],
		notes: 'ハラキリ対象（恵比寿クエスト関連）',
	},
	{
		id: 5120,
		ja: 'リュウグウノツカイ',
		en: 'Ryugu Titan',
		description: 'test',
		maxSkill: 110,
		sizeType: 'large',
		harakiri: true,
		ebisu: true,
		taikobou: true,
		zoneIds: [102],
		notes: '超高難易度魚',
	},
];
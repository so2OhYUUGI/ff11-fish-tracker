import type { FishMaster, ZoneMaster } from '@/types/fish';

export const ZONES: ZoneMaster[] = [
  {
    "id": 0,
    "ja": "unknown",
    "en": "unknown"
  },
  {
    "id": 1,
    "ja": "ファノエ運河",
    "en": "Phanauet Channel"
  },
  {
    "id": 2,
    "ja": "ギルド桟橋",
    "en": "Carpenters' Landing"
  },
  {
    "id": 3,
    "ja": "マナクリッパー",
    "en": "Manaclipper"
  },
  {
    "id": 4,
    "ja": "ビビキー湾",
    "en": "Bibiki Bay"
  },
  {
    "id": 5,
    "ja": "ウルガラン山脈",
    "en": "Uleguerand Range"
  },
  {
    "id": 6,
    "ja": "熊爪嶽",
    "en": "Bearclaw Pinnacle"
  },
  {
    "id": 7,
    "ja": "アットワ地溝",
    "en": "Attohwa Chasm"
  },
  {
    "id": 8,
    "ja": "千骸谷",
    "en": "Boneyard Gully"
  },
  {
    "id": 9,
    "ja": "ソ・ジヤ",
    "en": "Pso'Xja"
  },
  {
    "id": 10,
    "ja": "異界の口",
    "en": "The Shrouded Maw"
  },
  {
    "id": 11,
    "ja": "ムバルポロス旧市街",
    "en": "Oldton Movalpolos"
  },
  {
    "id": 12,
    "ja": "ムバルポロス新市街",
    "en": "Newton Movalpolos"
  },
  {
    "id": 13,
    "ja": "2716号採石場",
    "en": "Mine Shaft #2716"
  },
  {
    "id": 14,
    "ja": "転移の間",
    "en": "Hall of Transference"
  },
  {
    "id": 15,
    "ja": "アビセア-コンシュタット",
    "en": "Abyssea - Konschtat"
  },
  {
    "id": 16,
    "ja": "プロミヴォン-ホラ",
    "en": "Promyvion - Holla"
  },
  {
    "id": 17,
    "ja": "ホラの塔",
    "en": "Spire of Holla"
  },
  {
    "id": 18,
    "ja": "プロミヴォン-デム",
    "en": "Promyvion - Dem"
  },
  {
    "id": 19,
    "ja": "デムの塔",
    "en": "Spire of Dem"
  },
  {
    "id": 20,
    "ja": "プロミヴォン-メア",
    "en": "Promyvion - Mea"
  },
  {
    "id": 21,
    "ja": "メアの塔",
    "en": "Spire of Mea"
  },
  {
    "id": 22,
    "ja": "プロミヴォン-ヴァズ",
    "en": "Promyvion - Vahzl"
  },
  {
    "id": 23,
    "ja": "ヴァズの塔",
    "en": "Spire of Vahzl"
  },
  {
    "id": 24,
    "ja": "ルフェーゼ野",
    "en": "Lufaise Meadows"
  },
  {
    "id": 25,
    "ja": "ミザレオ海岸",
    "en": "Misareaux Coast"
  },
  {
    "id": 26,
    "ja": "タブナジア地下壕",
    "en": "Tavnazian Safehold"
  },
  {
    "id": 27,
    "ja": "フォミュナ水道",
    "en": "Phomiuna Aqueducts"
  },
  {
    "id": 28,
    "ja": "礼拝堂",
    "en": "Sacrarium"
  },
  {
    "id": 29,
    "ja": "リヴェーヌ岩塊群サイトB01",
    "en": "Riverne - Site #B01"
  },
  {
    "id": 30,
    "ja": "リヴェーヌ岩塊群サイトA01",
    "en": "Riverne - Site #A01"
  },
  {
    "id": 31,
    "ja": "帝龍の飛泉",
    "en": "Monarch Linn"
  },
  {
    "id": 32,
    "ja": "海獅子の巣窟",
    "en": "Sealion's Den"
  },
  {
    "id": 33,
    "ja": "アル・タユ",
    "en": "Al'Taieu"
  },
  {
    "id": 34,
    "ja": "フ・ゾイの王宮",
    "en": "Grand Palace of Hu'Xzoi"
  },
  {
    "id": 35,
    "ja": "ル・メトの園",
    "en": "The Garden of Ru'Hmet"
  },
  {
    "id": 36,
    "ja": "天象の鎖",
    "en": "Empyreal Paradox"
  },
  {
    "id": 37,
    "ja": "テメナス",
    "en": "Temenos"
  },
  {
    "id": 38,
    "ja": "アポリオン",
    "en": "Apollyon"
  },
  {
    "id": 39,
    "ja": "デュナミス-バルクルム",
    "en": "Dynamis - Valkurm"
  },
  {
    "id": 40,
    "ja": "デュナミス-ブブリム",
    "en": "Dynamis - Buburimu"
  },
  {
    "id": 41,
    "ja": "デュナミス-クフィム",
    "en": "Dynamis - Qufim"
  },
  {
    "id": 42,
    "ja": "デュナミス-タブナジア",
    "en": "Dynamis - Tavnazia"
  },
  {
    "id": 43,
    "ja": "アブダルスの箱庭-ゲルスバ",
    "en": "Diorama Abdhaljs-Ghelsba"
  },
  {
    "id": 44,
    "ja": "アブダルスの島-プルゴノルゴ",
    "en": "Abdhaljs Isle-Purgonorgo"
  },
  {
    "id": 45,
    "ja": "アビセア-タロンギ",
    "en": "Abyssea - Tahrongi"
  },
  {
    "id": 46,
    "ja": "外洋航路：アルザビ行き",
    "en": "Open sea route to Al Zahbi"
  },
  {
    "id": 47,
    "ja": "外洋航路：マウラ行き",
    "en": "Open sea route to Mhaura"
  },
  {
    "id": 48,
    "ja": "アルザビ",
    "en": "Al Zahbi"
  },
  {
    "id": 50,
    "ja": "アトルガン白門",
    "en": "Aht Urhgan Whitegate"
  },
  {
    "id": 51,
    "ja": "ワジャーム樹林",
    "en": "Wajaom Woodlands"
  },
  {
    "id": 52,
    "ja": "バフラウ段丘",
    "en": "Bhaflau Thickets"
  },
  {
    "id": 53,
    "ja": "ナシュモ",
    "en": "Nashmau"
  },
  {
    "id": 54,
    "ja": "アラパゴ暗礁域",
    "en": "Arrapago Reef"
  },
  {
    "id": 55,
    "ja": "イルルシ環礁",
    "en": "Ilrusi Atoll"
  },
  {
    "id": 56,
    "ja": "ペリキア",
    "en": "Periqia"
  },
  {
    "id": 57,
    "ja": "タラッカ入江",
    "en": "Talacca Cove"
  },
  {
    "id": 58,
    "ja": "銀海航路：ナシュモ行き",
    "en": "Silver Sea route to Nashmau"
  },
  {
    "id": 59,
    "ja": "銀海航路：アルザビ行き",
    "en": "Silver Sea route to Al Zahbi"
  },
  {
    "id": 60,
    "ja": "アシュタリフ号",
    "en": "The Ashu Talif"
  },
  {
    "id": 61,
    "ja": "ゼオルム火山",
    "en": "Mount Zhayolm"
  },
  {
    "id": 62,
    "ja": "ハルブーン",
    "en": "Halvung"
  },
  {
    "id": 63,
    "ja": "レベロス風穴",
    "en": "Lebros Cavern"
  },
  {
    "id": 64,
    "ja": "ナバゴ処刑場",
    "en": "Navukgo Execution Chamber"
  },
  {
    "id": 65,
    "ja": "マムーク",
    "en": "Mamook"
  },
  {
    "id": 66,
    "ja": "マムージャ兵訓練所",
    "en": "Mamool Ja Training Grounds"
  },
  {
    "id": 67,
    "ja": "翡翠廟",
    "en": "Jade Sepulcher"
  },
  {
    "id": 68,
    "ja": "エジワ蘿洞",
    "en": "Aydeewa Subterrane"
  },
  {
    "id": 69,
    "ja": "ルジャワン霊窟",
    "en": "Leujaoam Sanctum"
  },
  {
    "id": 70,
    "ja": "チョコボサーキット",
    "en": "Chocobo Circuit"
  },
  {
    "id": 71,
    "ja": "コロセウム",
    "en": "The Colosseum"
  },
  {
    "id": 72,
    "ja": "アルザダール海底遺跡群",
    "en": "Alzadaal Undersea Ruins"
  },
  {
    "id": 73,
    "ja": "ゼオルム遺構",
    "en": "Zhayolm Remnants"
  },
  {
    "id": 74,
    "ja": "アラパゴ遺構",
    "en": "Arrapago Remnants"
  },
  {
    "id": 75,
    "ja": "バフラウ遺構",
    "en": "Bhaflau Remnants"
  },
  {
    "id": 76,
    "ja": "銀海遺構",
    "en": "Silver Sea Remnants"
  },
  {
    "id": 77,
    "ja": "ナイズル島",
    "en": "Nyzul Isle"
  },
  {
    "id": 78,
    "ja": "ハザルム試験場",
    "en": "Hazhalm Testing Grounds"
  },
  {
    "id": 79,
    "ja": "カダーバの浮沼",
    "en": "Caedarva Mire"
  },
  {
    "id": 80,
    "ja": "南サンドリア〔Ｓ〕",
    "en": "Southern San d'Oria [S]"
  },
  {
    "id": 81,
    "ja": "東ロンフォール〔Ｓ〕",
    "en": "East Ronfaure [S]"
  },
  {
    "id": 82,
    "ja": "ジャグナー森林〔Ｓ〕",
    "en": "Jugner Forest [S]"
  },
  {
    "id": 83,
    "ja": "ブンカール浦〔Ｓ〕",
    "en": "Vunkerl Inlet [S]"
  },
  {
    "id": 84,
    "ja": "バタリア丘陵〔Ｓ〕",
    "en": "Batallia Downs [S]"
  },
  {
    "id": 85,
    "ja": "ラヴォール村〔Ｓ〕",
    "en": "La Vaule [S]"
  },
  {
    "id": 86,
    "ja": "常花の石窟",
    "en": "Everbloom Hollow"
  },
  {
    "id": 87,
    "ja": "バストゥーク商業区〔Ｓ〕",
    "en": "Bastok Markets [S]"
  },
  {
    "id": 88,
    "ja": "北グスタベルグ〔Ｓ〕",
    "en": "North Gustaberg [S]"
  },
  {
    "id": 89,
    "ja": "グロウベルグ〔Ｓ〕",
    "en": "Grauberg [S]"
  },
  {
    "id": 90,
    "ja": "パシュハウ沼〔Ｓ〕",
    "en": "Pashhow Marshlands [S]"
  },
  {
    "id": 91,
    "ja": "ロランベリー耕地〔Ｓ〕",
    "en": "Rolanberry Fields [S]"
  },
  {
    "id": 92,
    "ja": "ベドー〔Ｓ〕",
    "en": "Beadeaux [S]"
  },
  {
    "id": 93,
    "ja": "ルホッツ銀山",
    "en": "Ruhotz Silvermines"
  },
  {
    "id": 94,
    "ja": "ウィンダス水の区〔Ｓ〕",
    "en": "Windurst Waters [S]"
  },
  {
    "id": 95,
    "ja": "西サルタバルタ〔Ｓ〕",
    "en": "West Sarutabaruta [S]"
  },
  {
    "id": 96,
    "ja": "カルゴナルゴ城砦〔Ｓ〕",
    "en": "Fort Karugo-Narugo [S]"
  },
  {
    "id": 97,
    "ja": "メリファト山地〔Ｓ〕",
    "en": "Meriphataud Mountains [S]"
  },
  {
    "id": 98,
    "ja": "ソロムグ原野〔Ｓ〕",
    "en": "Sauromugue Champaign [S]"
  },
  {
    "id": 99,
    "ja": "オズトロヤ城〔Ｓ〕",
    "en": "Castle Oztroja [S]"
  },
  {
    "id": 100,
    "ja": "西ロンフォール",
    "en": "West Ronfaure"
  },
  {
    "id": 101,
    "ja": "東ロンフォール",
    "en": "East Ronfaure"
  },
  {
    "id": 102,
    "ja": "ラテーヌ高原",
    "en": "La Theine Plateau"
  },
  {
    "id": 103,
    "ja": "バルクルム砂丘",
    "en": "Valkurm Dunes"
  },
  {
    "id": 104,
    "ja": "ジャグナー森林",
    "en": "Jugner Forest"
  },
  {
    "id": 105,
    "ja": "バタリア丘陵",
    "en": "Batallia Downs"
  },
  {
    "id": 106,
    "ja": "北グスタベルグ",
    "en": "North Gustaberg"
  },
  {
    "id": 107,
    "ja": "南グスタベルグ",
    "en": "South Gustaberg"
  },
  {
    "id": 108,
    "ja": "コンシュタット高地",
    "en": "Konschtat Highlands"
  },
  {
    "id": 109,
    "ja": "パシュハウ沼",
    "en": "Pashhow Marshlands"
  },
  {
    "id": 110,
    "ja": "ロランベリー耕地",
    "en": "Rolanberry Fields"
  },
  {
    "id": 111,
    "ja": "ボスディン氷河",
    "en": "Beaucedine Glacier"
  },
  {
    "id": 112,
    "ja": "ザルカバード",
    "en": "Xarcabard"
  },
  {
    "id": 113,
    "ja": "テリガン岬",
    "en": "Cape Teriggan"
  },
  {
    "id": 114,
    "ja": "東アルテパ砂漠",
    "en": "Eastern Altepa Desert"
  },
  {
    "id": 115,
    "ja": "西サルタバルタ",
    "en": "West Sarutabaruta"
  },
  {
    "id": 116,
    "ja": "東サルタバルタ",
    "en": "East Sarutabaruta"
  },
  {
    "id": 117,
    "ja": "タロンギ大峡谷",
    "en": "Tahrongi Canyon"
  },
  {
    "id": 118,
    "ja": "ブブリム半島",
    "en": "Buburimu Peninsula"
  },
  {
    "id": 119,
    "ja": "メリファト山地",
    "en": "Meriphataud Mountains"
  },
  {
    "id": 120,
    "ja": "ソロムグ原野",
    "en": "Sauromugue Champaign"
  },
  {
    "id": 121,
    "ja": "聖地ジ・タ",
    "en": "The Sanctuary of Zi'Tah"
  },
  {
    "id": 122,
    "ja": "ロ・メーヴ",
    "en": "Ro'Maeve"
  },
  {
    "id": 123,
    "ja": "ユタンガ大森林",
    "en": "Yuhtunga Jungle"
  },
  {
    "id": 124,
    "ja": "ヨアトル大森林",
    "en": "Yhoator Jungle"
  },
  {
    "id": 125,
    "ja": "西アルテパ砂漠",
    "en": "Western Altepa Desert"
  },
  {
    "id": 126,
    "ja": "クフィム島",
    "en": "Qufim Island"
  },
  {
    "id": 127,
    "ja": "ベヒーモスの縄張り",
    "en": "Behemoth's Dominion"
  },
  {
    "id": 128,
    "ja": "慟哭の谷",
    "en": "Valley of Sorrows"
  },
  {
    "id": 129,
    "ja": "ゴユの空洞",
    "en": "Ghoyu's Reverie"
  },
  {
    "id": 130,
    "ja": "ル・オンの庭",
    "en": "Ru'Aun Gardens"
  },
  {
    "id": 131,
    "ja": "モルディオン監獄",
    "en": "Mordion Gaol"
  },
  {
    "id": 132,
    "ja": "アビセア-ラテーヌ",
    "en": "Abyssea - La Theine"
  },
  {
    "id": 133,
    "ja": "ラ・カザナル宮外郭〔Ｕ２〕",
    "en": "Outer Ra'Kaznar [U2]"
  },
  {
    "id": 134,
    "ja": "デュナミス-ボスディン",
    "en": "Dynamis - Beaucedine"
  },
  {
    "id": 135,
    "ja": "デュナミス-ザルカバード",
    "en": "Dynamis - Xarcabard"
  },
  {
    "id": 136,
    "ja": "ボスディン氷河〔Ｓ〕",
    "en": "Beaucedine Glacier [S]"
  },
  {
    "id": 137,
    "ja": "ザルカバード〔Ｓ〕",
    "en": "Xarcabard [S]"
  },
  {
    "id": 138,
    "ja": "ズヴァール城外郭〔Ｓ〕",
    "en": "Castle Zvahl Baileys [S]"
  },
  {
    "id": 139,
    "ja": "ホルレーの岩峰",
    "en": "Horlais Peak"
  },
  {
    "id": 140,
    "ja": "ゲルスバ野営陣",
    "en": "Ghelsba Outpost"
  },
  {
    "id": 141,
    "ja": "ゲルスバ砦",
    "en": "Fort Ghelsba"
  },
  {
    "id": 142,
    "ja": "ユグホトの岩屋",
    "en": "Yughott Grotto"
  },
  {
    "id": 143,
    "ja": "パルブロ鉱山",
    "en": "Palborough Mines"
  },
  {
    "id": 144,
    "ja": "ワールンの祠",
    "en": "Waughroon Shrine"
  },
  {
    "id": 145,
    "ja": "ギデアス",
    "en": "Giddeus"
  },
  {
    "id": 146,
    "ja": "バルガの舞台",
    "en": "Balga's Dais"
  },
  {
    "id": 147,
    "ja": "ベドー",
    "en": "Beadeaux"
  },
  {
    "id": 148,
    "ja": "クゥルンの大伽藍",
    "en": "Qulun Dome"
  },
  {
    "id": 149,
    "ja": "ダボイ",
    "en": "Davoi"
  },
  {
    "id": 150,
    "ja": "修道窟",
    "en": "Monastic Cavern"
  },
  {
    "id": 151,
    "ja": "オズトロヤ城",
    "en": "Castle Oztroja"
  },
  {
    "id": 152,
    "ja": "祭壇の間",
    "en": "Altar Room"
  },
  {
    "id": 153,
    "ja": "ボヤーダ樹",
    "en": "The Boyahda Tree"
  },
  {
    "id": 154,
    "ja": "龍のねぐら",
    "en": "Dragon's Aery"
  },
  {
    "id": 155,
    "ja": "ズヴァール城内郭〔Ｓ〕",
    "en": "Castle Zvahl Keep [S]"
  },
  {
    "id": 156,
    "ja": "王の間〔Ｓ〕",
    "en": "Throne Room [S]"
  },
  {
    "id": 157,
    "ja": "デルクフの塔中層",
    "en": "Middle Delkfutt's Tower"
  },
  {
    "id": 158,
    "ja": "デルクフの塔上層",
    "en": "Upper Delkfutt's Tower"
  },
  {
    "id": 159,
    "ja": "ウガレピ寺院",
    "en": "Temple of Uggalepih"
  },
  {
    "id": 160,
    "ja": "怨念洞",
    "en": "Den of Rancor"
  },
  {
    "id": 161,
    "ja": "ズヴァール城外郭",
    "en": "Castle Zvahl Baileys"
  },
  {
    "id": 162,
    "ja": "ズヴァール城内郭",
    "en": "Castle Zvahl Keep"
  },
  {
    "id": 163,
    "ja": "生贄の間",
    "en": "Sacrificial Chamber"
  },
  {
    "id": 164,
    "ja": "ガルレージュ要塞〔Ｓ〕",
    "en": "Garlaige Citadel [S]"
  },
  {
    "id": 165,
    "ja": "王の間",
    "en": "Throne Room"
  },
  {
    "id": 166,
    "ja": "ラングモント峠",
    "en": "Ranguemont Pass"
  },
  {
    "id": 167,
    "ja": "ボストーニュ監獄",
    "en": "Bostaunieux Oubliette"
  },
  {
    "id": 168,
    "ja": "宣託の間",
    "en": "Chamber of Oracles"
  },
  {
    "id": 169,
    "ja": "トライマライ水路",
    "en": "Toraimarai Canal"
  },
  {
    "id": 170,
    "ja": "満月の泉",
    "en": "Full Moon Fountain"
  },
  {
    "id": 171,
    "ja": "クロウラーの巣〔Ｓ〕",
    "en": "Crawlers' Nest [S]"
  },
  {
    "id": 172,
    "ja": "ツェールン鉱山",
    "en": "Zeruhn Mines"
  },
  {
    "id": 173,
    "ja": "コロロカの洞門",
    "en": "Korroloka Tunnel"
  },
  {
    "id": 174,
    "ja": "クフタルの洞門",
    "en": "Kuftal Tunnel"
  },
  {
    "id": 175,
    "ja": "エルディーム古墳〔Ｓ〕",
    "en": "The Eldieme Necropolis [S]"
  },
  {
    "id": 176,
    "ja": "海蛇の岩窟",
    "en": "Sea Serpent Grotto"
  },
  {
    "id": 177,
    "ja": "ヴェ・ルガノン宮殿",
    "en": "Ve'Lugannon Palace"
  },
  {
    "id": 178,
    "ja": "ル・アビタウ神殿",
    "en": "The Shrine of Ru'Avitau"
  },
  {
    "id": 179,
    "ja": "天輪の場",
    "en": "Stellar Fulcrum"
  },
  {
    "id": 180,
    "ja": "ラ・ロフの劇場",
    "en": "La'Loff Amphitheater"
  },
  {
    "id": 181,
    "ja": "宿星の座",
    "en": "The Celestial Nexus"
  },
  {
    "id": 182,
    "ja": "ウォークオブエコーズ",
    "en": "Walk of Echoes"
  },
  {
    "id": 183,
    "ja": "アブダルスの模型-レギオンA",
    "en": "Maquette Abdhaljs-LegionA"
  },
  {
    "id": 184,
    "ja": "デルクフの塔下層",
    "en": "Lower Delkfutt's Tower"
  },
  {
    "id": 185,
    "ja": "デュナミス-サンドリア",
    "en": "Dynamis - San d'Oria"
  },
  {
    "id": 186,
    "ja": "デュナミス-バストゥーク",
    "en": "Dynamis - Bastok"
  },
  {
    "id": 187,
    "ja": "デュナミス-ウィンダス",
    "en": "Dynamis - Windurst"
  },
  {
    "id": 188,
    "ja": "デュナミス-ジュノ",
    "en": "Dynamis - Jeuno"
  },
  {
    "id": 189,
    "ja": "ラ・カザナル宮外郭〔Ｕ３〕",
    "en": "Outer Ra'Kaznar [U3]"
  },
  {
    "id": 190,
    "ja": "龍王ランペールの墓",
    "en": "King Ranperre's Tomb"
  },
  {
    "id": 191,
    "ja": "ダングルフの涸れ谷",
    "en": "Dangruf Wadi"
  },
  {
    "id": 192,
    "ja": "内ホルトト遺跡",
    "en": "Inner Horutoto Ruins"
  },
  {
    "id": 193,
    "ja": "オルデール鍾乳洞",
    "en": "Ordelle's Caves"
  },
  {
    "id": 194,
    "ja": "外ホルトト遺跡",
    "en": "Outer Horutoto Ruins"
  },
  {
    "id": 195,
    "ja": "エルディーム古墳",
    "en": "The Eldieme Necropolis"
  },
  {
    "id": 196,
    "ja": "グスゲン鉱山",
    "en": "Gusgen Mines"
  },
  {
    "id": 197,
    "ja": "クロウラーの巣",
    "en": "Crawlers' Nest"
  },
  {
    "id": 198,
    "ja": "シャクラミの地下迷宮",
    "en": "Maze of Shakhrami"
  },
  {
    "id": 200,
    "ja": "ガルレージュ要塞",
    "en": "Garlaige Citadel"
  },
  {
    "id": 201,
    "ja": "突風の回廊",
    "en": "Cloister of Gales"
  },
  {
    "id": 202,
    "ja": "雷鳴の回廊",
    "en": "Cloister of Storms"
  },
  {
    "id": 203,
    "ja": "凍結の回廊",
    "en": "Cloister of Frost"
  },
  {
    "id": 204,
    "ja": "フェ・イン",
    "en": "Fei'Yin"
  },
  {
    "id": 205,
    "ja": "イフリートの釜",
    "en": "Ifrit's Cauldron"
  },
  {
    "id": 206,
    "ja": "ク・ビアの闘技場",
    "en": "Qu'Bia Arena"
  },
  {
    "id": 207,
    "ja": "灼熱の回廊",
    "en": "Cloister of Flames"
  },
  {
    "id": 208,
    "ja": "流砂洞",
    "en": "Quicksand Caves"
  },
  {
    "id": 209,
    "ja": "震動の回廊",
    "en": "Cloister of Tremors"
  },
  {
    "id": 211,
    "ja": "海流の回廊",
    "en": "Cloister of Tides"
  },
  {
    "id": 212,
    "ja": "グスタフの洞門",
    "en": "Gustav Tunnel"
  },
  {
    "id": 213,
    "ja": "オンゾゾの迷路",
    "en": "Labyrinth of Onzozo"
  },
  {
    "id": 215,
    "ja": "アビセア-アットワ",
    "en": "Abyssea - Attohwa"
  },
  {
    "id": 216,
    "ja": "アビセア-ミザレオ",
    "en": "Abyssea - Misareaux"
  },
  {
    "id": 217,
    "ja": "アビセア-ブンカール",
    "en": "Abyssea - Vunkerl"
  },
  {
    "id": 218,
    "ja": "アビセア-アルテパ",
    "en": "Abyssea - Altepa"
  },
  {
    "id": 220,
    "ja": "航路：セルビナ行き",
    "en": "Ship bound for Selbina"
  },
  {
    "id": 221,
    "ja": "航路：マウラ行き",
    "en": "Ship bound for Mhaura"
  },
  {
    "id": 222,
    "ja": "真界",
    "en": "Provenance"
  },
  {
    "id": 223,
    "ja": "飛空艇航路",
    "en": "San d'Oria-Jeuno Airship"
  },
  {
    "id": 224,
    "ja": "飛空艇航路",
    "en": "Bastok-Jeuno Airship"
  },
  {
    "id": 225,
    "ja": "飛空艇航路",
    "en": "Windurst-Jeuno Airship"
  },
  {
    "id": 226,
    "ja": "飛空艇航路",
    "en": "Kazham-Jeuno Airship"
  },
  {
    "id": 227,
    "ja": "航路：セルビナ行き",
    "en": "Ship bound for Selbina"
  },
  {
    "id": 228,
    "ja": "航路：マウラ行き",
    "en": "Ship bound for Mhaura"
  },
  {
    "id": 229,
    "ja": "王の間〔Ｖ〕",
    "en": "Throne Room [V]"
  },
  {
    "id": 230,
    "ja": "南サンドリア",
    "en": "Southern San d'Oria"
  },
  {
    "id": 231,
    "ja": "北サンドリア",
    "en": "Northern San d'Oria"
  },
  {
    "id": 232,
    "ja": "サンドリア港",
    "en": "Port San d'Oria"
  },
  {
    "id": 233,
    "ja": "ドラギーユ城",
    "en": "Chateau d'Oraguille"
  },
  {
    "id": 234,
    "ja": "バストゥーク鉱山区",
    "en": "Bastok Mines"
  },
  {
    "id": 235,
    "ja": "バストゥーク商業区",
    "en": "Bastok Markets"
  },
  {
    "id": 236,
    "ja": "バストゥーク港",
    "en": "Port Bastok"
  },
  {
    "id": 237,
    "ja": "大工房",
    "en": "Metalworks"
  },
  {
    "id": 238,
    "ja": "ウィンダス水の区",
    "en": "Windurst Waters"
  },
  {
    "id": 239,
    "ja": "ウィンダス石の区",
    "en": "Windurst Walls"
  },
  {
    "id": 240,
    "ja": "ウィンダス港",
    "en": "Port Windurst"
  },
  {
    "id": 241,
    "ja": "ウィンダス森の区",
    "en": "Windurst Woods"
  },
  {
    "id": 242,
    "ja": "天の塔",
    "en": "Heavens Tower"
  },
  {
    "id": 243,
    "ja": "ル・ルデの庭",
    "en": "Ru'Lude Gardens"
  },
  {
    "id": 244,
    "ja": "ジュノ上層",
    "en": "Upper Jeuno"
  },
  {
    "id": 245,
    "ja": "ジュノ下層",
    "en": "Lower Jeuno"
  },
  {
    "id": 246,
    "ja": "ジュノ港",
    "en": "Port Jeuno"
  },
  {
    "id": 247,
    "ja": "ラバオ",
    "en": "Rabao"
  },
  {
    "id": 248,
    "ja": "セルビナ",
    "en": "Selbina"
  },
  {
    "id": 249,
    "ja": "マウラ",
    "en": "Mhaura"
  },
  {
    "id": 250,
    "ja": "カザム",
    "en": "Kazham"
  },
  {
    "id": 251,
    "ja": "神々の間",
    "en": "Hall of the Gods"
  },
  {
    "id": 252,
    "ja": "ノーグ",
    "en": "Norg"
  },
  {
    "id": 253,
    "ja": "アビセア-ウルガラン",
    "en": "Abyssea - Uleguerand"
  },
  {
    "id": 254,
    "ja": "アビセア-グロウベルグ",
    "en": "Abyssea - Grauberg"
  },
  {
    "id": 255,
    "ja": "アビセア-天象の鎖",
    "en": "Abyssea - Empyreal Paradox"
  },
  {
    "id": 256,
    "ja": "西アドゥリン",
    "en": "Western Adoulin"
  },
  {
    "id": 257,
    "ja": "東アドゥリン",
    "en": "Eastern Adoulin"
  },
  {
    "id": 258,
    "ja": "ララ水道",
    "en": "Rala Waterways"
  },
  {
    "id": 259,
    "ja": "ララ水道〔Ｕ〕",
    "en": "Rala Waterways [U]"
  },
  {
    "id": 260,
    "ja": "ヤッセの狩り場",
    "en": "Yahse Hunting Grounds"
  },
  {
    "id": 261,
    "ja": "ケイザック古戦場",
    "en": "Ceizak Battlegrounds"
  },
  {
    "id": 262,
    "ja": "エヌティエル水林",
    "en": "Foret de Hennetiel"
  },
  {
    "id": 263,
    "ja": "ヨルシア森林",
    "en": "Yorcia Weald"
  },
  {
    "id": 264,
    "ja": "ヨルシア森林〔Ｕ〕",
    "en": "Yorcia Weald [U]"
  },
  {
    "id": 265,
    "ja": "モリマー台地",
    "en": "Morimar Basalt Fields"
  },
  {
    "id": 266,
    "ja": "マリアミ渓谷",
    "en": "Marjami Ravine"
  },
  {
    "id": 267,
    "ja": "カミール山麓",
    "en": "Kamihr Drifts"
  },
  {
    "id": 268,
    "ja": "シィの門",
    "en": "Sih Gates"
  },
  {
    "id": 269,
    "ja": "モーの門",
    "en": "Moh Gates"
  },
  {
    "id": 270,
    "ja": "シルダス洞窟",
    "en": "Cirdas Caverns"
  },
  {
    "id": 271,
    "ja": "シルダス洞窟〔Ｕ〕",
    "en": "Cirdas Caverns [U]"
  },
  {
    "id": 272,
    "ja": "ドーの門",
    "en": "Dho Gates"
  },
  {
    "id": 273,
    "ja": "ウォーの門",
    "en": "Woh Gates"
  },
  {
    "id": 274,
    "ja": "ラ・カザナル宮外郭",
    "en": "Outer Ra'Kaznar"
  },
  {
    "id": 275,
    "ja": "ラ・カザナル宮外郭〔Ｕ１〕",
    "en": "Outer Ra'Kaznar [U1]"
  },
  {
    "id": 276,
    "ja": "ラ・カザナル宮内郭",
    "en": "Ra'Kaznar Inner Court"
  },
  {
    "id": 277,
    "ja": "ラ・カザナル宮天守",
    "en": "Ra'Kaznar Turris"
  },
  {
    "id": 278,
    "ja": "グォラ-歩廊",
    "en": "Gwora - Corridor"
  },
  {
    "id": 279,
    "ja": "ウォークオブエコーズ〔Ｐ２〕",
    "en": "Walk of Echoes [P2]"
  },
  {
    "id": 280,
    "ja": "モグガーデン",
    "en": "Mog Garden"
  },
  {
    "id": 281,
    "ja": "リファーリア",
    "en": "Leafallia"
  },
  {
    "id": 282,
    "ja": "カミール山",
    "en": "Mount Kamihr"
  },
  {
    "id": 283,
    "ja": "シルバー・ナイフ",
    "en": "Silver Knife"
  },
  {
    "id": 284,
    "ja": "セレニア図書館",
    "en": "Celennia Memorial Library"
  },
  {
    "id": 285,
    "ja": "魂の聖櫃",
    "en": "Feretory"
  },
  {
    "id": 287,
    "ja": "アブダルスの模型-レギオンB",
    "en": "Maquette Abdhaljs-LegionB"
  },
  {
    "id": 288,
    "ja": "エスカ-ジ・タ",
    "en": "Escha - Zi'Tah"
  },
  {
    "id": 289,
    "ja": "エスカ-ル・オン",
    "en": "Escha - Ru'Aun"
  },
  {
    "id": 290,
    "ja": "デスエチア-天象の鎖",
    "en": "Desuetia - Empyreal Paradox"
  },
  {
    "id": 291,
    "ja": "醴泉島",
    "en": "Reisenjima"
  },
  {
    "id": 292,
    "ja": "醴泉島-秘境",
    "en": "Reisenjima Henge"
  },
  {
    "id": 293,
    "ja": "醴泉島の祠",
    "en": "Reisenjima Sanctorium"
  },
  {
    "id": 294,
    "ja": "デュナミス-サンドリア〔Ｄ〕",
    "en": "Dynamis - San d'Oria [D]"
  },
  {
    "id": 295,
    "ja": "デュナミス-バストゥーク〔Ｄ〕",
    "en": "Dynamis - Bastok [D]"
  },
  {
    "id": 296,
    "ja": "デュナミス-ウィンダス〔Ｄ〕",
    "en": "Dynamis - Windurst [D]"
  },
  {
    "id": 297,
    "ja": "デュナミス-ジュノ〔Ｄ〕",
    "en": "Dynamis - Jeuno [D]"
  },
  {
    "id": 298,
    "ja": "ウォークオブエコーズ〔Ｐ１〕",
    "en": "Walk of Echoes [P1]"
  },
  {
    "id": 299,
    "ja": "グォラ-王の間",
    "en": "Gwora - Throne Room"
  }
];

export const FISHES: FishMaster[] = [
  {
    "id": 4318,
    "ja": "ビビキーアーチン",
    "en": "Bibiki Urchin",
    "description": "ビビキー湾の岩礁に生息する、球形の棘皮動物。\\n珍味で知られる。",
    "maxSkill": 30,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 2216,
    "ja": "ランプマリモ",
    "en": "Lamp Marimo",
    "description": "緑藻が集まって作り出した球体。\\n発光する種は、エジワ蘿洞にのみ生息する。",
    "maxSkill": 3,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5125,
    "ja": "ファノエニュート",
    "en": "Phanauet Newt",
    "description": "ファノエ運河にのみ生息する緑色のイモリ。\\n",
    "maxSkill": 4,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4443,
    "ja": "コバルトジェリー",
    "en": "Cobalt Jellyfish",
    "description": "ヴァナ・ディール全土の海に生息するクラゲ。\\n",
    "maxSkill": 5,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5447,
    "ja": "デニズアナス",
    "en": "Denizanasi",
    "description": "アルザビの漁師を悩ませるオバケクラゲ。\\n",
    "maxSkill": 5,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5785,
    "ja": "ザリガニ",
    "en": "Crayfish",
    "description": "ヴァナ・ディール全土に生息する甲殻類。\\n",
    "maxSkill": 7,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5960,
    "ja": "ウルブカザリガニ",
    "en": "Ulbukan Lobster",
    "description": "ウルブカ大陸に生息する甲殻類。\\n毒に強い。",
    "maxSkill": 7,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4314,
    "ja": "ビビキーチョコボ",
    "en": "Bibikibo",
    "description": "ビビキー湾に生息する、直立泳法の奇妙な海水魚。\\n頭がチョコボの首に似ている。",
    "maxSkill": 8,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5792,
    "ja": "バストアサーディン",
    "en": "Bastore Sardine",
    "description": "バストア海沿岸に生息する海水魚。\\n",
    "maxSkill": 9,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5449,
    "ja": "ハムシー",
    "en": "Hamsi",
    "description": "偃月海峡に生息する海水魚。\\n",
    "maxSkill": 9,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5963,
    "ja": "センローサーディン",
    "en": "Senroh Sardine",
    "description": "センロー海沿岸に生息する海水魚。\\n",
    "maxSkill": 9,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5789,
    "ja": "堀ブナ",
    "en": "Moat Carp",
    "description": "ヴァナ・ディール全域の湖沼に生息する淡水魚。\\n",
    "maxSkill": 11,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（素人→見習）"
  },
  {
    "id": 5473,
    "ja": "バストアスイーパー",
    "en": "Bastore Sweeper",
    "description": "ブンカール浦に生息していた甲殻類。\\n",
    "maxSkill": 12,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6334,
    "ja": "カザナルシェル",
    "en": "Ra. Shellfish",
    "description": "金属で覆われている未知の生物。\\n",
    "maxSkill": 12,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5950,
    "ja": "アジェ",
    "en": "Mackerel",
    "description": "センロー海周辺に生息する海水魚。\\n",
    "maxSkill": 13,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4500,
    "ja": "グリーディ",
    "en": "Greedie",
    "description": "ベッフェル湾に生息する悪食の海水魚。\\n",
    "maxSkill": 14,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5790,
    "ja": "カッパーフロッグ",
    "en": "Copper Frog",
    "description": "クォン大陸南部の湖沼に生息する両生類。\\n",
    "maxSkill": 16,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5993,
    "ja": "センローフロッグ",
    "en": "Senroh Frog",
    "description": "センロー海沿岸の岩礁に生息する両生類。",
    "maxSkill": 16,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4403,
    "ja": "イエローグローブ",
    "en": "Yellow Globe",
    "description": "猛毒で知られる海水魚。\\n",
    "maxSkill": 17,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5126,
    "ja": "マッディサイレドン",
    "en": "Muddy Siredon",
    "description": "ファノエ運河に生息する小さなイモリ。\\n水中に入ると、大きなエラが飛び出す。",
    "maxSkill": 18,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5802,
    "ja": "イスタヴリット",
    "en": "Istavrit",
    "description": "アラパゴ諸島の岩礁に生息する海水魚。\\nヒレに猛毒を秘めている。",
    "maxSkill": 18,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6333,
    "ja": "インビジサルパ",
    "en": "Translucent Salpa",
    "description": "透明な未知の生物。\\n",
    "maxSkill": 18,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5793,
    "ja": "キュス",
    "en": "Quus",
    "description": "南洋に広く分布する海水魚。\\n",
    "maxSkill": 19,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4310,
    "ja": "金魚",
    "en": "Tiny Goldfish",
    "description": "東方伝来の小型観賞魚。鮮やかな橙色をしており、\\nふよふよと愛らしく泳ぐ。",
    "maxSkill": 20,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4289,
    "ja": "森ブナ",
    "en": "Forest Carp",
    "description": "エルシモ島に生息する淡水魚。\\n",
    "maxSkill": 20,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6613,
    "ja": "ヒキガエル",
    "en": "Hoptoad",
    "description": "醴泉島の水辺に生息する両生類。\\n",
    "maxSkill": 20,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4379,
    "ja": "シュヴァルサーモン",
    "en": "Cheval Salmon",
    "description": "シュヴァル川流域に生息する淡水魚。\\n",
    "maxSkill": 21,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（見習→徒弟）"
  },
  {
    "id": 5961,
    "ja": "コモンオクトパス",
    "en": "Contortopus",
    "description": "センロー海に生息している小型の頭足類。\\n",
    "maxSkill": 22,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5536,
    "ja": "ヨルシアナイフ",
    "en": "Yorchete",
    "description": "ヨルシア森林に生息する淡水魚。\\nナイフのような姿をしている。",
    "maxSkill": 22,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6335,
    "ja": "ホワイトロブスター",
    "en": "White Lobster",
    "description": "白い甲殻類のような未知の生物。\\n",
    "maxSkill": 22,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4501,
    "ja": "太ったグリーディ",
    "en": "Fat Greedie",
    "description": "ベッフェル湾に生息する悪食の海水魚。\\n何かを飲み込み、腹が膨れている。",
    "maxSkill": 24,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5121,
    "ja": "ムーリシュアイドル",
    "en": "Moorish Idol",
    "description": "マリヤカレヤリーフに生息する、美しい海水魚。\\nウィンダスでは観賞用として珍重される。",
    "maxSkill": 26,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5132,
    "ja": "ガーナード",
    "en": "Gurnard",
    "description": "ググリュー洋に生息する海水魚。\\n短時間だが飛行できる。",
    "maxSkill": 26,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4426,
    "ja": "トリカラードカープ",
    "en": "Tricolored Carp",
    "description": "クォン大陸の河川に生息する淡水魚。\\nウィンダスでは観賞用として珍重される。",
    "maxSkill": 27,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4361,
    "ja": "ネビムナイト",
    "en": "Nebimonite",
    "description": "バストア海に生息する有殻の頭足類。\\n",
    "maxSkill": 27,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4313,
    "ja": "ブラインフィッシュ",
    "en": "Blindfish",
    "description": "洞窟に生息する淡水魚。\\n眼が退化してしまっており、痕跡すらない。",
    "maxSkill": 27,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5787,
    "ja": "ピピラ",
    "en": "Pipira",
    "description": "ミンダルシア大陸河川に生息する凶暴な淡水魚。\\n",
    "maxSkill": 29,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5794,
    "ja": "タイガーコッド",
    "en": "Tiger Cod",
    "description": "シュ・メーヨ海を中心に分布する海水魚。\\n",
    "maxSkill": 29,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4290,
    "ja": "エルシモフロッグ",
    "en": "Elshimo Frog",
    "description": "エルシモ島の密林に生息する両生類。\\n",
    "maxSkill": 30,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5465,
    "ja": "カダーバフロッグ",
    "en": "Caedarva Frog",
    "description": "カダーバの浮沼に生息する両生類。\\n",
    "maxSkill": 30,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6336,
    "ja": "ボーンフィッシュ",
    "en": "Bonefish",
    "description": "骨のような姿で泳ぐ未知の巨大な生物。\\n",
    "maxSkill": 30,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5799,
    "ja": "オオナマズ",
    "en": "Giant Catfish",
    "description": "クォン大陸の湖沼に生息する巨大淡水魚。\\n",
    "maxSkill": 31,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（徒弟→下級職人）"
  },
  {
    "id": 5463,
    "ja": "ヤユンバルウ",
    "en": "Yayinbaligi",
    "description": "エラジア大陸の湖沼に生息する巨大淡水魚。\\n",
    "maxSkill": 31,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5535,
    "ja": "リバースフィッシュ",
    "en": "Deademoiselle",
    "description": "腹を上にして泳ぐ珍しい淡水魚。\\nアドゥリンでは観賞用として珍重される。",
    "maxSkill": 31,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4315,
    "ja": "ラングフィッシュ",
    "en": "Lungfish",
    "description": "ファノエ運河の近辺に生息する淡水魚。\\n地上でも呼吸ができる。",
    "maxSkill": 32,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5803,
    "ja": "ギガントオクトパス",
    "en": "Gigant Octopus",
    "description": "バストア海に生息していた大型頭足類。\\n",
    "maxSkill": 32,
    "sizeType": "large",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5786,
    "ja": "ダークバス",
    "en": "Dark Bass",
    "description": "ヴァナ・ディール全土の湖沼に生息する淡水魚。\\n",
    "maxSkill": 33,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4528,
    "ja": "クリスタルバス",
    "en": "Crystal Bass",
    "description": "体表に結晶が浮かんだダークバスの変種。\\n",
    "maxSkill": 35,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5795,
    "ja": "オーガイール",
    "en": "Ogre Eel",
    "description": "バストア洋沿岸の岩礁に生息する海水魚。\\n",
    "maxSkill": 35,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5949,
    "ja": "ムセル",
    "en": "Mussel",
    "description": "ウルブカ諸島の岩礁に附着する\\n二枚貝の一種。",
    "maxSkill": 36,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5791,
    "ja": "ヒカリマス",
    "en": "Shining Trout",
    "description": "クォン大陸北部の清流に生息する淡水魚。\\n",
    "maxSkill": 37,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5461,
    "ja": "アラバルウ",
    "en": "Alabaligi",
    "description": "近東の清流に生息する淡水魚。\\n",
    "maxSkill": 37,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5804,
    "ja": "ヴェーダルラス",
    "en": "Veydal Wrasse",
    "description": "伝説の提督の名を冠する、巨大海水魚。\\n",
    "maxSkill": 37,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5812,
    "ja": "アバサー",
    "en": "Blowfish",
    "description": "無数の棘が特徴の淡水魚。\\n",
    "maxSkill": 38,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5796,
    "ja": "ノストーヘリング",
    "en": "Nosteau Herring",
    "description": "北洋に広く分布する海水魚。\\n",
    "maxSkill": 39,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4580,
    "ja": "コーラルバタフライ",
    "en": "Coral Butterfly",
    "description": "エルシモ島の近海に生息する美しい海水魚。\\n",
    "maxSkill": 40,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5805,
    "ja": "ググリュートゥーナ",
    "en": "Gugru Tuna",
    "description": "南洋を回遊する巨大海水魚。\\n",
    "maxSkill": 41,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（下級職人→名取）"
  },
  {
    "id": 5450,
    "ja": "ラケルダ",
    "en": "Lakerda",
    "description": "暗碧海を回遊する巨大海水魚。\\n",
    "maxSkill": 41,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5469,
    "ja": "ブラスローチ",
    "en": "Brass Loach",
    "description": "グロウベルグの沼沢に生息していた淡水魚。\\n",
    "maxSkill": 42,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4385,
    "ja": "ザフムルグバス",
    "en": "Zafmlug Bass",
    "description": "ザフムルグ海沿岸に生息する海水魚。\\n",
    "maxSkill": 43,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5952,
    "ja": "レッドシーマ",
    "en": "Ruddy Seema",
    "description": "エヌティエル水林に生息する\\n猛毒を持つ淡水魚。",
    "maxSkill": 44,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5797,
    "ja": "ゴールドロブスター",
    "en": "Gold Lobster",
    "description": "バストア海海底に生息する甲殻類。\\n",
    "maxSkill": 46,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5453,
    "ja": "イスタコズ",
    "en": "Istakoz",
    "description": "アラパゴ諸島周辺の海底に生息する甲殻類。\\n",
    "maxSkill": 46,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5788,
    "ja": "ブラックイール",
    "en": "Black Eel",
    "description": "グスタベルグの河川に生息する淡水魚。\\n",
    "maxSkill": 47,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5458,
    "ja": "ユランバルウ",
    "en": "Yilanbaligi",
    "description": "近東の河川に生息する淡水魚。\\n",
    "maxSkill": 47,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5128,
    "ja": "コーンカラマリ",
    "en": "Cone Calamary",
    "description": "尖った殻が特徴的な頭足類。\\n",
    "maxSkill": 48,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5448,
    "ja": "カラマール",
    "en": "Kalamar",
    "description": "尖った殻が特徴的な頭足類。\\n",
    "maxSkill": 48,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4470,
    "ja": "アイスフィッシュ",
    "en": "Icefish",
    "description": "フォルガンディの氷の下に生息する淡水魚。\\n",
    "maxSkill": 49,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6144,
    "ja": "グラシアフィッシュ",
    "en": "Frigorifish",
    "description": "ウルブカ大陸の氷河湖に生息する淡水魚。 \\n",
    "maxSkill": 49,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4291,
    "ja": "サンドフィッシュ",
    "en": "Sandfish",
    "description": "アルテパ砂漠の地底に生息する淡水魚。\\n",
    "maxSkill": 50,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5800,
    "ja": "大鈍甲",
    "en": "Giant Donko",
    "description": "ゼプウェル島の湖に生息する巨大淡水魚。\\n",
    "maxSkill": 50,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 9077,
    "ja": "グレーフィッシュ",
    "en": "Duskcrawler",
    "description": "エスカの影響を受けた淡水魚。",
    "maxSkill": 50,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "2015.5.14追加"
  },
  {
    "id": 9146,
    "ja": "ハイイロザリガニ",
    "en": "Ashen Crayfish",
    "description": "エスカの影響を受けた甲殻類。\\n",
    "maxSkill": 50,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "2015.8.5追加"
  },
  {
    "id": 5801,
    "ja": "モンケオンケ",
    "en": "Monke-Onke",
    "description": "ミンダルシア大陸の湖沼に生息する巨大淡水魚。\\n",
    "maxSkill": 51,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（名取→目録）"
  },
  {
    "id": 5959,
    "ja": "龍魚",
    "en": "Dragonfish",
    "description": "汽水域にも生息する鱗の美しい淡水魚。\\nアドゥリンでは観賞用として珍重される。",
    "maxSkill": 52,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4402,
    "ja": "レッドテラピン",
    "en": "Red Terrapin",
    "description": "クォン大陸の湖沼に生息する獰猛なカメ。\\n",
    "maxSkill": 53,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4484,
    "ja": "シャル貝",
    "en": "Shall Shell",
    "description": "岩礁に附着する二枚貝の一種。\\n",
    "maxSkill": 53,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5131,
    "ja": "ボンゴラ",
    "en": "Vongola Clam",
    "description": "プルゴノルゴ島に生息する二枚貝の固有種。\\nたいへん美味。",
    "maxSkill": 53,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5456,
    "ja": "イスティルディエ",
    "en": "Istiridye",
    "description": "アラパゴ諸島の岩礁に附着する二枚貝の一種。\\n",
    "maxSkill": 53,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5464,
    "ja": "カプルンバァ",
    "en": "Kaplumbaga",
    "description": "近東の湖沼に生息する鈍重なカメ。\\n",
    "maxSkill": 53,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5948,
    "ja": "ブラックプローン",
    "en": "Black Prawn",
    "description": "センロー海周辺の海底に生息する甲殻類。\\n",
    "maxSkill": 54,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5798,
    "ja": "ブルーテール",
    "en": "Bluetail",
    "description": "ミンダルシア大陸近海に分布する海水魚。\\n",
    "maxSkill": 55,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5452,
    "ja": "ウスクムル",
    "en": "Uskumru",
    "description": "暗碧海に分布する海水魚。\\n",
    "maxSkill": 55,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 9216,
    "ja": "ヴォイドキンギョ",
    "en": "Voidsnapper",
    "description": "空虚な存在とされる魚。",
    "maxSkill": 55,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "2015.11.10追加"
  },
  {
    "id": 4427,
    "ja": "ゴールドカープ",
    "en": "Gold Carp",
    "description": "クォン大陸の河川に生息する淡水魚。\\nウィンダスでは観賞用として珍重される。",
    "maxSkill": 56,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5459,
    "ja": "ザザンバルウ",
    "en": "Sazanbaligi",
    "description": "近東の河川に生息する淡水魚。\\n",
    "maxSkill": 56,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5953,
    "ja": "ヤマメ",
    "en": "Dragonfly Trout",
    "description": "清流に生息する淡水魚。\\n",
    "maxSkill": 57,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "2015.11.10追加"
  },
  {
    "id": 5815,
    "ja": "ペラゾエア",
    "en": "Pelazoea",
    "description": "フライ族の幼虫である、巨大な水棲の肉食虫。\\n",
    "maxSkill": 58,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4317,
    "ja": "トリロバイト",
    "en": "Trilobite",
    "description": "ビビキー湾の海底に生息する、海生節足動物。\\n",
    "maxSkill": 59,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6337,
    "ja": "ティサノペルティス",
    "en": "Thysanopeltis",
    "description": "センロー海の海底に生息する、海生節足動物。\\n",
    "maxSkill": 59,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4579,
    "ja": "エルシモニュート",
    "en": "Elshimo Newt",
    "description": "エルシモ島の湖沼に生息するイモリ。\\n",
    "maxSkill": 60,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5806,
    "ja": "ベッフェルマリーン",
    "en": "Bhefhel Marlin",
    "description": "ベッフェル湾に出没する巨大海水魚。\\n別名『ベッフェルの悪魔』。",
    "maxSkill": 61,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（目録→印可）"
  },
  {
    "id": 5451,
    "ja": "クルチュバルウ",
    "en": "Kilicbaligi",
    "description": "暗碧海に出没する巨大海水魚。\\n別名『暗碧の剣』。",
    "maxSkill": 61,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5466,
    "ja": "トランペットシェル",
    "en": "Trumpet Shell",
    "description": "ブンカール浦に生息していた肉食の巻貝。\\n",
    "maxSkill": 63,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5955,
    "ja": "クラリアス",
    "en": "Yawning Catfish",
    "description": "ウルブカ大陸の地下深くに生息する珍しい\\n巨大淡水魚。",
    "maxSkill": 64,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5816,
    "ja": "キングパーチ",
    "en": "King Perch",
    "description": "食欲旺盛な巨大淡水魚。\\n汽水域にも生息している。",
    "maxSkill": 65,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5995,
    "ja": "マリシアスパーチ",
    "en": "Malicious Perch",
    "description": "食欲旺盛な猛毒を持つ巨大淡水魚。\\n汽水域にも生息している。\\n",
    "maxSkill": 65,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4485,
    "ja": "ノーブルレディ",
    "en": "Noble Lady",
    "description": "南洋に生息する海水魚。\\n",
    "maxSkill": 66,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5139,
    "ja": "ベタ",
    "en": "Betta",
    "description": "艶やかな美しさと強い闘争本能を備えた淡水魚。\\n観賞魚として、あるいは闘魚として飼育される。",
    "maxSkill": 66,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5957,
    "ja": "ビリビリ",
    "en": "Shockfish",
    "description": "電気を発する珍しい淡水魚。\\n",
    "maxSkill": 67,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "2015.11.10追加"
  },
  {
    "id": 4473,
    "ja": "三日月魚",
    "en": "Crescent Fish",
    "description": "ミンダルシア大陸の湖沼に生息する淡水魚。\\nウィンダスでは観賞用として珍重される。",
    "maxSkill": 69,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4288,
    "ja": "ゼブライール",
    "en": "Zebra Eel",
    "description": "エルシモ島の岩礁に生息する海水魚。\\n",
    "maxSkill": 70,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5807,
    "ja": "ブレードフィッシュ",
    "en": "Bladefish",
    "description": "刃のような歯を持つ、幻の巨大海水魚。\\n",
    "maxSkill": 71,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（印可→高弟）"
  },
  {
    "id": 5808,
    "ja": "ライノキメラ",
    "en": "Rhinochimera",
    "description": "剣のような吻を備えた巨大海水魚。\\n",
    "maxSkill": 73,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6145,
    "ja": "ドワーフレモラ",
    "en": "Dwarf Remora",
    "description": "古代魚の幼魚。\\n",
    "maxSkill": 73,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5534,
    "ja": "アプカルモドキ",
    "en": "Apkallufa",
    "description": "マリアミ渓谷に生息するアプカルに\\nよく似た淡水魚。\\nアドゥリンでは観賞用として珍重される。",
    "maxSkill": 74,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5130,
    "ja": "タブナジアゴビー",
    "en": "Tavnazian Goby",
    "description": "旧タブナジア領の川底に生息する淡水魚。\\n体色はオレンジとシルバーの鮮やかなストライプ。",
    "maxSkill": 75,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5460,
    "ja": "カヤバルウ",
    "en": "Kayabaligi",
    "description": "近東の川底に生息する淡水魚。\\n体色はオレンジとシルバーの鮮やかなストライプ。",
    "maxSkill": 75,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4451,
    "ja": "シルバーシャーク",
    "en": "Silver Shark",
    "description": "ジュノ海峡付近に出没する獰猛な海水魚。\\n",
    "maxSkill": 76,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6001,
    "ja": "バファイクロット",
    "en": "Clotflagration",
    "description": "環境に適応して熱に強くなった\\nスライム族の亜種「クロット」の小型の分身。",
    "maxSkill": 77,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5474,
    "ja": "カークォン",
    "en": "Ca Cuong",
    "description": "グロウベルグの沼沢に生息していた水棲の肉食虫。\\n",
    "maxSkill": 78,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4307,
    "ja": "オオモリナマズ",
    "en": "Jungle Catfish",
    "description": "エルシモ島の湖沼に生息する巨大淡水魚。\\n",
    "maxSkill": 80,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4477,
    "ja": "ガビアルフィッシュ",
    "en": "Gavial Fish",
    "description": "大きな顎を持つ凶暴な巨大淡水魚。\\n",
    "maxSkill": 81,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5809,
    "ja": "三眼魚",
    "en": "Three-eyed Fish",
    "description": "幻の3つ目の巨大海水魚。\\n",
    "maxSkill": 81,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（高弟→皆伝）"
  },
  {
    "id": 5470,
    "ja": "ピラルク",
    "en": "Pirarucu",
    "description": "グロウベルグの河川に生息していた巨大淡水魚。\\n",
    "maxSkill": 81,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5951,
    "ja": "レッドスポット",
    "en": "Bloodblotch",
    "description": "エヌティエル水林近海に生息する\\n猛毒を持つ巨大海水魚。",
    "maxSkill": 82,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5472,
    "ja": "ガー",
    "en": "Garpike",
    "description": "ブンカール浦の汽水域に生息していた海水魚。\\n",
    "maxSkill": 83,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4461,
    "ja": "バストアブリーム",
    "en": "Bastore Bream",
    "description": "バストア海に生息する海水魚。\\n",
    "maxSkill": 86,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5454,
    "ja": "メルジャンバルウ",
    "en": "Mercanbaligi",
    "description": "アラパゴ諸島周辺の海域に生息する海水魚。\\n",
    "maxSkill": 86,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5138,
    "ja": "ブラックゴースト",
    "en": "Black Ghost",
    "description": "体内に発電器官をもつ淡水魚。\\n",
    "maxSkill": 88,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5813,
    "ja": "ドラドガー",
    "en": "Dorado Gar",
    "description": "「黄金」の名をもつ、幻の巨大淡水魚。\\n",
    "maxSkill": 89,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4304,
    "ja": "グリモナイト",
    "en": "Grimmonite",
    "description": "エルシモ島近海に生息する有殻の頭足類。\\n",
    "maxSkill": 90,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5455,
    "ja": "アフポット",
    "en": "Ahtapot",
    "description": "アラパゴ諸島周辺の海域に生息する有殻の頭足類。\\n",
    "maxSkill": 90,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4454,
    "ja": "煌魚",
    "en": "Emperor Fish",
    "description": "幻の巨大な淡水魚。\\n",
    "maxSkill": 91,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4474,
    "ja": "ギガントスキッド",
    "en": "Gigant Squid",
    "description": "幻の巨大な頭足類。\\n",
    "maxSkill": 91,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（皆伝→師範）"
  },
  {
    "id": 5462,
    "ja": "モリナバルウ",
    "en": "Morinabaligi",
    "description": "幻の巨大な淡水魚。\\n",
    "maxSkill": 91,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5467,
    "ja": "メガロドン",
    "en": "Megalodon",
    "description": "バストア海に生息していた巨大海水魚。\\n別名『バストアの大顎』。",
    "maxSkill": 93,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4384,
    "ja": "ブラックソール",
    "en": "Black Sole",
    "description": "北洋の海底に生息する海水魚。\\n",
    "maxSkill": 96,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5457,
    "ja": "ディル",
    "en": "Dil",
    "description": "アラパゴ諸島周辺の海底に生息する海水魚。\\n",
    "maxSkill": 96,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5817,
    "ja": "タイガーシャーク",
    "en": "Tiger Shark",
    "description": "バストア海に生息する巨大海水魚。\\n",
    "maxSkill": 98,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "昇級認定試験（師範→高級職人）"
  },
  {
    "id": 5133,
    "ja": "プテリゴートゥス",
    "en": "Pterygotus",
    "description": "「海のサソリ」と呼ばれる巨大節足動物。\\n",
    "maxSkill": 99,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4463,
    "ja": "タキタロ",
    "en": "Takitaro",
    "description": "伝説の巨大淡水魚。\\n",
    "maxSkill": 101,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4475,
    "ja": "シーゾンビ",
    "en": "Sea Zombie",
    "description": "伝説の巨大な海生ハ虫類。\\n",
    "maxSkill": 101,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4476,
    "ja": "ティタニクティス",
    "en": "Titanictus",
    "description": "伝説の巨大な古代魚。\\n",
    "maxSkill": 101,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5140,
    "ja": "カルカンバルウ",
    "en": "Kalkanbaligi",
    "description": "「巨人の盾」と呼ばれる、伝説の巨大海水魚。\\n",
    "maxSkill": 105,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5137,
    "ja": "トゥルナバルウ",
    "en": "Turnabaligi",
    "description": "時に水鳥や水辺の獣すら捕食する巨大淡水魚。\\n",
    "maxSkill": 105,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4316,
    "ja": "アーマードピスケス",
    "en": "Armored Pisces",
    "description": "地底に生息する古代淡水魚。\\n全身、甲殻で覆われている。",
    "maxSkill": 108,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4308,
    "ja": "オオイトウ",
    "en": "Giant Chirai",
    "description": "伝説の巨大淡水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5814,
    "ja": "クロコディロス",
    "en": "Crocodilos",
    "description": "巨大な水棲ハ虫類。\\n非常に獰猛なことで知られる。",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5446,
    "ja": "水泡眼",
    "en": "Red Bubble-Eye",
    "description": "東方伝来の高級観賞魚。眼球の一部が風船状に\\n膨らんだ、ユーモラスな顔をしている。",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5120,
    "ja": "タイタニックソー",
    "en": "Titanic Sawfish",
    "description": "船を沈めると恐れられる、伝説の巨大海水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4319,
    "ja": "トライコーン",
    "en": "Tricorn",
    "description": "頭部の形状が特徴的な、伝説の巨大両生類。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 4309,
    "ja": "ケーブヤビー",
    "en": "Cave Cherax",
    "description": "伝説の巨大甲殻類。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6489,
    "ja": "ネオタキタロ",
    "en": "Far East Puffer",
    "description": "誰も見たことがないと云う伝説の巨大淡水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "2015.11.10追加"
  },
  {
    "id": 5134,
    "ja": "モラモラ",
    "en": "Mola Mola",
    "description": "遭難者を助けたという伝説もある巨大海水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5471,
    "ja": "ゲロトラックス",
    "en": "Gerrothorax",
    "description": "伝説の巨大両生類。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5127,
    "ja": "ググリューサウルス",
    "en": "Gugrusaurus",
    "description": "伝説の長大な海生ハ虫類。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": true,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "ハラキリ「剣の枝」（恵比寿釣竿）"
  },
  {
    "id": 5129,
    "ja": "リク",
    "en": "Lik",
    "description": "伝説の長大な淡水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": true,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "ハラキリ「五色の糸」（恵比寿釣竿）"
  },
  {
    "id": 5997,
    "ja": "シン",
    "en": "Shen",
    "description": "伝説の巨大二枚貝。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5540,
    "ja": "コクリュウ",
    "en": "Kokuryu",
    "description": "伝説の巨大な古代竜の一種。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": true,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "ハラキリ「コクリュウの肝」（海竜の肝）"
  },
  {
    "id": 5537,
    "ja": "ソウリュウ",
    "en": "Soryu",
    "description": "伝説の巨大な古代竜の一種。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": true,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "ハラキリ「ソウリュウの肝」（海竜の肝）"
  },
  {
    "id": 5538,
    "ja": "セキリュウ",
    "en": "Sekiryu",
    "description": "伝説の巨大な古代竜の一種。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": true,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "ハラキリ「セキリュウの肝」（海竜の肝）"
  },
  {
    "id": 6338,
    "ja": "カメロケラス",
    "en": "Cameroceras",
    "description": "巨大な殻をもつ伝説の頭足類。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6373,
    "ja": "古代ブナ",
    "en": "Ancient Carp",
    "description": "伝説の巨大淡水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5539,
    "ja": "ハクリュウ",
    "en": "Hakuryu",
    "description": "伝説の巨大な古代竜の一種。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": true,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": [],
    "notes": "ハラキリ「ハクリュウの肝」（海竜の肝）"
  },
  {
    "id": 6376,
    "ja": "トゥソテウティス",
    "en": "Tusoteuthis Longa",
    "description": "伝説の巨大頭足類。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6375,
    "ja": "コウリュウ",
    "en": "Phan. Serpent",
    "description": "海竜の頂点に立つ、伝説の巨大な古代竜の一種。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "クエスト「勇魚」（真恵比寿釣竿）"
  },
  {
    "id": 4305,
    "ja": "リュウグウノツカイ",
    "en": "Ryugu Titan",
    "description": "伝説の巨大深海魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 5476,
    "ja": "アバイア",
    "en": "Abaia",
    "description": "伝説の巨大淡水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6371,
    "ja": "ゴライアスホーン",
    "en": "Quick. Blade",
    "description": "海を割る、伝説の巨大深海魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "クエスト「勇魚」（真恵比寿釣竿）"
  },
  {
    "id": 5468,
    "ja": "マツヤ",
    "en": "Matsya",
    "description": "伝説の巨大海水魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "クエスト「勇魚」（真恵比寿釣竿）"
  },
  {
    "id": 6146,
    "ja": "レモラ",
    "en": "Remora",
    "description": "伝説の巨大な古代魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": false,
    "taikobou": false,
    "zoneIds": []
  },
  {
    "id": 6374,
    "ja": "シンリュウノツカイ",
    "en": "Dra. Tabernacle",
    "description": "異世界の使者と云われる、伝説の巨大魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "クエスト「勇魚」（真恵比寿釣竿）"
  },
  {
    "id": 6372,
    "ja": "ナミニャミ",
    "en": "Lord of Ulbuka",
    "description": "厄災を引き起こすと恐れられる、伝説の巨大魚。\\n",
    "maxSkill": 120,
    "sizeType": "small",
    "harakiri": false,
    "ebisu": true,
    "taikobou": false,
    "zoneIds": [],
    "notes": "クエスト「勇魚」（真恵比寿釣竿）"
  }
];

/**
 * ============================================================================
 * [FilePath] scripts/generateFishes.ts
 * [Role] Wikiデータおよび Windower Resources から fishes.ts を自動生成するビルドスクリプト
 *
 * [概要]
 * - Wikiデータ（fish_skill_wiki.data）からスキル上限、ハラキリ、恵比寿フラグ、備考等を抽出
 * - items.lua および item_descriptions.lua から魚の基本情報（ID、和名、英名、説明文）を取得・統合
 * - 説明文に含まれるキーワード（「大型」など）から魚のサイズ区分（sizeType）を判定
 * - 型定義（FishMaster）に準拠した fishes.ts を自動生成
 * ============================================================================
 */
export {};

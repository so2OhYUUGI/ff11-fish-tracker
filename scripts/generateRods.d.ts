/**
 * ============================================================================
 * [FilePath] scripts/generateRods.ts
 * [Role] items.lua および item_descriptions.lua から rods.ts を自動生成するビルドスクリプト
 *
 * [概要]
 * - items.lua をパースし、`range_type="Fishing Rod"` が指定された釣り竿アイテムを抽出
 * - item_descriptions.lua から対応するアイテムIDの日本語説明文（ja）を取得
 * - 抽出した釣り竿のID、和名、英名、説明文（description）を取得
 * - 型定義（FishingRodMaster）に準拠した rods.ts を自動生成
 * ============================================================================
 */
export {};

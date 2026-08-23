/**
 * ============================================================================
 * [FilePath] src/main.tsx
 * [Role]     アプリケーションのエントリーポイント
 * 
 * [概要]
 * - React DOMのルートレンダリングおよびグローバルプロバイダー（HelmetProvider等）の設定を行う。
 * 
 * [依存関係・関連ファイル]
 * - スタイル : src/index.css
 * - コンポーネント : src/App.tsx
 * - ライブラリ : react-helmet-async
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【プロバイダー階層】 SEOメタデータ制御のため、Appコンポーネント全体を HelmetProvider でラップすること。
 * 2. 【StrictMode】 開発時の潜在バグ検知のため StrictMode を維持すること。
 * ============================================================================
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
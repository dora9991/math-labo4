import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite の設定。
// base: "./" にすると、公開用ファイルが部品(JS/CSS)を「相対パス」で読み込む。
// → GitHub Pages（/リポジトリ名/ 配下）でも、Vercel でも、dist を直接開いても
//    真っ白にならず表示される。公開先を問わず動く安全設定。
export default defineConfig({
  base: "./",
  plugins: [react()],
});

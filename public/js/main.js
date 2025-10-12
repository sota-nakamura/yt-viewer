import {
  getHistoryState,
  createHistoryListHTML,
  storeHistory
} from './history_ui.js';
import initializePlaybackOnLoad from './playback.js';
import { changeColor, changeMode } from './theme.js';

const deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
const YThistoryList = document.querySelector(".history");
const loader = document.querySelector(".loading");

// ページの初期化処理
window.addEventListener("load", async () => {
  const {
    YThistory,
    useHistory
  } = getHistoryState();

  if (!useHistory) {
    YThistoryList.innerHTML = "履歴機能を有効化してください。";
  } else {
    // 履歴データがない場合に初期化
    if (!YThistory) {
      localStorage.setItem("YThistory", JSON.stringify([]));
    }
  }

  await initializePlaybackOnLoad();

  // 履歴リストの描画（初期ロード時）
  YThistoryList.innerHTML = createHistoryListHTML(YThistory || []);
  // ロード完了
  loader.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  if (storedTheme) {
    changeColor(storedTheme);
  }
  changeMode(storedMode);
});

deviceDark.addEventListener("change", () => {
  if(!storedMode) changeMode();
});
import {
  getHistoryState,
  createHistoryListHTML
} from './history_ui.js';
import { initializePlaybackOnLoad } from './playback.js';

const YThistoryList = document.querySelector(".history");
const loader = document.querySelector(".loading");

// ページの初期化処理
window.addEventListener("load", async () => {
  const {
    YThistory,
    useHistory
  } = getHistoryState();
  
  // 履歴データがない場合に初期化
  if (!YThistory) {
    localStorage.setItem("YThistory", JSON.stringify([]));
  }

  await initializePlaybackOnLoad();

  // 履歴リストの描画（初期ロード時）
  YThistoryList.innerHTML = createHistoryListHTML(YThistory || []);
  // ロード完了
  loader.classList.add("hidden");
});
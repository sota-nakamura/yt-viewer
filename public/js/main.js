import {
  getHistoryState,
  createHistoryListHTML
} from './history_ui.js';
import { Play } from "./player.js";
import { initializePlaybackOnLoad } from './playback.js';

const YThistoryList = document.querySelector(".history");
const loading = document.querySelector(".loading");

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

  const params = new URLSearchParams(location.search);
  
  if(params.get("id")) {
    await Play(params.get("id"));
  } else {
    await initializePlaybackOnLoad();
  }

  // 履歴リストの描画（初期ロード時）
  YThistoryList.innerHTML = createHistoryListHTML(YThistory || [], 50);
  // ロード完了
  loading.classList.add("hidden");
});
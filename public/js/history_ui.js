import { escapeHtml, formatTime } from './util.js';

export function getHistoryState() {
    let YThistory = JSON.parse(localStorage.getItem("YThistory"));
    const useHistory = localStorage.getItem("use_history") === "true";
    const usePlayback = localStorage.getItem("use_playback") === "true";
    return {
      YThistory,
      useHistory,
      usePlayback
    };
  }

  // 履歴リストのHTMLを生成 (Play関数はグローバルに公開されている前提)
  export function createHistoryListHTML(historyArray) {
    const { useHistory } = getHistoryState();
    if(!useHistory) {
      return '履歴機能を有効化してください。'
    } else if (!historyArray || historyArray.length === 0) {
      return "履歴がありません。";
    }
    return historyArray.map(e => `
    <li>
      <button class="circle" onclick="Play('${e.id}', ${e.time || 0})">
        <i>play_arrow</i>
      </button>
      <div class="max">
        <h6 class="small video_title">${escapeHtml(e.title || 'タイトル不明')}</h6>
        <div>時間: ${formatTime(e.time || 0)}</div>
      </div>
      <label>
        <a onclick="copyURL('https://youtu.be/${e.id}?t=${e.time || 0}s')">
          <i>content_copy</i>
        </a>
      </label>
    </li>
  `).join('');
  }

  // 履歴をlocalStorageに保存し、UIを更新
  export function storeHistory(item, updateUI = true) {
    const {
      YThistory: currentHistory,
      useHistory
    } = getHistoryState();
    if (!useHistory) return;
    let YThistory = currentHistory || [];
    // 重複削除・先頭追加
    YThistory = YThistory.filter((el) => el.id !== item.id);
    YThistory.unshift(item);
    localStorage.setItem("YThistory", JSON.stringify(YThistory));
    if(updateUI) {
      const YThistoryList = document.querySelector(".history");
      YThistoryList.innerHTML = createHistoryListHTML(YThistory);
    }
  }
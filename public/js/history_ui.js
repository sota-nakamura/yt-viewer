import { escapeHtml, formatTime } from './util.js';
const YThistoryList = document.querySelector(".history");
let historyCount = 0;

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

  // 履歴リストのHTMLを生成
  export function createHistoryListHTML(historyArray, end = null) {
    const { useHistory } = getHistoryState();
    let newArray = [];
    if(!useHistory) {
      return '履歴機能を有効化してください。'
    } else if (!historyArray || historyArray.length === 0) {
      return "履歴がありません。";
    }
    if(
      end &&
      typeof end === "number"
    ) {
      newArray = historyArray.slice(0, end);
      historyCount = end;
    } else {
      newArray = historyArray;
      historyCount = historyArray.length;
    }
    return newArray.map(e => `
    <li>
      <button class="circle" onclick="Play('${e.id}', ${e.time || 0})">
        <i>play_arrow</i>
      </button>
      <div class="title-area">
        <span class="title-wrapper">
          <h6 class="small video_title">${escapeHtml(e.title || "タイトル不明")}</h6>
        </span>
        <div>時間: ${formatTime(e.time || 0)}</div>
      </div>
      <label>
        <a>
          <i>more_vert</i>
          <menu class="left no-wrap">
            <li>
              <i>content_copy</i>
              <a onclick="copyURL('https://youtu.be/${e.id}?t=${e.time || 0}s')">
                URLをコピー
              </a>
            </li>
            <li>
              <i>delete</i>
              <a onclick="deleteHistory('${e.id}')">
                この履歴を削除
              </a>
            </li>
          </menu>
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
      YThistoryList.innerHTML = createHistoryListHTML(YThistory, 50);
    }
  }

  export function searchHistory(id) {
    const {
      YThistory: currentHistory
    } = getHistoryState();
    let item = currentHistory.find((el) => el.id === id);
    return item;
  }
  
  function handleInfiniteScroll() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50;
    const loader = document.querySelector('#loader');
    const { YThistory } = getHistoryState();
    
    // YThistoryがnullまたはundefined、または配列でない場合
    if (!Array.isArray(YThistory) || YThistory.length === 0) return;
    if (endOfPage && historyCount < YThistory.length) {
      loader.classList.remove('hidden');
      // 非同期でリストを生成・更新し、ローディングを隠す
      setTimeout(() => {
        const newHistoryHTML = createHistoryListHTML(YThistory, historyCount + 50);
        YThistoryList.innerHTML = newHistoryHTML;
        loader.classList.add('hidden');
      }, 500);
    }
  }

  window.addEventListener("scroll", handleInfiniteScroll);
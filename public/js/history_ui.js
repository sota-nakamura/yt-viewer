import { escapeHtml, formatTime } from './util.js';
const YThistoryList = document.querySelector(".history");
let historyCount = 50;

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
      <article class="no-padding">
        <div class="grid no-space">
          <div class="s6">
            <img class="responsive" src="https://img.youtube.com/vi/${e.id}/maxresdefault.jpg">
          </div>
          <div class="s6">
            <div class="padding">
              <nav>
                <h6 class="small">
                  <a onclick="Play('${e.id}', ${e.time || 0})">
                    ${escapeHtml(e.title || "タイトル不明")}
                  </a>
                </h6>
                <div class="max"></div>
                <button class="circle transparent">
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
                </button>
              </nav>
              <p>時間: ${formatTime(e.time || 0)}</p>
            </div>
          </div>
        </div>
      </article>
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
  const loader = document.querySelector('#loader');
  if (!loader || !loader.classList.contains('hidden')) return;

  const scrollPos = window.innerHeight + window.scrollY;
  const totalHeight = document.documentElement.scrollHeight;
  const isNearBottom = scrollPos >= totalHeight - 100;

  const { YThistory } = getHistoryState();

  if (Array.isArray(YThistory) && isNearBottom && historyCount < YThistory.length) {
    loader.classList.remove('hidden');

    setTimeout(() => {
      historyCount += 50;
      const newHistoryHTML = createHistoryListHTML(YThistory, historyCount);
      YThistoryList.innerHTML = newHistoryHTML;
      loader.classList.add('hidden');
    }, 500);
  }
}

window.addEventListener('scroll', handleInfiniteScroll);
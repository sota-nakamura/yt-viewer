import {
  getVideoId,
  getTimeStamp,
  getVideoTitle
} from './youtube_util.js';
import {
  getHistoryState,
  createHistoryListHTML,
  storeHistory
} from './history_ui.js';
import {
  initializePlaybackOnLoad
} from './playback.js';

const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
const YThistoryList = document.querySelector(".history");
const playbackFeatureToggler = document.querySelector(".usePlayback");
const removeBtn = document.querySelector(".remove_button");
const searchBtn = document.querySelector('.search_button');

// 動画を再生 
async function Play(id, sec = 0) {
  ui("#home");

  video.src = `
  https://www.youtube.com/embed/${id}?autoplay=1&start=${sec || 0}
  `;
  video.scrollIntoView({
    behavior: "smooth",
  });

  storeHistory({
    title: await getVideoTitle(id),
    id: id,
    time: sec || 0
  });
}

// URLをinputから取得し、再生を開始
async function getYoutube(url) {
  urlInput.blur();

  if (url) {
    const id = getVideoId(url);
    const timeStamp = getTimeStamp(url);
    if (id) {
      await Play(id, timeStamp);
    } else {
      console.warn("no valid video id provided.");
    }
  }
}

window.Play = Play;
window.getYoutube = getYoutube;

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
});

urlInput.addEventListener("input", (e) => {
  if (e.target.value) {
    removeBtn.style.display = "inline-flex";
  } else {
    removeBtn.style.display = "none";
  }
});

removeBtn.addEventListener('click', () => {
  urlInput.value = '';
  urlInput.focus();
});

searchBtn.addEventListener('click', () => {
  getYoutube(urlInput.value)
});

urlInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getYoutube(urlInput.value);
  } else if (event.key === "/") {
    urlInput.focus();
  }
});
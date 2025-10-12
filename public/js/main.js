import {
  getHistoryState,
  createHistoryListHTML,
  storeHistory
} from './history_ui.js';
import initializePlaybackOnLoad from './playback.js';
import { changeColor, changeMode } from './theme.js';

import { Play, getYoutube } from './player.js';

const deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
const YThistoryList = document.querySelector(".history");
const loader = document.querySelector(".loading");
const body = document.body;
const removeBtn = document.querySelector(".remove_button");
const searchBtn = document.querySelector('.search_button');

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

body.addEventListener('keyup', (e) => {
  if(e.code === 'Slash') {
    urlInput.focus();
  }
});

removeBtn.addEventListener('click', () => {
  urlInput.value = '';
  urlInput.focus();
});

searchBtn.addEventListener('click', () => {
  getYoutube(urlInput.value)
});

urlInput.addEventListener("input", (e) => {
  if (e.target.value) {
    removeBtn.style.display = "inline-flex";
  } else {
    removeBtn.style.display = "none";
  }
});

urlInput.addEventListener("keyup", (event) => {
  if (event.code === "Enter") {
    event.preventDefault();
    getYoutube(urlInput.value);
  }
});
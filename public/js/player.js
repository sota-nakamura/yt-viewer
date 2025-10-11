const enc = "AXH1ezmdd9o6dZqqptRJnsdC3G6wXZkpiFy-OkwZJS0F4Q2dVfEuGuPTTaWgYHQuF_XxtxhxvYkQex4VXVOHkL-pT7uPyBCamD2sdGqbI9aZKv8krdv8TfdmVnZJ90l3qYSvaiHH4u7O_X1ygC6HznEe1bcCvjqgng==";
const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
const YThistoryList = document.querySelector(".history");
let YThistory = JSON.parse(localStorage.getItem("YThistory"));
const useHistory = localStorage.getItem("use_history");
const usePlayback = localStorage.getItem("use_playback");
const playbackFeatureToggler = document.querySelector(".usePlayback");
const removeBtn = document.querySelector(".removeBtn");
const hostList = [
  "www.youtube.com",
  "m.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.youtube-education.com",
  "www.youtube-nocookie.com"
];

function createHistoryListHTML(historyArray) {
  if (!historyArray || historyArray.length === 0) {
    return "履歴がありません。";
  }

  // html生成
  return historyArray.map(e => `
    <li>
      <button class="circle" onclick="Play('${e.id}', ${e.time})">
        <i>play</i>
      </button>
      <div class="max">
        <h6 class="small">${escapeHtml(e.title)}</h6>
        <div>時間: ${formatTime(e.time)}</div>
      </div>
      <label>
        <a onclick="navigator.clipboard.writeText('https://youtu.be/${e.id}?t=${e.time}')">
          <i>copy</i>
        </a>
      </label>
    </li>
  `).join('');
}

function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); // or &#39;
}

function addZero(number) {
  if (number < 10) {
    return '0' + number;
  } else {
    return number;
  }
}

function formatTime(seconds = 0) {
  const hour = Math.floor(seconds % 86400 / 3600);
  const min = Math.floor(seconds % 3600 / 60);
  const sec = seconds % 60
  let time = '';
  if (hour !== 0) {
    //ゼロパディング処理
    time = `${hour}:${addZero(min)}:${addZero(sec)}`;
  } else if (min !== 0) {
    time = `${min}:${addZero(sec)}`;
  } else {
    time = `0:${addZero(sec)}`;
  }
  return time;
}

function getVideoId(value) {
  const url = new URL(value);
  const host = url.hostname;
  const path = url.pathname.split("/");
  const pathList = ["live", "shorts", "embed"];
  //urlのhostチェック(厳密には youtu.beはパスが違ったりと 分岐が必要だが割愛)
  if (hostList.includes(host)) {
    if (path[1] === "watch") {
      const params = url.searchParams;
      const videoId = params.get("v");
      return videoId;
    } else if (pathList.includes(path[1])) {
      const videoId = path[2];
      return videoId;
    } else {
      const videoId = path[1];
      return videoId;
    }
  } else return;
}

async function getVideoTitle(id) {
  const videoUrl = `https://www.youtube.com/watch?v=${id}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
  let title = "タイトル不明"; // デフォルト値

  try {
    // fetchリクエスト
    const res = await fetch(oembedUrl);
    const data = await res.json();
    // タイトル存在チェック
    if (data && data.title) {
      title = data.title;
    }
  } catch (error) {
    console.error("Failed to fetch video title:", error);
  }

  return title;
}

function getTimeStamp(value) {
  const url = new URL(value);
  const host = url.hostname;

  if (hostList.includes(host)) {
    const params = url.searchParams;
    const timeStamp = params.get('t') || undefined;
    return timeStamp;
  }
}

function storeHistory(item) {
  if (!useHistory) return;

  // 重複削除・先頭追加
  YThistory = YThistory.filter((el) => el.id !== item.id);
  YThistory.unshift(item);
  localStorage.setItem("YThistory", JSON.stringify(YThistory));
  YThistoryList.innerHTML = createHistoryListHTML(YThistory);
}

async function Play(id, sec = 0) {
  ui("#home");

  video.src = `
    https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}&start=${sec}
  `;
  video.scrollIntoView({
    behavior: "smooth",
  });

  storeHistory({
    title: await getVideoTitle(id),
    id: id,
    time: sec
  });
}

async function getYoutube(url) {
  urlInput.blur();
  if (url) {
    const id = getVideoId(url);
    const timeStamp = getTimeStamp(url);
    await Play(id, timeStamp);
  } else return;
}

window.addEventListener("load", async () => {
  if (!useHistory) {
    YThistoryList.innerHTML = "履歴機能を有効化してください。";
    //プレイバック機能は有効にできない
    playbackFeatureToggler.disabled = true;
  } else {
    playbackFeatureToggler.checked = usePlayback;
    if (!YThistory) {
      //履歴を初期化
      localStorage.setItem("YThistory", JSON.stringify([]));
      YThistory = [];
      await Play("wDchsz8nmbo");
    } else {
      //履歴が空でない、かつプレイバック機能が有効
      if (YThistory.length && usePlayback) {
        await Play(YThistory[0].id, YThistory[0].time);
      } else {
        await Play("wDchsz8nmbo");
      }
    }
  }
  YThistoryList.innerHTML = createHistoryListHTML(YThistory);
});

urlInput.addEventListener("input", (e) => {
  if (e.target.value) {
    removeBtn.style.display = "inline-flex";
  } else {
    removeBtn.style.display = "none";
  }
});

playbackFeatureToggler.addEventListener("change", (e) => {
  localStorage.setItem("use_playback", e.target.checked);
});

urlInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getYoutube(urlInput.value);
  } else if (event.key === "/") {
    urlInput.focus();
  }
});
let enc = "AXH1ezmdd9o6dZqqptRJnsdC3G6wXZkpiFy-OkwZJS0F4Q2dVfEuGuPTTaWgYHQuF_XxtxhxvYkQex4VXVOHkL-pT7uPyBCamD2sdGqbI9aZKv8krdv8TfdmVnZJ90l3qYSvaiHH4u7O_X1ygC6HznEe1bcCvjqgng==";

let urlInput = document.querySelector('input[name="url"]');
let video = document.querySelector(".iframe");
let YThistoryList = document.querySelector(".history");
let YThistory = localStorage.getItem("YThistory") ? JSON.parse(localStorage.getItem("YThistory")) : JSON.parse([]);
let useHistory = localStorage.getItem("use_history");
let usePlayback = localStorage.getItem("use_playback");
let playbackFeatureToggler = document.querySelector(".usePlayback");
let removeBtn = document.querySelector(".removeBtn");

window.addEventListener("load", () => {
  if (!useHistory) {
    YThistoryList.innerHTML = "履歴機能を有効化してください。";
    //プレイバック機能は有効にできない
    playbackFeatureToggler.disabled = true;
  } else {
    playbackFeatureToggler.checked = usePlayback;
    if (!YThistory) {
      //履歴を初期化
      localStorage.setItem("YThistory", JSON.stringify([]));
      Play("wDchsz8nmbo");
    } else {
      //履歴が空でない、かつプレイバック機能が有効
      if (YThistory.length && usePlayback) {
        Play(YThistory[0].id, YThistory[0].time);
      } else {
        Play("wDchsz8nmbo");
      }
      YThistoryList.innerHTML = YThistory.length ? "" : "履歴がありません。";
    }
  }
  YThistory.forEach((e) => {
    YThistoryList.innerHTML =
      YThistoryList.innerHTML +
      `
      <li>
        <button class="circle" onclick="Play('${e.id}', ${e.time})">
          <i>play</i>
        </button>
        <div class="max">
          <h6 class="small">${e.title}</h6>
          <div>時間: ${GetTime(e.time)}</div>
        </div>
        <label>
          <a onclick="navigator.clipboard.writeText('https://youtu.be/${e.id}?t=${e.time}')">
            <i>copy</i>
          </a>
        </label>
      </li>
    `;
  });
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

function removeURL() {
  removeBtn.style.display = "none";
  urlInput.value = "";
}
function GetTime(seconds = 0) {
  let hour = Math.floor(seconds % 86400 / 3600);
    let min = Math.floor(seconds % 3600 / 60);
    let sec = seconds % 60
    let time = '';
    if(hour !==0 ) {
      time = `${hour}:${min >= 10 ? min : `0${min}`}:${sec >= 10 ? sec : `0${sec}`}:`;
    }else if(min !==0) {
      time = `${min}:${sec >= 10 ? sec : `0${sec}`}:`;
    }else {
      time = `0:${sec >= 10 ? sec : `0${sec}`}`;
    }
    return time;
}
function GetVideoId(link) {
  let url = new URL(link);
  let host = url.hostname;
  let path = url.pathname.split("/");
  let hostList = [
    "www.youtube.com",
    "m.youtube.com",
    "youtube.com",
    "youtu.be",
    "www.youtube-education.com",
    "www.youtube-nocookie.com"
  ];
  let pathList = [
    "live",
    "shorts",
    "embed"
  ];
  if (hostList.includes(host)) {
    if (path[1] === "watch") {
      let params = url.searchParams;
      let videoId = params.get("v");
      return videoId;
    } else if (pathList.includes(path[1])) {
      let videoId = path[2];
      return videoId;
    } else {
      let videoId = path[1];
      return videoId;
    }
  } else return;
}

function History(item) {
  if (!useHistory) return;
  YThistory.filter((el) => el.id !== item.id);
  YThistory.unshift(item);
  localStorage.setItem("YThistory", JSON.stringify(YThistory));
  YThistoryList.innerHTML = "";
  YThistory.forEach((e) => {
    YThistoryList.innerHTML = YThistoryList.innerHTML + `
      <li>
        <button class="circle" onclick="Play('${e.id}', ${e.time})">
          <i>play</i>
        </button>
        <div class="max">
          <h6 class="small">${e.title}</h6>
          <div>時間: ${GetTime(e.time)}</div>
        </div>
        <label>
          <a onclick="navigator.clipboard.writeText('https://youtu.be/${e.id}?t=${e.time}')">
            <i>copy</i>
          </a>
        </label>
      </li>
    `;
  });
}

function Play(id, sec = 0) {
  ui("#home");
  video.src = `
    https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}&start=${sec ? sec : '0'}
  `;
  video.scrollIntoView({
    behavior: "smooth",
  });
  History({
    'title': video.contentDocument.querySelector('.yt-title-link').textContent,
    'id': id,
    'time': sec ? sec : 0
  });
}

function GetYoutube(url) {
  urlInput.blur();
  if (url) {
    let id = GetVideoId(url);
    Play(id);
  } else return;
}

urlInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    GetYoutube(urlInput.value);
  } else if (event.key === "/") {
    urlInput.focus();
  }
});
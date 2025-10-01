var enc = "AXH1ezm_hEd9ta9Nsq3ze0OqSFu1tRGx3jLsPLFXzmlgJVDsT59V6rk5gBT8pPA5riyJM1Bk2xUtxKg1rhfBhmW9NXMYaUAepWjxJGlZI5XBLtHGaKMGCGjaELFjrO2f_LkVAzGOEsTzgVs-B5ZnOyaLtqtUz-zMrWt-J2vxDtexDpqe";

const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
var YThistoryList = document.querySelector(".history");
var YThistory = JSON.parse(localStorage.getItem("YThistory"));
var useHistory = localStorage.getItem("use_history");
var usePlayback = localStorage.getItem("use_playback");
var playbackFeatureToggler = document.querySelector(".usePlayback");
var YThistory = JSON.parse(localStorage.getItem("YThistory"));
const removeBtn = document.querySelector(".removeBtn");

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
      //履歴が空でないか、プレイバック機能が有効か判定
      if(YThistory.length && usePlayback) {
        Play(YThistory[0]);
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
          <a onclick="Play('${e}')" class="link">https://youtube.com/watch?v=${e}</a>
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
  localStorage.setItem("use_playback", e.target.checked)
});

function removeURL() {
  removeBtn.style.display = "none";
  urlInput.value = "";
}

function GetVideoId(link) {
  const url = new URL(link);
  const host = url.hostname;
  const path = url.pathname;
  if (
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube.com" ||
    host === "www.youtube-nocookie.com" ||
    host === "www.youtubeeducation.com"
  ) {
    if (path === "/watch") {
      let params = url.searchParams;
      let videoId = params.get("v");
      return videoId;
    } else if (path === "/live" || "/shorts" || "/embed") {
      let videoId = `${path.split("/")[2]}`;
      return videoId;
    } else return;
  } else if (host === "youtu.be") {
    let videoId = `${path.split("/")[1]}`;
    return videoId;
  } else return;
}

function History(id) {
  if (!useHistory) return;
  YThistory.filter((el) => el != id);
  YThistory.unshift(id);
  localStorage.setItem("YThistory", JSON.stringify(YThistory));
  YThistoryList.innerHTML = "";
  YThistory.forEach((el) => {
    YThistoryList.innerHTML = YThistoryList.innerHTML + `
      <li>
        <a onclick="Play('${el}')" class="link">https://youtube.com/watch?v=${el}</a>
      </li>
    `
  });
}

function Play(id) {
  ui("#home");
  video.src = `
    https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}
  `;
  video.scrollIntoView({
    behavior: "smooth",
  });
  History(id);
}

function GetYoutube(url) {
  urlInput.blur();
  if (url) {
    const id = GetVideoId(url);
    Play(id);
  } else return;
}

urlInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    GetYoutube(urlInput.value);
  } else if (event.key === "/") {
    urlInput.focus();
  }
});

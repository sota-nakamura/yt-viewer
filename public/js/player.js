const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
var enc =
  "AXH1ezn1I_C7mKu2hKOIlDW6NxRkm1l-Ic1ijxXhCVFO1OS7MWx15Gf_PFD895oCt7oOZ3EXDr-uhSGQHkiCud3hGA-39YNjctRJH5PXutrXEIFbc3-aBjFkN5lKGsgDrQoQp_8_uavg27CTl0AHLGuJiQ4hbJRkrw==";
var YThistoryList = document.querySelector(".history");
var YThistory = JSON.parse(localStorage.getItem("YThistory"));
var useHistory = localStorage.getItem("use_history");
var useContinue = localStorage.getItem("use_continue");
const removeBtn = document.querySelector(".removeBtn");

window.addEventListener("load", () => {
  if (!useHistory) {
    YThistoryList.innerHTML = "履歴機能を有効化してください。";
  } else {
    historyFeatureToggler.checked = true;
    if (!YThistory) localStorage.setItem("YThistory", JSON.stringify([]));
    if(YThistory.length && useContinue) Play(YThistory[0]);
    YThistoryList.innerHTML = YThistory.length ? "" : "履歴がありません。";
  }
  video.src = `https://www.youtubeeducation.com/embed/wDchsz8nmbo?embed_config={"enc":"${enc}"}`;
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
    host === "youtube.com"
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
  if (YThistory[0] === id) return;
  YThistory.push(id);
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

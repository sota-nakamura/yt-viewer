const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
var enc = "AXH1ezkLtnYR4IS5qBg4lfRyKzzJyAXGt7_J6YTjSFbmWsKPCZAp3sTy5Ecr4s1vFvYm6-Xjemf3AwU6HaJV6VDksPc1zp1SVCnz1RBI8faBUQ5qHUC8-Fd8kx02RMvCNejzdiRMzIIWRKiUQ2egPdFM-J-cDSMxjCXnh-3qw0UFN7VV";
var historyList = document.querySelector(".history");
var history = JSON.parse(localStorage.getItem("history")) || [];

window.addEventListener("load", () => {
  historyList.innerHTML = history ? "" : "No Items"
  video.src = `https://www.youtubeeducation.com/embed/wDchsz8nmbo?embed_config={"enc":"${enc}"}`;
  history.forEach((e) => {
    historyList.innerHTML = historyList.innerHTML + `
      <li>
          <a onClick="Play(${e})" class="link">https://youtube.com/watch?v=${e}</a>
      </li>
    `;
  });
});

function GetYoutube(url) {
  urlInput.blur();
  if (url) {
    const id = GetVideoId(url);
    Play(id);
  } else return;
}

function GetVideoId(link) {
  const url = new URL(link);
  const host = url.hostname;
  const path = url.pathname;
  if (host === "www.youtube.com" || host === "m.youtube.com" || host === "youtube.com") {
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

function Play(id) {
  video.src = `https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}`;
  video.scrollIntoView({
    behavior: "smooth"
  });
  History(id);
}

function History(id) {
  history.push(id);
  localStorage.setItem("history", JSON.stringify(history));
  historyList.innerHTML = historyList.innerHTML + `
          <li>
              <a onClick="Play(${id})" class="link">https://youtube.com/watch?v=${id}</a>
          </li>
  `;
}

function removeURL() {
  urlInput.value === "";
}
urlInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    GetYoutube(urlInput.value);
  }
});
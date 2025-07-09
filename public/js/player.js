
const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
var len = 158;
var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_";
var enc = "AXH1ezmHuc1Pw9Z4ANGyxHXwPEiwC-iCeohIPeFNWXjwcM5-OMfvHmB27ihSBnKBSdowaCQIfllNFq7LOzJUI9_bu6a5jJLl-t9CPpdsGx557SuItQXPPW0hjsqPJ2AOeoQDVPAVn0El8DQC8uo_em1z1hjgH7pR67FQ_DiGcJZV9_x_";
var strLen = str.length;
var historyList = document.querySelector(".history");
var history = localStorage.getItem("history") || [];

window.addEventListener("load", () => {
  historyList.innerHTML = history ? "" : "No Items"
  video.src = `https://www.youtubeeducation.com/embed/wDchsz8nmbo?embed_config=%7B%22enc%22:%22${enc}%22%7D`;
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
  video.src = `https://www.youtubeeducation.com/embed/${id}?origin=https://create.kahoot.it&amp;embed_config={"enc":"${enc}"}`;
  video.scrollIntoView({
    behavior: "smooth"
  });
  History(id);
}

function History(id) {
  history.push(id);
  localStorage.setItem("history", history);
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
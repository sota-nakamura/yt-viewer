const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
var enc = "AXH1ezn1I_C7mKu2hKOIlDW6NxRkm1l-Ic1ijxXhCVFO1OS7MWx15Gf_PFD895oCt7oOZ3EXDr-uhSGQHkiCud3hGA-39YNjctRJH5PXutrXEIFbc3-aBjFkN5lKGsgDrQoQp_8_uavg27CTl0AHLGuJiQ4hbJRkrw==";
var YThistoryList = document.querySelector(".history");
var YThistory = JSON.parse(localStorage.getItem("YThistory"));

window.addEventListener("load", () => {
  if(!YThistory) localStorage.setItem("YThistory", JSON.stringify([]));
  YThistoryList.innerHTML = YThistory ? "" : "No Items";
  video.src = `https://www.youtubeeducation.com/embed/wDchsz8nmbo?embed_config={"enc":"${enc}"}`;
  YThistory.forEach((e) => {
    YThistoryList.innerHTML = YThistoryList.innerHTML + `
      <li>
          <a onClick="Play(${e})" class="link">https://youtube.com/watch?v=${e}</a>
      </li>
    `;
  });
});

function removeURL() {
  urlInput.value = '';
}

function removeHistory() {
  localStorage.removeItem("YThistory");
  location.reload();
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

function History(id) {
  if(YThistory[0] === id) return;
  YThistory.push(id);
  localStorage.setItem("YThistory", JSON.stringify(YThistory));
  YThistoryList.innerHTML = YThistoryList.innerHTML + `
          <li>
              <a onClick="Play(${id})" class="link">https://youtube.com/watch?v=${id}</a>
          </li>
  `;
}

function Play(id) {
  video.src = `https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}`;
  video.scrollIntoView({
    behavior: "smooth"
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

urlInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    GetYoutube(urlInput.value);
  }
});
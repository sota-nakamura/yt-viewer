const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
var enc = "AXH1ezlXbgZ-TCOvBj2I7xsQVe-SBRV7Y6Y3OT5AfRn3O2zbabXrrQMLVqaqpoZjy3H0cgWajm-t1cpTj_JYHsMMmLMCBCDTl0tcQRnQE9sw_eaSyqbkfBSoSy1yREjWpTICRR2QlOlRYMzENinCKEJkK8QG9bEWpbFbZ7q5yDWh8aNG";
var YThistoryList = document.querySelector(".YThistory");
var YThistory = JSON.parse(localStorage.getItem("YThistory") || []);

window.addEventListener("load", () => {
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
  YThistory(id);
}

function YThistory(id) {
  if(YThistory[0] === id) return;
  YThistory.push(id);
  localStorage.setItem("YThistory", JSON.stringify(YThistory));
  YThistoryList.innerHTML = YThistoryList.innerHTML + `
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
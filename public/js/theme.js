var colorInput = document.querySelector(`input[name="theme"]`);
var modeList = document.querySelector("#mode_list").querySelectorAll("li");
var modeName = document.querySelector("#mode_name");
var themeList = document
  .querySelector("#theme_list")
  .querySelectorAll("button:not(.chip)");
var themeColor = document.querySelector('meta[name="theme-color"]');
var deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
var mode = "";
var theme = "";
var storedMode = localStorage.getItem("mode");
var storedTheme = localStorage.getItem("theme");
function changeColor(e) {
  // set theme
  theme = e;
  ui("theme", e);
  colorInput.value = e;
  themeColor.setAttribute("content", e);
  localStorage.setItem("theme", e);
}
function changeMode(e) {
  mode = e;
  if(e) {
    if(e === "dark") {
      modeName.innerHTML = "ダークモード";
    } else {
      modeName.innerHTML = "ライトモード";
    }
    // set mode to selected one
    ui("mode", e);
    document.querySelector(`#mode_list > li[name="${mode}"]`).classList.add("active");
    localStorage.setItem("mode", e);
  } else {
    // set mode to device default
    modeName.innerHTML = "システム設定";
    localStorage.removeItem("mode");
    document.querySelector('#mode_list > li[name=""]').classList.add("active");
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
}
async function getColorFromImage(e) {
  let imageTheme = await ui("theme", e);
  color = CSSJSON.toJSON(imageTheme.light).attributes["--primary"];
  changeColor(color);
}
document.addEventListener("DOMContentLoaded", () => {
  if (storedTheme) {
    changeColor(storedTheme);
  }
  changeMode(storedMode);
});
deviceDark.addEventListener("change", (event) => {
  if(!storedMode) changeMode(event);
});
modeList.forEach((e) => {
  e.addEventListener("click", () => {
    modeList.forEach(el => el.classList.remove("active"));
    var name = e.getAttribute("name");
    changeMode(name);
  });
});
themeList.forEach((e) => {
  e.addEventListener("click", () => {
    var rgb = getComputedStyle(e).backgroundColor;
    var color = `#${rgb
        .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
        .slice(1)
        .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
        .join("")}`;
    changeColor(color);
  });
});
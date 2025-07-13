var colorInput = document.querySelector(`input[name="theme"]`);
var modeList = document.querySelector("#mode_list").querySelectorAll("button");
var themeList = document
  .querySelector("#theme_list")
  .querySelectorAll("button:not(.chip)");
var themeColor = document.querySelector('meta[name="theme-color"]');
var deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
var storedMode = localStorage.getItem("mode");
var theme = localStorage.getItem("theme");
function changeColor(e) {
  console.log("color: ", e);
  ui("theme", e);
  colorInput.value = e;
  themeColor.setAttribute("content", e);
  localStorage.setItem("theme", e);
}
async function getColorFromImage(e) {
  let color = await ui("theme", e);
  color = CSSJSON.toJSON(theme.light).attributes["--primary"];
  changeColor(color);
}
document.addEventListener("DOMContentLoaded", () => {
    if (theme) {
        changeColor(theme);
    }
  if (storedMode) {
    ui("mode", storedMode);
    document.querySelector(`#mode_list > 
        button[name="${storedMode}"]`).classList.add("active");
  } else {
    document.querySelector('#mode_list > button[name=""]').classList.add("active");
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
});
deviceDark.addEventListener("change", (event) => {
  if (!storedMode) {
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
});
modeList.forEach((e) => {
  e.addEventListener("click", () => {
    var mode = e.getAttribute("name");
    ui("mode", mode);
    if (!mode) {
      ui("mode", deviceDark.matches ? "dark" : "light");
    }
    localStorage.setItem("mode", mode);
    modeList.forEach(el => el.classList.remove("active"));
    e.classList.add("active");
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
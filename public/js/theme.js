var colorInput = document.querySelector(`input[name="theme"]`);
var modeList = document.querySelector("#mode_list").querySelectorAll("button");
var themeList = document
  .querySelector("#theme_list")
  .querySelectorAll("button:not(.chip)");
var themeColor = document.querySelector('meta[name="theme-color"]');
var deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
var mode = localStorage.getItem("mode");
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
  if (mode) {
    ui("mode", mode);
    document.querySelector(`#mode_list > button[name="${mode}"]`).classList.add("active", "border");
  } else {
    document.querySelector('#mode_list > button[name=""]').classList.add("active", "border");
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
});
deviceDark.addEventListener("change", (event) => {
  if (!mode) {
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
});
modeList.forEach((e) => {
  e.addEventListener("click", () => {
    var mode = e.getAttribute("name");
    if (!mode) {
      ui("mode", deviceDark.matches ? "dark" : "light");
      localStorage.removeItem("mode");
    } else {
      ui("mode", mode);
      localStorage.setItem("mode", mode);
      modeList.forEach(el => el.classList.remove("active", "border"));
      e.classList.add("active");
    }
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
const colorInput = document.querySelector(`input[name="theme"]`);
const imageTheme = document.querySelector(`input[name="imageTheme"]`);
const modeList = document.querySelector("#mode_list").querySelectorAll("button");
const themeList = document
  .querySelector("#theme_list")
  .querySelectorAll("button:not(.chip)");
const themeColor = document.querySelector('meta[name="theme-color"]');
const deviceDark = window.matchMedia("(prefers-color-scheme: dark)");
const mode = localStorage.getItem("mode");
const theme = localStorage.getItem("theme");
document.addEventListener("DOMContentLoaded", () => {
    if (theme) {
        changeColor(theme);
    }
  if (mode) {
    ui("mode", mode);
    document.querySelector(`#mode_list > 
        button[name="${mode}"]`).classList.add("active");
  } else {
    document.querySelector('#mode_list > button[name=""]').classList.add("active");
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
});
deviceDark.addEventListener("change", (event) => {
  if (!mode) {
    ui("mode", deviceDark.matches ? "dark" : "light");
  }
});
function changeColor(e) {
  ui("theme", e);
  colorInput.value = e;
  themeColor.setAttribute("content", e);
  localStorage.setItem("theme", e);
}
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

function getColorFromImage(e) {
    let color = await ui("theme", e);
    color = CSSJSON.toJSON(theme.light).attributes["--primary"];
    changeColor(color);
}
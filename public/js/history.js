var historyFeatureToggler = document.querySelector(".useHistory");
var useHistory = localStorage.getItem("use_history");
var YThistoryList = document.querySelector(".history");
historyFeatureToggler.addEventListener("change", (e) => {
  if (!e.target.checked) {
    e.target.checked = true;
    ui("#confirm_disabling_history");
    e.preventDefault();
  } else {
    localStorage.setItem("use_history", true);
    YThistoryList.innerHTML = "履歴がありません。";
  }
});
function disableHistory() {
  ui("#confirm_disabling_history");
  localStorage.removeItem("YThistory");
  YThistoryList.innerHTML = "履歴機能を有効化してください。";
  localStorage.setItem("use_history", false);
  historyFeatureToggler.checked = false;
}

function removeHistory() {
  ui("#confirm_deleting_history");
  localStorage.removeItem("YThistory");
  YThistoryList.innerHTML = "履歴がありません。";
}
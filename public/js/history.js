import {
  getHistoryState,
  createHistoryListHTML,
  searchHistory
} from './history_ui.js';
let historyFeatureToggler = document.querySelector(".useHistory");
const YThistoryList = document.querySelector(".history");

window.disableHistory = disableHistory;
window.deleteAllHistory = deleteAllHistory;

document.addEventListener("DOMContentLoaded", () => {
  const {
    useHistory
  } = getHistoryState();
  if (historyFeatureToggler) {
    historyFeatureToggler.checked = useHistory;
  }
});
historyFeatureToggler.addEventListener("change", (e) => {
  if (!e.target.checked) {
    e.target.checked = true;
    ui("#confirm_disabling_history");
    e.preventDefault();
  } else {
    // 履歴を有効化
    localStorage.setItem("use_history", "true");
  }
  ui('#update_snackbar');
});

function disableHistory() {
  ui("#confirm_disabling_history");
  localStorage.removeItem("YThistory");
  localStorage.setItem("use_history", "false");
  historyFeatureToggler.checked = false;
  YThistoryList.innerHTML = "履歴機能を有効化してください。";
}

function deleteAllHistory() {
  ui("#confirm_deleting_history");
  localStorage.removeItem("YThistory");
  YThistoryList.innerHTML = "履歴がありません。";
}
import {
  getHistoryState,
  createHistoryListHTML
} from './history_ui.js';
import { showToast } from "./util.js"
let historyFeatureToggler = document.querySelector(".useHistory");
const YThistoryList = document.querySelector(".history");
const historyInput = document.querySelector("#historyInput");
const exportButton = document.querySelector("#export");
const importButton = document.querySelector("#import");

window.disableHistory = disableHistory;
window.deleteAllHistory = deleteAllHistory;
window.deleteHistory = deleteHistory;

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

exportButton.addEventListener('click', function(){
  const {
    YThistory: data
  } = getHistoryState();
  const blob = new Blob([JSON.stringify(data, null, '  ')],
{type: 'application\/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'history.json';
  link.click();
  URL.revokeObjectURL(url);
});

  importButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            console.log(jsonData);
            localStorage.setItem("YThistory", JSON.stringify(jsonData));
            showToast("履歴のインポートに成功しました。");
            // Process the JSON data here
        } catch (error) {
            console.error("Error parsing JSON:", error);
            showToast("間違った形式のJSONファイルです。", true);
        }
    };
    reader.readAsText(file);
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
function deleteHistory(id) {
  const {
    YThistory: currentHistory
  } = getHistoryState();
  let YThistory = currentHistory.filter((el) => el.id !== id);
  localStorage.setItem("YThistory", JSON.stringify(YThistory));
  YThistoryList.innerHTML = createHistoryListHTML(YThistory, 50);
}

function searchHistory(keyword) {
  const {
    YThistory: currentHistory
  } = getHistoryState();
  let item = currentHistory.filter((val) => (val.title || "").toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
  return item;
}

historyInput.addEventListener('input', (e) => {
  const {
    YThistory: currentHistory
  } = getHistoryState();
  
  if (e.target.value) {
    const keyword = e.target.value;
    const searchResult = searchHistory(keyword);
    YThistoryList.innerHTML = createHistoryListHTML(searchResult, 50);
  } else {
    YThistoryList.innerHTML = createHistoryListHTML(YThistory, 50);
  }
});
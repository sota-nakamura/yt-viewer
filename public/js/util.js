/**
 * HTMLエンティティのエスケープ処理
 * @param {string} unsafe - エスケープ対象の文字列
 * @returns {string}
 */
export function escapeHtml(unsafe) {
    return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;"); // or &#39;
  }
  
  /**
   * 秒数を HH:MM:SS の形式にフォーマット
   * @param {number} [seconds=0] - 秒数
   * @returns {string}
   */
  export function formatTime(seconds = 0) {
    const hour = Math.floor(seconds % 86400 / 3600);
    const min = Math.floor(seconds % 3600 / 60);
    const sec = seconds % 60
    let time = '';

    if (hour !== 0) {
      //ゼロパディング処理+フォーマット
      time = `${hour}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    } else if (min !== 0) {
      time = `${min}:${String(sec).padStart(2, '0')}`;
    } else {
      time = `0:${String(sec).padStart(2, '0')}`;
    }
    return time;
  }
export function copyURL(txt) {
  navigator.clipboard.writeText(txt);
  showToast('URLをコピーしました。', false);
}
export function showToast(message, error = false) {
  if(error) {
    document.querySelector('.error_text').textContent = message;
    ui('#error_snackbar');
  } else {
    document.querySelector('.snackbar_text').textContent = message;
    ui('#snackbar');
  }
}

window.copyURL = copyURL;
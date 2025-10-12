import { getHistoryState } from './history_ui.js';
import { Play } from './player.js';

const playbackFeatureToggler = document.querySelector(".usePlayback");

// PlayBackのトグルイベントハンドラ
playbackFeatureToggler.addEventListener("change", (e) => {
  // localStorageは文字列で保存
  localStorage.setItem("use_playback", e.target.checked ? "true" : "false");
  ui('#update_snackbar');
});
// ページのロード時に動画を再生
export async function initializePlaybackOnLoad() {
  const {
    YThistory,
    useHistory,
    usePlayback
  } = getHistoryState();
  
  if (!useHistory) {
    // 履歴が無効な場合、PlayBackも無効化
    playbackFeatureToggler.disabled = true;
    Play("wDchsz8nmbo");
  } else {
    // PlayBackトグルスイッチの初期状態を設定
    playbackFeatureToggler.checked = usePlayback;
    // 履歴が空でない、かつPlayBackが有効
    if (YThistory && YThistory.length > 0 && usePlayback) {
      // 最新の動画を再生
      await Play(YThistory[0].id, YThistory[0].time);
    } else {
      await Play("wDchsz8nmbo");
    }
  }
}
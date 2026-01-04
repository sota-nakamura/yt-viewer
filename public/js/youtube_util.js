import { hostList } from './config.js';
import { showToast } from './util.js';

// URLからYouTubeの動画IDを抽出
export function getVideoId(value) {
  if (!value) return;
  // 'https://' を補完
  const fullUrl = value.startsWith('http') ? value : `https://${value}`;
  
  try {
    const url = new URL(fullUrl);
    const host = url.hostname;
    const path = url.pathname.split("/");
    const pathList = ["live", "shorts", "embed"];
    let videoId = '';
    
    if (hostList.includes(host)) {
      if (path[1] === "watch") {
        const params = url.searchParams;
        videoId = params.get("v");
      } else if (pathList.includes(path[1])) {
        videoId = path[2];
      } else {
        videoId = path[1];
      }
    } else {
      showToast('正しいURLを入力してください。', true);
    }
    console.log('videoId: ', videoId);
    return videoId;
  } catch (e) {
    // ID単体の場合のチェック
    if (value.length === 11 && !value.includes('/') && !value.includes('=')) {
      return value;
    } else {
      console.error('error while getting video ID: ', e);
      return;
    }
  }
}

// URLからタイムスタンプを抽出
export function getTimeStamp(value) {
  if (!value) return;
  const fullUrl = value.startsWith('http') ? value : `https://${value}`;

  try {
    const url = new URL(fullUrl);
    const host = url.hostname;

    if (hostList.includes(host)) {
      const params = url.searchParams;
      const tParam = params.get('t');
      
      if (tParam) {
        return parseInt(tParam.replace(/[^0-9]/g, '')) || 0;
      }
      return 0;
    } else {
      showToast('正しいURLを入力してください。', true);
      return 0;
    }
  } catch (e) {
    console.error('error while getting timestamp: ', e);
    return 0;
  }
}
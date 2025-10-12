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
      return params.get('t') || 0;
    } else {
      showToast('正しいURLを入力してください。', true);
    }
  } catch (e) {
    console.error('error while getting timestamp: ', e);
    return 0;
  }
}

// 動画IDからタイトルを取得 (noembed.comを使用)
/*
export async function getVideoTitle(id) {
  if (!id) return;
    
  const videoUrl = `https://www.youtube.com/watch?v=${id}`;
  const noembedUrl = `https://noembed.com/embed?dataType=json&url=${encodeURIComponent(videoUrl)}`;
  let title = ""; 

  try {
    const res = await fetch(noembedUrl);
    const data = await res.json();
    if (data && data.title) {
      title = data.title;
    }
  } catch (error) {
    showToast('タイトルの取得に失敗しました。', true);
    console.error("Failed to fetch the video title:", error);
    title = "タイトル不明";
  }
  console.log('title: ', title);
  return title;
}
*/
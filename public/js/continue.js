import { Play } from "player.js";
var useContinue = localStorage.getItem("use_continue");
var continueFeatureToggler = document.querySelector(".useContinue");
var latestVideo = localStorage.getItem("latest_video");
var video = document.querySelector(".iframe")
var YThistory = JSON.parse(localStorage.getItem("YThistory"));

continueFeatureToggler.addEventListener("change", (e) => {
    if (!e.target.checked) {
        e.target.checked = true;
        ui("#confirm_disabling_continue");
        e.preventDefault();
      } else {
        localStorage.setItem("use_continue", true);
        e.target.checked = true;
      }
})
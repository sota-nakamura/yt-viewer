var useContinue = localStorage.getItem("use_continue");
var continueFeatureToggler = document.querySelector(".useContinue");
var YThistory = JSON.parse(localStorage.getItem("YThistory"));

continueFeatureToggler.addEventListener("change", (e) => localStorage.setItem("use_continue", this.checked))
window.addEventListener("load", () => {
  if(useContinue) continueFeatureToggler.checked = true;
})
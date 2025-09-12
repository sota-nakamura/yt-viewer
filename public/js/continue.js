var useContinue = localStorage.getItem("use_continue");
var continueFeatureToggler = document.querySelector(".useContinue");

continueFeatureToggler.addEventListener("change", (e) => localStorage.setItem("use_continue", this.checked))
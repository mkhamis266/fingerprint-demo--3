document.addEventListener("DOMContentLoaded", function (e) {
  document.addEventListener("dblclick", function (e) {
    e.preventDefault();
  });
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
});

const allFingerprints = [
  "./imgs/fingerprints/fb-1.png",
  "./imgs/fingerprints/fb-2.png",
  "./imgs/fingerprints/fb-3.png",
  "./imgs/fingerprints/fb-4.png",
  "./imgs/fingerprints/fb-5.png",
  "./imgs/fingerprints/fb-6.png",
  "./imgs/fingerprints/fb-7.png",
  "./imgs/fingerprints/fb-8.png",
  "./imgs/fingerprints/fb-9.png",
  "./imgs/fingerprints/fb-1.png",
  "./imgs/fingerprints/fb-11.png",
  "./imgs/fingerprints/fb-12.png",
  "./imgs/fingerprints/fb-13.png",
  "./imgs/fingerprints/fb-14.png",
  "./imgs/fingerprints/fb-15.png",
  "./imgs/fingerprints/fb-16.png",
  "./imgs/fingerprints/fb-17.png",
  "./imgs/fingerprints/fb-18.png",
  "./imgs/fingerprints/fb-19.png",
  "./imgs/fingerprints/fb-20.png",
  "./imgs/fingerprints/fb-21.png",
  "./imgs/fingerprints/fb-22.png",
  "./imgs/fingerprints/fb-23.png",
  "./imgs/fingerprints/fb-24.png",
  "./imgs/fingerprints/fb-25.png",
];

const scanSound = new Audio("../sounds/scan.mp3");
const wrongAnswerSound = new Audio("../sounds/wrong_sir_wrong.mp3");
const correctAnswerSound = new Audio("../sounds/correct.mp3");
const clickSound = new Audio("../sounds/mouse_click.mp3");
const timeoutSound = new Audio("../sounds/game_over_sms.mp3");

let score = 0;
let timer = 20;
let attempts = 3;
let timerInterval;
let timeout;
let isPaused = false;

$(".submitButton").on("click", () => submit());
$(".generateButton").on("click", () => {
  $(".generateButton").attr("disabled", true);
  setTimeout(() => $(".generateButton").attr("disabled", false), 1000);
  reset();
  start();
});

// start the Game
start();
function start() {
  setInitialFingerprints();
  setPerpetratorImg();
  timerInterval = setInterval(() => {
    countDown();
  }, 1000);
}

function reset() {
  isPaused = false;
  timer = 20;
  // $(".timer span").text(moment(timer * 1000).format("mm [:] ss"));
  $(".timer span").text(timer);
  score = 0;
  $(".score span").html(score);
  attempts = 3;
  $(".attempts span").html(attempts);
  timeoutSound.pause();
  timeoutSound.currentTime = 0;
  $(".popup").hide();
  $("#suspected-img").addClass("opacity-0");
  $(".fingerprint").removeClass("selected");
  $("#scanGif").addClass("d-none");
}

function setInitialFingerprints() {
  $(".fingerprint").each((index, element) => {
    setFingerPrintImg($(element).find("img"));
    $(element).on("click", () => handleFingerprintClick(element));
  });
}

function setFingerPrintImg(element) {
  let id = getRandomIndex(allFingerprints.length);
  if ($(".fingerprint").attr("id") == id) {
    setFingerPrintImg(element);
  }
  $(element).attr({
    id: id + 1,
    src: allFingerprints[id],
  });
}

function setPerpetratorImg() {
  let index = getRandomIndex($(".fingerprint img").length);
  let imgSrc = $(".fingerprint img").eq(index).attr("src");
  let id = $(".fingerprint img").eq(index).attr("id");
  $("#perpetrator-img").attr({
    src: imgSrc,
    "data-key": id,
  });
}

function getRandomIndex(range) {
  return Math.floor(Math.random() * range);
}

function handleFingerprintClick(element) {
  clickSound.play();
  $(".fingerprint").removeClass("selected");
  $(element).addClass("selected");
  $("#suspected-img")
    .attr({
      src: $(element).find("img").attr("src"),
      "data-key": $(element).find("img").attr("id"),
    })
    .removeClass("opacity-0");
  $(".submitButton").removeAttr("disabled");
}

function submit(){
  $("#timeoutPopup").fadeIn(1000);
}

// function submit() {
//   isPaused = true;
//   attempts--;
//   $(".attempts span").html(attempts);
//   $(".attempts span").html(attempts);
//   scan().then((matched) => {
//     if (matched) {
//       correctAnswerSound.play();
//       score = Math.round((1 / timer) * 1000);
//       $(".score span").html(score);
//       endGame("win");
//     } else {
//       if (attempts == 0) {
//         timeoutSound.play();
//         endGame("fail");
//       } else {
//         wrongAnswerSound.play();
//         $("#wrongPopup").fadeIn(1000, function () {
//           $("#wrongPopup").fadeOut(1000, function () {
//             isPaused = false;
//           });
//         });
//       }
//     }
//   });
// }

function endGame(status) {
  clearInterval(timerInterval);
  timerInterval = "";
  $(".submitButton").attr("disabled", true);
  switch (status) {
    case "win":
      $("#correctPopup").fadeIn(1500);
      break;
    case "timeout":
      $("#timeoutPopup").fadeIn(1000);
      break;
    case "fail":
      $("#failPopup").fadeIn(1000);
      break;
  }
}

// function countDown() {
//   if (isPaused) {
//     return;
//   }
//   timer--;
//   // $(".timer span").text(moment(timer * 1000).format("mm [:] ss"));
//   $(".timer span").text(timer);
//   if (timer <= 0) {
//     timeoutSound.play();
//     endGame("timeout");
//     return;
//   }
// }

function scan() {
  scanSound.loop = true;
  scanSound.play();
  $("#scanGif").removeClass("d-none");
  $(".submitButton").attr("disabled", true);
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      scanSound.pause();
      scanSound.currentTime = 0;
      $("#scanGif").addClass("d-none");
      if ($("#suspected-img").attr("data-key") == $(".perpetrator-img-box img").attr("data-key")) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, 3000);
  });
}

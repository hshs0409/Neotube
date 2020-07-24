import axios from "axios";
import millify from "millify";
const userProfileContainer = document.querySelector(".user-profile__header");
const userLikeBtn = document.querySelector(".profile__likeBtn");
const userLikeNums = document.querySelectorAll(".profile__likeNum");

const increaseNumber = () => {
  userLikeNums.forEach((userLikeNum) => {
    let likeNum = userLikeNum;
    likeNum.classList.toggle("blind");
  });
  userLikeNums[1].innerHTML = parseInt(userLikeNums[1].innerHTML, 10) + 1;
};

const sendLike = async () => {
  const userId = window.location.href.split("/users/")[1];
  const response = await axios({
    url: `/api/${userId}/like`,
    method: "POST",
    data: {},
  });
  if (response.status === 200) {
    increaseNumber();
  }
};

const handleClick = () => {
  sendLike();
  userLikeBtn.removeEventListener("click", handleClick);
};

function init() {
  userLikeBtn.addEventListener("click", handleClick);
}

if (userProfileContainer) {
  init();
}

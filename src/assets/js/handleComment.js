import axios from "axios";
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const addCommentUser = document.querySelector(".add__comment-user");
const commentdeleteBtn = document.querySelectorAll(".comment__deleteBtn");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = async (comment) => {
  let currentCommentColumn;
  let newComment;
  if (document.querySelector(".comment__column")) {
    currentCommentColumn = document.querySelector(".comment__column");
    newComment = currentCommentColumn.cloneNode(true);
  } else {
    currentCommentColumn = document.querySelector(".comment__column-blind");
    newComment = currentCommentColumn.cloneNode(true);
    newComment.classList.replace("comment__column-blind", "comment__column");
  }
  const addCommentUserImg = addCommentUser.querySelector("img").src;
  const addCommentUserName = addCommentUser.querySelector("a").innerText;
  // const newComment = currentCommentColumn.cloneNode(true);
  const spans = newComment.querySelectorAll("span");
  const a = newComment.querySelector("a");
  const img = newComment.querySelector(".u-avatar");
  img.src = addCommentUserImg;
  a.innerText = addCommentUserName;
  spans[0].innerText = "just Now";
  spans[1].innerText = comment;
  await commentList.prepend(newComment);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: { comment },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const handleDeleteBtn = (event) => {
  const commentUrl = event.target.parentNode.href;
  const pageUrl = window.location.href;
  event.preventDefault();
  sendDeleteComment(commentUrl, pageUrl, event);
};

const sendDeleteComment = async (commentUrl, pageUrl, event) => {
  const commentId = commentUrl.split("/")[4];
  const videoId = pageUrl.split("/videos/")[1];
  const response = await axios({
    url: `/api/${commentId}/commentDelete`,
    method: "POST",
    data: { videoId },
  });
  const target = event.target.parentNode.parentNode;
  target.style.display = "none";
  if (response.status === 200) {
    // addComment(comment);
  }
  decreaseNumber();
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  commentdeleteBtn.forEach((btn) => {
    btn.addEventListener("click", handleDeleteBtn);
  });
}

if (addCommentForm) {
  init();
}

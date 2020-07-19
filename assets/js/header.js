const headerMenu = document.getElementById("headerMenu");
const headerSearch = document.getElementById("headerSearch");
const headerToggleBtn = document.querySelector(".header__toggleBtn");

const handelToggleBtn = () => {
  headerMenu.classList.toggle("active");
  headerSearch.classList.toggle("active");
};

function init() {
  headerToggleBtn.addEventListener("click", handelToggleBtn);
}

if (headerToggleBtn) {
  init();
}

const images = document.querySelectorAll('.seat-image');
const menuItems = document.querySelectorAll('.menu-item');
let currentIndex = 0;
const halfWindowHeight = window.innerHeight / 2;
let lastY = 0;

function showImage(index) {
  images.forEach((img, i) => {
    img.classList.remove('active');
    if (i === index) {
      img.classList.add('active');
    }
  });

  menuItems.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
}

function handleScroll(e) {
  const container = document.querySelector('.viewer');
  const rect = container.getBoundingClientRect();

  if (rect.top <= halfWindowHeight && rect.bottom >= halfWindowHeight) {
    const scrollProgress = (halfWindowHeight - rect.top) / container.offsetHeight;
    let newIndex = Math.floor(scrollProgress * (images.length - 1));
    newIndex = Math.max(0, Math.min(images.length - 1, newIndex));

    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      showImage(currentIndex);
    }
  }
}

function handleTouch(e) {
  const touch = e.touches ? e.touches[0] : null;
  if (!touch) return;

  const deltaY = touch.clientY - (lastY || touch.clientY);
  lastY = touch.clientY;

  if (Math.abs(deltaY) > 30) { // 降低閾值以提高靈敏度
    e.preventDefault(); // 防止頁面滾動干擾
    if (deltaY < 0 && currentIndex < images.length - 1) { // 向上滑
      currentIndex++;
      showImage(currentIndex);
    } else if (deltaY > 0 && currentIndex > 0) { // 向下滑
      currentIndex--;
      showImage(currentIndex);
    }
  }
}

// 滑鼠滾輪事件
window.addEventListener('wheel', (e) => {
  const delta = e.deltaY;
  if (delta > 0 && currentIndex < images.length - 1) { // 向下滾
    currentIndex++;
    showImage(currentIndex);
  } else if (delta < 0 && currentIndex > 0) { // 向上滾
    currentIndex--;
    showImage(currentIndex);
  }
});

// 觸控事件
window.addEventListener('touchstart', (e) => {
  lastY = e.touches[0].clientY;
});
window.addEventListener('touchmove', handleTouch);

// 菜單點擊事件
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const index = Number(item.getAttribute('data-index'));
    if (index !== currentIndex) {
      currentIndex = index;
      showImage(currentIndex);
    }
  });
});

// 滾動觸發（半圈切換）
window.addEventListener('scroll', handleScroll);

// 初始顯示第一個圖片
showImage(currentIndex);
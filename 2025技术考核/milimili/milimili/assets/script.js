function uploadFile() {
    const fileInput = document.getElementById('avatar-input');
    const form = document.getElementById('upload-form');

    if (fileInput.files.length > 0) {
        // Auto submit when file is selected
        form.submit();
    }
}

// Easter Egg Trigger Function
function triggerEasterEgg() {
    alert('恭喜你发现了隐藏彩蛋！但是... 这里没有 Flag (Congratulation! But no flag here)');
    document.body.style.transform = "rotate(180deg)";
    document.body.style.transition = "transform 1s";
}

// Easter Egg: Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerEasterEgg();
            konamiIndex = 0; // Reset
        }
    } else {
        konamiIndex = 0;
    }
});

// Easter Egg: Search "flag"
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');

    function checkSearch() {
        if (searchInput.value.toLowerCase().includes('flag')) {
            triggerEasterEgg();
        } else {
            alert('搜索功能正在维护中... (Searching is under maintenance)');
        }
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', checkSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkSearch();
            }
        });
    }
});

console.log("%c Milimili CTF %c 招聘黑客：有意者请联系 null@milimili.com ", "background:#fb7299; color:white; padding:4px; border-radius: 4px 0 0 4px;", "background:#333; color:white; padding:4px; border-radius: 0 4px 4px 0;");
console.log("不要试图寻找源代码... 除非你能找到 user.php 的漏洞");

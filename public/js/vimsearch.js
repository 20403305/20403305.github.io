let searchQuery = ''; // 当前的搜索词
let matches = []; // 存储匹配项的DOM元素
let currentMatchIndex = -1; // 当前匹配项的索引
let searchMode = false; // 用于跟踪是否在搜索模式

// 监听键盘事件
document.addEventListener('keydown', function(event) {
    // 如果正在输入（比如在输入框中），则不处理快捷键
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    if (event.key === '/') {
        event.preventDefault();
        searchMode = true;
        promptForSearch();
    } else if (searchMode) {
        // 搜索模式下的快捷键
        if (event.key === 'n') {
            jumpToNextMatch();
        } else if (event.key === 'N') {
            jumpToPreviousMatch();
        } else if (event.key === 'Escape') {
            exitSearch();
            searchMode = false;
        }
    } else {
        // 非搜索模式下的导航快捷键
        if (event.key.toLowerCase() === 'j') {
            event.preventDefault();
            scrollPage('down');
        } else if (event.key.toLowerCase() === 'k') {
            event.preventDefault();
            scrollPage('up');
        } else if (event.key === 'G') {
            event.preventDefault();
            scrollToBottom();
        } else if (event.key === 'g') {
            event.preventDefault();
            handleGKey(event);
        }
    }
});

// 显示输入框让用户输入搜索词
function promptForSearch() {
    searchQuery = prompt("请输入搜索内容:");
    if (searchQuery) {
        highlightMatches();
        showSearchInfo(); // 显示搜索框
    }
}

// 高亮页面中所有匹配的文本
function highlightMatches() {
    // 清除之前的高亮
    clearAllHighlights();

    // 使用不区分大小写的正则表达式
    const matchRegex = new RegExp(searchQuery, 'gi');
    
    // 递归遍历所有节点
    function searchInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const content = node.textContent;
            if (matchRegex.test(content)) {
                // 重置正则表达式的lastIndex
                matchRegex.lastIndex = 0;
                
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                let match;
                
                while ((match = matchRegex.exec(content)) !== null) {
                    // 添加匹配前的文本
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(content.slice(lastIndex, match.index)));
                    }
                    
                    // 创建高亮span
                    const span = document.createElement('span');
                    span.className = 'highlight';
                    span.textContent = match[0];
                    fragment.appendChild(span);
                    matches.push(span);
                    
                    lastIndex = matchRegex.lastIndex;
                }
                
                // 添加剩余的文本
                if (lastIndex < content.length) {
                    fragment.appendChild(document.createTextNode(content.slice(lastIndex)));
                }
                
                // 替换原始节点
                node.parentNode.replaceChild(fragment, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && 
                   !['script', 'style', 'textarea'].includes(node.tagName.toLowerCase())) {
            // 递归处理子节点
            Array.from(node.childNodes).forEach(searchInNode);
        }
    }

    // 从 body 开始搜索
    searchInNode(document.body);

    // 更新搜索框的匹配信息
    updateSearchInfo();

    // 如果有匹配项，跳转到第一个
    if (matches.length > 0) {
        currentMatchIndex = 0;
        highlightCurrentMatch();
    } else {
        alert("没有找到匹配的内容");
    }
}

// 跳转到下一个匹配项
function jumpToNextMatch() {
    if (matches.length > 0) {
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        highlightCurrentMatch();
    }
}

// 跳转到上一个匹配项
function jumpToPreviousMatch() {
    if (matches.length > 0) {
        currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
        highlightCurrentMatch();
    }
}

// 高亮当前匹配项
function highlightCurrentMatch() {
    matches.forEach((match, index) => {
        if (index === currentMatchIndex) {
            match.scrollIntoView({ behavior: 'smooth', block: 'center' });
            match.style.backgroundColor = 'red'; // 高亮显示当前匹配项
        } else {
            match.style.backgroundColor = ''; // 移除其他项的高亮
        }
    });
    // 更新搜索框的匹配信息
    updateSearchInfo();
}

// 清除所有高亮
function clearAllHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize(); // 合并相邻的文本节点
    });
    matches = [];
    currentMatchIndex = -1;
}

// 退出搜索，移除高亮
function exitSearch() {
    searchQuery = '';
    searchMode = false;
    clearAllHighlights();
    hideSearchInfo(); // 隐藏搜索框
    
    // 移除所有搜索按钮的焦点
    const searchButtons = [
        document.getElementById("search-match-btn"),
        document.getElementById("search-match-up"),
        document.getElementById("search-match-down")
    ];
    
    searchButtons.forEach(button => {
        if (button) {
            button.blur(); // 移除按钮焦点
        }
    });
}



// 更新搜索框显示的信息
function updateSearchInfo() {
    const searchInfo = document.getElementById('searchInfo');
    const currentMatchText = (currentMatchIndex + 1); // 当前光标位置是从 1 开始
    const totalMatches = matches.length;
    searchInfo.innerHTML = `匹配到 <span>${totalMatches}</span> 个内容，当前光标在第 <span>${currentMatchText}</span> 个位置`;
}

// 显示搜索框
function showSearchInfo() {
    document.getElementById('searchInfo').style.display = 'block';
}

// 隐藏搜索框
function hideSearchInfo() {
    document.getElementById('searchInfo').style.display = 'none';
}

let lastGKeyTime = 0;
const doubleKeyTimeout = 300; // 300毫秒内按两次g键才触发

// 处理g键的按压
function handleGKey(event) {
    const currentTime = new Date().getTime();
    if (currentTime - lastGKeyTime <= doubleKeyTimeout) {
        // 双击g，跳转到顶部
        scrollToTop();
        lastGKeyTime = 0; // 重置时间
    } else {
        lastGKeyTime = currentTime;
    }
}

// 滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 滚动到底部
function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

// 页面滚动
function scrollPage(direction) {
    const scrollDistance = window.innerHeight * 0.8; // 滚动页面高度的80%
    const currentScroll = window.pageYOffset;
    
    window.scrollTo({
        top: direction === 'down' 
            ? currentScroll + scrollDistance 
            : currentScroll - scrollDistance,
        behavior: 'smooth'
    });
}

// 修改按钮监听部分
function initSearchButtons() {
    // 搜索按钮
    const searchBtn = document.getElementById("search-match-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", function() {
            searchMode = true;
            promptForSearch();
        });
    }

    // 向上搜索按钮
    const searchUpBtn = document.getElementById("search-match-up");
    if (searchUpBtn) {
        searchUpBtn.addEventListener("click", function() {
            if (searchMode && matches.length > 0) {
                jumpToPreviousMatch();
            }
        });
    }

    // 向下搜索按钮
    const searchDownBtn = document.getElementById("search-match-down");
    if (searchDownBtn) {
        searchDownBtn.addEventListener("click", function() {
            if (searchMode && matches.length > 0) {
                jumpToNextMatch();
            }
        });
    }
}

// 在页面加载完成后初始化按钮
document.addEventListener('DOMContentLoaded', initSearchButtons);
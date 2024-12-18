let searchQuery = ''; // 当前的搜索词
let matches = []; // 存储匹配项的DOM元素
let currentMatchIndex = -1; // 当前匹配项的索引

// 监听键盘事件
document.addEventListener('keydown', function(event) {
    if (event.key === '/') {
        event.preventDefault(); // 阻止默认行为
        promptForSearch();
    } else if (event.key === 'n') {
        jumpToNextMatch();
    } else if (event.key === 'N') {
        jumpToPreviousMatch();
    } else if (event.key === 'Escape') {
        exitSearch();
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
    const textNodes = getTextNodesInDocument();
    matches = [];
    const matchRegex = new RegExp(searchQuery, 'gi'); // 添加 'i' 以实现不区分大小写的匹配
    textNodes.forEach(node => {
        let match;
        while ((match = matchRegex.exec(node.textContent)) !== null) {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            const span = document.createElement('span');
            span.className = 'highlight';
            range.surroundContents(span);
            matches.push(span);
        }
    });
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

// 获取页面中所有的文本节点
function getTextNodesInDocument() {
    const textNodes = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walk.nextNode())) {
        textNodes.push(node);
    }
    return textNodes;
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
        // 移除所有高亮 span 标签
        const highlightedElements = document.querySelectorAll('.highlight');
        highlightedElements.forEach(element => {
            element.replaceWith(...element.childNodes); // 替换 span 标签为其子节点
        });
    matches = [];
    currentMatchIndex = -1; // 重置匹配项索引
}

// 退出搜索，移除高亮
function exitSearch() {
    searchQuery = '';
    clearAllHighlights();
    hideSearchInfo(); // 隐藏搜索框
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
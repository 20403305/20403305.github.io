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
}

// 清除所有高亮
function clearAllHighlights() {
    matches.forEach(match => {
        match.classList.remove('highlight');
        match.style.backgroundColor = ''; // 清除背景颜色
    });
    matches = [];
    currentMatchIndex = -1; // 重置匹配项索引
}

// 退出搜索，移除高亮
function exitSearch() {
    searchQuery = '';
    clearAllHighlights();
}
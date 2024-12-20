// 将数字转换为带中文单位的字符串
function formatNumberWithChineseUnit(num) {
    // 定义单位和对应的阈值
    const units = [
        { value: 100000000, unit: '亿' },
        { value: 10000000, unit: '千万' },
        { value: 1000000, unit: '百万' },
        { value: 100000, unit: '十万' },
        { value: 10000, unit: '万' },
        { value: 1000, unit: '千' }
    ];

    // 如果数字小于1000，直接返回
    if (num < 1000) {
        return num.toString();
    }

    // 找到适合的单位
    for (const { value, unit } of units) {
        if (num >= value) {
            const scaled = num / value;
            // 如果结果是整数，直接返回
            if (Number.isInteger(scaled)) {
                return scaled.toString() + unit;
            }
            // 否则保留一位小数
            return scaled.toFixed(1).replace('.0', '') + unit;
        }
    }

    return num.toString();
}

// 更新显示的访问量
function updateCounter() {
    const pvElement = document.getElementById('busuanzi_value_site_pv');
    const uvElement = document.getElementById('busuanzi_value_site_uv');
    
    if (pvElement && pvElement.textContent) {
        const pv = parseInt(pvElement.textContent.replace(/[^0-9]/g, ''));
        if (!isNaN(pv)) {
            const formattedPV = formatNumberWithChineseUnit(pv);
            pvElement.textContent = formattedPV;
            console.log('PV原始值:', pv, '格式化后:', formattedPV);
        }
    }
    
    if (uvElement && uvElement.textContent) {
        const uv = parseInt(uvElement.textContent.replace(/[^0-9]/g, ''));
        if (!isNaN(uv)) {
            const formattedUV = formatNumberWithChineseUnit(uv);
            uvElement.textContent = formattedUV;
            console.log('UV原始值:', uv, '格式化后:', formattedUV);
        }
    }
}

// 监听DOM变化
function observeCounter() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const target = mutation.target;
            if (target.id === 'busuanzi_value_site_pv' || target.id === 'busuanzi_value_site_uv') {
                console.log('检测到计数器更新:', target.id, target.textContent);
                updateCounter();
                break;
            }
        }
    });

    const pvElement = document.getElementById('busuanzi_value_site_pv');
    const uvElement = document.getElementById('busuanzi_value_site_uv');

    if (pvElement) {
        observer.observe(pvElement, { 
            childList: true, 
            characterData: true, 
            subtree: true 
        });
    }
    if (uvElement) {
        observer.observe(uvElement, { 
            childList: true, 
            characterData: true, 
            subtree: true 
        });
    }
}

// 初始化函数
function initializeCounter() {
    console.log('初始化计数器...');
    
    // 等待不蒜子脚本加载完成
    const waitForBusuanzi = setInterval(() => {
        const pvElement = document.getElementById('busuanzi_value_site_pv');
        const uvElement = document.getElementById('busuanzi_value_site_uv');
        
        if (pvElement && pvElement.textContent || uvElement && uvElement.textContent) {
            clearInterval(waitForBusuanzi);
            updateCounter();
            observeCounter();
        }
    }, 500);

    // 设置超时，防止无限等待
    setTimeout(() => {
        clearInterval(waitForBusuanzi);
    }, 10000);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCounter);
} else {
    initializeCounter();
} 
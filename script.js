// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化功能
    animateRatingBars();
    addCardHoverEffects();
    initializeTooltips();
    setResponsiveHeight();
    initializeRatingEffects();
    animateTagElements();
    
    // 移除价格相关功能初始化
    // initializeBinancePrice();
    // initializeShutdownPriceUpdates();
    
    // 移除刮奖效果相关代码
    
    // 窗口大小改变时调整高度
    window.addEventListener('resize', function() {
        setResponsiveHeight();
    });

    // 获取所有社交媒体图标和教程链接
    const socialIcons = document.querySelectorAll('.social-icon');
    const tutorialLinks = document.querySelectorAll('.hidden.md\\:flex a');
    const allClickableElements = [...socialIcons, ...tutorialLinks];
    
    // 获取消息提示元素
    const followMessage = document.getElementById('followMessage');
    
    // 掉落TRUMP效果脚本
    // 当点击元素时，生成掉落的TRUMP图标
    allClickableElements.forEach(element => {
        element.addEventListener('click', function(event) {
            // 创建掉落Trump图标 (仅为动画效果，不阻止正常点击行为)
            createFallingTrump(event, this);
            
            // 如果有消息提示元素，则显示
            if (followMessage) {
                followMessage.classList.add('show');
                
                // 3秒后隐藏
                setTimeout(() => {
                    followMessage.classList.remove('show');
                }, 3000);
            }
        });
    });
});

// 为标签元素添加动画效果
function animateTagElements() {
    const tagElements = document.querySelectorAll('.tag-animate');
    
    // 设置初始状态
    tagElements.forEach((tag, index) => {
        // 给每个标签一个随机的初始透明度，使其看起来更自然
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(15px)';
        
        // 延迟显示，形成波浪进入的效果
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
            
            // 添加点击效果
            tag.addEventListener('click', function() {
                // 创建波纹效果
                const ripple = document.createElement('span');
                ripple.className = 'tag-ripple';
                ripple.style.position = 'absolute';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                ripple.style.animation = 'tagRipple 0.6s linear';
                
                // 获取点击位置
                const rect = this.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                // 确保标签是相对定位以便放置波纹
                if (this.style.position !== 'relative') {
                    this.style.position = 'relative';
                }
                this.style.overflow = 'hidden';
                
                this.appendChild(ripple);
                
                // 动画结束后移除波纹元素
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // 添加缩放效果
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            });
        }, 100 * (index + 1));
    });
    
    // 添加波纹动画样式
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes tagRipple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 动画评级条
function animateRatingBars() {
    // 获取所有评级条
    const ratingBars = document.querySelectorAll('.rating-bar');
    
    // 为每个评级条添加发光元素
    ratingBars.forEach(bar => {
        const glow = document.createElement('div');
        glow.className = 'rating-glow';
        bar.appendChild(glow);
        
        // 设置初始位置在左侧
        glow.style.left = '0px';
        
        // 添加动画，使发光效果从左到右移动
        animateGlow(glow, bar);
    });
}

// 发光效果动画
function animateGlow(glow, bar) {
    // 计算评级条宽度
    const barWidth = bar.offsetWidth;
    
    // 设置动画持续时间与评级条宽度成正比
    const duration = barWidth * 20; // 假设每像素20ms
    
    // 使用requestAnimationFrame添加动画
    let start = null;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        // 计算当前位置
        const position = (progress / duration) * barWidth;
        
        // 如果动画未完成，继续移动
        if (position <= barWidth) {
            glow.style.left = position + 'px';
            requestAnimationFrame(step);
        } else {
            // 动画完成后，重置位置并再次开始
            glow.style.left = '0px';
            start = null;
            setTimeout(() => requestAnimationFrame(step), 1000); // 延迟1秒再次开始
        }
    }
    
    // 开始动画
    requestAnimationFrame(step);
}

// 添加卡片悬停效果
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.crypto-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        });
    });
}

// 初始化工具提示
function initializeTooltips() {
    const tooltipTargets = document.querySelectorAll('[data-tooltip]');
    
    tooltipTargets.forEach(element => {
        // 悬停时显示提示
        element.addEventListener('mouseenter', function() {
            // 获取提示文本
            const tooltipText = this.getAttribute('data-tooltip');
            
            // 创建提示元素
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            // 设置样式
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#1e293b';
            tooltip.style.color = 'white';
            tooltip.style.padding = '4px 8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.7rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s';
            
            // 添加到页面
            document.body.appendChild(tooltip);
            
            // 计算位置
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            // 显示提示
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            // 存储提示元素引用
            this._tooltip = tooltip;
        });
        
        // 鼠标离开时移除提示
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                const tooltip = this._tooltip;
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
                this._tooltip = null;
            }
        });
    });
}

// 设置响应式高度
function setResponsiveHeight() {
    // 获取视窗高度
    const vh = window.innerHeight;
    
    // 对某些需要填充高度的元素设置高度
    // 例如：让主内容区域至少占据视窗高度的80%
    const main = document.querySelector('main');
    if (main) {
        main.style.minHeight = `${vh * 0.8}px`;
    }
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// 为标签添加交互效果
const categoryTags = document.querySelectorAll('.rounded-full');
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // 可以在这里添加标签点击的功能，例如筛选等
        tag.classList.add('ring-2', 'ring-offset-1');
        setTimeout(() => {
            tag.classList.remove('ring-2', 'ring-offset-1');
        }, 300);
    });
});

// 设置评级效果
function initializeRatingEffects() {
    // 获取所有评级项
    const ratingItems = document.querySelectorAll('.rating-item');
    
    // 为每个评级项添加悬停效果
    ratingItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.color = '#10b981';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = '';
        });
    });
}

// 创建掉落的TRUMP元素
function createFallingTrump(event, clickedElement) {
    // 创建掉落元素
    const fallingElement = document.createElement('div');
    fallingElement.className = 'falling-crypto';
    
    // 设置TRUMP相关内容 (美元符号、国旗、TRUMP文字等)
    const trumpElements = [
        '💰', // 钱袋
        '🇺🇸', // 美国国旗
        '$', // 美元符号
        '🏛️', // 政府建筑
        '🦅', // 白头鹰
        '🗽', // 自由女神像
        '🔔', // 自由钟
        '📈', // 上涨图表
        '💼' // 公文包
    ];
    
    // 随机选择一个TRUMP元素
    const randomIndex = Math.floor(Math.random() * trumpElements.length);
    
    // 设置内容和样式
    fallingElement.textContent = trumpElements[randomIndex];
    fallingElement.style.position = 'fixed';
    fallingElement.style.fontSize = '24px';
    fallingElement.style.top = '0';
    fallingElement.style.left = event.clientX + 'px';
    fallingElement.style.zIndex = '1000';
    fallingElement.style.pointerEvents = 'none';
    fallingElement.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
    
    // 添加到body
    document.body.appendChild(fallingElement);
    
    // 设置随机掉落动画参数
    const animationDuration = Math.random() * 3 + 2; // 2-5秒
    const horizontalMovement = Math.random() * 100 - 50; // -50px 到 50px 的水平移动
    
    // 设置CSS动画
    fallingElement.style.animation = `fallDown ${animationDuration}s ease-in, sway ${animationDuration / 3}s ease-in-out infinite alternate`;
    
    // 添加旋转效果
    fallingElement.style.transform = 'rotate(0deg)';
    fallingElement.style.transition = `transform ${animationDuration}s linear`;
    setTimeout(() => {
        fallingElement.style.transform = `rotate(${360 + Math.random() * 360}deg)`;
    }, 50);
    
    // 添加颜色变化效果
    if (randomIndex === 2) { // 只对美元符号应用颜色变化
        fallingElement.style.color = '#00BB00'; // 美元绿色
        fallingElement.style.fontWeight = 'bold';
        fallingElement.style.fontSize = '32px';
    }
    
    // 动画结束后移除元素
    setTimeout(() => {
        fallingElement.remove();
    }, animationDuration * 1000);
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动
    smoothScroll();
    
    // 技能图表
    initSkillChart();
    
    // 表单提交
    handleFormSubmit();
    
    // 清空留言
    setupClearMessages();
    
    // 显示留言
    displayMessages();
});

// 初始化清空留言按钮
function setupClearMessages() {
    const clearButton = document.getElementById('clearMessages');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (confirm('确定要清空所有留言吗？')) {
                // 从localStorage中删除messages数据
                localStorage.removeItem('messages');
                console.log('留言已清空');
                // 更新留言板
                displayMessages();
            }
        });
    }
}

// 平滑滚动功能
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化技能图表
function initSkillChart() {
    const ctx = document.getElementById('skillChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['平面与色彩基本知识', '素描与色彩基本知识', '软件的运用', '创意思维', '设计理论', 'VI/UI设计'],
            datasets: [{
                label: '技能水平',
                data: [90, 85, 95, 90, 95, 85],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 处理表单提交
function handleFormSubmit() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            const date = new Date().toLocaleString();
            
            console.log('获取到的表单数据:', { name, email, message });
            
            // 创建留言对象
            const newMessage = {
                id: Date.now(),
                name: name,
                email: email,
                message: message,
                date: date
            };
            
            console.log('创建的留言对象:', newMessage);
            
            // 从localStorage获取现有留言
            let messages = JSON.parse(localStorage.getItem('messages') || '[]');
            
            // 添加新留言
            messages.unshift(newMessage);
            
            // 保存到localStorage
            localStorage.setItem('messages', JSON.stringify(messages));
            
            // 发送邮件
            console.log('准备发送邮件...');
            emailjs.send('service_stcssdv', 'template_ho0y6ns', {
                from_name: name,
                from_email: email,
                message: message,
                send_date: date
            }).then(function(response) {
                console.log('邮件发送成功:', response);
                alert('留言已发送，感谢您的联系！邮件已发送到您的邮箱。');
            }, function(error) {
                console.log('邮件发送失败:', error);
                alert('留言已保存到留言板，但邮件发送失败，请检查EmailJS配置。');
            });
            
            // 重置表单
            form.reset();
            
            // 更新留言板
            displayMessages();
        });
    }
}

// 显示留言
function displayMessages() {
    const messageList = document.getElementById('messageList');
    if (!messageList) {
        console.log('messageList元素不存在');
        return;
    }
    
    // 从localStorage获取留言
    let messages;
    try {
        const storedMessages = localStorage.getItem('messages');
        console.log('localStorage中的messages:', storedMessages);
        messages = JSON.parse(storedMessages || '[]');
        // 确保messages是数组
        if (!Array.isArray(messages)) {
            console.log('messages不是数组，重置为空数组');
            messages = [];
        }
    } catch (e) {
        console.log('JSON解析错误:', e);
        // 如果解析出错，使用空数组
        messages = [];
    }
    
    console.log('处理后的messages:', messages);
    
    if (messages.length === 0) {
        messageList.innerHTML = '<p>暂无留言</p>';
        console.log('留言数组为空，显示"暂无留言"');
        return;
    }
    
    // 生成留言HTML
    const messagesHTML = messages.map(message => `
        <div class="message-item">
            <h4>${message.name || ''}</h4>
            <p>${message.message || ''}</p>
            <small>${message.date || ''} | ${message.email || ''}</small>
        </div>
    `).join('');
    
    console.log('生成的HTML:', messagesHTML);
    messageList.innerHTML = messagesHTML;
    console.log('留言板更新完成');
}

// 滚动动画
window.addEventListener('scroll', function() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom >= 0) {
            // 检查是否已经执行过动画
            if (!bar.dataset.animated) {
                // 获取原始宽度（从HTML的style属性中）
                const originalWidth = bar.style.width;
                if (originalWidth) {
                    bar.style.width = '0';
                    
                    setTimeout(() => {
                        bar.style.width = originalWidth;
                    }, 100);
                    
                    // 标记为已执行动画
                    bar.dataset.animated = 'true';
                }
            }
        }
    });
});
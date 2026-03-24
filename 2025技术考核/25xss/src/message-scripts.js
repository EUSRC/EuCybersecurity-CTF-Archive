document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.message-content');
    messages.forEach(message => {
        const scripts = message.querySelectorAll('script');
        scripts.forEach(script => {
            try {
                const originalAlert = window.alert;
                window.alert = async function(alertContent) {
                    // 新增：如果alert参数含cat/flag，不弹真实Flag
                    const hasForbiddenWord = /cat\s+\/?flag/i.test(alertContent);
                    if (hasForbiddenWord) {
                        originalAlert('非法请求！');
                        return;
                    }
                    
                    // 从额外的PHP文件获取flag
                    try {
                        const response = await fetch('get-flag.php');
                        const flag = await response.text();
                        originalAlert(flag);
                    } catch(error) {
                        console.error('获取flag失败:', error);
                        originalAlert('获取flag失败');
                    }
                };
                
                // 执行脚本（此时脚本内的cat/flag已被替换）
                eval(script.innerHTML);
                
                window.alert = originalAlert;
            } catch(e) {
                console.error('脚本执行错误:', e);
            }
        });
    });
    
    const messageElements = document.querySelectorAll('.message');
    messageElements.forEach((message, index) => {
        message.style.animationDelay = `${index * 0.1}s`;
    });
});
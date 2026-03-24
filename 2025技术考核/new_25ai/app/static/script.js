// 聊天界面功能
document.addEventListener('DOMContentLoaded', function () {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');

    // 自动滚动到底部
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 初始滚动到底部
    scrollToBottom();

    // 表单提交处理
    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (!message) return;

        // 添加用户消息到界面
        addMessage(message, 'user');

        // 清空输入框
        messageInput.value = '';

        // 发送请求到服务器
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'message=' + encodeURIComponent(message) + '&ajax=1'
        })
            .then(response => response.json())
            .then(data => {
                // 添加AI回复到界面
                addMessage(data.response, 'ai');
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('抱歉，出现了错误，请稍后重试。', 'ai');
            });
    });

    // 添加消息到聊天界面
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = sender === 'user' ? '👤' : '🤖';

        const messageContentDiv = document.createElement('div');
        messageContentDiv.className = 'message-content';

        const messageTextDiv = document.createElement('div');
        messageTextDiv.className = 'message-text';
        messageTextDiv.textContent = text;

        const messageTimeDiv = document.createElement('div');
        messageTimeDiv.className = 'message-time';
        messageTimeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageContentDiv.appendChild(messageTextDiv);
        messageContentDiv.appendChild(messageTimeDiv);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(messageContentDiv);

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // 输入框回车键发送
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // 聚焦输入框
    messageInput.focus();
});

// 清空对话
function clearConversation() {
    if (confirm('确定要清空所有对话吗？')) {
        window.location.href = '?clear=1';
    }
}
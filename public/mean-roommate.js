(function() {
    window.addEventListener('load', function() {
        console.log('页面加载完成，初始化Mean室友聊天功能');
        
        const chatContainer = document.getElementById('gemini-chat-container');
        const userInput = document.getElementById('gemini-user-input');
        const sendBtn = document.getElementById('gemini-send-btn');
        
        if (!chatContainer || !userInput || !sendBtn) {
            console.error('聊天功能初始化失败：无法找到必要的DOM元素');
            return;
        }
        
        console.log('聊天元素找到，设置事件监听器');
        
        // Mean室友初始消息 - 更有个性和多样性
        const initialResponses = [
            "又是你啊？有事说事，别耽误我时间。",
            "嗯？什么事？我很忙的。",
            "（抬头看你一眼，又低头玩手机）",
            "哦，是你啊，有话快说。",
            "怎么又是你？说吧，又有什么事？"
        ];
        
        const initialMessage = initialResponses[Math.floor(Math.random() * initialResponses.length)];
        
        // 确保初始消息显示在聊天容器中
        if (chatContainer.children.length === 0) {
            const initialMessageDiv = document.createElement('div');
            initialMessageDiv.className = 'message bot-message';
            initialMessageDiv.textContent = initialMessage;
            chatContainer.appendChild(initialMessageDiv);
        }
        
        let chatHistory = [
            {
                role: "model",
                content: initialMessage
            }
        ];
        
        // 发送消息函数
        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;
            
            // 清空输入框
            userInput.value = '';
            
            // 添加用户消息到聊天区域
            appendMessage(message, 'user');
            
            // 添加到历史
            chatHistory.push({
                role: "user",
                content: message
            });
            
            // 显示加载状态
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message bot-message';
            loadingDiv.innerHTML = '<div class="loading"></div>';
            chatContainer.appendChild(loadingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            try {
                console.log('发送API请求到/api/chat');
                // 使用正确的API端点
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        history: chatHistory
                    })
                });
                
                // 移除加载状态
                chatContainer.removeChild(loadingDiv);
                
                if (!response.ok) {
                    throw new Error('API请求失败: ' + response.status);
                }
                
                const data = await response.json();
                console.log('收到API响应:', data);
                
                // 添加回复到聊天区域
                appendMessage(data.response, 'bot');
                
                // 添加到历史
                chatHistory.push({
                    role: "model",
                    content: data.response
                });
                
            } catch (error) {
                console.error('聊天错误:', error);
                
                // 移除加载状态(如果还存在)
                if (chatContainer.contains(loadingDiv)) {
                    chatContainer.removeChild(loadingDiv);
                }
                
                // 显示错误消息
                appendMessage("随便吧，懒得理你。", 'bot');
                
                // 添加到历史
                chatHistory.push({
                    role: "model",
                    content: "随便吧，懒得理你。"
                });
            }
        }
        
        // 添加消息到聊天界面
        function appendMessage(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = message;
            chatContainer.appendChild(messageDiv);
            
            // 滚动到底部
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // 确保事件监听器正确绑定
        sendBtn.addEventListener('click', sendMessage);
        
        // 输入框回车事件
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        console.log('Mean室友聊天功能初始化完成');
    });
})();

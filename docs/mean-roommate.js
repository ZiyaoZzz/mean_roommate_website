(function() {
    window.addEventListener('load', function() {
        console.log('初始化Mean室友聊天功能');
        
        const chatContainer = document.getElementById('gemini-chat-container');
        const userInput = document.getElementById('gemini-user-input');
        const sendBtn = document.getElementById('gemini-send-btn');
        
        if (!chatContainer || !userInput || !sendBtn) {
            console.error('聊天元素未找到');
            return;
        }
        
        // Mean室友初始消息
        const initialResponses = [
            "又是你啊？有事说事，别耽误我时间。",
            "嗯？什么事？我很忙的。",
            "（抬头看你一眼，又低头玩手机）",
            "哦，是你啊，有话快说。"
        ];
        
        // 聊天历史
        let chatHistory = [];
        
        // 显示初始消息
        if (chatContainer.children.length === 0) {
            const initialMessage = initialResponses[Math.floor(Math.random() * initialResponses.length)];
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message-container bot-container';
            
            // 添加室友头像
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            const avatarImg = document.createElement('img');
            avatarImg.src = '../img/mean_avatar.jpeg';
            avatarImg.alt = '室友头像';
            avatarDiv.appendChild(avatarImg);
            
            // 添加消息气泡
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message bot-message';
            bubbleDiv.textContent = initialMessage;
            
            // 组装
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(bubbleDiv);
            
            chatContainer.appendChild(messageDiv);
            
            // 添加到历史
            chatHistory.push({
                role: "model",
                content: initialMessage
            });
        }
        
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
            loadingDiv.className = 'message-container bot-container';
            
            // 添加室友头像（加载状态也添加头像）
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            const avatarImg = document.createElement('img');
            avatarImg.src = '../img/mean_avatar.jpeg';
            avatarImg.alt = '室友头像';
            avatarDiv.appendChild(avatarImg);
            
            // 添加加载气泡
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'message bot-message';
            bubbleDiv.innerHTML = '<div class="loading"></div>';
            
            // 组装
            loadingDiv.appendChild(avatarDiv);
            loadingDiv.appendChild(bubbleDiv);
            
            chatContainer.appendChild(loadingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            try {
                // 随机决定是否冷暴力不回复 (15%概率)
                if (Math.random() < 0.15) {
                    // 移除加载状态
                    chatContainer.removeChild(loadingDiv);
                    
                    // 显示冷暴力回复
                    const coldResponse = "(无视你，继续刷手机)";
                    appendMessage(coldResponse, 'bot');
                    
                    // 添加到历史
                    chatHistory.push({
                        role: "model",
                        content: coldResponse
                    });
                    
                    return;
                }
                
                // 调用后端API
                console.log('发送API请求到:', '/api/chat');
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ history: chatHistory })
                });
                
                // 移除加载状态
                chatContainer.removeChild(loadingDiv);
                
                if (!response.ok) {
                    throw new Error('API请求失败: ' + response.status);
                }
                
                const data = await response.json();
                console.log('收到API响应:', data);
                
                // 显示回复
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
                
                // Mean室友备用回复
                const meanResponses = [
                    "管好你自己的事吧，我现在没心情聊天。",
                    "又来烦我？我很忙的，知道吗？",
                    "我不想谈这个，你能不能自己解决一次？",
                    "你总是这样，有完没完啊？",
                    "随便吧，反正你说了算。"
                ];
                
                const fallbackResponse = meanResponses[Math.floor(Math.random() * meanResponses.length)];
                
                // 显示备用回复
                appendMessage(fallbackResponse, 'bot');
                
                // 添加到历史
                chatHistory.push({
                    role: "model",
                    content: fallbackResponse
                });
            }
        }
        
        // 添加消息到聊天界面 - 确保每个消息都有头像
        function appendMessage(message, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message-container ${sender}-container`;
            
            // 创建头像元素
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            const avatarImg = document.createElement('img');
            
            // 设置不同的头像
            if (sender === 'user') {
                avatarImg.src = '../img/me_avatar.jpeg';
                avatarImg.alt = '用户头像';
            } else {
                avatarImg.src = '../img/mean_avatar.jpeg';
                avatarImg.alt = '室友头像';
            }
            
            avatarDiv.appendChild(avatarImg);
            
            // 创建消息气泡
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = `message ${sender}-message`;
            bubbleDiv.textContent = message;
            
            // 添加到容器 - 用户消息在右侧，机器人消息在左侧
            if (sender === 'user') {
                messageDiv.appendChild(bubbleDiv);
                messageDiv.appendChild(avatarDiv);
            } else {
                messageDiv.appendChild(avatarDiv);
                messageDiv.appendChild(bubbleDiv);
            }
            
            chatContainer.appendChild(messageDiv);
            
            // 滚动到底部
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        // 绑定事件
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        console.log('Mean室友聊天功能初始化完成');
    });
})();

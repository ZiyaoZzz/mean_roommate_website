(function() {
    // 配置后端API地址
    const API_URL = 'https://你的应用名称.onrender.com/api/chat';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('初始化Mean室友聊天功能 - GitHub Pages版本');
        
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
            "（抬头看你一眼，又低头玩手机）"
        ];
        
        // 随机选择一个初始消息
        const initialMessage = initialResponses[Math.floor(Math.random() * initialResponses.length)];
        
        // 显示初始消息
        if (chatContainer.children.length === 0) {
            const initialMessageDiv = document.createElement('div');
            initialMessageDiv.className = 'message bot-message';
            initialMessageDiv.textContent = initialMessage;
            chatContainer.appendChild(initialMessageDiv);
        }
        
        // 聊天历史
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
            
            // 显示用户消息
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'message user-message';
            userMessageDiv.textContent = message;
            chatContainer.appendChild(userMessageDiv);
            
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
                // 随机决定是否冷暴力不回复 (15%概率)
                if (Math.random() < 0.15) {
                    // 移除加载状态
                    chatContainer.removeChild(loadingDiv);
                    
                    // 显示冷暴力回复
                    const coldResponse = "(无视你，继续刷手机)";
                    const responseDiv = document.createElement('div');
                    responseDiv.className = 'message bot-message';
                    responseDiv.textContent = coldResponse;
                    chatContainer.appendChild(responseDiv);
                    
                    // 添加到历史
                    chatHistory.push({
                        role: "model",
                        content: coldResponse
                    });
                    
                    return;
                }
                
                // 调用后端API
                console.log('发送API请求到:', API_URL);
                const response = await fetch(API_URL, {
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
                const responseDiv = document.createElement('div');
                responseDiv.className = 'message bot-message';
                responseDiv.textContent = data.response;
                chatContainer.appendChild(responseDiv);
                
                // 添加到历史
                chatHistory.push({
                    role: "model",
                    content: data.response
                });
                
                // 滚动到底部
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
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
                    "我不想谈这个，你能不能自己解决一次？"
                ];
                
                const fallbackResponse = meanResponses[Math.floor(Math.random() * meanResponses.length)];
                
                // 显示备用回复
                const responseDiv = document.createElement('div');
                responseDiv.className = 'message bot-message';
                responseDiv.textContent = fallbackResponse;
                chatContainer.appendChild(responseDiv);
                
                // 添加到历史
                chatHistory.push({
                    role: "model",
                    content: fallbackResponse
                });
            }
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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roommateForm');
    const resultDiv = document.getElementById('result');
    const scoreValue = document.getElementById('score-value');
    const scoreTitle = document.getElementById('score-title');
    const comment = document.getElementById('comment');
    const avatar = document.getElementById('avatar');
    const resetBtn = document.getElementById('reset-btn');
    const shareBtn = document.getElementById('share-btn');
    
    // AI 室友发言模拟器元素
    const generateSpeechBtn = document.getElementById('generate-speech');
    const speechBubble = document.getElementById('speech-bubble');
    const speechContent = document.getElementById('speech-content');
    const toneRadios = document.getElementsByName('tone');
    
    // 吐槽内容库
    const comments = [
        "你洗发水是不是又少了？",
        "这碗你上周就说要洗！",
        "室友：我明天一定早起（x）",
        "他说冰箱里的东西不是他吃的...",
        "别问他干嘛去了，问就是学习",
        "为什么你的充电器总是消失？",
        "别相信他说的任何时间承诺",
        "垃圾桶：我不用倒，会自己消失的",
        "那个不是我弄脏的，一定是你自己",
        "我5分钟后就回来（实际：3小时）"
    ];
    
    // 室友发言库 - 按不同语气分类（作为备用）
    const roommateSpeeches = {
        // 冷暴力语气
        passive: [
            "关我什么事，又不是我弄的。",
            "哦，那你想怎么样？",
            "我没空，你自己弄吧。",
            "我不记得有这回事。",
            "你总是这样小题大做。"
        ],
        
        // 可怜兮兮语气
        pitiful: [
            "我最近真的很累，你就不能体谅一下吗？",
            "我已经尽力了，你为什么总是那么苛刻...",
            "对不起，我忘记了，我最近压力很大...",
            "我好像生病了，没什么精力做家务...",
            "我上次不是已经帮你做了很多事吗？"
        ],
        
        // 强词夺理语气
        sophistry: [
            "我没吃你的东西啊，你自己记错了吧。",
            "打游戏怎么了？你不也玩手机？",
            "洗碗是轮到我？我记得上周你说帮我洗的。",
            "我用了你的东西怎么了？你不也经常用我的？",
            "你说的是今天？我以为你说的是明天啊。"
        ]
    };
    
    // 头像库
    const avatars = {
        high: "https://i.imgur.com/7EVsJ3T.jpg", // 装到极致
        medium: "https://i.imgur.com/L5mGACX.jpg", // 有点不对劲
        low: "https://i.imgur.com/AqEOFQQ.jpg" // 暂时安全
    };
    
    // 确保在使用前先定义
    let chatHistory = [];
    
    // 生成漂浮吐槽
    function spawnComment() {
        const commentsContainer = document.getElementById('comments-container');
        const comment = document.createElement("div");
        comment.innerText = comments[Math.floor(Math.random() * comments.length)];
        comment.className = "floating-comment";
        
        // 随机位置
        comment.style.left = `${10 + Math.random() * 70}%`;
        comment.style.top = `${10 + Math.random() * 80}%`;
        
        commentsContainer.appendChild(comment);
        
        // 动画结束后移除
        setTimeout(() => {
            comment.remove();
        }, 8000);
    }
    
    // 每3秒生成一个吐槽
    setInterval(spawnComment, 3000);
    
    // 生成室友发言 - 使用安全的后端API
    generateSpeechBtn.addEventListener('click', async function() {
        // 获取当前选择的语气
        let selectedTone = 'passive'; // 默认冷暴力
        for (let i = 0; i < toneRadios.length; i++) {
            if (toneRadios[i].checked) {
                selectedTone = toneRadios[i].value;
                break;
            }
        }
        
        // 获取上下文
        const context = { issues: [] };
        if (document.getElementById('dishes').checked) context.issues.push("不洗碗");
        if (document.getElementById('shampoo').checked) context.issues.push("用了室友的洗发水");
        if (document.getElementById('noise').checked) context.issues.push("半夜吵闹");
        if (document.getElementById('trash').checked) context.issues.push("不倒垃圾");
        if (document.getElementById('food').checked) context.issues.push("偷吃零食");
        
        // 显示加载状态
        speechContent.textContent = "正在思考回应...";
        speechBubble.classList.remove('hidden');
        
        try {
            // 调用后端API
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tone: selectedTone, context }),
            });
            
            if (!response.ok) {
                throw new Error('API请求失败');
            }
            
            const data = await response.json();
            speechContent.textContent = data.response;
            
        } catch (error) {
            console.error("AI生成失败，使用预设回应", error);
            
            // 回退到预设回应
            const speeches = roommateSpeeches[selectedTone];
            const randomIndex = Math.floor(Math.random() * speeches.length);
            speechContent.textContent = speeches[randomIndex];
        }
        
        // 添加动画效果
        speechBubble.style.animation = 'none';
        void speechBubble.offsetWidth; // 触发重排
        speechBubble.style.animation = 'pop-in 0.5s forwards';
    });
    
    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(form);
        
        // 计算分数
        const score = calculateIndex(formData);
        
        // 显示结果
        displayResults(score);
    });
    
    // 重置按钮
    resetBtn.addEventListener('click', function() {
        form.reset();
        resultDiv.classList.add('hidden');
    });
    
    // 分享按钮
    shareBtn.addEventListener('click', function() {
        alert('分享功能：生成了一个可以分享到社交媒体的链接！（示例功能）');
    });
    
    // 计算"装指数"
    function calculateIndex(formData) {
        let score = 0;
        
        // 基础分数 - 所有人从30分开始
        score = 30;
        
        // 计算各人格类型的得分
        let lazyScore = 0;  // 摸鱼怪
        let liarScore = 0;  // 鬼话大师
        let clownScore = 0; // 社交小丑
        
        // 日常行为
        if (!formData.has('dishes')) {
            score += 15; // 没洗碗
            lazyScore += 20;
            liarScore += 10;
        }
        
        if (formData.has('shampoo')) {
            score += 20; // 用了你的洗发水
            lazyScore += 15;
            liarScore += 20;
        }
        
        if (formData.has('noise')) {
            score += 25; // 半夜吵闹
            lazyScore += 25;
            clownScore += 25;
        }
        
        if (formData.has('trash')) {
            score += 15; // 忘记倒垃圾
            lazyScore += 30;
            liarScore += 15;
        }
        
        if (formData.has('food')) {
            score += 20; // 偷吃零食
            lazyScore += 35;
            liarScore += 15;
        }
        
        // 作息时间
        const wakeTime = formData.get('wake_time');
        if (wakeTime) {
            const wakeHour = parseInt(wakeTime.split(':')[0]);
            if (wakeHour >= 11) {
                score += 20; // 起床晚
                lazyScore += 30;
            }
            else if (wakeHour <= 6) {
                score -= 10; // 起得早，减分
                lazyScore -= 20;
            }
        }
        
        const sleepTime = formData.get('sleep_time');
        if (sleepTime) {
            const sleepHour = parseInt(sleepTime.split(':')[0]);
            if (sleepHour < 22 || sleepHour >= 2) {
                score += 15; // 睡太晚或太早
                clownScore += 20;
            }
        }
        
        // 社交方面
        if (formData.has('visitors')) {
            score += 20; // 带陌生人回来
            clownScore += 30;
        }
        
        if (formData.has('noisy_calls')) {
            score += 15; // 大声通话
            clownScore += 35;
            liarScore += 15;
        }
        
        // 保存人格分数到全局变量
        window.personalityScores = {
            lazy: lazyScore,
            liar: liarScore,
            clown: clownScore
        };
        
        // 限制分数范围 0-100
        return Math.max(0, Math.min(100, Math.round(score)));
    }
    
    // 显示结果
    function displayResults(score) {
        scoreValue.textContent = score;
        
        // 根据分数判断等级
        let title, avatarSrc, commentText;
        
        if (score >= 70) {
            title = "百分百在装";
            avatarSrc = avatars.high;
            commentText = "警告：你的室友装指数爆表！建议你今晚锁好门窗，保管好个人物品。";
        } else if (score >= 40) {
            title = "有点不对劲";
            avatarSrc = avatars.medium;
            commentText = "注意：你的室友表面勤快，实则摸鱼。别太相信他的承诺，随时做好被坑的准备。";
        } else {
            title = "暂时安全";
            avatarSrc = avatars.low;
            commentText = "恭喜：你的室友目前表现良好，但别太放心，多观察几天再下结论。";
        }
        
        scoreTitle.textContent = title;
        avatar.src = avatarSrc;
        comment.textContent = commentText;
        
        // 显示人格诊断结果
        displayPersonalityDiagnosis();
        
        // 显示结果区域
        resultDiv.classList.remove('hidden');
        
        // 滚动到结果区域
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 新增函数：显示人格诊断结果
    function displayPersonalityDiagnosis() {
        // 获取各种人格类型的得分
        const scores = window.personalityScores || { lazy: 0, liar: 0, clown: 0 };
        
        // 计算总分，用于计算百分比
        const totalScore = Math.max(1, scores.lazy + scores.liar + scores.clown);
        
        // 计算百分比
        const lazyPercent = Math.round((scores.lazy / totalScore) * 100);
        const liarPercent = Math.round((scores.liar / totalScore) * 100);
        const clownPercent = Math.round((scores.clown / totalScore) * 100);
        
        // 更新进度条和百分比文本
        document.getElementById('lazy-bar').style.width = lazyPercent + '%';
        document.getElementById('liar-bar').style.width = liarPercent + '%';
        document.getElementById('clown-bar').style.width = clownPercent + '%';
        
        document.getElementById('lazy-percent').textContent = lazyPercent + '%';
        document.getElementById('liar-percent').textContent = liarPercent + '%';
        document.getElementById('clown-percent').textContent = clownPercent + '%';
        
        // 确定主要人格类型
        let mainPersonality = 'balanced';
        let maxScore = 0;
        
        if (scores.lazy > maxScore) {
            maxScore = scores.lazy;
            mainPersonality = 'lazy';
        }
        
        if (scores.liar > maxScore) {
            maxScore = scores.liar;
            mainPersonality = 'liar';
        }
        
        if (scores.clown > maxScore) {
            maxScore = scores.clown;
            mainPersonality = 'clown';
        }
        
        // 设置主要人格类型显示
        const mainPersonalityText = document.getElementById('main-personality');
        const personalityDescription = document.getElementById('personality-description');
        const preventionContent = document.getElementById('prevention-content');
        
        // 设置人格类型文本和描述
        switch (mainPersonality) {
            case 'lazy':
                mainPersonalityText.textContent = '🦥 摸鱼怪';
                personalityDescription.innerHTML = '你的室友是典型的"摸鱼怪"。喜欢赖床、偷吃零食、打游戏到深夜。对公共区域的清洁毫不关心，从不主动做家务，经常找借口逃避责任。';
                preventionContent.innerHTML = '<ul>' +
                    '<li><strong>设置明确的家务分配表</strong>，并拍照保存证据</li>' +
                    '<li>准备<strong>单独的食物储存区</strong>，并贴上名字标签</li>' +
                    '<li>睡前使用<strong>降噪耳机</strong>，避免游戏声音干扰</li>' +
                    '<li>永远不要相信"我待会就做"这种承诺</li>' +
                    '</ul>';
                break;
                
            case 'liar':
                mainPersonalityText.textContent = '👻 鬼话大师';
                personalityDescription.innerHTML = '你的室友是狡猾的"鬼话大师"。善于编造各种借口，拖延任务，装傻充愣。经常否认自己的行为，即使有确凿证据也会坚持自己的说法。';
                preventionContent.innerHTML = '<ul>' +
                    '<li>保存所有<strong>聊天记录和协议</strong>作为证据</li>' +
                    '<li>使用<strong>视频监控</strong>记录公共区域活动</li>' +
                    '<li>提前录制他承诺要做事情的声音</li>' +
                    '<li>与其争辩，不如直接<strong>设置后果</strong>：不做就如何</li>' +
                    '</ul>';
                break;
                
            case 'clown':
                mainPersonalityText.textContent = '🤡 社交小丑';
                personalityDescription.innerHTML = '你的室友是情绪化的"社交小丑"。说话骚话连篇，情绪波动大，喜欢带朋友回宿舍开派对。大声通话不考虑他人感受，社交活动频繁且吵闹。';
                preventionContent.innerHTML = '<ul>' +
                    '<li>明确<strong>安静时间</strong>和访客政策</li>' +
                    '<li>购买高质量<strong>降噪耳机</strong>是必备投资</li>' +
                    '<li>创建你的"专注空间"并设置边界</li>' +
                    '<li>学会<strong>直接沟通</strong>而非被动攻击</li>' +
                    '</ul>';
                break;
                
            default:
                mainPersonalityText.textContent = '混合型';
                personalityDescription.innerHTML = '你的室友展现出多种人格特质的混合。有时懒惰摸鱼，有时嘴硬说谎，偶尔也会像个社交小丑。这种多变性反而使他更难预测。';
                preventionContent.innerHTML = '<ul>' +
                    '<li>制定<strong>明确的宿舍规则</strong>并张贴在公共区域</li>' +
                    '<li>准备<strong>证据收集系统</strong>：照片、录音等</li>' +
                    '<li>投资<strong>个人安全装备</strong>：锁、耳机、独立存储空间</li>' +
                    '<li>学习<strong>情绪管理</strong>和冲突解决技巧</li>' +
                    '</ul>';
        }
    }
    
    // 添加CSS动画
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes pop-in {
                0% { transform: scale(0.8); opacity: 0; }
                70% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
    `);
});
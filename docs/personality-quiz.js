// personality-quiz.js - 室友人格诊断问卷系统
document.addEventListener('DOMContentLoaded', function() {
    // 获取问卷容器
    const quizContainer = document.getElementById('personality-quiz-container');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const submitButton = document.getElementById('quiz-submit-btn');
    const progressBar = document.getElementById('quiz-progress-bar-inner');
    const progressText = document.getElementById('quiz-progress-text');
    const quizNavPrev = document.getElementById('quiz-nav-prev');
    const quizNavNext = document.getElementById('quiz-nav-next');
    
    // 添加null检查
    if (!quizContainer) {
        console.error('问卷容器未找到: personality-quiz-container');
        return;
    }
    
    if (submitButton) {
        submitButton.addEventListener('click', submitQuiz);
    } else {
        console.error('提交按钮未找到: quiz-submit-btn');
    }
    
    // 问卷状态变量
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let questions = [];
    
    // 在DOMContentLoaded事件中添加
    console.log("开始初始化问卷系统...");
    console.log("找到的元素:", {
        quizContainer: document.getElementById('personality-quiz-container'),
        submitButton: document.getElementById('quiz-submit-btn'),
        progressBar: document.getElementById('quiz-progress-bar-inner')
    });
    
    // 修改异步加载问题数据函数，修复所有引号转义问题
    async function loadQuestions() {
        try {
            console.log("使用内嵌问题数据...");
            
            // 直接在代码中嵌入所有问题数据，修复引号转义
            questions = [
                {
                  "id": 1,
                  "text": "晚上你敲室友房门借零食，对方最可能的反应是：",
                  "options": [
                    { "label": "A. 冷哼一句\"自己去找\"",    "scores": { "lazy": 0, "sarcasm": 3, "social": 0 } },
                    { "label": "B. 立刻拿出来招待你",        "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "C. 直接拒绝说\"我也没了\"",   "scores": { "lazy": 2, "sarcasm": 0, "social": 0 } },
                    { "label": "D. 偷偷留一包不声不响",      "scores": { "lazy": 1, "sarcasm": 1, "social": 1 } }
                  ]
                },
                {
                  "id": 2,
                  "text": "一起做家务时，他/她最常说的一句话是：",
                  "options": [
                    { "label": "A. \"你先做，我一会儿来\"",   "scores": { "lazy": 2, "sarcasm": 1, "social": 0 } },
                    { "label": "B. \"家务算我的功课吗？\"",   "scores": { "lazy": 1, "sarcasm": 3, "social": 0 } },
                    { "label": "C. \"我来搞定！\"",           "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "D. \"我好累，改天吧\"",       "scores": { "lazy": 3, "sarcasm": 2, "social": 0 } }
                  ]
                },
                {
                  "id": 3,
                  "text": "清晨他起床最可能的场景：",
                  "options": [
                    { "label": "A. 闹铃响不停地赖床",       "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "B. 起床后一脸苦相",          "scores": { "lazy": 2, "sarcasm": 1, "social": 0 } },
                    { "label": "C. 闹钟响了还要骂半天",      "scores": { "lazy": 1, "sarcasm": 3, "social": 0 } },
                    { "label": "D. 早早起床锻炼",            "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } }
                  ]
                },
                {
                  "id": 4,
                  "text": "每次网络突然断了，他/她的第一反应：",
                  "options": [
                    { "label": "A. 直接回房睡觉",            "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "B. 去敲你房门\"能网吗？\"",   "scores": { "lazy": 1, "sarcasm": 1, "social": 1 } },
                    { "label": "C. 抱怨\"怎么又断了\"",        "scores": { "lazy": 0, "sarcasm": 2, "social": 0 } },
                    { "label": "D. 立刻去找路由器重启",      "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } }
                  ]
                },
                {
                  "id": 5,
                  "text": "月底话费快没了，他/她会怎么做：",
                  "options": [
                    { "label": "A. 借你的流量卡",            "scores": { "lazy": 1, "sarcasm": 0, "social": 1 } },
                    { "label": "B. 干脆不回消息了",          "scores": { "lazy": 3, "sarcasm": 1, "social": 0 } },
                    { "label": "C. 跟运营商续费",            "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "D. 找借口\"下个月再交\"",      "scores": { "lazy": 2, "sarcasm": 2, "social": 0 } }
                  ]
                },
                {
                  "id": 6,
                  "text": "宿舍停电，他/她最可能做的是：",
                  "options": [
                    { "label": "A. 继续睡大觉",              "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "B. 去找别人要手电筒",        "scores": { "lazy": 1, "sarcasm": 1, "social": 1 } },
                    { "label": "C. 抱怨\"这世道\"",            "scores": { "lazy": 0, "sarcasm": 3, "social": 0 } },
                    { "label": "D. 找蜡烛看书",              "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } }
                  ]
                },
                {
                  "id": 7,
                  "text": "你做饭时，他/她最可能的表现是：",
                  "options": [
                    { "label": "A. 吃完直接溜，不留碗筷",   "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "B. 问\"你怎么又没放盐？\"",  "scores": { "lazy": 1, "sarcasm": 1, "social": 0 } },
                    { "label": "C. 在旁边抱怨油烟味",       "scores": { "lazy": 0, "sarcasm": 2, "social": 0 } },
                    { "label": "D. 主动帮忙洗菜收拾",       "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } }
                  ]
                },
                {
                  "id": 8,
                  "text": "周末大家想去郊游，他/她最可能说：",
                  "options": [
                    { "label": "A. \"景点也就那样嘛\"",       "scores": { "lazy": 0, "sarcasm": 3, "social": 0 } },
                    { "label": "B. \"你们去吧，别等我\"",     "scores": { "lazy": 2, "sarcasm": 1, "social": 0 } },
                    { "label": "C. \"我太累，不去了\"",       "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "D. \"太好了，一起去！\"",     "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } }
                  ]
                },
                {
                  "id": 9,
                  "text": "宿舍门忘了锁，他/她会：",
                  "options": [
                    { "label": "A. 骂一句\"太不安全了\"",    "scores": { "lazy": 0, "sarcasm": 2, "social": 0 } },
                    { "label": "B. 主动跑出去帮锁门",       "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "C. 问\"门哪儿开了？\"",      "scores": { "lazy": 1, "sarcasm": 1, "social": 0 } },
                    { "label": "D. 无所谓，继续玩手机",     "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } }
                  ]
                },
                {
                  "id": 10,
                  "text": "发现公共区域垃圾堆满，他/她最可能做什么：",
                  "options": [
                    { "label": "A. 抱怨\"谁又没扔垃圾\"",    "scores": { "lazy": 0, "sarcasm": 3, "social": 0 } },
                    { "label": "B. 自己动手清理掉",         "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "C. 去敲门让大家一起清",     "scores": { "lazy": 1, "sarcasm": 1, "social": 1 } },
                    { "label": "D. 继续走开不管",           "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } }
                  ]
                },
                {
                  "id": 11,
                  "text": "晚上他/她去洗澡，你最可能听到的声音是：",
                  "options": [
                    { "label": "A. 呼噜声（睡着了）",      "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "B. 放歌洗澡",               "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "C. 抱怨\"水又凉了\"",        "scores": { "lazy": 0, "sarcasm": 2, "social": 0 } },
                    { "label": "D. 嘟囔\"洗个澡也累\"",      "scores": { "lazy": 2, "sarcasm": 1, "social": 0 } }
                  ]
                },
                {
                  "id": 12,
                  "text": "临近期末，他/她对你说的第一句话是：",
                  "options": [
                    { "label": "A. \"等我考完再说\"",        "scores": { "lazy": 3, "sarcasm": 0, "social": 0 } },
                    { "label": "B. \"一起复习吧\"",          "scores": { "lazy": 0, "sarcasm": 0, "social": 2 } },
                    { "label": "C. \"你考怎么样？\"",        "scores": { "lazy": 1, "sarcasm": 1, "social": 1 } },
                    { "label": "D. \"好像没那么必要\"",      "scores": { "lazy": 2, "sarcasm": 1, "social": 0 } }
                  ]
                }
            ];
            
            console.log(`成功加载 ${questions.length} 个问题`);
            
            // 初始化用户答案数组
            userAnswers = new Array(questions.length).fill(null);
            
            // 显示第一个问题
            showQuestion(0);
            updateProgressBar();
        } catch (error) {
            console.error('加载问题出错:', error);
            quizContainer.innerHTML = `
                <div class="error-message">
                    <p>加载问题失败: ${error.message}</p>
                    <button onclick="window.location.reload()">刷新页面</button>
                </div>
            `;
        }
    }
    
    // 显示指定索引的问题
    function showQuestion(index) {
        if (!questions || questions.length === 0) return;
        
        // 确保索引在有效范围内
        if (index < 0) index = 0;
        if (index >= questions.length) index = questions.length - 1;
        
        currentQuestionIndex = index;
        const question = questions[index];
        
        // 生成问题HTML
        let questionHTML = `
            <div class="quiz-question">
                <h3>问题 ${index + 1}/${questions.length}</h3>
                <p class="question-text">${question.text}</p>
                <div class="quiz-options">
        `;
        
        // 添加选项
        question.options.forEach((option, optionIndex) => {
            const isChecked = userAnswers[index] === optionIndex ? 'checked' : '';
            questionHTML += `
                <div class="quiz-option">
                    <input type="radio" id="q${index}_o${optionIndex}" 
                           name="question${index}" value="${optionIndex}" ${isChecked}>
                    <label for="q${index}_o${optionIndex}">${option.label}</label>
                </div>
            `;
        });
        
        questionHTML += `
                </div>
            </div>
        `;
        
        // 更新问题容器
        quizContainer.innerHTML = questionHTML;
        
        // 添加选项点击事件监听
        document.querySelectorAll(`input[name="question${index}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                userAnswers[index] = parseInt(this.value);
                updateProgressBar();
                
                // 自动前进到下一题
                if (currentQuestionIndex < questions.length - 1) {
                    setTimeout(() => showQuestion(currentQuestionIndex + 1), 300);
                }
            });
        });
        
        // 更新导航按钮状态
        updateNavigationButtons();
    }
    
    // 更新进度条
    function updateProgressBar() {
        const answeredCount = userAnswers.filter(answer => answer !== null).length;
        const progressPercent = Math.round((answeredCount / questions.length) * 100);
        
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${answeredCount}/${questions.length}`;
        
        // 如果所有问题都已回答，启用提交按钮
        if (answeredCount === questions.length) {
            submitButton.removeAttribute('disabled');
            submitButton.classList.add('active');
        } else {
            submitButton.setAttribute('disabled', 'disabled');
            submitButton.classList.remove('active');
        }
    }
    
    // 更新导航按钮状态
    function updateNavigationButtons() {
        // 前一题按钮
        if (currentQuestionIndex === 0) {
            quizNavPrev.classList.add('disabled');
        } else {
            quizNavPrev.classList.remove('disabled');
        }
        
        // 后一题按钮
        if (currentQuestionIndex === questions.length - 1) {
            quizNavNext.classList.add('disabled');
        } else {
            quizNavNext.classList.remove('disabled');
        }
    }
    
    // 计算分数
    function calculateScores() {
        const scores = {
            lazy: 0,
            sarcasm: 0,
            social: 0
        };
        
        userAnswers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== null) {
                const questionScores = questions[questionIndex].options[answerIndex].scores;
                scores.lazy += questionScores.lazy || 0;
                scores.sarcasm += questionScores.sarcasm || 0;
                scores.social += questionScores.social || 0;
            }
        });
        
        return scores;
    }
    
    // 计算百分比
    function calculatePercentages(scores) {
        const total = scores.lazy + scores.sarcasm + scores.social;
        
        return {
            lazy: Math.round((scores.lazy / total) * 100),
            sarcasm: Math.round((scores.sarcasm / total) * 100),
            social: Math.round((scores.social / total) * 100)
        };
    }
    
    // 确定主要人格类型
    function determinePrimaryPersonality(scores) {
        const maxScore = Math.max(scores.lazy, scores.sarcasm, scores.social);
        
        if (scores.lazy === maxScore) {
            return 'lazy';
        } else if (scores.sarcasm === maxScore) {
            return 'sarcasm'; 
        } else if (scores.social === maxScore) {
            return 'social';
        } else {
            return 'balanced';
        }
    }
    
    // 提交问卷
    function submitQuiz() {
        // 计算分数
        const scores = calculateScores();
        const percentages = calculatePercentages(scores);
        const primaryPersonality = determinePrimaryPersonality(scores);
        
        // 更新图表
        document.getElementById('lazy-bar').style.width = `${percentages.lazy}%`;
        document.getElementById('liar-bar').style.width = `${percentages.sarcasm}%`;
        document.getElementById('clown-bar').style.width = `${percentages.social}%`;
        
        document.getElementById('lazy-percent').textContent = `${percentages.lazy}%`;
        document.getElementById('liar-percent').textContent = `${percentages.sarcasm}%`;
        document.getElementById('clown-percent').textContent = `${percentages.social}%`;
        
        // 更新主要人格和描述
        updatePersonalityDescription(primaryPersonality);
        
        // 显示人格诊断系统区域
        const diagnosisSystem = document.getElementById('personality-diagnosis-system');
        diagnosisSystem.classList.remove('hidden');
        
        // 滚动到人格诊断系统区域
        diagnosisSystem.scrollIntoView({ behavior: 'smooth' });
        
        // 保存人格分数到全局变量（与原有代码兼容）
        window.personalityScores = {
            lazy: scores.lazy,
            liar: scores.sarcasm,
            clown: scores.social
        };
    }
    
    // 更新人格描述
    function updatePersonalityDescription(type) {
        const mainPersonalityText = document.getElementById('main-personality');
        const personalityDescription = document.getElementById('personality-description');
        const preventionContent = document.getElementById('prevention-content');
        
        switch (type) {
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
                
            case 'sarcasm':
                mainPersonalityText.textContent = '👻 鬼话大师';
                personalityDescription.innerHTML = '你的室友是狡猾的"鬼话大师"。善于编造各种借口，拖延任务，装傻充愣。经常否认自己的行为，即使有确凿证据也会坚持自己的说法。';
                preventionContent.innerHTML = '<ul>' +
                    '<li>保存所有<strong>聊天记录和协议</strong>作为证据</li>' +
                    '<li>使用<strong>视频监控</strong>记录公共区域活动</li>' +
                    '<li>提前录制他承诺要做事情的声音</li>' +
                    '<li>与其争辩，不如直接<strong>设置后果</strong>：不做就如何</li>' +
                    '</ul>';
                break;
                
            case 'social':
                mainPersonalityText.textContent = '🌟 社交达人';
                personalityDescription.innerHTML = '你的室友是善解人意的"社交达人"。乐于助人、积极主动，总是第一个提出帮忙解决问题。喜欢和大家一起活动，但也尊重他人空间。责任感强，生活习惯良好，是个值得信赖的室友。';
                preventionContent.innerHTML = '<ul>' +
                    '<li>充分<strong>感谢和肯定</strong>他们的主动付出</li>' +
                    '<li>尊重他们的<strong>社交需求</strong>，偶尔一起参与活动</li>' +
                    '<li>和他们建立<strong>清晰的沟通机制</strong>，坦诚表达自己的需求</li>' +
                    '<li>注意<strong>平衡友谊与界限</strong>，避免过度依赖</li>' +
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
    
    if (quizNavPrev) {
        quizNavPrev.addEventListener('click', function() {
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
    }
    
    if (quizNavNext) {
        quizNavNext.addEventListener('click', function() {
            if (currentQuestionIndex < questions.length - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        });
    }
    
    // 处理重置按钮
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('重置按钮被点击');
            // 重置答案
            userAnswers = new Array(questions.length).fill(null);
            
            // 显示第一个问题
            showQuestion(0);
            updateProgressBar();
            
            // 隐藏结果区域
            const resultElem = document.getElementById('result');
            if (resultElem) resultElem.classList.add('hidden');
            
            // 隐藏人格诊断系统区域
            const diagnosisSystem = document.getElementById('personality-diagnosis-system');
            if (diagnosisSystem) diagnosisSystem.classList.add('hidden');
            
            // 滚动回问卷顶部
            quizContainer.scrollIntoView({ behavior: 'smooth' });
        });
    } else {
        // 如果找不到重置按钮，创建一个
        console.log('找不到重置按钮，将自动创建');
        const submitBtnContainer = submitButton.parentElement;
        if (submitBtnContainer) {
            const newResetBtn = document.createElement('button');
            newResetBtn.id = 'reset-btn';
            newResetBtn.className = 'quiz-reset-btn';
            newResetBtn.textContent = '重新测试';
            submitBtnContainer.appendChild(newResetBtn);
            
            // 为新创建的按钮添加事件监听
            newResetBtn.addEventListener('click', function() {
                console.log('新创建的重置按钮被点击');
                // 重置答案
                userAnswers = new Array(questions.length).fill(null);
                
                // 显示第一个问题
                showQuestion(0);
                updateProgressBar();
                
                // 隐藏人格诊断系统区域
                const diagnosisSystem = document.getElementById('personality-diagnosis-system');
                if (diagnosisSystem) diagnosisSystem.classList.add('hidden');
                
                // 滚动回问卷顶部
                quizContainer.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
    
    // 加载问题
    loadQuestions();
});

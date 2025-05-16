// 槽点回忆系统 - JavaScript
let savedScores = {
    lazy: 0,
    sarcasm: 0,
    social: 0,
    events: [], // 存储每次事件的详情
    categories: {} // 记录每个类别的选择次数
};

let savedBehaviors = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log("槽点系统初始化中...");
    
    // DOM元素引用
    const triggerBtn = document.getElementById('槽点-trigger-btn');
    const typeModal = document.getElementById('槽点-type-modal');
    const typeItems = document.querySelectorAll('.槽点-type-item');
    const typeCancel = document.getElementById('槽点-type-cancel');
    
    const behaviorsModal = document.getElementById('槽点-behaviors-modal');
    const behaviorsTitle = document.getElementById('槽点-behaviors-title');
    const behaviorsContainer = document.getElementById('槽点-behaviors-container');
    const customContainer = document.getElementById('槽点-custom-container');
    const customText = document.getElementById('槽点-custom-text');
    const lazySlider = document.getElementById('槽点-lazy-slider');
    const sarcasmSlider = document.getElementById('槽点-sarcasm-slider');
    const socialSlider = document.getElementById('槽点-social-slider');
    const lazyValue = document.getElementById('槽点-lazy-value');
    const sarcasmValue = document.getElementById('槽点-sarcasm-value');
    const socialValue = document.getElementById('槽点-social-value');
    const behaviorsBack = document.getElementById('槽点-behaviors-back');
    const behaviorsSubmit = document.getElementById('槽点-behaviors-submit');
    
    const resultModal = document.getElementById('槽点-result-modal');
    const resultTitle = document.getElementById('槽点-result-title');
    const lazyBar = document.getElementById('槽点-lazy-bar');
    const sarcasmBar = document.getElementById('槽点-sarcasm-bar');
    const socialBar = document.getElementById('槽点-social-bar');
    const lazyPercent = document.getElementById('槽点-lazy-percent');
    const sarcasmPercent = document.getElementById('槽点-sarcasm-percent');
    const socialPercent = document.getElementById('槽点-social-percent');
    const resultComment = document.getElementById('槽点-result-comment');
    const resultAgain = document.getElementById('槽点-result-again');
    
    // 状态变量
    let selectedType = '';
    let selectedTypeTitle = '';
    let selectedBehaviors = [];
    
    // 行为数据库 - 包含不同类型场景的行为选项
    const behaviorData = {
        night: {
            title: "半夜潜行动作",
            behaviors: [
                { text: "半夜进房搬走你的充电线", scores: { lazy: 1, sarcasm: 2, social: 0 } },
                { text: "把你的台灯电话模式改成静音", scores: { lazy: 0, sarcasm: 3, social: 0 } },
                { text: "偷走你的枕头偷偷睡一次", scores: { lazy: 2, sarcasm: 1, social: 0 } },
                { text: "给你的被子塞条枕头当按摩棒", scores: { lazy: 1, sarcasm: 2, social: 1 } },
            ]
        },
        bathroom: {
            title: "厨卫尴尬现场",
            behaviors: [
                { text: "用完最后一卷厕纸不补又关门溜走", scores: { lazy: 3, sarcasm: 1, social: 0 } },
                { text: "洗澡大水花打湿地板不擦", scores: { lazy: 3, sarcasm: 0, social: 0 } },
                { text: "把你洗碗时泼出来的水当洗脚池", scores: { lazy: 1, sarcasm: 2, social: 0 } },
                { text: "把牙刷当小刷子刷鞋底", scores: { lazy: 0, sarcasm: 3, social: 0 } },
            ]
        },
        noise: {
            title: "声光轰炸",
            behaviors: [
                { text: "在你看剧时大声练口哨", scores: { lazy: 0, sarcasm: 2, social: 1 } },
                { text: "开最响蓝牙音箱放EDM", scores: { lazy: 0, sarcasm: 2, social: 2 } },
                { text: "深夜隔墙大喊\"有鬼！\"吓你", scores: { lazy: 0, sarcasm: 3, social: 1 } },
                { text: "半夜开门脚步声震天", scores: { lazy: 1, sarcasm: 1, social: 1 } },
            ]
        },
        food: {
            title: "食物失踪记",
            behaviors: [
                { text: "把你做好的便当丢到公共冰箱", scores: { lazy: 1, sarcasm: 2, social: 0 } },
                { text: "打包你外卖盒子当垃圾丢掉", scores: { lazy: 1, sarcasm: 2, social: 0 } },
                { text: "给你买零食却偷偷吃了一半", scores: { lazy: 1, sarcasm: 1, social: 1 } },
                { text: "把你冰箱里的蔬菜当花瓶摆", scores: { lazy: 0, sarcasm: 3, social: 0 } },
            ]
        },
        personal: {
            title: "私人物品\"创新\"",
            behaviors: [
                { text: "把袜子当抹布用完不还", scores: { lazy: 2, sarcasm: 1, social: 0 } },
                { text: "拿你的床单当窗帘挂上", scores: { lazy: 1, sarcasm: 2, social: 0 } },
                { text: "用你的牙刷梳头发", scores: { lazy: 1, sarcasm: 3, social: 0 } },
                { text: "画你的笔记本封面做涂鸦", scores: { lazy: 0, sarcasm: 2, social: 1 } },
            ]
        },
        delivery: {
            title: "快递／收纳灾难",
            behaviors: [
                { text: "开快递包装时狂撒纸屑不清理", scores: { lazy: 3, sarcasm: 0, social: 0 } },
                { text: "在柜子里乱塞鞋子害你找不到", scores: { lazy: 2, sarcasm: 1, social: 0 } },
                { text: "把行李箱当椅子坐，压扁你的衣服", scores: { lazy: 1, sarcasm: 1, social: 1 } },
                { text: "把快递箱当纸篓随手丢垃圾", scores: { lazy: 3, sarcasm: 0, social: 0 } },
            ]
        },
        social: {
            title: "社交／消息轰炸",
            behaviors: [
                { text: "半夜群里发\"表情包大轰炸\"", scores: { lazy: 0, sarcasm: 1, social: 3 } },
                { text: "不断给你转发同一个段子不带字幕", scores: { lazy: 1, sarcasm: 1, social: 2 } },
                { text: "直播斗鱼/抖音时开了麦克风", scores: { lazy: 1, sarcasm: 0, social: 3 } },
                { text: '给你备注名改成"沙雕室友"群发全员', scores: { lazy: 0, sarcasm: 3, social: 1 } },
            ]
        },
        gaming: {
            title: "游戏／追剧成瘾",
            behaviors: [
                { text: "占用客厅电视打游戏到凌晨", scores: { lazy: 1, sarcasm: 0, social: 2 } },
                { text: "边吃泡面边追剧，飘出\"泡面味\"", scores: { lazy: 2, sarcasm: 0, social: 1 } },
                { text: "把Chromecast当投影仪用在天花板上", scores: { lazy: 0, sarcasm: 2, social: 1 } },
                { text: "给你拉游戏组队不带上别的室友", scores: { lazy: 0, sarcasm: 1, social: 2 } },
            ]
        },
        door: {
            title: "门禁／安全失误",
            behaviors: [
                { text: '忘关门窗又赖在你面前说"我以为关了"', scores: { lazy: 2, sarcasm: 2, social: 0 } },
                { text: "乱换门锁设置PIN码不告诉你", scores: { lazy: 0, sarcasm: 3, social: 0 } },
                { text: "把门卡放冰箱里急得你半夜找", scores: { lazy: 2, sarcasm: 1, social: 0 } },
                { text: "用鞋子堵门逃火警演练", scores: { lazy: 1, sarcasm: 2, social: 0 } },
            ]
        },
        emergency: {
            title: "紧急场景",
            behaviors: [
                { text: "半夜突降\"灵异事件\"要你陪查房", scores: { lazy: 0, sarcasm: 1, social: 3 } },
                { text: "突然来个\"炉石练习\"就不让你睡", scores: { lazy: 0, sarcasm: 2, social: 2 } },
                { text: "半夜\"群殴\"电视遥控器打赌", scores: { lazy: 0, sarcasm: 1, social: 3 } },
                { text: "定闹钟假装早起催你晨跑", scores: { lazy: 0, sarcasm: 3, social: 1 } },
            ]
        },
        other: {
            title: "其他行为",
            behaviors: [
                { text: "自定义其他行为", scores: { lazy: 0, sarcasm: 0, social: 0 } }
            ]
        }
    };
    
    // 结果文案库
    const commentTemplates = [
        { condition: score => score.sarcasm > 60, text: '你的室友毒舌满分，已经超标了！建议给TA送本《如何做一个有礼貌的室友》🙄' },
        { condition: score => score.lazy > 60, text: "这个室友的\"懒散指数\"爆表了！TA可能把拖延当成了一种生活艺术 🦥" },
        { condition: score => score.social > 60, text: "社交恐慌症患者慎入！这个室友把宿舍当成24小时派对现场了 🎉" },
        { condition: score => score.sarcasm > 40 && score.lazy > 40, text: "懒又毒舌，这是闲出毛病了吧？建议给TA多布置点任务 📝" },
        { condition: score => score.lazy > 40 && score.social > 40, text: "精力充沛却不做家务，这室友选择性勤奋啊！" },
        { condition: score => score.sarcasm > 40 && score.social > 40, text: "活跃又毒舌，这室友是社交小达人还是社恐制造机？🤔" },
        { condition: score => Math.max(score.lazy, score.sarcasm, score.social) < 40, text: "这次表现基本在可接受范围，但还是建议多沟通，少头疼 💬" }
    ];
    
    // 获取触发按钮
    if (triggerBtn) {
        console.log("找到触发按钮，绑定事件");
        // 绑定点击事件
        triggerBtn.addEventListener('click', function() {
            console.log("触发按钮被点击");
            const typeModal = document.getElementById('槽点-type-modal');
            if (typeModal) {
                typeModal.classList.remove('hidden');
            } else {
                console.error("找不到类型选择模态框");
                alert("系统初始化失败，请刷新页面重试");
            }
        });
    } else {
        console.error("找不到触发按钮，ID: 槽点-trigger-btn");
    }
    
    // 事件监听 - 取消类型选择
    typeCancel.addEventListener('click', function() {
        typeModal.classList.add('hidden');
    });
    
    // 事件监听 - 选择类型
    typeItems.forEach(item => {
        item.addEventListener('click', function() {
            selectedType = this.getAttribute('data-type');
            selectedTypeTitle = behaviorData[selectedType].title;
            
            // 切换到行为选择模态框
            typeModal.classList.add('hidden');
            loadBehaviors(selectedType);
            behaviorsTitle.textContent = `选择室友具体表现 - ${selectedTypeTitle}`;
            behaviorsModal.classList.remove('hidden');
            
            // 重置已选择的行为
            selectedBehaviors = [];
            
            // 如果是"其他"类型，显示自定义容器
            if (selectedType === 'other') {
                customContainer.classList.remove('hidden');
            } else {
                customContainer.classList.add('hidden');
            }
        });
    });
    
    // 当前会话的选择记录，但不保存到localStorage
    let currentSessionBehaviors = {};
    let currentSessionScores = {
        lazy: 0,
        sarcasm: 0,
        social: 0,
        events: [],
        categories: {}
    };
    
    // 加载行为选项函数，保持当前会话的选择
    function loadBehaviors(type) {
        const behaviors = behaviorData[type].behaviors;
        behaviorsContainer.innerHTML = '';
        
        // 重置当前类型的选择行为数组
        selectedBehaviors = [];
        
        behaviors.forEach((behavior, index) => {
            const behaviorItem = document.createElement('div');
            behaviorItem.className = '槽点-behavior-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `behavior-${index}`;
            checkbox.setAttribute('data-index', index);
            
            // 如果当前会话中已经选择过，保持选中状态
            if (currentSessionBehaviors[selectedType] && 
                currentSessionBehaviors[selectedType].some(b => b.text === behavior.text)) {
                
                checkbox.checked = true;
                
                // 找到已保存的行为及其情绪值
                const savedBehavior = currentSessionBehaviors[selectedType].find(b => b.text === behavior.text);
                const behaviorWithEmotion = {...behavior, emotion: savedBehavior.emotion || 3};
                selectedBehaviors.push(behaviorWithEmotion);
            }
            
            const label = document.createElement('label');
            label.setAttribute('for', `behavior-${index}`);
            label.textContent = behavior.text;
            
            // 修改情绪评级部分，添加emoji
            const emotionRating = document.createElement('div');
            emotionRating.className = '槽点-behavior-emotion';
            emotionRating.innerHTML = `
                <span>生气程度:</span>
                <div class="槽点-behavior-rating">
                    <span class="槽点-emotion-item" data-value="1" data-index="${index}">😔<br>1</span>
                    <span class="槽点-emotion-item" data-value="2" data-index="${index}">😢<br>2</span>
                    <span class="槽点-emotion-item" data-value="3" data-index="${index}">😠<br>3</span>
                    <span class="槽点-emotion-item" data-value="4" data-index="${index}">😡<br>4</span>
                    <span class="槽点-emotion-item" data-value="5" data-index="${index}">💥<br>5</span>
                </div>
            `;
            
            // 如果有已保存的情绪值，显示选中状态
            if (currentSessionBehaviors[selectedType]) {
                const savedBehavior = currentSessionBehaviors[selectedType].find(b => b.text === behavior.text);
                if (savedBehavior && savedBehavior.emotion) {
                    const emotionToSelect = emotionRating.querySelector(`.槽点-emotion-item[data-value="${savedBehavior.emotion}"][data-index="${index}"]`);
                    if (emotionToSelect) {
                        emotionToSelect.classList.add('selected');
                    }
                }
            }
            
            behaviorItem.appendChild(checkbox);
            behaviorItem.appendChild(label);
            behaviorItem.appendChild(emotionRating);
            behaviorsContainer.appendChild(behaviorItem);
            
            // 情绪评分添加事件
            const emotionItems = emotionRating.querySelectorAll('.槽点-emotion-item');
            emotionItems.forEach(item => {
                item.addEventListener('click', function() {
                    const behaviorIndex = parseInt(this.getAttribute('data-index'));
                    const emotionValue = parseInt(this.getAttribute('data-value'));
                    const isCurrentlySelected = this.classList.contains('selected');
                    
                    // 移除同一行为所有情绪选项的选中状态
                    emotionItems.forEach(i => {
                        if (i.getAttribute('data-index') === this.getAttribute('data-index')) {
                            i.classList.remove('selected');
                        }
                    });
                    
                    // 如果点击的是当前已选中的，则完全取消选择
                    if (isCurrentlySelected) {
                        // 不添加selected类，实现取消选择
                        
                        // 自动取消勾选该行为的复选框
                        const checkbox = document.getElementById(`behavior-${behaviorIndex}`);
                        if (checkbox && checkbox.checked) {
                            checkbox.checked = false;
                            
                            // 手动触发change事件，确保数据更新
                            const event = new Event('change');
                            checkbox.dispatchEvent(event);
                        }
                    } else {
                        // 添加当前选中状态
                        this.classList.add('selected');
                        
                        // 自动勾选该行为
                        const checkbox = document.getElementById(`behavior-${behaviorIndex}`);
                        if (!checkbox.checked) {
                            checkbox.checked = true;
                            // 手动添加行为到selectedBehaviors
                            const behaviorWithEmotion = {...behaviors[behaviorIndex], emotion: emotionValue};
                            selectedBehaviors.push(behaviorWithEmotion);
                        } else {
                            // 更新已选中行为的情绪值
                            selectedBehaviors.forEach(b => {
                                if (b.text === behaviors[behaviorIndex].text) {
                                    b.emotion = emotionValue;
                                }
                            });
                        }
                    }
                });
            });
            
            // 复选框事件
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (this.checked) {
                    // 添加行为并设置默认情绪值为3
                    const behaviorWithEmotion = {...behaviors[index], emotion: 3};
                    selectedBehaviors.push(behaviorWithEmotion);
                } else {
                    // 取消选择时从selectedBehaviors中移除
                    selectedBehaviors = selectedBehaviors.filter(b => b.text !== behaviors[index].text);
                    
                    // 同时从currentSessionBehaviors中移除
                    if (currentSessionBehaviors[selectedType]) {
                        currentSessionBehaviors[selectedType] = currentSessionBehaviors[selectedType].filter(
                            b => b.text !== behaviors[index].text
                        );
                        
                        // 立即更新类别计数
                        updateCategoryCounters();
                    }
                    
                    // 移除相应的情绪评级选中状态
                    const emotionItems = document.querySelectorAll(`.槽点-emotion-item[data-index="${index}"]`);
                    emotionItems.forEach(item => {
                        item.classList.remove('selected');
                    });
                }
            });
        });
    }
    
    // 事件监听 - 滑块值更新
    lazySlider.addEventListener('input', function() {
        lazyValue.textContent = this.value;
    });
    
    sarcasmSlider.addEventListener('input', function() {
        sarcasmValue.textContent = this.value;
    });
    
    socialSlider.addEventListener('input', function() {
        socialValue.textContent = this.value;
    });
    
    // 事件监听 - 返回类型选择
    behaviorsBack.addEventListener('click', function() {
        behaviorsModal.classList.add('hidden');
        typeModal.classList.remove('hidden');
        updateCategoryCounters();
    });
    
    // 事件监听 - 提交结果计算
    behaviorsSubmit.addEventListener('click', function() {
        console.log("selectedBehaviors:", selectedBehaviors);
        
        // 检查是否有未设置情绪值的行为并设置默认值3
        selectedBehaviors.forEach(behavior => {
            if (!behavior.emotion) {
                behavior.emotion = 3;
            }
        });
        
        // 计算本次结果并保存
        saveCurrentResults();
        
        // 显示一个简短提示
        showSavedConfirmation();
        
        // 更新类别计数
        updateCategoryCounters();
        
        // 直接返回到类型选择页面
        behaviorsModal.classList.add('hidden');
        typeModal.classList.remove('hidden');
    });
    
    // 事件监听 - 再来一次
    resultAgain.addEventListener('click', function() {
        resultModal.classList.add('hidden');
        typeModal.classList.remove('hidden');
    });
    
    // 修改保存结果函数，确保所有已选项都被保存
    function saveCurrentResults() {
        // 初始化分数
        let totalLazy = 0;
        let totalSarcasm = 0;
        let totalSocial = 0;
        
        // 如果该类型不存在于currentSessionBehaviors中，初始化为空数组
        if (!currentSessionBehaviors[selectedType]) {
            currentSessionBehaviors[selectedType] = [];
        }
        
        // 获取当前页面上所有的行为项
        const checkboxes = behaviorsContainer.querySelectorAll('input[type="checkbox"]');
        const allBehaviors = Array.from(checkboxes).map(checkbox => {
            const index = parseInt(checkbox.getAttribute('data-index'));
            if (selectedType === 'other') {
                return null; // 自定义类型单独处理
            }
            return {
                checkbox: checkbox,
                data: behaviorData[selectedType].behaviors[index]
            };
        }).filter(item => item !== null);
        
        // 累加所有选中行为的分数
        if (selectedType === 'other') {
            // 自定义行为使用滑块值
            totalLazy = parseInt(lazySlider.value);
            totalSarcasm = parseInt(sarcasmSlider.value);
            totalSocial = parseInt(socialSlider.value);
            
            // 记录自定义行为
            const customBehavior = {
                text: customText.value || "自定义行为",
                scores: {
                    lazy: totalLazy,
                    sarcasm: totalSarcasm,
                    social: totalSocial
                },
                emotion: 3
            };
            
            // 更新而不是替换
            if (!currentSessionBehaviors[selectedType].some(b => b.text === customBehavior.text)) {
                currentSessionBehaviors[selectedType].push(customBehavior);
            }
        } else {
            // 首先从页面获取当前选中的行为
            // 这确保即使用户没有进行任何修改，也能捕获所有已选中的项目
            const currentSelectedBehaviors = [];
            allBehaviors.forEach(item => {
                if (item.checkbox.checked) {
                    // 查找该行为的情绪值
                    const behaviorIndex = parseInt(item.checkbox.getAttribute('data-index'));
                    const emotionItem = behaviorsContainer.querySelector(`.槽点-emotion-item.selected[data-index="${behaviorIndex}"]`);
                    const emotionValue = emotionItem ? parseInt(emotionItem.getAttribute('data-value')) : 3;
                    
                    currentSelectedBehaviors.push({
                        ...item.data,
                        emotion: emotionValue
                    });
                }
            });
            
            // 确保selectedBehaviors包含当前页面上所有选中的行为
            // 这解决了"只浏览但不修改"的情况
            selectedBehaviors = currentSelectedBehaviors;
            
            // 计算分数并更新保存状态
            selectedBehaviors.forEach(behavior => {
                // 使用行为特定的情绪值计算分数
                const emotionFactor = behavior.emotion / 3;
                
                totalLazy += behavior.scores.lazy * emotionFactor;
                totalSarcasm += behavior.scores.sarcasm * emotionFactor;
                totalSocial += behavior.scores.social * emotionFactor;
                
                // 更新currentSessionBehaviors
                const existingIndex = currentSessionBehaviors[selectedType].findIndex(b => b.text === behavior.text);
                if (existingIndex >= 0) {
                    // 更新已有行为
                    currentSessionBehaviors[selectedType][existingIndex] = behavior;
                } else {
                    // 添加新行为
                    currentSessionBehaviors[selectedType].push(behavior);
                }
            });
            
            // 删除未选中的行为
            currentSessionBehaviors[selectedType] = currentSessionBehaviors[selectedType].filter(b => 
                selectedBehaviors.some(sb => sb.text === b.text)
            );
        }
        
        // 记录本次事件到当前会话
        // 只有在有选择的情况下才记录
        if (selectedBehaviors.length > 0 || selectedType === 'other') {
            currentSessionScores.events.push({
                type: selectedType,
                title: selectedTypeTitle,
                behaviors: selectedBehaviors,
                scores: {
                    lazy: totalLazy,
                    sarcasm: totalSarcasm, 
                    social: totalSocial
                },
                timestamp: new Date().toLocaleString()
            });
        }
        
        // 更新当前会话累计分数
        currentSessionScores.lazy += totalLazy;
        currentSessionScores.sarcasm += totalSarcasm;
        currentSessionScores.social += totalSocial;
        
        // 记录类别选择次数
        if (!currentSessionScores.categories[selectedType]) {
            currentSessionScores.categories[selectedType] = 1;
        } else {
            currentSessionScores.categories[selectedType]++;
        }

        // 更新当前会话的events数组，确保它只包含当前选择的行为
        // 先清空events数组
        currentSessionScores.events = [];
        
        // 遍历currentSessionBehaviors，重新构建events数组
        for (const type in currentSessionBehaviors) {
            if (currentSessionBehaviors[type].length > 0) {
                const behaviors = currentSessionBehaviors[type];
                const typeTitle = behaviorData[type].title;
                
                // 计算该类型的总分
                let totalLazy = 0;
                let totalSarcasm = 0;
                let totalSocial = 0;
                
                behaviors.forEach(behavior => {
                    const emotionFactor = behavior.emotion / 3;
                    totalLazy += behavior.scores.lazy * emotionFactor;
                    totalSarcasm += behavior.scores.sarcasm * emotionFactor;
                    totalSocial += behavior.scores.social * emotionFactor;
                });
                
                // 添加到events
                currentSessionScores.events.push({
                    type: type,
                    title: typeTitle,
                    behaviors: behaviors,
                    scores: {
                        lazy: totalLazy,
                        sarcasm: totalSarcasm,
                        social: totalSocial
                    },
                    timestamp: new Date().toLocaleString()
                });
            }
        }
        
        // 重新计算总分
        currentSessionScores.lazy = 0;
        currentSessionScores.sarcasm = 0;
        currentSessionScores.social = 0;
        
        currentSessionScores.events.forEach(event => {
            currentSessionScores.lazy += event.scores.lazy;
            currentSessionScores.sarcasm += event.scores.sarcasm;
            currentSessionScores.social += event.scores.social;
        });
    }

    // 显示保存确认提示
    function showSavedConfirmation() {
        // 计算所有类别中实际选择的行为项总数
        let totalSelectedBehaviors = 0;
        Object.values(currentSessionBehaviors).forEach(behaviors => {
            totalSelectedBehaviors += behaviors.length;
        });
        
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = '槽点-saved-confirmation';
        confirmationDiv.innerHTML = `
            <div class="槽点-confirmation-content">
                <div class="槽点-confirmation-icon">✓</div>
                <div class="槽点-confirmation-text">
                    <p>已保存槽点事件</p>
                    <p class="槽点-confirmation-count">已累积 ${totalSelectedBehaviors} 个槽点</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmationDiv);
        
        // 2秒后淡出
        setTimeout(() => {
            confirmationDiv.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(confirmationDiv);
            }, 500);
        }, 1500);
    }

    // 修改标题文字
    // 将"选择发生的行为 - XXX"改为"选择室友具体表现 - XXX"
    function updateBehaviorsTitle() {
        behaviorsTitle.textContent = `选择室友具体表现 - ${selectedTypeTitle}`;
    }

    // 修改"计算结果"按钮文本和功能
    // 在初始化函数中添加
    function updateButtonsText() {
        const submitBtn = document.getElementById('槽点-behaviors-submit');
        if (submitBtn) {
            submitBtn.textContent = '保存并继续';
        }
    }

    // 初始化时加载数据并设置按钮
    updateButtonsText();

    // 在CSS中添加样式使emoji更突出
    const emojiStyle = document.createElement('style');
    emojiStyle.textContent = `
        .槽点-emotion-item {
            display: inline-block;
            text-align: center;
            cursor: pointer;
            margin: 0 5px;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .槽点-emotion-item.selected {
            background-color: #e0e7ff;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
        
        .槽点-emotion-item emoji {
            font-size: 1.5em;
            display: block;
            margin-bottom: 2px;
        }
    `;
    document.head.appendChild(emojiStyle);

    // 在CSS中隐藏相关元素
    const hideEmotionStyle = document.createElement('style');
    hideEmotionStyle.textContent = `
        .emotion-global-rating, 
        .当时被坑程度,
        #emotion-rating-container {
            display: none !important;
        }
    `;
    document.head.appendChild(hideEmotionStyle);

    // 恢复完整的槽点总结功能

    // 行为模式分析函数
    function generateRoommatePattern(percentages) {
        const maxType = Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b);
        
        const patterns = {
            lazy: {
                title: "消极懒散型",
                description: "你的室友是典型的「消极懒散型」。懒惰是TA的主要特征，经常逃避责任，推迟任务，对公共区域维护漠不关心。TA可能会晚起床，忘记做分配的家务，并且经常找借口拖延应该完成的事情。"
            },
            sarcasm: {
                title: "尖酸刻薄型",
                description: "你的室友是典型的「尖酸刻薄型」。TA喜欢用刻薄的言语和态度来应对生活中的各种情况，经常让人感到不舒服。TA可能会对你的行为进行批评，发表尖锐评论，或者用讽刺的方式表达不满，而不是直接沟通问题。"
            },
            social: {
                title: "过度社交型",
                description: "你的室友是典型的「过度社交型」。TA的社交需求很高，可能会不考虑你的个人空间和安静需求。这表现为频繁邀请朋友到宿舍，在公共区域大声交谈或播放音乐，或者在你想要独处时打扰你。"
            }
        };
        
        // 检查是否有明显的混合型
        if (percentages.lazy >= 30 && percentages.sarcasm >= 30) {
            return {
                title: "懒散刻薄混合型",
                description: "你的室友展现出「懒散刻薄混合型」的特征，既不愿承担责任，又喜欢用刻薄言语掩饰自己的懒惰。TA不仅会推脱任务，还会用尖酸的评论让人感到不舒服，这种组合尤其令人头疼，因为TA既不做事，还会对别人的努力进行贬低。"
            };
        }
        
        if (percentages.lazy >= 30 && percentages.social >= 30) {
            return {
                title: "选择性精力型",
                description: "你的室友展现出「选择性精力型」的特征。TA对社交活动充满热情和精力，却对家务和责任表现得极为懒散。TA可能会为了组织派对花费大量精力，却懒得洗碗或打扫卫生，这种行为模式表明TA只会将精力用在自己感兴趣的活动上。"
            };
        }
        
        if (percentages.sarcasm >= 30 && percentages.social >= 30) {
            return {
                title: "戏剧社交型",
                description: "你的室友展现出「戏剧社交型」的特征。TA既有强烈的社交需求，又喜欢用刻薄或讽刺的方式表达自己。这种组合使TA成为社交场合的中心，但也可能让周围的人感到不舒服，因为TA的幽默常带有尖锐的边缘，让人难以分辨是玩笑还是批评。"
            };
        }
        
        return patterns[maxType] || { title: "未知类型", description: "无法分析行为模式。" };
    }

    // 生成应对策略函数
    function generateStrategies(percentages) {
        const strategies = [];
        
        if (percentages.lazy > 30) {
            strategies.push("建立明确的家务分配表，并拍照保存作为证据");
            strategies.push("设置具体的截止日期和后果，避免拖延");
            strategies.push("为食物和个人物品使用标签或单独的存储空间");
        }
        
        if (percentages.sarcasm > 30) {
            strategies.push("保持冷静，避免情绪化回应，这可能会进一步激化情况");
            strategies.push("使用\"我感受\"句式进行沟通，如\"当你说...时，我感到...\"");
            strategies.push("记录所有重要的对话和协议，避免后续争议");
        }
        
        if (percentages.social > 30) {
            strategies.push("建立明确的\"安静时间\"规则，用于学习或休息");
            strategies.push("投资高质量的降噪耳机，创建个人安静空间");
            strategies.push("提前沟通你的时间表和需求，尤其是重要事件前");
        }
        
        // 添加通用策略
        strategies.push("保持定期的室友会议，讨论问题并寻找解决方案");
        strategies.push("学习设定健康的界限，坚定而尊重地表达你的需求");
        
        return strategies;
    }

    // 添加"查看本次总结"按钮
    function addSummaryButton() {
        const typeModal = document.getElementById('槽点-type-modal');
        if (!typeModal) return;
        
        // 创建一个独立的容器用于中间按钮
        const summaryContainer = document.createElement('div');
        summaryContainer.style.cssText = `
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        `;
        
        // 检查按钮是否已存在
        let viewSummaryBtn = document.getElementById('view-summary-btn');
        if (!viewSummaryBtn) {
            viewSummaryBtn = document.createElement('button');
            viewSummaryBtn.id = 'view-summary-btn';
            viewSummaryBtn.className = 'view-summary-btn';
            viewSummaryBtn.textContent = '查看本次总结';
            viewSummaryBtn.style.cssText = `
                background-color: #4caf50;
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s;
            `;
            
            viewSummaryBtn.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#45a049';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });
            
            viewSummaryBtn.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#4caf50';
                this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            });
            
            viewSummaryBtn.addEventListener('click', function(event) {
                event.preventDefault();
                console.log("总结按钮被点击");
                showCurrentSummary();
            });
            
            summaryContainer.appendChild(viewSummaryBtn);
            
            // 将总结按钮添加到模态框底部
            const modalContent = typeModal.querySelector('.槽点-modal-content');
            modalContent.appendChild(summaryContainer);
        }
    }

    // 添加本地吐槽生成函数，不依赖服务器
    function generateLocalRoast(events) {
        // 提取所有选择的行为类型
        const categories = events.map(event => event.title);
        const behaviorTexts = events.map(event => 
            event.behaviors.map(b => b.text)
        ).flat();
        
        console.log("生成本地吐槽，行为:", behaviorTexts);
        
        // 吐槽模板库
        const roastTemplates = [
            "你这室友是集💤懒散、🔥作妖和🤡社恐于一身的完美典范啊！",
            "你室友这操作我直呼内行，简直是让人抓狂的艺术家～🎨",
            "这哪是室友啊，简直是祖传生活整蛊大师🧙‍♂️，建议申请专利！",
            "我不是专家，但你室友这些行为已经可以评为年度槽点王了👑",
            "你室友这是把\"麻烦制造机\"玩出了新高度，堪称行业标杆💯",
            "你室友是不是把\"如何气死室友100种方法\"当成了人生指南？🤔",
            "这些行为简直是教科书级别的\"如何快速失去室友\"案例！📚",
            "你室友这些骚操作，我愿称之为年度最佳室友灾难片男/女主角！🏆",
            "你的忍耐力已经达到了奥运冠军水平，建议申请吉尼斯纪录！🥇",
            "看完这些我只想说：你室友是来自异次元的生物吧？👽"
        ];
        
        // 行为特定的吐槽
        const behaviorSpecificRoasts = {
            "半夜潜行动作": "你室友这半夜鬼鬼祟祟的行动力，用在学习上早就考上哈佛了！🌙👻",
            "厨卫尴尬现场": "你室友是把厨卫当成了实验室吗？这些\"创新发明\"可以申请专利了！🚿🧪",
            "声光轰炸": "你室友是不是以为租了整栋楼？这音量和灯光秀堪比演唱会啊！🔊💡",
            "食物失踪记": "你室友这个食物处理能力，比《十宗罪》还离谱，FBI可以来取经了！🍔🕵️",
            "私人物品创新": "你室友对你物品的\"创意再利用\"，简直是垃圾分类大师和环保先锋啊！♻️👑",
            "快递/收纳灾难": "你室友的收纳哲学大概是\"混沌即艺术\"吧？这乱放技术已经达到了艺术境界！📦🎨",
            "社交/消息轰炸": "你室友是把社交软件当成了氧气泵吗？这消息频率简直是在刷KPI！📱💬",
            "游戏/追剧成瘾": "你室友不是在打游戏就是在追剧的路上，这专注度用在工作上早就升CEO了！🎮📺",
            "门禁/安全失误": "你室友对门锁的创新使用方式，连专业锁匠都得自愧不如！🔐👨‍🔧",
            "紧急场景": "你室友制造的这些\"紧急情况\"，简直比好莱坞灾难片编剧还有想象力！🚨🎬"
        };
        
        // 根据行为选择合适的吐槽
        let finalRoast = "";

        // 如果只有一个类别，使用该类别的专属吐槽
        if (categories.length === 1 && behaviorSpecificRoasts[categories[0]]) {
            finalRoast = behaviorSpecificRoasts[categories[0]];
        } 
        // 如果有多个类别，组合通用吐槽和随机特定吐槽
        else if (categories.length > 1) {
            // 选择一个随机的通用模板
            const baseRoast = roastTemplates[Math.floor(Math.random() * roastTemplates.length)];
            
            // 选择一个随机的行为特定吐槽（如果有）
            const availableSpecificRoasts = categories
                .filter(cat => behaviorSpecificRoasts[cat])
                .map(cat => behaviorSpecificRoasts[cat]);
            
            if (availableSpecificRoasts.length > 0) {
                const specificRoast = availableSpecificRoasts[Math.floor(Math.random() * availableSpecificRoasts.length)];
                finalRoast = baseRoast + " " + specificRoast;
            } else {
                finalRoast = baseRoast;
            }
        }
        // 如果选项很少，使用默认吐槽
        else {
            finalRoast = roastTemplates[Math.floor(Math.random() * roastTemplates.length)];
        }
        
        return finalRoast;
    }

    // 修改AI吐槽生成函数，使其适合服务器API格式
    async function generateAIRoast(events) {
        // 提取所有选择的行为文本
        const behaviorTexts = events.map(event => {
            return `${event.title}: ${event.behaviors.map(b => b.text).join('、')}`;
        }).join('；');
        
        console.log("准备发送行为到服务器:", behaviorTexts);
        
        try {
            // 构造符合服务器期望的聊天历史格式
            const chatHistory = [
                {
                    role: "system",
                    content: "你是一个能生成幽默吐槽的AI。用户将描述室友的行为，你需要生成一段吐槽。"
                },
                {
                    role: "user",
                    content: `请根据以下室友行为，生成一段幽默风趣的吐槽（4-6句话）：
${behaviorTexts}

要求：
1. 使用生活化、年轻人的语言风格
2. 融入当下流行的梗和emoji表情
3. 表达应该带有讽刺但不过分刻薄
4. 直接输出吐槽内容，不要加引号或提示语`
                }
            ];
            
            // 调用API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    history: chatHistory 
                })
            });
            
            if (!response.ok) {
                throw new Error('API请求失败: ' + response.status);
            }
            
            const data = await response.json();
            console.log('收到API吐槽响应:', data);
            
            // 返回生成的吐槽
            return data.response;
        } catch (error) {
            console.error("生成AI吐槽失败:", error);
            // 如果API调用失败，回退到本地模板
            return generateLocalRoast(events);
        }
    }

    // 修改showCurrentSummary函数，添加使用AI生成吐槽的选项
    async function showCurrentSummary() {
        console.log("显示总结...");
        
        // 如果没有currentSessionScores，创建一个模拟数据
        if (typeof currentSessionScores === 'undefined' || !currentSessionScores.events || currentSessionScores.events.length === 0) {
            currentSessionScores = {
                lazy: Math.random() * 10,
                sarcasm: Math.random() * 10,
                social: Math.random() * 10,
                events: [{ 
                    type: 'night', 
                    title: '半夜潜行动作',
                    behaviors: [{ text: "半夜进房搬走你的充电线" }] 
                }],
                categories: { night: 1 }
            };
        }
        
        // 显示加载中的提示
        const loadingModal = document.createElement('div');
        loadingModal.className = '槽点-modal';
        loadingModal.id = '槽点-loading-modal';
        loadingModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        loadingModal.innerHTML = `
            <div style="
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
            ">
                <div class="loading" style="
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border: 3px solid rgba(0,0,0,.1);
                    border-radius: 50%;
                    border-top-color: #4caf50;
                    animation: spin 1s infinite linear;
                    margin-bottom: 15px;
                "></div>
                <p>AI正在生成专业吐槽...</p>
            </div>
        `;
        
        document.body.appendChild(loadingModal);
        
        // 隐藏类型模态框
        const typeModal = document.getElementById('槽点-type-modal');
        if (typeModal) {
            typeModal.classList.add('hidden');
        }
        
        // 计算总百分比
        const totalSum = currentSessionScores.lazy + currentSessionScores.sarcasm + currentSessionScores.social;
        
        // 避免除以零
        let totalPercentages = {
            lazy: 33,
            sarcasm: 33,
            social: 34
        };
        
        if (totalSum > 0) {
            totalPercentages = {
                lazy: Math.round((currentSessionScores.lazy / totalSum) * 100),
                sarcasm: Math.round((currentSessionScores.sarcasm / totalSum) * 100),
                social: Math.round((currentSessionScores.social / totalSum) * 100)
            };
            
            // 修正百分比总和为100%
            const sum = totalPercentages.lazy + totalPercentages.sarcasm + totalPercentages.social;
            if (sum !== 100) {
                // 找到最大值调整
                const maxKey = Object.keys(totalPercentages).reduce((a, b) => 
                    totalPercentages[a] > totalPercentages[b] ? a : b
                );
                totalPercentages[maxKey] += (100 - sum);
            }
        }
        
        // 生成室友行为模式分析和策略
        const behaviorPattern = generateRoommatePattern(totalPercentages);
        const strategies = generateStrategies(totalPercentages);
        
        // 尝试使用AI生成吐槽内容
        let aiRoast;
        try {
            aiRoast = await generateAIRoast(currentSessionScores.events);
        } catch (error) {
            console.error("AI吐槽生成失败，使用本地模板:", error);
            aiRoast = generateLocalRoast(currentSessionScores.events);
        }
        
        // 移除加载提示
        document.body.removeChild(loadingModal);
        
        // 创建总结模态框
        const summaryModal = document.createElement('div');
        summaryModal.className = '槽点-modal';
        summaryModal.id = '槽点-summary-modal';
        summaryModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        summaryModal.innerHTML = `
            <div class="槽点-modal-content" style="
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">
                <h2 style="margin-top: 0; color: #333; text-align: center;">室友行为分析</h2>
                
                <div style="
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin-top: 0; color: #f44336;">AI扎心吐槽</h3>
                    <p style="line-height: 1.6; font-style: italic; background-color: #fff8f8; padding: 15px; border-left: 5px solid #f44336; border-radius: 0 8px 8px 0; font-size: 1.1em;">${aiRoast}</p>
                </div>
                
                <div style="
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin-top: 0; color: #4caf50;">行为评分</h3>
                    
                    <div style="margin: 15px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="width: 80px; font-weight: bold;">懒散度:</span>
                            <div style="
                                flex-grow: 1;
                                height: 20px;
                                background-color: #f0f0f0;
                                border-radius: 10px;
                                overflow: hidden;
                                position: relative;
                            ">
                                <div style="
                                    width: ${totalPercentages.lazy}%;
                                    height: 100%;
                                    background-color: #ff9800;
                                    border-radius: 10px;
                                "></div>
                                <span style="
                                    position: absolute;
                                    right: 10px;
                                    top: 0;
                                    font-weight: bold;
                                ">${totalPercentages.lazy}%</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="width: 80px; font-weight: bold;">毒舌度:</span>
                            <div style="
                                flex-grow: 1;
                                height: 20px;
                                background-color: #f0f0f0;
                                border-radius: 10px;
                                overflow: hidden;
                                position: relative;
                            ">
                                <div style="
                                    width: ${totalPercentages.sarcasm}%;
                                    height: 100%;
                                    background-color: #f44336;
                                    border-radius: 10px;
                                "></div>
                                <span style="
                                    position: absolute;
                                    right: 10px;
                                    top: 0;
                                    font-weight: bold;
                                ">${totalPercentages.sarcasm}%</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center;">
                            <span style="width: 80px; font-weight: bold;">社交度:</span>
                            <div style="
                                flex-grow: 1;
                                height: 20px;
                                background-color: #f0f0f0;
                                border-radius: 10px;
                                overflow: hidden;
                                position: relative;
                            ">
                                <div style="
                                    width: ${totalPercentages.social}%;
                                    height: 100%;
                                    background-color: #2196f3;
                                    border-radius: 10px;
                                "></div>
                                <span style="
                                    position: absolute;
                                    right: 10px;
                                    top: 0;
                                    font-weight: bold;
                                ">${totalPercentages.social}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin-top: 0; color: #2196f3;">行为模式: ${behaviorPattern.title}</h3>
                    <p style="line-height: 1.5;">${behaviorPattern.description}</p>
                </div>
                
                <div style="
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin-top: 0; color: #ff9800;">应对策略</h3>
                    <ul style="line-height: 1.5;">
                        ${strategies.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                
                <p style="text-align: center; color: #666; font-style: italic;">点击空白区域关闭</p>
            </div>
        `;
        
        // 添加点击关闭功能
        summaryModal.addEventListener('click', function(event) {
            if (event.target === summaryModal) {
                document.body.removeChild(summaryModal);
                if (typeModal) {
                    typeModal.classList.remove('hidden');
                }
            }
        });
        
        document.body.appendChild(summaryModal);
        
        // 修复按钮事件
        setTimeout(fixRefreshRoastButton, 100);
    }

    // 立即执行和页面加载后执行
    function initializeSummaryButton() {
        console.log("初始化总结按钮...");
        addSummaryButton();
    }

    // 立即执行
    setTimeout(initializeSummaryButton, 500);

    // 页面加载后执行
    setTimeout(initializeSummaryButton, 1000);

    // 修改更新类别计数器函数，使其基于已选择的行为项
    function updateCategoryCounters() {
        // 总计数显示
        const typeModalContent = document.querySelector('.槽点-modal-content');
        
        // 如果总计数元素不存在则创建
        let totalCounter = document.getElementById('槽点-total-counter');
        if (!totalCounter) {
            totalCounter = document.createElement('div');
            totalCounter.id = '槽点-total-counter';
            totalCounter.style.cssText = `
                background-color: #4caf50;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                text-align: center;
                margin: 15px auto;
                max-width: 200px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            typeModalContent.insertBefore(totalCounter, typeModalContent.firstChild);
        }
        
        // 计算所有类别中已选择的行为项总数
        let totalSelectedBehaviors = 0;
        Object.values(currentSessionBehaviors).forEach(behaviors => {
            totalSelectedBehaviors += behaviors.length;
        });
        
        // 更新总计数
        totalCounter.textContent = `已选择 ${totalSelectedBehaviors} 个行为`;
        
        // 更新各类别的计数
        const typeItems = document.querySelectorAll('.槽点-type-item');
        typeItems.forEach(item => {
            const type = item.getAttribute('data-type');
            
            // 获取该类别中已选择的行为项数量
            const selectedBehaviors = currentSessionBehaviors[type] || [];
            const count = selectedBehaviors.length;
            
            // 查找或创建计数器
            let counter = item.querySelector('.槽点-category-counter');
            if (!counter && count > 0) {
                counter = document.createElement('span');
                counter.className = '槽点-category-counter';
                counter.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: #f44336;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    font-weight: bold;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;
                item.style.position = 'relative';
                item.appendChild(counter);
            }
            
            // 更新或删除计数器
            if (counter) {
                if (count > 0) {
                    counter.textContent = count;
                } else {
                    item.removeChild(counter);
                }
            }
        });
    }

    // 在初始化最后添加:
    setTimeout(updateCategoryCounters, 500);

    // 修复刷新吐槽按钮的事件处理程序
    function fixRefreshRoastButton() {
        const refreshRoastBtn = document.getElementById('refresh-roast-btn');
        if (refreshRoastBtn) {
            refreshRoastBtn.addEventListener('click', async function() {
                console.log("点击换一个吐槽按钮");
                
                // 找到吐槽文本元素 - 更精确定位
                const roastSection = this.closest('div[style*="background-color: #f9f9f9"]');
                const roastParagraph = roastSection.querySelector('p');
                if (!roastParagraph) {
                    console.error("找不到吐槽文本元素");
                    return;
                }
                
                const originalRoastText = roastParagraph.innerHTML;
                roastParagraph.innerHTML = '<span style="display:inline-block;width:20px;height:20px;border:3px solid rgba(0,0,0,.1);border-radius:50%;border-top-color:#f44336;animation:spin 1s infinite linear;margin-right:10px;vertical-align:middle;"></span> 重新生成吐槽中...';
                
                try {
                    // 尝试使用服务器API生成
                    const newRoast = await generateAIRoast(currentSessionScores.events);
                    roastParagraph.innerHTML = newRoast;
                } catch (error) {
                    console.error("刷新吐槽失败，使用本地生成:", error);
                    const localRoast = generateLocalRoast(currentSessionScores.events);
                    roastParagraph.innerHTML = localRoast;
                }
            });
        }
    }
});

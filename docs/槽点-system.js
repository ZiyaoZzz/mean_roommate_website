// 槽点回忆系统 - JavaScript
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
    const emotionItems = document.querySelectorAll('.槽点-emotion-item');
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
    let emotionRating = 3; // 默认情感评分
    
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
                { text: '深夜隔墙大喊"有鬼！"吓你', scores: { lazy: 0, sarcasm: 3, social: 1 } },
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
            title: '私人物品"创新"',
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
                { text: '半夜群里发"表情包大轰炸"', scores: { lazy: 0, sarcasm: 1, social: 3 } },
                { text: "不断给你转发同一个段子不带字幕", scores: { lazy: 1, sarcasm: 1, social: 2 } },
                { text: "直播斗鱼/抖音时开了麦克风", scores: { lazy: 1, sarcasm: 0, social: 3 } },
                { text: '给你备注名改成"沙雕室友"群发全员', scores: { lazy: 0, sarcasm: 3, social: 1 } },
            ]
        },
        gaming: {
            title: "游戏／追剧成瘾",
            behaviors: [
                { text: "占用客厅电视打游戏到凌晨", scores: { lazy: 1, sarcasm: 0, social: 2 } },
                { text: '边吃泡面边追剧，飘出"泡面味"', scores: { lazy: 2, sarcasm: 0, social: 1 } },
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
                { text: '半夜突降"灵异事件"要你陪查房', scores: { lazy: 0, sarcasm: 1, social: 3 } },
                { text: '突然来个"炉石练习"就不让你睡', scores: { lazy: 0, sarcasm: 2, social: 2 } },
                { text: '半夜"群殴"电视遥控器打赌', scores: { lazy: 0, sarcasm: 1, social: 3 } },
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
        { condition: score => score.lazy > 60, text: "这个室友的'懒散指数'爆表了！TA可能把拖延当成了一种生活艺术 🦥" },
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
            behaviorsTitle.textContent = `选择发生的行为 - ${selectedTypeTitle}`;
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
    
    // 加载行为选项
    function loadBehaviors(type) {
        const behaviors = behaviorData[type].behaviors;
        behaviorsContainer.innerHTML = '';
        
        behaviors.forEach((behavior, index) => {
            const behaviorItem = document.createElement('div');
            behaviorItem.className = '槽点-behavior-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `behavior-${index}`;
            checkbox.setAttribute('data-index', index);
            
            const label = document.createElement('label');
            label.setAttribute('for', `behavior-${index}`);
            label.textContent = behavior.text;
            
            const scores = document.createElement('span');
            scores.className = '槽点-behavior-scores';
            scores.textContent = `懒:${behavior.scores.lazy} 讽:${behavior.scores.sarcasm} 社:${behavior.scores.social}`;
            
            behaviorItem.appendChild(checkbox);
            behaviorItem.appendChild(label);
            behaviorItem.appendChild(scores);
            behaviorsContainer.appendChild(behaviorItem);
            
            // 添加复选框事件
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (this.checked) {
                    selectedBehaviors.push(behaviors[index]);
                } else {
                    selectedBehaviors = selectedBehaviors.filter(b => b !== behaviors[index]);
                }
            });
        });
    }
    
    // 事件监听 - 情感评分选择
    emotionItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有选中状态
            emotionItems.forEach(i => i.classList.remove('selected'));
            // 添加当前选中状态
            this.classList.add('selected');
            // 更新评分
            emotionRating = parseInt(this.getAttribute('data-value'));
        });
    });
    
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
    });
    
    // 事件监听 - 提交结果计算
    behaviorsSubmit.addEventListener('click', function() {
        if (selectedBehaviors.length === 0 && selectedType !== 'other') {
            alert('请至少选择一个行为！');
            return;
        }
        
        // 计算结果
        calculateResults();
        
        // 隐藏行为选择，显示结果
        behaviorsModal.classList.add('hidden');
        resultModal.classList.remove('hidden');
    });
    
    // 事件监听 - 再来一次
    resultAgain.addEventListener('click', function() {
        resultModal.classList.add('hidden');
        typeModal.classList.remove('hidden');
    });
    
    // 计算结果
    function calculateResults() {
        // 初始化分数
        let totalLazy = 0;
        let totalSarcasm = 0;
        let totalSocial = 0;
        
        // 累加所有选中行为的分数
        if (selectedType === 'other') {
            // 自定义行为使用滑块值
            totalLazy = parseInt(lazySlider.value);
            totalSarcasm = parseInt(sarcasmSlider.value);
            totalSocial = parseInt(socialSlider.value);
        } else {
            // 累加选中行为的分数
            selectedBehaviors.forEach(behavior => {
                totalLazy += behavior.scores.lazy;
                totalSarcasm += behavior.scores.sarcasm;
                totalSocial += behavior.scores.social;
            });
        }
        
        // 应用情感权重
        const emotionFactor = emotionRating / 3; // 将1-5的情感评分转换为权重因子
        totalLazy *= emotionFactor;
        totalSarcasm *= emotionFactor;
        totalSocial *= emotionFactor;
        
        // 归一化为百分比
        const total = totalLazy + totalSarcasm + totalSocial;
        const percentages = {
            lazy: total === 0 ? 0 : Math.round((totalLazy / total) * 100),
            sarcasm: total === 0 ? 0 : Math.round((totalSarcasm / total) * 100),
            social: total === 0 ? 0 : Math.round((totalSocial / total) * 100)
        };
        
        // 处理总和不为100的情况
        const sum = percentages.lazy + percentages.sarcasm + percentages.social;
        if (sum !== 100 && sum !== 0) {
            const diff = 100 - sum;
            const maxKey = Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b);
            percentages[maxKey] += diff;
        }
        
        // 更新UI
        updateResultDisplay(percentages);
    }

    // 更新结果显示
    function updateResultDisplay(percentages) {
        // 设置标题
        resultTitle.textContent = `本次槽点: "${selectedTypeTitle}"`;
        
        // 更新百分比条
        lazyBar.style.width = `${percentages.lazy}%`;
        sarcasmBar.style.width = `${percentages.sarcasm}%`;
        socialBar.style.width = `${percentages.social}%`;
        
        lazyPercent.textContent = `${percentages.lazy}%`;
        sarcasmPercent.textContent = `${percentages.sarcasm}%`;
        socialPercent.textContent = `${percentages.social}%`;
        
        // 生成评论文案
        for (const template of commentTemplates) {
            if (template.condition(percentages)) {
                resultComment.textContent = template.text;
                break;
            }
        }
    }
});

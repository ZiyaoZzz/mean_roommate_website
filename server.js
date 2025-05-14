require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 启用CORS - 允许GitHub Pages访问
app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use(express.static('docs'));

// 使用环境变量中的Google凭证
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_CREDENTIALS_JSON;

// 查找服务账号文件
function findServiceAccountFile() {
  // 首先，获取当前工作目录
  const currentDir = process.cwd();
  console.log('当前工作目录:', currentDir);
  
  // 尝试在当前目录查找匹配的文件
  const files = fs.readdirSync(currentDir);
  const serviceAccountFile = files.find(file => file.startsWith('gen-lang-client-') && file.endsWith('.json'));
  
  if (serviceAccountFile) {
    return path.join(currentDir, serviceAccountFile);
  }
  
  // 检查是否有gemini-integration.js文件所在的目录
  const integrationDir = path.join(currentDir, path.dirname('gemini-integration.js'));
  if (fs.existsSync(integrationDir)) {
    const integrationFiles = fs.readdirSync(integrationDir);
    const integrationServiceAccountFile = integrationFiles.find(file => file.startsWith('gen-lang-client-') && file.endsWith('.json'));
    if (integrationServiceAccountFile) {
      return path.join(integrationDir, integrationServiceAccountFile);
    }
  }
  
  return null;
}

const SERVICE_ACCOUNT_FILE = findServiceAccountFile();

if (!SERVICE_ACCOUNT_FILE) {
  console.error('服务账号文件未找到。请确保文件名以gen-lang-client-开头并以.json结尾');
  process.exit(1);
}

console.log('使用服务账号文件:', SERVICE_ACCOUNT_FILE);

const auth = new GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: 'https://www.googleapis.com/auth/generative-language'
});

// 获取访问令牌
let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (!accessToken || Date.now() > tokenExpiry) {
    try {
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      accessToken = token.token;
      tokenExpiry = Date.now() + 50 * 60 * 1000;
      console.log('成功获取新的访问令牌');
    } catch (error) {
      console.error('获取访问令牌失败:', error);
      throw error;
    }
  }
  return accessToken;
}

// API端点用于生成室友回应
app.post('/api/generate', async (req, res) => {
  try {
    console.log('收到请求:', req.body);
    
    // 获取访问令牌
    const token = await getAccessToken();
    
    const { tone, context } = req.body;
    
    let prompt = "";
    
    switch (tone) {
      case "passive":
        prompt = "生成一个冷暴力室友逃避责任的回应。回应应简短(1-2句)，冷漠且敷衍。请使其听起来真实。";
        break;
      case "pitiful":
        prompt = "生成一个可怜兮兮的室友逃避责任的借口。回应应让人觉得他在扮演受害者(1-2句)。请使其听起来真实且让人有罪恶感。";
        break;
      case "sophistry":
        prompt = "生成一个通过歪曲逻辑逃避责任的室友操纵性回应。回应应简短(1-2句)，使用煤气灯效应技巧，并试图转移责任。请使其听起来真实。";
        break;
      default:
        prompt = "生成一个室友逃避责任的敷衍回应。保持在1-2句话，使其听起来真实。";
    }
    
    // 添加上下文
    if (context && context.issues && context.issues.length > 0) {
      prompt += " 回应应与以下问题之一相关: " + context.issues.join(", ");
    }
    
    console.log('发送到Gemini的提示:', prompt);
    
    // 正确的API调用方式：Bearer token认证，无API密钥
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent',
      {
        contents: [{ 
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('响应状态:', response.status);
    
    // 从响应中提取生成的文本
    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('生成的文本:', generatedText);
    
    // 返回结果，删除可能的引号
    res.json({ 
      response: generatedText.replace(/^["'](.*)["']$/, '$1') 
    });
    
  } catch (error) {
    console.error("生成内容错误:", error);
    
    // 提供更详细的错误信息
    let errorMessage = "生成回应失败";
    let errorDetails = error.message;
    
    if (error.response) {
      console.error("API错误响应:", JSON.stringify(error.response.data, null, 2));
      errorDetails = JSON.stringify(error.response.data);
    }
    
    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails 
    });
  }
});

// 添加一个用于测试的路由，列出可用模型
app.get('/api/list-models', async (req, res) => {
  try {
    // 获取访问令牌
    const token = await getAccessToken();
    
    // 使用Bearer认证方式列出模型
    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('可用模型:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error("列出模型错误:", error);
    res.status(500).json({ 
      error: "列出模型失败", 
      details: error.message 
    });
  }
});

// 在server.js中添加这个新的API端点
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到聊天请求', req.body);
    
    // 获取访问令牌
    const token = await getAccessToken();
    
    const { history } = req.body;
    
    if (!history || !Array.isArray(history)) {
      throw new Error('缺少有效的聊天历史');
    }

    // Mean室友系统提示
    const SYSTEM_PROMPT = "你是一个冷漠、被动、刻薄、逃避责任的室友。你不喜欢聊天，也不愿意帮忙。回应要简短、冷淡、敷衍，最好带点酸味。你讨厌做家务，总是找借口推脱责任。你的回复要多样化，不要重复同样的句子。";
    
    // 构建请求内容
    let contents = [];
    
    // 添加系统提示
    contents.push({
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }]
    });
    
    // 添加模型确认
    contents.push({
      role: "model",
      parts: [{ text: "明白了，我会扮演一个冷漠刻薄的室友。" }]
    });
    
    // 添加实际对话历史
    for (let msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
    
    // 调用Gemini API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent',
      {
        contents: contents,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // 从响应中提取生成的文本
    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('生成的回复:', generatedText);
    
    // 返回结果
    res.json({ 
      response: generatedText 
    });
    
  } catch (error) {
    console.error("聊天生成错误:", error);
    
    // 提供Mean室友风格的回复，即使出错
    const meanResponses = [
      "管好你自己的事吧，我现在没心情聊天。",
      "又来烦我？我很忙的，知道吗？",
      "我不想谈这个，你能不能自己解决一次？",
      "你总是这样，有完没完啊？",
      "随便吧，反正你说了算。"
    ];
    
    const randomResponse = meanResponses[Math.floor(Math.random() * meanResponses.length)];
    
    res.json({ 
      response: randomResponse 
    });
  }
});

// 健康检查端点（Render需要）
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
}); 
import { ChatMessage, MessageRole, GameState, SetupStep } from './types';

export async function callGeminiAPI(messages: ChatMessage[], gameState: GameState) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('API Key missing.');

  const targetMembersInfo = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `${m.name}（${m.stageName}，${m.group}）`)
    .join('、') || '无';

  const targetMembersDetail = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `- ${m.name}：公开人设"${m.publicPersona}"，真实性格"${m.realPersonality}"`)
    .join('\n');

  const playerIdentity = gameState.identity?.join(', ') || '普通人';
  const memory = gameState.hiddenSummary ? `\n【剧情记忆】${gameState.hiddenSummary}` : '';
  const cardMemory = gameState.collectedCards?.length
    ? `\n【已收录人物】${gameState.collectedCards.map((c: any) => c.name).join('、')}` : '';

  const currentAffection = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `${m.name} ${m.affection}/100`)
    .join(' | ');

  const isInitialSetup = gameState.setupStep === SetupStep.CARDS;

  const systemPrompt = `你是《爱豆收集梦想生活》的DM。
玩家：${gameState.playerName}，${gameState.playerAge}岁，${playerIdentity}。
攻略目标：${targetMembersInfo}
目标爱豆性格设定：
${targetMembersDetail}
${memory}${cardMemory}

【当前状态】
好感度：${currentAffection}
第${gameState.turnCount || 1}周 | 场景：${gameState.currentScene || '首尔'}
回归期：${gameState.isComebackSetting ? '是' : '否'}

════════════════════════
核心规则
════════════════════════

【语言】全程只用中文，禁止韩语日语原文。

【节奏规则】
- 同一场景/事件最多进行3轮对话，第3轮必须自然结束并推进到下一个场景或下一周
- 每隔3-5轮推进一次周数（weekCount+1）
- 周数推进时 isWeekEnd 设为 true，其他时候设为 false

【好感度规则】
- 每轮根据互动质量更新 affection（+2~+8 正面，-2~-5 负面，+1~+2 普通）
- 必须在 SNAPSHOT 里体现变化

【回归期规则】
- 剧情自然推进到回归期时，将 isComebackSetting 设为 true
- 回归期内每隔几轮触发一次打歌节目，随机计算一位结果并输出 MUSICSHOW
- 回归期结束后将 isComebackSetting 设为 false

【选项规则】
每轮必须提供3个具体行动选项，格式如下：
A. [具体行动，15字内]
B. [具体行动，15字内]
C. [具体行动，15字内]
禁止写"继续前进""观察周围"等废话选项。

【UI触发规则】
根据剧情自然触发，不要强行插入：
- 有人发手机消息 → 输出 KKTMSG
- 爱豆发Weverse → 输出 WEVERSE
- 爱豆发Bubble → 输出 BUBBLE
- 浏览论坛/有热帖 → 输出 THEQOO
- 打歌节目出一位 → 输出 MUSICSHOW

【收集档案规则】
- 角色第一次实质登场时生成 CARD
- 每轮最多1张，已收录的不重复生成

════════════════════════
${isInitialSetup
  ? '【初始化】为目标爱豆生成角色卡，然后开启第一幕。第一幕要真实日常，偶然相遇，符合爱豆性格，禁止"四目相对心跳加速"。'
  : '【剧情推进】推动故事，好感度必须变化，选项必须具体紧扣当前剧情。'}
════════════════════════

回复格式（严格按此顺序输出）：

[剧情正文 150-300字]

（如有角色卡）
CARD_START
{"name":"中文名","stageName":"英文名","group":"团体","status":"状态","publicPersona":"公开人设","realPersonality":"真实性格","weaknesses":["特点1","特点2"],"hiddenStory":"特殊记忆"}
CARD_END

（如有KKT消息）
KKTMSG_START
{"sender":"发信人","avatar":"😊","messages":[{"text":"消息内容","time":"14:23","isRead":false}]}
KKTMSG_END

（如有Weverse）
WEVERSE_START
{"artist":"爱豆中文名","group":"团体","content":"帖子内容","imageDesc":null,"likes":12800,"comments":3400,"time":"1小时前"}
WEVERSE_END

（如有Bubble）
BUBBLE_START
{"artist":"爱豆中文名","group":"团体","messages":[{"text":"消息内容","time":"22:15","hasImage":false}]}
BUBBLE_END

（如有热帖）
THEQOO_START
{"title":"帖子标题","category":"아이돌","viewsCount":48392,"likesCount":1823,"commentsCount":247,"comments":[{"authorId":"user1","content":"评论内容","translation":""},{"authorId":"user2","content":"评论内容","translation":""},{"authorId":"user3","content":"评论内容","translation":""}]}
THEQOO_END

（如有打歌节目）
MUSICSHOW_START
{"winner":"团体名","scores":[{"group":"团体名","digital":3200,"physical":1100,"sns":2400,"preVote":1600,"broadcast":700,"total":9000}]}
MUSICSHOW_END

选项（每轮必须有）：
A. [具体行动]
B. [具体行动]
C. [具体行动]

状态快照（每轮必须有，必须是合法JSON，不能写成文字描述）：
SNAPSHOT_START
{"members":[{"id":"英文小写id","affection":数字,"careerPressure":数字,"status":"当前状态"}],"currentScene":"地点","weekCount":数字,"isWeekEnd":true或false,"hiddenSummary":"2-3句摘要","isComebackSetting":true或false,"groupHeats":[]}
SNAPSHOT_END

════════════════════════
禁止事项：
- 禁止把SNAPSHOT写成文字描述，必须是JSON
- 禁止省略选项
- 禁止省略SNAPSHOT
- 禁止出现韩语日语原文
- 禁止同一场景超过3轮不推进
════════════════════════`;

  try {
    const cleanHistory = messages.slice(-6).map(msg => ({
      ...msg,
      content: msg.role === MessageRole.ASSISTANT
        ? msg.content
            .replace(/SNAPSHOT_START[\s\S]*?SNAPSHOT_END/g, '')
            .replace(/THEQOO_START[\s\S]*?THEQOO_END/g, '')
            .replace(/KKTMSG_START[\s\S]*?KKTMSG_END/g, '')
            .replace(/WEVERSE_START[\s\S]*?WEVERSE_END/g, '')
            .replace(/BUBBLE_START[\s\S]*?BUBBLE_END/g, '')
            .replace(/MUSICSHOW_START[\s\S]*?MUSICSHOW_END/g, '')
            .replace(/CARD_START[\s\S]*?CARD_END/g, '')
            .trim()
        : msg.content
    }));

    const chatMessages: { role: 'user' | 'assistant'; content: string }[] = cleanHistory.map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content || ''
    }));

    if (chatMessages.length === 0) chatMessages.push({ role: 'user', content: '开始故事' });
    if (chatMessages[0].role !== 'user') chatMessages.unshift({ role: 'user', content: '继续故事' });

    // 在最后一条用户消息加格式提醒
    const lastUserIdx = chatMessages.map(m => m.role).lastIndexOf('user');
    if (lastUserIdx !== -1) {
      chatMessages[lastUserIdx].content += '\n[必须包含A/B/C选项和SNAPSHOT_START...SNAPSHOT_END]';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    let response: Response;
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 4096,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) throw new Error('API Key 无效。');
      if (response.status === 429) throw new Error('请求过于频繁，请稍后再试。');
      if (response.status === 402) throw new Error('DeepSeek 余额不足，请充值。');
      throw new Error(`DeepSeek API 错误 (${response.status})：${errText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text || text.trim() === '') throw new Error('AI 返回内容为空。');
    return text;

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('通讯超时，请重试。');
    throw error;
  }
}

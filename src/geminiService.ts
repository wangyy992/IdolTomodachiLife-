import { ChatMessage, MessageRole, GameState, SetupStep } from './types';

export async function callGeminiAPI(messages: ChatMessage[], gameState: GameState) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('API Key missing. Please check Settings > Secrets.');

  const targetMembersInfo = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `${m.name}（${m.stageName}，${m.group}）`)
    .join('、') || '无';

  const targetMembersDetail = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `- ${m.name}（${m.stageName}）：公开人设"${m.publicPersona}"，真实性格"${m.realPersonality}"`)
    .join('\n');

  const playerIdentity = gameState.identity?.join(', ') || '普通人';
  const memory = gameState.hiddenSummary ? `【剧情记忆】${gameState.hiddenSummary}` : '';
  const cardMemory = gameState.collectedCards?.length
    ? `【已收录人物】${gameState.collectedCards.map((c: any) => c.name).join('、')}` : '';

  const isInitialSetup = gameState.setupStep === SetupStep.CARDS;

  // 当前属性状态，每轮都注入，让AI随时看到
  const currentStats = `
好感度：${gameState.members.filter(m => gameState.targets.includes(m.id)).map(m => `${m.name} ${m.affection}/100`).join(' | ')}
心情值：${gameState.playerMood}/100
金钱：W${(gameState.playerMoney || 0).toLocaleString()}
第${gameState.turnCount || 1}周 | 场景：${gameState.currentScene || '首尔'}
回归期：${gameState.isComebackSetting ? '是' : '否'}`;

  const systemPrompt = `你是《爱豆收集梦想生活》的DM（游戏主持人）。
玩家：${gameState.playerName}，${gameState.playerAge}岁，${playerIdentity}。
攻略目标：${targetMembersInfo}
${targetMembersDetail ? `\n目标爱豆详细设定：\n${targetMembersDetail}` : ''}
${memory ? `\n${memory}` : ''}
${cardMemory ? `\n${cardMemory}` : ''}

【当前属性】
${currentStats}

═══════════════════════════════════
核心规则
═══════════════════════════════════

【语言】全程只用中文，包括爱豆说话也用中文，禁止出现韩语或日语原文。

【属性更新规则】每轮必须更新以下属性：
- 好感度：有实质互动 +2~+8，负面互动 -2~-5，普通接触 +1~+2
- 心情值：正面事件 +3~+8，挫折/冷场 -3~-10，平淡 ±1~2
- 金钱：每次消费必须扣除（咖啡W4500/打车W10000/餐厅W15000/礼物W30000/专辑W300000/投票W50000）
- 周数：每周行程结束后+1

【选项规则】每轮必须提供3个选项，格式固定如下：
A. [具体行动，15字内]
B. [具体行动，15字内]  
C. [具体行动，15字内]
D. 自由行动（玩家自己输入）
禁止写"继续前进""观察周围"这类废话。

【UI触发规则】根据剧情自然触发：
- 有人发手机消息 → 触发 (kkt_message)
- 爱豆发Weverse帖 → 触发 (weverse_post)
- 爱豆发Bubble → 触发 (bubble_message)
- 浏览论坛/有热帖 → 触发 (theqoo_post)
- 打歌节目一位 → 触发 (music_show)
- 周数+1时 → state_snapshot里 isWeekEnd=true

【收集档案】满足以下条件时生成 (character_card)：
- 该角色本轮有实质登场（有台词/互动）
- 是第一次登场
- 不是路人甲
- 每轮最多1张

═══════════════════════════════════
${isInitialSetup ? '【初始化】为目标爱豆生成角色卡，然后开始第一幕剧情。第一幕要求：真实日常场景，偶然相遇，符合爱豆性格，禁止"四目相对心跳加速"。' : '【剧情推进】推动故事发展，属性必须变化，选项必须具体。'}
═══════════════════════════════════

回复格式（严格按此顺序）：

【第一部分：剧情正文】
150-300字，真实生动，全程中文。

【第二部分：UI组件（有则输出，无则省略）】

(character_card)
{"name":"中文名","stageName":"英文名","group":"团体","status":"当前状态","publicPersona":"公开人设","realPersonality":"真实性格","weaknesses":["特点1","特点2"],"hiddenStory":"与玩家相关的特殊记忆"}
(/character_card)

(kkt_message)
{"sender":"发信人姓名","avatar":"😊","messages":[{"text":"消息内容","time":"14:23","isRead":false}]}
(/kkt_message)

(weverse_post)
{"artist":"爱豆中文名","group":"团体名","content":"帖子内容","imageDesc":null,"likes":12800,"comments":3400,"time":"1小时前"}
(/weverse_post)

(bubble_message)
{"artist":"爱豆中文名","group":"团体名","messages":[{"text":"消息内容","time":"22:15","hasImage":false}]}
(/bubble_message)

(theqoo_post)
{"title":"帖子标题","category":"아이돌","viewsCount":48392,"likesCount":1823,"commentsCount":247,"comments":[{"authorId":"user1","content":"评论内容（中文）","translation":""},{"authorId":"user2","content":"评论内容（中文）","translation":""},{"authorId":"user3","content":"评论内容（中文）","translation":""}]}
(/theqoo_post)

(music_show)
{"winner":"团体名","scores":[{"group":"团体名","digital":3200,"physical":1100,"sns":2400,"preVote":1600,"broadcast":700,"total":9000}]}
(/music_show)

【第三部分：选项（每轮必须有）】
A. [具体行动]
B. [具体行动]
C. [具体行动]
D. 自由行动

【第四部分：属性快照（每轮必须有）】
(state_snapshot)
{"members":[{"id":"英文小写id","affection":数字,"careerPressure":数字,"companyAlertness":数字,"privacy":数字,"status":"当前状态描述"}],"playerMood":数字,"playerMoney":数字,"currentScene":"地点","weekCount":数字,"isWeekEnd":true或false,"hiddenSummary":"2-3句本轮剧情摘要","isComebackSetting":true或false,"groupHeats":[{"name":"团体名","heat":数字,"isPlayerTarget":true或false}],"playerImpact":{"albumImpact":0,"voteImpact":0},"hasContributedThisWeek":false}
(/state_snapshot)

═══════════════════════════════════
禁止事项
- 禁止标签用方括号[tag]或尖括号<tag>，只能用圆括号(tag)
- 禁止正文出现裸JSON
- 禁止选项写成JSON格式
- 禁止属性不变化
- 禁止出现韩语日语原文
- 禁止省略选项或state_snapshot
═══════════════════════════════════`;

  try {
    // 传给API的历史：只保留6条，且去掉JSON内容减少token
    const cleanHistory = messages.slice(-6).map(msg => ({
      ...msg,
      content: msg.role === MessageRole.ASSISTANT
        ? msg.content
            .replace(/\(state_snapshot\)[\s\S]*?\(\/state_snapshot\)/gi, '')
            .replace(/\(theqoo_post\)[\s\S]*?\(\/theqoo_post\)/gi, '')
            .replace(/\(kkt_message\)[\s\S]*?\(\/kkt_message\)/gi, '')
            .replace(/\(weverse_post\)[\s\S]*?\(\/weverse_post\)/gi, '')
            .replace(/\(bubble_message\)[\s\S]*?\(\/bubble_message\)/gi, '')
            .replace(/\(music_show\)[\s\S]*?\(\/music_show\)/gi, '')
            .replace(/\(character_card\)[\s\S]*?\(\/character_card\)/gi, '')
            .replace(/\(options\)[\s\S]*?\(\/options\)/gi, '')
            .trim()
        : msg.content
    }));

    const chatMessages: { role: 'user' | 'assistant'; content: string }[] = cleanHistory.map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content || ''
    }));

    if (chatMessages.length === 0) chatMessages.push({ role: 'user', content: '开始故事' });
    if (chatMessages[0].role !== 'user') chatMessages.unshift({ role: 'user', content: '继续故事' });

    // 在用户消息后面加格式提醒
    const lastUserIdx = chatMessages.map(m => m.role).lastIndexOf('user');
    if (lastUserIdx !== -1) {
      chatMessages[lastUserIdx].content += '\n[请记住：回复必须包含A/B/C/D四个选项和(state_snapshot)]';
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
      if (response.status === 401) throw new Error('API Key 无效，请检查 VITE_DEEPSEEK_API_KEY。');
      if (response.status === 429) throw new Error('请求过于频繁，请稍后再试。');
      if (response.status === 402) throw new Error('DeepSeek 余额不足，请充值。');
      throw new Error(`DeepSeek API 错误 (${response.status})：${errText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text || text.trim() === '') throw new Error('AI 返回内容为空。');
    return text;

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('通讯超时 (60s)，请重试。');
    throw error;
  }
}

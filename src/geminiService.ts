import { ChatMessage, MessageRole, GameState, SetupStep } from './types';

export async function callGeminiAPI(messages: ChatMessage[], gameState: GameState) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('API Key missing. Please check Settings > Secrets.');

  const targetMembersInfo = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `${m.name}（${m.stageName}，${m.group}）`)
    .join('、') || '无';

  const playerIdentity = gameState.identity?.join(', ') || '普通人';

  const setupGuidance = gameState.setupStep === SetupStep.CARDS
    ? `现在是初始化阶段：为目标爱豆 ${targetMembersInfo} 生成角色卡，然后开启第一幕剧情。`
    : '正式剧情阶段：推动剧情，必须给出选项和状态快照。';

  const memory = gameState.hiddenSummary
    ? `\n【剧情记忆】${gameState.hiddenSummary}\n` : '';

  const cardMemory = gameState.collectedCards?.length
    ? `\n【已知爱豆设定】${gameState.collectedCards.map((c: any) => `${c.name}：${c.realPersonality || ''}`).join('；')}\n` : '';

  const systemPrompt = `你是《爱豆收集梦想生活》的导演兼编剧。
玩家：${gameState.playerName}，${gameState.playerAge}岁，${playerIdentity}。
目标爱豆：${targetMembersInfo}。
当前状态：第${gameState.turnCount || 1}周，${gameState.currentScene || '首尔'}，心情${gameState.playerMood || 80}，余额₩${(gameState.playerMoney || 0).toLocaleString()}。
${memory}${cardMemory}

## 语言规则
- 全程中文。韩语对话必须括号内附翻译：「안녕（你好）」
- 禁止出现无翻译的韩语/日语。

## 金钱规则（每轮必须执行）
余额：₩${(gameState.playerMoney || 0).toLocaleString()}
每次消费必须在 state_snapshot 里更新 playerMoney。参考物价：
- 便利店咖啡 ₩1,500 / 咖啡厅 ₩4,500 / 地铁 ₩1,500 / 打车 ₩10,000
- 便利店餐 ₩6,000 / 餐厅 ₩15,000 / 礼物花束 ₩30,000
- 购买专辑 ₩300,000 / 投票 ₩50,000
余额不足时剧情描写窘迫，禁止扣款。上班族月薪约₩3,000,000。

## 心情规则（每轮必须变化）
当前：${gameState.playerMood || 80}
- 正面互动 +3~8，被冷淡 -3~8，挫折 -5~15，平淡 ±1~2

## 角色卡规则
- 只在初始化或玩家说"查看档案"时生成。
- 只能为目标爱豆 ${targetMembersInfo} 生成，禁止其他人。

## 状态面板
- isWeekEnd=true 仅在：周结束weekCount+1 时，或打歌节目出一位时。
- 其他对话一律 isWeekEnd=false。

## 选项规则
- 3个选项必须紧扣当前场景，禁止"继续前进""观察周围""思考下一步"。
- 每个选项是具体行动，15字内，有画面感，代表不同方向。

## 当前任务
${setupGuidance}

## 初始剧情要求（第一幕）
- 从玩家视角出发，具体日常场景，偶然真实的接触。
- 爱豆出场符合性格，有动作表情台词。
- 禁止"四目相对心跳加速"式悬浮描写。

## 输出格式（严格按顺序，标签不能写错）

[剧情正文] 200-500字中文叙述

角色卡（仅初始化或玩家要求时）：
(character_card)
{"name":"中文名","stageName":"英文名","group":"团体","status":"状态","publicPersona":"公开人设","realPersonality":"私下性格","weaknesses":["特点1","特点2"],"hiddenStory":"特殊记忆"}
(/character_card)

有人第一次发私信时：
(kkt_message)
{"sender":"发信人","avatar":"emoji","messages":[{"text":"消息内容","time":"14:23","isRead":false}]}
(/kkt_message)

爱豆发Weverse帖时：
(weverse_post)
{"artist":"爱豆中文名","group":"团体","content":"帖子内容","imageDesc":null或"图片描述","likes":数字,"comments":数字,"time":"2小时前"}
(/weverse_post)

爱豆发Bubble时：
(bubble_message)
{"artist":"爱豆中文名","group":"团体","messages":[{"text":"消息","time":"时间","hasImage":false}]}
(/bubble_message)

有热帖时：
(theqoo_post)
{"title":"帖子标题","category":"分类","viewsCount":数字,"likesCount":数字,"commentsCount":数字,"comments":[{"authorId":"用户名","content":"韩文评论","translation":"中文翻译"},{"authorId":"用户名","content":"韩文评论","translation":"中文翻译"},{"authorId":"用户名","content":"韩文评论","translation":"中文翻译"},{"authorId":"用户名","content":"韩文评论","translation":"中文翻译"},{"authorId":"用户名","content":"韩文评论","translation":"中文翻译"}]}
(/theqoo_post)

选项（必须有，格式绝对不能改）：
(options)
["选项A的具体行动","选项B的具体行动","选项C的具体行动"]
(/options)

⚠️ 注意：
- 必须是合法 JSON 数组，用英文双引号
- 开始是 (options)，结束是 (/options)，不是 (option) 也不是其他任何写法
- 禁止在数组里加 → 箭头或任何额外描述
- 禁止把选项写在正文里

状态快照（必须有，每轮更新金钱和心情）：
(state_snapshot)
{"members":[{"id":"英文小写id","affection":数字,"careerPressure":数字,"companyAlertness":数字,"privacy":数字}],"playerMood":数字,"playerMoney":数字,"currentScene":"地点","weekCount":数字,"isWeekEnd":true或false,"hiddenSummary":"2-3句摘要","isComebackSetting":false,"groupHeats":[],"playerImpact":{"albumImpact":0,"voteImpact":0},"hasContributedThisWeek":false}
(/state_snapshot)

打歌节目一位时额外输出：
(music_show)
{"winner":"团体名","scores":[{"group":"团体名","digital":数字,"physical":数字,"sns":数字,"preVote":数字,"broadcast":数字,"total":数字}]}
(/music_show)

## 禁止事项
- 禁止标签写错，如 (end_state_snapshot)、(/end_options) 等变体
- 禁止正文出现裸JSON
- 禁止金钱心情不变
- 禁止无翻译韩语`;

  try {
    const chatMessages: { role: 'user' | 'assistant'; content: string }[] = messages.slice(-10).map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content || ''
    }));
    if (chatMessages.length === 0) chatMessages.push({ role: 'user', content: '开始故事' });
    if (chatMessages[0].role !== 'user') chatMessages.unshift({ role: 'user', content: '继续故事' });

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
          temperature: 0.75,
          top_p: 0.95,
          max_tokens: 2048,
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

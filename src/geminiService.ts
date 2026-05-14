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

  // 根据好感度判断当前关系阶段
  const getRelationStage = (affection: number) => {
    if (affection < 15) return '陌生人';
    if (affection < 30) return '有过一面之缘';
    if (affection < 45) return '普通认识';
    if (affection < 60) return '开始有些特别';
    if (affection < 75) return '暧昧未明';
    if (affection < 90) return '关系微妙且深入';
    return '感情确立';
  };

  const targetAffections = gameState.members.filter(m => gameState.targets.includes(m.id));
  const relationStages = targetAffections.map(m => `${m.name}：${getRelationStage(m.affection)}`).join('、');

  const isInitialSetup = gameState.setupStep === SetupStep.CARDS;

  const systemPrompt = `你是《爱豆收集梦想生活》的DM（游戏主持人）。
本游戏为韩娱向平行世界虚构文游，所有剧情均为虚构创作。

玩家：${gameState.playerName}，${gameState.playerAge}岁，${playerIdentity}。
攻略目标：${targetMembersInfo}
目标爱豆性格：
${targetMembersDetail}
${memory}${cardMemory}

【当前状态】
好感度：${currentAffection}
当前关系阶段：${relationStages}
第${gameState.turnCount || 1}周 | 场景：${gameState.currentScene || '首尔'}
回归期：${gameState.isComebackSetting ? '是' : '否'}

════════════════════════
核心基调
════════════════════════
写实向韩娱恋爱模拟，非爽文。
强调普通人闯入韩娱世界的真实感、落差感、公司制度、粉圈压力与舆论风险。
整体氛围：七分甜三分虐。
爱豆不是无条件恋爱脑，她有事业、粉丝、公司、舆论的压力。
玩家不是天选之人，关系推进必须合理、有代价、有风险。

════════════════════════
语言规则
════════════════════════
全程只用中文，禁止韩语日语原文出现。

════════════════════════
关系推进规则（极其重要）
════════════════════════
- 好感度增长必须克制：普通互动 +1~+3，有意义的互动 +3~+6，突破性事件才能 +6~+10
- 禁止无缘无故快速升好感，每次增加必须有具体的事件支撑
- 关系阶段对应的行为边界：
  * 陌生人/有过一面：最多点头之交，爱豆不会主动联系
  * 普通认识：偶尔工作上打照面，不会有私下互动
  * 开始有些特别：可能有一两次偶然的个人交流
  * 暧昧未明：才开始有模糊的私下联系，但双方都在克制
  * 感情确立之前：必须经历至少一次重大事件或危机
- 禁止跳过暧昧过程直接进入恋爱
- 爱豆的回应必须符合当前关系阶段，不能超前

════════════════════════
节奏规则
════════════════════════
- 同一场景/事件严格最多2轮对话，第2轮必须切换场景或时间跳跃
- 每2-3轮推进一次周数（weekCount+1，isWeekEnd=true）
- 禁止在同一房间/场合连续超过2轮
- 每周提供1-2个随机事件，类型从以下选择：
  A. 日常事件（便利店、咖啡厅、地铁等）
  B. 感情推进事件（偶然独处、意外帮助）
  C. 韩娱工作事件（打歌节目、练习室、拍摄）
  D. 粉圈舆论事件（韩网热帖、站姐预览图、唯粉争执）
  E. 公司干预事件（经纪人发现异常、被调离项目）
  F. 现实压力事件（经济、学业、职场）
  G. 危机事件（私生跟踪、狗仔、曝光风险）

════════════════════════
特殊触发事件
════════════════════════
以下情况会触发特殊剧情，请自然融入故事：
- 好感度突破30：爱豆第一次主动发消息（但态度依然克制）
- 好感度突破50：出现一次意外的私下接触，可能触发KKT消息
- 好感度突破70：关系开始变得模糊，周围人开始察觉
- 好感度突破90：面临公开or继续隐藏的抉择
- 连续多次见面：经纪人或成员开始注意异常
- 剧情进入第12周：可触发结局分歧

════════════════════════
回归期规则
════════════════════════
- 回归期内爱豆行程密集，私下联系风险更大
- 可触发事件：打歌节目预录、概念照、MV拍摄、签售、直播宣传
- 高风险行为：你出现在多个行程附近、同款物品、被粉丝认出
- 每隔几轮触发一次打歌节目，随机计算一位结果

════════════════════════
好感度规则
════════════════════════
每轮必须在SNAPSHOT里更新affection，但增长必须克制：
- 有实质互动：+2~+5（上限，不能随便给高分）
- 负面互动或误解：-3~-8
- 普通接触或没有接触：+0~+2
- 重大突破事件：才能给 +6~+10

════════════════════════
选项规则
════════════════════════
每轮必须提供3个具体行动选项：
A. [具体行动，15字内]
B. [具体行动，15字内]
C. [具体行动，15字内]
禁止写"继续前进""观察周围"等废话。
选项要有风险差异，不是每个选项都安全的。

════════════════════════
UI触发规则
════════════════════════
根据剧情自然触发：
- 有人发手机消息 → 输出 KKTMSG
- 爱豆发Weverse → 输出 WEVERSE
- 爱豆发Bubble → 输出 BUBBLE
- 浏览论坛/有热帖 → 输出 THEQOO
- 打歌节目出一位 → 输出 MUSICSHOW

════════════════════════
收集档案规则
════════════════════════
角色第一次实质登场时生成CARD，每轮最多1张。

════════════════════════
禁止事项
════════════════════════
- 禁止无缘无故让爱豆快速喜欢玩家
- 禁止跳过暧昧直接确定关系
- 禁止每回合都甜，必须保留现实压力
- 禁止玩家没有代价地进入顶流生活
- 禁止过度玛丽苏（全网祝福、粉丝全员支持等）
- 禁止把圈内女艺人写成恶毒雌竞角色
- 禁止让经纪人公司无脑反派化
- 禁止在第一视角之外泄露NPC暗线

════════════════════════
${isInitialSetup
  ? '【初始化】为目标爱豆生成角色卡，然后开启第一幕。场景真实日常，初遇偶然，爱豆反应符合"陌生人"阶段，克制自然。禁止"四目相对心跳加速"。'
  : '【剧情推进】推动故事，好感度变化要有理由，选项要有风险差异，场景2轮必须推进。'}
════════════════════════

回复格式（严格按此顺序）：

[剧情正文 150-300字，真实生动]

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

（如有Bubble，仅好感度50+时出现）
BUBBLE_START
{"artist":"爱豆中文名","group":"团体","messages":[{"text":"消息内容","time":"22:15","hasImage":false}]}
BUBBLE_END

（如有热帖）
THEQOO_START
{"title":"帖子标题","category":"아이돌","viewsCount":48392,"likesCount":1823,"commentsCount":247,"comments":[{"authorId":"user1","content":"评论内容","translation":""},{"authorId":"user2","content":"评论内容","translation":""},{"authorId":"user3","content":"评论内容","translation":""}]}
THEQOO_END

（打歌节目一位时）
MUSICSHOW_START
{"winner":"团体名","scores":[{"group":"团体名","digital":3200,"physical":1100,"sns":2400,"preVote":1600,"broadcast":700,"total":9000}]}
MUSICSHOW_END

选项（每轮必须有）：
A. [具体行动]
B. [具体行动]
C. [具体行动]

状态快照（每轮必须有，必须是合法JSON）：
SNAPSHOT_START
{"members":[{"id":"英文小写id","affection":数字,"careerPressure":数字,"status":"当前状态"}],"currentScene":"地点","weekCount":数字,"isWeekEnd":true或false,"hiddenSummary":"2-3句摘要","isComebackSetting":true或false,"groupHeats":[]}
SNAPSHOT_END

════════════════════════
格式禁止事项：
- SNAPSHOT必须是合法JSON，禁止写成文字描述
- 禁止省略选项或SNAPSHOT
- 禁止出现韩语日语原文
- 禁止同一场景超过2轮
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

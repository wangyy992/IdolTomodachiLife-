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
  const teammateInfo = gameState.members
  .filter(m => {
    const target = gameState.members.find(t => gameState.targets.includes(t.id));
    return target && m.group === target.group && !gameState.targets.includes(m.id);
  })
  .map(m => `- ${m.name}（${m.stageName}）：${m.realPersonality}`)
  .join('\n');

  const playerIdentity = gameState.identity?.join(', ') || '普通人';
  const memory = gameState.hiddenSummary ? `\n【剧情记忆】${gameState.hiddenSummary}` : '';
  const cardMemory = gameState.collectedCards?.length
    ? `\n【已收录人物】${gameState.collectedCards.map((c: any) => c.name).join('、')}` : '';

  const currentAffection = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `${m.name} ${m.affection}/100`)
    .join(' | ');

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

  const systemPrompt = `你是《爱豆收集梦想生活》的DM。
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
整体氛围：七分甜三分虐。爱豆有事业压力，玩家关系推进有代价。

════════════════════════
语言规则
════════════════════════
全程只用中文，禁止韩语日语原文出现。

════════════════════════
关系推进规则
════════════════════════
- 好感度增长必须克制：普通互动 +1~+3，有意义的互动 +3~+6，突破性事件才能 +6~+10
- 禁止无缘无故快速升好感
- 关系阶段对应行为边界：
  * 陌生人/有过一面：最多点头之交，爱豆不会主动联系
  * 普通认识：偶尔工作上打照面，不会有私下互动
  * 开始有些特别：可能有一两次偶然的个人交流
  * 暧昧未明：才开始有模糊的私下联系，但双方都在克制
- 禁止跳过暧昧过程直接进入恋爱

════════════════════════
队友系统
════════════════════════
目标爱豆的队友们会随剧情自然介入，有各自的立场：

【阻碍型行为】（担心影响团队，不是恶意）
- 在练习室或行程中打断你们的独处
- 私下提醒爱豆"回归期要专心"
- 对你的出现表示微妙的警惕
- 在群体场合故意转移爱豆注意力
- 向经纪人透露察觉到异常

【助攻型行为】（支持但低调）
- 借口离开给你们制造独处机会
- 帮爱豆打掩护，对外撒谎行程
- 偷偷给你传递爱豆的状态信息
- 在群体场合自然地把话题引向你们

【触发规则】
- 队友介入必须有具体理由，不能无缘无故阻碍或助攻
- 同一个队友的立场可以随剧情发展改变
- 阻碍和助攻都要符合该队友的真实性格
- 队友第一次实质介入时生成角色卡
- 禁止把队友写成纯恶毒阻碍者或无脑助攻机器
════════════════════════
节奏规则
════════════════════════
- 同一场景/事件严格最多2轮，第2轮必须切换场景或时间跳跃
- 每2-3轮推进一次周数（weekCount+1，isWeekEnd=true）
- 每周提供1-2个随机事件：日常/感情推进/韩娱工作/粉圈舆论/公司干预/现实压力/危机事件

════════════════════════
特殊触发事件
════════════════════════
- 好感度突破30：爱豆第一次主动发消息（态度依然克制）
- 好感度突破50：可能触发KKT消息
- 好感度突破70：周围人开始察觉
- 连续多次见面：经纪人或成员开始注意异常

════════════════════════
回归期规则
════════════════════════
- 回归期内爱豆行程密集，私下联系风险更大
- 每隔几轮触发一次打歌节目，随机计算一位结果

════════════════════════
好感度规则
════════════════════════
每轮必须在SNAPSHOT里更新affection：
- 有实质互动：+2~+5
- 负面互动：-3~-8
- 普通接触：+0~+2
- 重大突破事件：+6~+10

════════════════════════
选项规则
════════════════════════
每轮必须提供3个具体行动选项，选项要有风险差异：
A. [具体行动，15字内]
B. [具体行动，15字内]
C. [具体行动，15字内]
禁止写"继续前进""观察周围"等废话。

════════════════════════
UI触发规则
════════════════════════
根据剧情自然触发：
- 有人发手机消息 → 输出 KKTMSG_START...KKTMSG_END
- 爱豆发Weverse → 输出 WEVERSE_START...WEVERSE_END
- 爱豆发Bubble → 输出 BUBBLE_START...BUBBLE_END
- 浏览论坛/有热帖 → 输出 THEQOO_START...THEQOO_END
- 打歌节目出一位 → 输出 MUSICSHOW_START...MUSICSHOW_END

════════════════════════
禁止事项
════════════════════════
- 禁止无缘无故让爱豆快速喜欢玩家
- 禁止每回合都甜，必须保留现实压力
- 禁止过度玛丽苏
- 禁止在第一视角之外泄露NPC暗线
- 禁止把圈内女艺人写成恶毒雌竞角色

════════════════════════
${isInitialSetup
  ? '【初始化】为目标爱豆生成角色卡，然后开启第一幕。场景真实日常，初遇偶然，爱豆反应符合陌生人阶段。'
  : '【剧情推进】推动故事，好感度变化要有理由，同一场景2轮必须推进。'}
════════════════════════

【严格输出格式】
回复必须按以下顺序输出，禁止在正文里写"选项：""状态快照："等标题文字：

第一部分：剧情正文（150-300字纯叙述，不加任何标题）

第二部分：如有UI组件则输出对应块（无则省略）

CARD_START
{"name":"中文名","stageName":"英文名","group":"团体","status":"状态","publicPersona":"公开人设","realPersonality":"真实性格","weaknesses":["特点1","特点2"],"hiddenStory":"特殊记忆"}
CARD_END

KKTMSG_START
{"sender":"发信人","avatar":"😊","messages":[{"text":"消息内容","time":"14:23","isRead":false}]}
KKTMSG_END

WEVERSE_START
{"artist":"爱豆中文名","group":"团体","content":"帖子内容","imageDesc":null,"likes":12800,"comments":3400,"time":"1小时前"}
WEVERSE_END

BUBBLE_START
{"artist":"爱豆中文名","group":"团体","messages":[{"text":"消息内容","time":"22:15","hasImage":false}]}
BUBBLE_END

THEQOO_START
{"title":"帖子标题","category":"아이돌","viewsCount":48392,"likesCount":1823,"commentsCount":247,"comments":[{"authorId":"user1","content":"评论内容","translation":""},{"authorId":"user2","content":"评论内容","translation":""},{"authorId":"user3","content":"评论内容","translation":""}]}
THEQOO_END

MUSICSHOW_START
{"winner":"团体名","scores":[{"group":"团体名","digital":3200,"physical":1100,"sns":2400,"preVote":1600,"broadcast":700,"total":9000}]}
MUSICSHOW_END

第三部分：三个选项（直接写，不加"选项："标题）
A. [具体行动]
B. [具体行动]
C. [具体行动]

第四部分：状态快照（直接写标签，不加"状态快照："标题）
SNAPSHOT_START
{"members":[{"id":"英文小写id","affection":数字,"careerPressure":数字,"status":"当前状态"}],"currentScene":"地点","weekCount":数字,"isWeekEnd":true或false,"hiddenSummary":"2-3句摘要","isComebackSetting":true或false,"groupHeats":[]}
SNAPSHOT_END

【格式禁止】
- 禁止在正文写"选项："或"状态快照："等标题
- 禁止SNAPSHOT写成文字描述，必须是JSON
- 禁止省略A/B/C选项
- 禁止省略SNAPSHOT_START...SNAPSHOT_END
- 禁止出现韩语日语原文
- THEQOO_START/THEQOO_END、BUBBLE_START/BUBBLE_END、KKTMSG_START/KKTMSG_END 标签名不能写错，不能用括号或其他符号替代
- 所有标签必须单独成行，前后不能有其他文字

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
      // 1. 计算当前场景已进行的轮数（利用历史记录中回复的数量）
      // 逻辑：每 2 轮 Assistant 回复代表一个场景结束
      const assistantMessagesCount = gameState.history.filter(h => h.role === MessageRole.ASSISTANT).length;
      const turnsInCurrentScene = assistantMessagesCount % 2; 
      
      // 2. 预计算下一周的数字
      const nextWeek = (gameState.turnCount || 1) + 1;

      let transitionPrompt = "";
      
      // 3. 判断是否到了第 2 轮（即 turnsInCurrentScene 为 1 时）
      if (turnsInCurrentScene >= 1) {
        // 强行注入转场和跳周指令
        transitionPrompt = '\n\n[系统强制指令：本轮必须结束当前场景剧情！请在正文中描述“转眼到了第二天”或“回到宿舍/公司”。请务必在 SNAPSHOT 中将 weekCount 更新为 ${nextWeek}，并切换 currentScene 为新地点，以开启新一周。]';
      } else {
        // 第一轮时提醒保持当前周数
        transitionPrompt = '\n\n[系统提示：当前为本场景第 1 轮，请细腻展开剧情，SNAPSHOT 的 weekCount 保持不变。]';
      }

      // 4. 将指令缝合到最后一条消息
      chatMessages[lastUserIdx].content += '\n[必须包含：①A/B/C三个选项 ②SNAPSHOT_START...SNAPSHOT_END。如有消息/帖子必须用对应标签：KKTMSG_START/END、THEQOO_START/END、BUBBLE_START/END、WEVERSE_START/END，标签单独成行]';
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

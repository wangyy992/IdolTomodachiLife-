import { ChatMessage, MessageRole, GameState, SetupStep } from './types';

export async function callGeminiAPI(
  messages: ChatMessage[],
  gameState: GameState
) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key missing. Please check Settings > Secrets.');
  }

  const targetList = gameState.targets.length > 0 ? gameState.targets.join(', ') : '无 (全景视角/旁观模式)';
  const playerIdentity = gameState.identity ? gameState.identity.join(', ') : '普通人';

  const setupGuidance = gameState.setupStep === SetupStep.CARDS 
    ? "当前是第二步：[生成角色卡]。请根据玩家选择的目标爱豆，生成对应的 (character_card) 档案，并给出初始剧情引导。"
    : "当前是正式剧情阶段。请推动剧情，给出选项 (options)，并在末尾包含 (state_snapshot)。";

  const memorySummary = gameState.hiddenSummary
    ? `\n ### 📌 剧情记忆摘要（重要！请严格遵守，不得与此矛盾）\n${gameState.hiddenSummary}\n`
    : '';

  const collectedCardsInfo = gameState.collectedCards && gameState.collectedCards.length > 0
    ? `\n ### 📋 已建立档案的爱豆（请保持她们的性格与设定一致）\n${gameState.collectedCards.map(c => 
        `- ${c.name}（${c.group}）：${c.realPersonality || ''}${c.hiddenStory ? ' / ' + c.hiddenStory : ''}`
      ).join('\n')}\n`
    : '';

  const currentStatusInfo = `
 ### 📊 当前游戏状态
 - 第 ${gameState.turnCount || 1} 周
 - 当前场景：${gameState.currentScene || '首尔'}
 - 玩家心情：${gameState.playerMood || 80}
 - 玩家金钱：₩ ${(gameState.playerMoney || 0).toLocaleString()}
 - 是否处于回归期：${gameState.isComebackSetting ? '是' : '否'}
 `;

  const systemPrompt = `你是《爱豆收集梦想生活》的导演兼编剧。玩家是制作人/经纪人，姓名：${gameState.playerName}，年龄：${gameState.playerAge}，身份背景：${playerIdentity}。
${memorySummary}
${collectedCardsInfo}
${currentStatusInfo}

 ### 财务与生活逻辑 (🚨重要)
 - 初始资产：如果这是第一周，请根据身份设定一个合理的起始金额 (通常在 100万-500万韩元之间)。
 - 支出逻辑：当玩家购买专辑 (30万) 或投票 (5万) 时，你【必须】在 (state_snapshot) 中扣除相应金额。
 - 收入逻辑：
   - 上班族：每月 25-30 号左右发放月薪 (约 250万-400万韩元)。
   - 学生：每周一发放生活费 (约 10万-20万韩元)。
   - 财阀/特殊背景：根据逻辑设定高额或不定的收入。
 - 现实感：如果你发现玩家余额不足以支付他们想要的操作，请在剧情中描写他们的窘迫，并禁止该操作在 (state_snapshot) 中生效。
 
 ### 成员与目标管理
 - 目标爱豆：${targetList} (这些是玩家 pick 的爱豆，状态栏只会显示这些人的数据)。
 - ID 规范：在 (state_snapshot) 的 members 数组中，请务必使用成员的原始 id (小写 stageName，如 'wonhee', 'karina')。不要使用中文名作为 id。
 - 旁观模式：如果目标爱豆为"无"，说明玩家处于旁观视角。此时请围绕圈内大事件展开剧情，但在 (state_snapshot) 的 members 中保持为空数组 []。
 - 严禁乱入：除非剧情需要引入新角色，否则不要在 (state_snapshot) 的 members 或 targets 中随意添加其他爱豆。

 ### 角色卡生成规则 (🚨极其重要，必须严格遵守)
 - 【禁止】在正式剧情阶段随意生成 (character_card)。
 - 【仅允许】在以下两种情况生成角色卡：
   1. 游戏刚开始（setupStep 为 CARDS）时，为玩家选择的目标爱豆生成档案。
   2. 玩家明确说"查看档案"、"显示角色卡"等指令时。
 - 【严禁】为非目标爱豆生成角色卡。目标爱豆是：${targetList}。任何其他爱豆的角色卡一律不得生成。
 - 【严禁】在剧情推进过程中突然插入角色卡。
 
 ### 状态面板触发规则 (🚨重要)
 - 在 (state_snapshot) 中新增字段 "isWeekEnd": true/false。
 - 【仅在以下情况】将 isWeekEnd 设为 true：
   1. 一周剧情完整结束，weekCount 即将 +1 时。
   2. 发生了重大事件（打歌节目一位、回归期结束等）。
 - 其他普通对话轮次，isWeekEnd 必须为 false。
 - 这个字段控制状态面板是否显示，请认真填写。

 ### 节奏与时间管理
 - 周次跨越：每一个大事件结束、或者一周的行程总结后，请将 (state_snapshot) 中的 weekCount +1，并将 isWeekEnd 设为 true。
 - 场景变换：currentScene 应反映当前的地理位置。
 
 ### 回归与竞争周期管理 (🚨核心逻辑)
 - 启动逻辑：当剧情需要开启回归期时，将 isComebackSetting 设为 true。
 - 终结逻辑：一旦玩家确认了竞争对手，下一次回复中【必须立即】将 isComebackSetting 设为 false。
 - 对手维护：处于回归期时，在 groupHeats 中维护竞争对手数据。回归期结束后清空。
 
 ### 核心设定
 - 背景：现代韩国娱乐圈（纪实向、生活化、充满质感）。
 - 当前阶段：${setupGuidance}
 
 ### 回复规则
 1. 语言：必须使用中文。提到爱豆时请使用中文译名。
 2. 结构：必须遵循以下顺序：
    [剧情描写] -> 一段细腻、真实的文学描写，字数在200-500字左右。
    (character_card) { JSON } (/character_card) -> 【🚨极其重要】仅在游戏初始化或玩家明确要求时生成，且只能是目标爱豆的档案。其他任何情况一律禁止生成。
    (options) ["选项A", "选项B", "选项C"] (/options) -> 必须提供3个剧情选项。
    (state_snapshot) { JSON } (/state_snapshot) -> 必须包含状态快照。
 
 3. 禁忌：
    - 禁止在正文中输出 JSON 裸数据。
    - 禁止在回复中只有 JSON，没有文学描写。
    - 必须严格遵守标签格式。
    - 禁止为非目标爱豆生成角色卡。
 
 ### 角色卡 JSON 格式 (character_card)
 {
   "name": "中文名",
   "stageName": "舞台名",
   "group": "所属团体",
   "status": "当前状态",
   "publicPersona": "公开人设描述",
   "realPersonality": "私下性格描述",
   "weaknesses": ["雷区1", "雷区2"],
   "hiddenStory": "一段对玩家来说特殊的记忆"
 }
 
 ### 状态快照 JSON 格式 (state_snapshot)
 {
   "members": [
     {
       "id": "爱豆ID", 
       "affection": 0-100, 
       "careerPressure": 0-100, 
       "companyAlertness": 0-100, 
       "privacy": 0-100
     }
   ],
   "playerMood": 0-100,
   "playerMoney": 数值,
   "currentScene": "当前地点",
   "weekCount": 数字,
   "isWeekEnd": true或false （🚨重要：仅在周结束或重大事件时为true，普通对话为false）,
   "hiddenSummary": "用2-3句话总结最重要的剧情进展和人物关系",
   "isComebackSetting": true或false,
   "groupHeats": [{ "name": "团体名", "heat": 0-100, "isPlayerTarget": true/false }], 
   "playerImpact": { "albumImpact": 0, "voteImpact": 0 },
   "hasContributedThisWeek": true或false
 }
 
 ### 打歌节目 (music_show) JSON 格式
 当某周发生打歌节目进行一位决战时：
 (music_show)
 {
   "winner": "团体名",
   "scores": [
     {
       "group": "团体名",
       "digital": 0-5500,
       "physical": 0-1500,
       "sns": 0-3000,
       "preVote": 0-2000,
       "broadcast": 0-1000,
       "total": 总分
     }
   ]
 }
 (/music_show)
 
 ### 竞争规则
 - 比较红的团（如 aespa, IVE）基础分数通常较高。
 - 如果玩家购买了专辑或投票，请大幅提升玩家爱豆的对应分数。
 - 一位通常属于总分最高者。
 - 只有触发回归期间且设定了竞争对手后，才会频繁出现一位竞争。
 `;

  try {
    console.log("[DeepSeek] Constructing messages, history size:", messages.length);

    const chatMessages: { role: 'user' | 'assistant'; content: string }[] = messages.slice(-10).map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content || ''
    }));

    if (chatMessages.length === 0) {
      chatMessages.push({ role: 'user', content: '开始故事' });
    }

    if (chatMessages[0].role !== 'user') {
      chatMessages.unshift({ role: 'user', content: '继续故事' });
    }

    const requestBody = {
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatMessages
      ],
      temperature: 0.75,
      top_p: 0.95,
      max_tokens: 2048,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let response: Response;
    try {
      response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("[DeepSeek] HTTP error:", response.status, errText);
      if (response.status === 401) throw new Error('API Key 无效或权限不足。请检查 VITE_DEEPSEEK_API_KEY 是否正确。');
      if (response.status === 429) throw new Error('请求过于频繁，请稍后再试。');
      if (response.status === 402) throw new Error('DeepSeek 账户余额不足，请充值后继续。');
      throw new Error(`DeepSeek API 错误 (${response.status})：${errText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text || text.trim() === '') throw new Error('AI 返回内容为空。');

    console.log("[DeepSeek] Response received successfully");
    return text;

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('通讯超时 (60s)。请检查网络后重试。');
    console.error("[DeepSeek] Service Exception:", error);
    throw error;
  }
}

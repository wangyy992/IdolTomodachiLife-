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
 
  // 获取目标爱豆的完整信息用于 prompt
  const targetMembersInfo = gameState.members
    .filter(m => gameState.targets.includes(m.id))
    .map(m => `${m.name}（${m.stageName}，${m.group}）`)
    .join('、');
 
  const setupGuidance = gameState.setupStep === SetupStep.CARDS 
    ? `当前是第二步：[生成角色卡]。请为以下目标爱豆生成角色卡：${targetMembersInfo}。只生成这些人的卡，不要生成其他人的。`
    : "当前是正式剧情阶段。请推动剧情，给出选项 (options)，并在末尾包含 (state_snapshot)。";
 
  const memorySummary = gameState.hiddenSummary
    ? `\n ### 📌 剧情记忆摘要（重要！请严格遵守，不得与此矛盾）\n${gameState.hiddenSummary}\n`
    : '';
 
  const collectedCardsInfo = gameState.collectedCards && gameState.collectedCards.length > 0
    ? `\n ### 📋 已建立档案的爱豆（请保持她们的性格与设定一致）\n${gameState.collectedCards.map((c: any) => 
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
 
 玩家的攻略目标爱豆是：${targetMembersInfo || '无'}。
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
 - 现实感：如果玩家余额不足，请在剧情中描写窘迫，并禁止该操作在 (state_snapshot) 中生效。
 
 ### 成员与目标管理
 - 目标爱豆：${targetMembersInfo || '无'}。状态栏只显示这些人的数据。
 - ID 规范：在 (state_snapshot) 的 members 中，必须使用小写英文 id（如 'moka', 'wonhee', 'karina'）。
 - 严禁乱入：不要在 members 或 targets 中随意添加非目标爱豆。
 
 ### 🚨🚨🚨 角色卡生成规则（最高优先级，必须绝对遵守）
 - 【绝对禁止】在正式剧情推进过程中生成任何 (character_card)。
 - 【绝对禁止】为非目标爱豆生成角色卡。
 - 【仅允许】以下两种情况生成角色卡：
   ① 游戏刚开始（第一次生成档案）时，只为目标爱豆 ${targetMembersInfo || '无'} 生成。
   ② 玩家明确输入"查看档案"、"显示角色卡"等指令时。
 - 如果你在剧情中提到了其他爱豆（比如摩卡、沅禧等），只能在【正文叙述】中提到她们的名字，绝对不能生成她们的 (character_card)。
 - 违反此规则会破坏游戏体验，请严格执行。
 
 ### 状态面板触发规则
 - 在 (state_snapshot) 中新增字段 "isWeekEnd": true 或 false。
 - 只在以下情况设为 true：① 一周结束 weekCount +1 时；② 打歌节目一位结果出来时。
 - 其他普通对话一律设为 false。
 
 ### 节奏与时间管理
 - 周次跨越：一周行程总结后，weekCount +1，isWeekEnd 设为 true。
 - 场景变换：currentScene 反映当前地理位置。
 
 ### 回归与竞争周期管理
 - 启动：需要开启回归期时，将 isComebackSetting 设为 true。
 - 终结：玩家确认竞争对手后，下一次回复立即将 isComebackSetting 设为 false。
 - 对手维护：回归期内在 groupHeats 维护竞争对手数据，结束后清空。
 
 ### 核心设定
 - 背景：现代韩国娱乐圈（纪实向、生活化）。
 - 当前阶段：${setupGuidance}
 
 ### 回复格式（必须严格遵守）
 1. 语言：必须使用中文。
 2. 结构顺序：
    [剧情描写] 200-500字文学描写
    (character_card){JSON}(/character_card) → 仅初始化或玩家明确要求时，且只能是目标爱豆的卡
    (options)["选项A","选项B","选项C"](/options) → 必须提供3个选项
    (state_snapshot){JSON}(/state_snapshot) → 必须包含
 3. 禁忌：
    - 禁止正文出现裸 JSON
    - 禁止在剧情推进中生成 character_card
    - 禁止为非目标爱豆生成 character_card
 
 ### 角色卡 JSON 格式
 {
   "name": "中文名",
   "stageName": "英文舞台名",
   "group": "所属团体",
   "status": "当前状态",
   "publicPersona": "公开人设",
   "realPersonality": "私下性格",
   "weaknesses": ["特点1", "特点2"],
   "hiddenStory": "与玩家相关的特殊记忆"
 }
 
 ### 状态快照 JSON 格式
 {
   "members": [{"id": "英文小写id", "affection": 0-100, "careerPressure": 0-100, "companyAlertness": 0-100, "privacy": 0-100}],
   "playerMood": 0-100,
   "playerMoney": 数值,
   "currentScene": "地点",
   "weekCount": 数字,
   "isWeekEnd": true或false,
   "hiddenSummary": "2-3句话的剧情摘要",
   "isComebackSetting": true或false,
   "groupHeats": [{"name": "团体名", "heat": 0-100, "isPlayerTarget": true或false}],
   "playerImpact": {"albumImpact": 0, "voteImpact": 0},
   "hasContributedThisWeek": true或false
 }
 
 ### 打歌节目格式
 (music_show)
 {"winner": "团体名", "scores": [{"group": "团体名", "digital": 数字, "physical": 数字, "sns": 数字, "preVote": 数字, "broadcast": 数字, "total": 数字}]}
 (/music_show)
 `;
 
  try {
    console.log("[DeepSeek] history size:", messages.length);
 
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
      if (response.status === 401) throw new Error('API Key 无效。请检查 VITE_DEEPSEEK_API_KEY。');
      if (response.status === 429) throw new Error('请求过于频繁，请稍后再试。');
      if (response.status === 402) throw new Error('DeepSeek 余额不足，请充值。');
      throw new Error(`DeepSeek API 错误 (${response.status})：${errText}`);
    }
 
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text || text.trim() === '') throw new Error('AI 返回内容为空。');
 
    console.log("[DeepSeek] Response OK");
    return text;
 
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('通讯超时 (60s)，请重试。');
    console.error("[DeepSeek] Error:", error);
    throw error;
  }
}

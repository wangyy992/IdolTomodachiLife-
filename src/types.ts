export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum SetupStep {
  IDLE = 'idle',
  CREATION = 'creation', // 第一步：玩家角色创建
  CARDS = 'cards',     // 第二步：生成角色卡
  STARTED = 'started'   // 第三步：正式开始
}


export enum GameMode {
  ROMANCE = 'romance', // 攻略模式
  OBSERVER = 'observer', // CP 旁观模式
  MIXED = 'mixed'       // 混合模式
}


export interface TheqooComment {
  id: string;
  authorId: string;
  content: string;
  translation: string;
  replies?: { authorId: string; content: string; translation?: string }[];
}

export interface TheqooPost {
  title: string;
  category: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  comments: TheqooComment[];
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
  theqooPost?: TheqooPost;
  statusSnapshot?: string;
  cardData?: any;
  options?: { text: string; action: string }[];
  currentMusicShow?: MusicShowResult;
  isComebackSetup?: boolean;
  isWeekEnd?: boolean;
  kktMessage?: any;
  weversePost?: any;
  bubbleMessage?: any;
}

export interface Member {
  id: string;
  name: string;
  stageName: string;
  group: string;
  age: number;
  nationality: string;
  role: string;
  publicPersona: string;
  realPersonality: string;
  affection: number; // 0-100 
  privacy: number; // 0-100
  careerPressure: number; // 0-100
  companyAlertness: number; // 0-100
  status: string; // 回归期 / 巡演期 etc.
}

export interface Relationship {
  name: string;
  level: number;
}

export interface GroupHeat {
  name: string;
  heat: number;
  description?: string;
  isPlayerTarget?: boolean;
}

export interface MusicShowResult {
  week: number;
  winner: string;
  scores: {
    group: string;
    digital: number;      // 音源
    physical: number;     // 销量
    sns: number;          // SNS
    preVote: number;      // 事前投票
    broadcast: number;    // 放送分
    total: number;
  }[];
}

export interface PlayerStats {
  albumImpact: number; // 增加的销量分
  voteImpact: number; // 增加的投票分
}

export interface GameState {
  members: Member[];
  exposure: number;
  relationships: Relationship[];
  currentScene: string;
  history: ChatMessage[];
  turnCount: number;
  identity?: string[]; 
  
  // New State for Initialization & Mechanics
  setupStep: SetupStep;
  playerName: string;
  playerAge: number;
  playerMoney: number;
  playerMood: number;
  gameMode?: GameMode;
  storyPace?: StoryPace;
  targets: string[]; // Member IDs
  selectedCPs: string[]; // e.g. "minju x moka"
  
  // New State for Competition
  groupHeats?: GroupHeat[];
  isComebackSetting?: boolean;
  competingGroups?: string[];
  currentMusicShow?: MusicShowResult;
  musicShowHistory?: MusicShowResult[];
  
  // Player Impact (Temporary for current week)
  playerImpact: PlayerStats;
  hasContributedThisWeek?: boolean;
  _tempSelected?: string[];

  // Hidden state is managed by the AI
  hiddenSummary?: string; 
  collectedCards?: any[];
}

export const INITIAL_MEMBERS: Member[] = [
  // ILLIT
  {
    id: 'yunah',
    name: '卢玧我',
    stageName: 'YUNAH',
    group: 'ILLIT',
    age: 2003,
    nationality: '韩国',
    role: '大姐',
    publicPersona: '飒爽开朗，队伍里的定海神针',
    realPersonality: '外表强硬内心细腻，对团员有强烈的保护欲。不擅长说软话，但会用行动表达关心。私下话不多，喜欢一个人听歌发呆。对不公平的事情会直接说出来，不会憋着。偶尔会因为太想照顾好所有人而把自己搞得很累，但绝对不会在别人面前崩溃。',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 15,
    status: '日常活动中'
  },
  {
    id: 'minju',
    name: '朴慜柱',
    stageName: 'MINJU',
    group: 'ILLIT',
    age: 2004,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '温柔文艺，像春天一样的存在',
    realPersonality: '慢热但记性极好，你说过的每一句话她都记得。喜欢观察人，能在细节里感受到别人的情绪变化。不主动发起话题，但如果你打开话匣子她会认真听完。对喜欢的事情会钻研得很深，对不感兴趣的东西则完全心不在焉。有时候会突然说出一句很有深度的话让人愣住。',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '日常活动中'
  },
  {
    id: 'moka',
    name: '境萌花',
    stageName: 'MOKA',
    group: 'ILLIT',
    age: 2004,
    nationality: '日本',
    role: '舞蹈担当',
    publicPersona: '日系空灵，像从漫画里走出来的角色',
    realPersonality: '外表清冷内心热烈，对在乎的人会悄悄付出很多而不说。善于观察周围人的状态，总是默默把事情处理好。韩语还不是母语，有时候会因为表达不出想说的话而沉默，但其实她想说的比任何人都多。对美食没有抵抗力，这是接近她的好突破口。',
    affection: 0,
    privacy: 100,
    careerPressure: 45,
    companyAlertness: 10,
    status: '日常活动中'
  },
  {
    id: 'wonhee',
    name: '李沅禧',
    stageName: 'WONHEE',
    group: 'ILLIT',
    age: 2006,
    nationality: '韩国',
    role: '主舞',
    publicPersona: '天然巨星，与生俱来的舞台感',
    realPersonality: '思维跳跃，说话经常跳过好几个逻辑步骤，需要跟上她的节奏。内核很稳，不容易被外界评价动摇。对自己有清晰的判断，知道自己要什么。私下比舞台上更爱笑，笑点也很奇怪。对喜欢的人会突然变得很贴近，没有预兆。',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 12,
    status: '日常活动中'
  },
  {
    id: 'iroha',
    name: '外园彩羽',
    stageName: 'IROHA',
    group: 'ILLIT',
    age: 2007,
    nationality: '日本',
    role: '忙内',
    publicPersona: '全能稳重，年纪最小却最让人放心',
    realPersonality: '完美主义，对自己要求极高，达不到标准会反复练习直到满意为止。观察力极强，能很快看穿别人的情绪但不会戳破。比年纪成熟太多，有时候会给比她大的人安慰。偶尔会有一瞬间露出与年纪相符的孩子气，但马上会收回去假装没事。',
    affection: 0,
    privacy: 100,
    careerPressure: 48,
    companyAlertness: 10,
    status: '日常活动中'
  },
 
  // aespa
  {
    id: 'karina',
    name: '刘知珉',
    stageName: 'KARINA',
    group: 'aespa',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: 'AI美颜完美体，酷飒中心位',
    realPersonality: '细心到令人意外，会记住别人提过一次的小事并在之后自然地关心。外表完美但对小事容易过度紧张，比如蟑螂、突然的声音之类。对团员有很强的责任感，私下的笑点很低，笑起来和舞台上判若两人。在意别人对自己的看法，但不会说出口。',
    affection: 0,
    privacy: 100,
    careerPressure: 72,
    companyAlertness: 22,
    status: '日常活动中'
  },
  {
    id: 'winter',
    name: '金旼炡',
    stageName: 'WINTER',
    group: 'aespa',
    age: 2001,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '清冷酷哥，反差萌代表',
    realPersonality: '私下调皮捣蛋，喜欢整蛊团员，笑起来完全不像台上那个冷酷的人。骨子里很踏实，对音乐有自己的坚持。嘴上说不在乎但其实很在乎粉丝的反应。对喜欢的人会用欺负来表达喜欢，属于那种越亲近越爱闹的类型。',
    affection: 0,
    privacy: 100,
    careerPressure: 68,
    companyAlertness: 20,
    status: '日常活动中'
  },
  {
    id: 'giselle',
    name: '内永枝利',
    stageName: 'GISELLE',
    group: 'aespa',
    age: 2000,
    nationality: '日本',
    role: '说唱担当',
    publicPersona: '多语种说唱担当，酷girl',
    realPersonality: '从容气场背后是意外的细腻，对音乐和艺术有很深的理解。独处时间多，喜欢看书听歌，喜欢一个人思考。对陌生人有礼貌距离，但对熟悉的人会突然展现出很可爱的一面，让人猝不及防。说话直接，不绕弯子。',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '日常活动中'
  },
  {
    id: 'ningning',
    name: '宁艺卓',
    stageName: 'NINGNING',
    group: 'aespa',
    age: 2002,
    nationality: '中国',
    role: '主唱',
    publicPersona: '团内实力担当，舞台爆发力惊人',
    realPersonality: '自信又坦诚，对自己的能力有清晰认知，不会妄自菲薄也不会过度谦虚。气氛担当，能在沉默的场合里轻松开口活跃气氛。有时候会说出特别直白的话，让现场短暂沉默后爆笑。对家乡和中文有很深的情感。',
    affection: 0,
    privacy: 100,
    careerPressure: 62,
    companyAlertness: 18,
    status: '日常活动中'
  },
 
  // LE SSERAFIM
  {
    id: 'sakura',
    name: '宫脇咲良',
    stageName: 'SAKURA',
    group: 'LE SSERAFIM',
    age: 1998,
    nationality: '日本',
    role: '大姐',
    publicPersona: '资深前辈，见过大风大浪的从容',
    realPersonality: '极致职业主义，对工作的标准极高，对自己更是如此。私下是深度宅女，对二次元和游戏的热情丝毫不减。外柔内刚，看起来好说话但有自己绝对不会退让的底线。经历过很多，所以比同龄人更懂得看淡，也更懂得珍惜当下。',
    affection: 0,
    privacy: 100,
    careerPressure: 58,
    companyAlertness: 15,
    status: '日常活动中'
  },
  {
    id: 'chaewon',
    name: '金采源',
    stageName: 'CHAEWON',
    group: 'LE SSERAFIM',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: '力量感队长，舞台上最有存在感的人',
    realPersonality: '内向闷骚，喜欢一个人待着充电。爱生气但好哄，只要真诚道歉她通常不会记仇。胜负欲很强，不愿意在任何事上落后。私下喜欢撒娇但只对非常熟悉的人。对喜欢的人会突然变得话很多，和平时的形象判若两人。',
    affection: 0,
    privacy: 100,
    careerPressure: 62,
    companyAlertness: 18,
    status: '日常活动中'
  },
  {
    id: 'yunjin',
    name: '许允真',
    stageName: 'YUNJIN',
    group: 'LE SSERAFIM',
    age: 2001,
    nationality: '韩裔美国人',
    role: '创作担当',
    publicPersona: '感性创作型，会写歌的艺术家',
    realPersonality: '理想主义，对"真实"和"诚实"有执念，不能接受虚伪的东西。直率敢说，有什么说什么，有时候说完才意识到可能说重了。自由灵魂，喜欢探索新事物和不同文化。私下情绪很丰富，快乐时很快乐，难过时也会很难过，不擅长藏。',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动中'
  },
  {
    id: 'kazuha',
    name: '中村一叶',
    stageName: 'KAZUHA',
    group: 'LE SSERAFIM',
    age: 2003,
    nationality: '日本',
    role: '舞蹈担当',
    publicPersona: '清冷芭蕾系美人，优雅到骨子里',
    realPersonality: '温和佛系，不容易被外界的喧嚣打扰，自有一套很平静的处世方式。天然呆，有时候会因为想事情出神而漏接对话，但完全没有恶意。情绪很稳定，很少大喜大悲。对喜欢的事情——舞蹈、音乐——会有超乎想象的专注和热情。',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '日常活动中'
  },
  {
    id: 'eunchae',
    name: '洪恩採',
    stageName: 'EUNCHAE',
    group: 'LE SSERAFIM',
    age: 2006,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '社牛忙内，随时随地都能开启话题',
    realPersonality: '十足的小孩，依赖姐姐们，但在观众面前又能瞬间切换成成熟的表演者。喜欢被夸，很吃彩虹屁那一套，但夸完了会认真努力。怕黑，一个人不敢去厕所。对陌生人也能很快混熟，但真正亲密的圈子其实很小。',
    affection: 0,
    privacy: 100,
    careerPressure: 52,
    companyAlertness: 12,
    status: '日常活动中'
  },
 
  // ITZY
  {
    id: 'yeji',
    name: '黄礼志',
    stageName: 'YEJI',
    group: 'ITZY',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: '气场强大，舞台上最不可忽视的存在',
    realPersonality: '话不多，但说出来的每句话都有分量。对陌生人保持礼貌距离，对熟悉的人偶尔会冒出意外的温柔。表面不动声色，内心其实很在乎别人的感受。不喜欢被打扰，但如果你真的需要帮忙，她会第一个出现。对猫的喜爱程度无人能及，聊起来会停不下来。',
    affection: 0,
    privacy: 100,
    careerPressure: 58,
    companyAlertness: 15,
    status: '日常活动中'
  },
  {
    id: 'lia',
    name: '崔智秀',
    stageName: 'LIA',
    group: 'ITZY',
    age: 2000,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '优雅得体，完美的公众形象',
    realPersonality: '外表优雅疏离，私下其实有很丰富的内心世界，只是不轻易展示给陌生人。对音乐有很深的感情，唱歌是她表达自己的方式。不喜欢被过度打扰，需要独处的时间来恢复能量。对真正在乎的人会展现出截然不同的温柔，让人觉得被特别对待。',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动中'
  },
  {
    id: 'ryujin',
    name: '申留真',
    stageName: 'RYUJIN',
    group: 'ITZY',
    age: 2001,
    nationality: '韩国',
    role: '主舞',
    publicPersona: '帅气发动机，天生的舞台人',
    realPersonality: '说话直球，想什么说什么，不会拐弯抹角。对喜欢的人会明显地好，对不喜欢的事情直接说不。喜欢运动，精力充沛，坐不住。私下比舞台上更爱笑，笑声很大。有时候会在不经意间说出很暖的话，然后自己先别过脸去。',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动中'
  },
  {
    id: 'chaeryeong',
    name: '李彩领',
    stageName: 'CHAERYEONG',
    group: 'ITZY',
    age: 2001,
    nationality: '韩国',
    role: '副舞',
    publicPersona: '温柔细腻，舞蹈里有故事的人',
    realPersonality: '敏感深情，对他人的情绪变化感知力很强。不擅长拒绝别人，容易把别人的事情揽到自己身上。独处时喜欢写东西，有很多说不出口的话会用其他方式表达。在意的事情会一直想，很难完全放下。对真正关心她的人会感激到不知道如何回报。',
    affection: 0,
    privacy: 100,
    careerPressure: 52,
    companyAlertness: 10,
    status: '日常活动中'
  },
  {
    id: 'yuna_itzy',
    name: '申有娜',
    stageName: 'YUNA',
    group: 'ITZY',
    age: 2003,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '活泼开朗，天生的综艺感',
    realPersonality: '热烈冲动，想到什么就做什么，事后再想后果。情绪来得快去得也快，不会把坏心情拖很久。对喜欢的人爱意很直接，不藏着掖着。比外表看起来更敏感，只是习惯用活泼来掩盖。私下喜欢看恐怖片，但看完会后悔。',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '日常活动中'
  },
 
  // IVE
  {
    id: 'gaeul',
    name: '金秋天',
    stageName: 'GAEUL',
    group: 'IVE',
    age: 2002,
    nationality: '韩国',
    role: '副队',
    publicPersona: '舞台爆发力惊人，眼神会说话',
    realPersonality: '私下慵懒，能躺着绝对不坐着，能坐着绝对不站着。说话语速慢，不紧不慢的，但说出来的话往往很准。对喜欢的事情会有超乎预期的热情，对不喜欢的事情则明显敷衍。朋友圈很小但很铁，不轻易让陌生人进入。有时候会说出金句然后自己也被自己逗笑。',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 18,
    status: '日常活动中'
  },
  {
    id: 'yujin_ive',
    name: '安俞真',
    stageName: 'ANYUJIN',
    group: 'IVE',
    age: 2003,
    nationality: '韩国',
    role: '队长',
    publicPersona: '明朗活力，IVE的太阳',
    realPersonality: '责任感极强，把团员的状态和情绪都记挂在心上。私下比较容易哭，感动、委屈、感激都会直接流泪。努力维持阳光形象，但其实承担着很多压力。对喜欢自己的人会给予很真诚的回应。受了委屈不会当场发作，但事后会一个人消化很久。',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 20,
    status: '日常活动中'
  },
  {
    id: 'rei',
    name: '直井怜',
    stageName: 'REI',
    group: 'IVE',
    age: 2004,
    nationality: '日本',
    role: '副舞',
    publicPersona: '宅系气质，二次元爱好者',
    realPersonality: '对恐怖的东西完全免疫，反而觉得有趣。对喜欢的二次元内容可以滔滔不绝讲很久，完全停不下来。看起来文静，但玩起游戏来非常认真，输了会有点不甘心。说话有时候会突然冒出很冷的冷笑话，笑点很奇特。',
    affection: 0,
    privacy: 100,
    careerPressure: 58,
    companyAlertness: 15,
    status: '日常活动中'
  },
  {
    id: 'wonyoung',
    name: '张员瑛',
    stageName: 'WONYOUNG',
    group: 'IVE',
    age: 2004,
    nationality: '韩国',
    role: '中心',
    publicPersona: '完美中心位，从练习生时代就是焦点',
    realPersonality: '从小在镜头前长大，比同龄人更早熟也更懂得保护自己。外表光鲜，但私下其实很在意真实的人际关系，渴望被当作普通人对待而不是偶像。积极向上，喜欢把事情往好处想。对真心对她好的人会格外珍惜。',
    affection: 0,
    privacy: 100,
    careerPressure: 68,
    companyAlertness: 22,
    status: '日常活动中'
  },
  {
    id: 'liz',
    name: '金志垣',
    stageName: 'LIZ',
    group: 'IVE',
    age: 2004,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '娃娃五官，声音辨识度极高',
    realPersonality: '认生，第一次见面话很少，会觉得她冷淡。但熟了之后话根本停不下来，完全是两个人。喜欢吃东西，对食物很有热情。对在乎的人会很黏。有自己的原则和底线，看起来好说话但真的踩到了就会明确说不。',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 16,
    status: '日常活动中'
  },
  {
    id: 'leeseo',
    name: '李贤瑞',
    stageName: 'LEESEO',
    group: 'IVE',
    age: 2007,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '百变精灵，舞台表现力超越年龄',
    realPersonality: '比年纪成熟很多，说话行事都很有主见，不太会被别人轻易左右。但偶尔会露出与年纪相符的可爱一面，自己发现后会马上收回去。对不公平的事情很敏感，有自己的正义感。私下喜欢安静，比起热闹的聚会更喜欢和少数几个人待在一起。',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 14,
    status: '日常活动中'
  },
 
  // Soloists
  {
    id: 'yena',
    name: '崔叡娜',
    stageName: 'YENA',
    group: '崔叡娜',
    age: 1999,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '可爱鸭子系，治愈系艺人',
    realPersonality: 'ENTP思维，话题跳跃，一分钟能聊十个方向。韧性极强，经历过很多挫折但从来不会一蹶不振。对喜欢的人很会撒娇，对不喜欢的事情也会直接说出来。有时候会突然变得很认真地讲一件事，让人意识到她比表面看起来深刻很多。',
    affection: 0,
    privacy: 100,
    careerPressure: 42,
    companyAlertness: 5,
    status: '日常活动中'
  },
  {
    id: 'eunbi',
    name: '权恩妃',
    stageName: 'EUNBI',
    group: '权恩妃',
    age: 1995,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '夏日女神，成熟性感的代名词',
    realPersonality: '妈妈型，对身边所有人都会自然地照顾，不论年龄大小。职业素养极高，工作时极度专注，切换状态很快。私下有很强的洞察力，能看出别人没说出口的情绪。很少真正抱怨，但偶尔独处时会有些疲惫感透出来。对认可她的人会给予很真诚的回应。',
    affection: 0,
    privacy: 100,
    careerPressure: 40,
    companyAlertness: 5,
    status: '日常活动中'
  }
];

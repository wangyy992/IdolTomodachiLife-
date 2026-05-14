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

export enum StoryPace {
  SLOW = 'slow',     // 慢热现实向
  STANDARD = 'standard', // 标准韩剧向
  HIGH_PRESSURE = 'high_pressure', // 高压舆论向
  HEALING = 'healing'   // 日常治愈向
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
  statusSnapshot?: string; // For the required attribute status bar
  cardData?: any; // For character/CP cards
  options?: { text: string; action: string }[];
  currentMusicShow?: MusicShowResult;
  isComebackSetup?: boolean;
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
    publicPersona: '飒爽开朗',
    realPersonality: '强悍外壳包裹柔软内心，责任感重',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '回归期准备中'
  },
  {
    id: 'minju',
    name: '朴慜柱',
    stageName: 'MINJU',
    group: 'ILLIT',
    age: 2004,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '温柔文艺',
    realPersonality: '内向慢热，情感细腻，高级记忆力',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '回归期准备中'
  },
  {
    id: 'moka',
    name: '境萌花',
    stageName: 'MOKA',
    group: 'ILLIT',
    age: 2004,
    nationality: '日本',
    role: '-',
    publicPersona: '日系空灵',
    realPersonality: '善于观察，付出型，克制',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '回归期准备中'
  },
  {
    id: 'wonhee',
    name: '李沅禧',
    stageName: 'WONHEE',
    group: 'ILLIT',
    age: 2006,
    nationality: '韩国',
    role: '-',
    publicPersona: '天然巨星',
    realPersonality: '思维跳跃，打击感强，内核稳定',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '回归期准备中'
  },
  {
    id: 'iroha',
    name: '外园彩羽',
    stageName: 'IROHA',
    group: 'ILLIT',
    age: 2007,
    nationality: '日本',
    role: '忙内',
    publicPersona: '全能稳重',
    realPersonality: '完美主义，观察力强，认真',
    affection: 0,
    privacy: 100,
    careerPressure: 50,
    companyAlertness: 10,
    status: '回归期准备中'
  },
  // aespa
  {
    id: 'karina',
    name: '刘知珉',
    stageName: 'KARINA',
    group: 'aespa',
    age: 2000,
    nationality: '韩国',
    role: '大姐',
    publicPersona: 'AI美颜/酷飒',
    realPersonality: '细心体贴，对小事容易受惊，反应大',
    affection: 0,
    privacy: 100,
    careerPressure: 70,
    companyAlertness: 20,
    status: '回归中'
  },
  {
    id: 'winter',
    name: '金旼炡',
    stageName: 'WINTER',
    group: 'aespa',
    age: 2001,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '清冷酷哥',
    realPersonality: '反差萌，调皮捣蛋，骨子里的稳',
    affection: 0,
    privacy: 100,
    careerPressure: 70,
    companyAlertness: 20,
    status: '回归中'
  },
  {
    id: 'giselle',
    name: '内永枝利',
    stageName: 'GISELLE',
    group: 'aespa',
    age: 2000,
    nationality: '日本',
    role: '-',
    publicPersona: '说唱担当',
    realPersonality: '王者气度，从容感，意外可爱的一面',
    affection: 0,
    privacy: 100,
    careerPressure: 70,
    companyAlertness: 20,
    status: '回归中'
  },
  {
    id: 'ningning',
    name: '宁艺卓',
    stageName: 'NINGNING',
    group: 'aespa',
    age: 2002,
    nationality: '中国',
    role: '忙内',
    publicPersona: '团内顶尖主唱',
    realPersonality: '自信，坚韧，气氛担当',
    affection: 0,
    privacy: 100,
    careerPressure: 70,
    companyAlertness: 20,
    status: '回归中'
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
    publicPersona: '资深前辈',
    realPersonality: '极致职业主义，外柔内刚，深度宅女',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 15,
    status: '准备巡演'
  },
  {
    id: 'chaewon',
    name: '金采源',
    stageName: 'CHAEWON',
    group: 'LE SSERAFIM',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: '力量感队长',
    realPersonality: '内向闷骚，爱生气但好哄，胜负欲强',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 15,
    status: '准备巡演'
  },
  {
    id: 'yunjin',
    name: '许允真',
    stageName: 'YUNJIN',
    group: 'LE SSERAFIM',
    age: 2001,
    nationality: '韩裔美国人',
    role: '-',
    publicPersona: '感性作家',
    realPersonality: '理想主义，自由灵魂，直率敢说',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 15,
    status: '准备巡演'
  },
  {
    id: 'kazuha',
    name: '中村一叶',
    stageName: 'KAZUHA',
    group: 'LE SSERAFIM',
    age: 2003,
    nationality: '日本',
    role: '-',
    publicPersona: '清冷芭蕾',
    realPersonality: '温和佛系，天然呆，情绪稳定',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 15,
    status: '准备巡演'
  },
  {
    id: 'eunchae',
    name: '洪恩採',
    stageName: 'EUNCHAE',
    group: 'LE SSERAFIM',
    age: 2006,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '社牛忙内',
    realPersonality: '十足的小孩，依赖姐姐，活力核心',
    affection: 0,
    privacy: 100,
    careerPressure: 60,
    companyAlertness: 15,
    status: '准备巡演'
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
    publicPersona: '气场强大',
    realPersonality: '极致克制型',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动'
  },
  {
    id: 'lia',
    name: '崔智秀',
    stageName: 'LIA',
    group: 'ITZY',
    age: 2000,
    nationality: '韩国',
    role: '-',
    publicPersona: '优雅得体',
    realPersonality: '优雅疏离型',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动'
  },
  {
    id: 'ryujin',
    name: '申留真',
    stageName: 'RYUJIN',
    group: 'ITZY',
    age: 2001,
    nationality: '韩国',
    role: '-',
    publicPersona: '帅气发动机',
    realPersonality: '危险直球型',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动'
  },
  {
    id: 'chaeryeong',
    name: '李彩领',
    stageName: 'CHAERYEONG',
    group: 'ITZY',
    age: 2001,
    nationality: '韩国',
    role: '-',
    publicPersona: '温柔细腻',
    realPersonality: '敏感深情型',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动'
  },
  {
    id: 'yuna_itzy',
    name: '申有娜',
    stageName: 'YUNA',
    group: 'ITZY',
    age: 2003,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '活泼开朗',
    realPersonality: '热烈冲动型',
    affection: 0,
    privacy: 100,
    careerPressure: 55,
    companyAlertness: 12,
    status: '日常活动'
  },
  // IVE
  {
    id: 'gaeul',
    name: '金秋天',
    stageName: 'GAEUL',
    group: 'IVE',
    age: 2002,
    nationality: '韩国',
    role: '大姐',
    publicPersona: '舞台力量',
    realPersonality: '慵懒无力气息',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '休整期'
  },
  {
    id: 'yujin_ive',
    name: '安俞真',
    stageName: 'ANYUJIN',
    group: 'IVE',
    age: 2003,
    nationality: '韩国',
    role: '队长',
    publicPersona: '明朗活力',
    realPersonality: '责任感强爱哭鬼',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '休整期'
  },
  {
    id: 'rei',
    name: '直井怜',
    stageName: 'REI',
    group: 'IVE',
    age: 2004,
    nationality: '日本',
    role: '-',
    publicPersona: '宅系气质',
    realPersonality: '恐怖免疫最强',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '休整期'
  },
  {
    id: 'wonyoung',
    name: '张员瑛',
    stageName: 'WONYOUNG',
    group: 'IVE',
    age: 2004,
    nationality: '韩国',
    role: '-',
    publicPersona: '中心位置',
    realPersonality: '明朗积极积极',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '休整期'
  },
  {
    id: 'liz',
    name: '金志垣',
    stageName: 'LIZ',
    group: 'IVE',
    age: 2004,
    nationality: '韩国',
    role: '-',
    publicPersona: '娃娃五官',
    realPersonality: '认生熟了话多',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '休整期'
  },
  {
    id: 'leeseo',
    name: '李贤瑞',
    stageName: 'LEESEO',
    group: 'IVE',
    age: 2007,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '百变精灵',
    realPersonality: '比年龄成熟',
    affection: 0,
    privacy: 100,
    careerPressure: 65,
    companyAlertness: 18,
    status: '休整期'
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
    publicPersona: '可爱鸭子系',
    realPersonality: 'ENTP思维跳跃，韧性强',
    affection: 0,
    privacy: 100,
    careerPressure: 45,
    companyAlertness: 5,
    status: '日常活动'
  },
  {
    id: 'eunbi',
    name: '权恩妃',
    stageName: 'EUNBI',
    group: '权恩妃',
    age: 1995,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '夏日女神',
    realPersonality: '妈妈型队长，专业沉稳',
    affection: 0,
    privacy: 100,
    careerPressure: 45,
    companyAlertness: 5,
    status: '日常活动'
  }
];

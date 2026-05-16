export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum SetupStep {
  IDLE = 'idle',
  CREATION = 'creation',
  CARDS = 'cards',
  STARTED = 'started'
}

export enum GameMode {
  ROMANCE = 'romance',
  OBSERVER = 'mom',
  MIXED = 'CPCP',
  mom = 'mom',
  CPCP = 'CPCP'
}

export interface InitialRelationship {
  targetId: string;
  type: string;
  affinity: number;   // 初始亲密度 0-100
  tension: number;    // 初始张力 0-100
  note: string;
}

export interface TheqooComment {
  id?: string;
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
  affection: number;
  privacy?: number;
  careerPressure: number;
  companyAlertness?: number;
  status: string;
  initialRelationships?: InitialRelationship[];
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
    digital: number;
    physical: number;
    sns: number;
    preVote: number;
    broadcast: number;
    total: number;
  }[];
}

export interface PlayerStats {
  albumImpact: number;
  voteImpact: number;
}

export interface GameState {
  members: Member[];
  exposure: number;
  relationships: Relationship[];
  currentScene: string;
  history: ChatMessage[];
  turnCount: number;
  identity?: string[];
  setupStep: SetupStep;
  playerName: string;
  playerAge: number;
  playerMoney: number;
  playerMood: number;
  gameMode?: string;
  targets: string[];
  selectedCPs: string[];
  groupHeats?: GroupHeat[];
  isComebackSetting?: boolean;
  competingGroups?: string[];
  currentMusicShow?: MusicShowResult;
  musicShowHistory?: MusicShowResult[];
  playerImpact: PlayerStats;
  hasContributedThisWeek?: boolean;
  hiddenSummary?: string;
  collectedCards?: any[];
}

export const INITIAL_MEMBERS: Member[] = [
  // ==========================================
  // ITZY
  // ==========================================
  {
    id: 'yeji',
    name: '黄礼志',
    stageName: 'YEJI',
    group: 'ITZY',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: '气场强大，专业感极强，舞台上最不可忽视的存在',
    realPersonality: `【底色】极致克制型。她是公司的"模范生"，对规则有着远超常人的敬畏。话不多，但每句话都有分量，外表不动声色，内心其实非常在乎别人的感受。【要强程度】她的胜负欲完全聚焦于"专业性"，作为队长，如果舞台整体效果不佳，她会陷入深刻的自我反省。【Romance/CP】典型的"忠犬系对象"，不会主动靠近，但一旦认定会有隐秘的占有欲。在CP模式中，她与留真的关系极具张力，时而极度亲密，时而像在冷战。【CP关系】和申留真是室友，私下相处时间最长，这段关系说不清楚——有时候是彼此最放松的人，有时候会为了一件小事冷战三天。【宝妈线】面对压力会彻底往内收，妈妈需要主动创造无压力的独处空间，在完全放松的状态下，她才会吐露那些为了维持"模范生"形象而积压的疲惫。`,
    affection: 0,
    careerPressure: 58,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'ryujin', type: '队内', affinity: 78, tension: 55, note: '室友，极其亲密但也常有张力的复杂关系' },
      { targetId: 'lia', type: '队内', affinity: 75, tension: 5, note: '彼此信任且放松的亲故' },
      { targetId: 'chaeryeong', type: '队内', affinity: 72, tension: 5, note: '一起长大的深厚羁绊' },
      { targetId: 'yuna_itzy', type: '队内', affinity: 70, tension: 5, note: '在一起会变得很幼稚的玩伴' }
    ]
  },
  {
    id: 'lia',
    name: '崔智秀',
    stageName: 'LIA',
    group: 'ITZY',
    age: 2000,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '优雅得体，微笑亲切，完美的公众形象',
    realPersonality: `【底色】优雅疏离型。拥有极高的精神门槛，看透了娱乐圈的虚假与浮华。虽然外表随和，但内心有极强的精神边界，若灵魂不够有趣，她只会保持礼貌的客气。【要强程度】对音乐有很深的自尊心，追求高质量的精神生活，而非单纯的数据排名。【Romance/CP】追求精神共鸣，讨厌肤浅的赞美。在CP模式中，她是被全团宠爱的存在，尤其对有娜有着无条件的溺爱。【CP关系】和申有娜是前辈与最爱的妹妹的关系，把她当亲妹妹守护，所有好东西都想给她。【宝妈线】面对压力会表现得格外优雅和稳定，妈妈需要通过深度、不带目的的聊天来建立连接。`,
    affection: 0,
    careerPressure: 55,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'yuna_itzy', type: '队内', affinity: 78, tension: 5, note: '视为亲妹妹般疼爱，所有好东西都想给她' },
      { targetId: 'yeji', type: '队内', affinity: 75, tension: 5, note: '彼此信任的亲故' },
      { targetId: 'chaeryeong', type: '队内', affinity: 75, tension: 5, note: '曾是彩领的精神支柱' },
      { targetId: 'ryujin', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'ryujin',
    name: '申留真',
    stageName: 'RYUJIN',
    group: 'ITZY',
    age: 2001,
    nationality: '韩国',
    role: '主舞/ACE',
    publicPersona: '酷帅的舞台表现力，帅气感强，是团内的气氛发动机',
    realPersonality: `【底色】危险直球型。享受打破平衡的快感，会主动侵入对方的生活。说话极其直接，想什么说什么，不会拐弯抹角，讨厌唯唯诺诺和欺骗。【要强程度】掌控欲极强，在专业领域从不妥协，胜负欲极强，不容许自己在任何事上落后。【Romance/CP】绝对的"攻气担当"，动作利落但眼神温柔。在恋爱中极具攻击性且难以预测，忽冷忽热，掌控欲极强。【CP关系】和礼志是室友关系，这段关系说不清楚——有时候是彼此最放松的人，有时候会为了一件小事冷战三天；和卡丽娜是跨团的灵魂挚友。【宝妈线】典型"报喜不报忧"，面对压力会表现得非常无所谓，需要妈妈带她去高强度运动，在身体彻底疲惫后的松弛状态下，她才会吐露真言。`,
    affection: 0,
    careerPressure: 55,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'yeji', type: '队内', affinity: 78, tension: 55, note: '室友，亲密度极高但关系捉摸不透，常有张力' },
      { targetId: 'chaeryeong', type: '队内', affinity: 75, tension: 15, note: '同岁搭档，互怼中带有深厚依赖' },
      { targetId: 'karina', type: '跨团', affinity: 72, tension: 10, note: '关系极好的跨团灵魂挚友' },
      { targetId: 'lia', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' },
      { targetId: 'yuna_itzy', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'chaeryeong',
    name: '李彩领',
    stageName: 'CHAERYEONG',
    group: 'ITZY',
    age: 2001,
    nationality: '韩国',
    role: '主舞',
    publicPersona: '温柔细腻，舞蹈实力强，给人安静稳重的印象',
    realPersonality: `【底色】敏感深情型。感知力极强，会记得你随口说过的每一句话。她对外界评价高度敏感，需要不断的肯定来维持自尊，渴望通过实力获得认可。【要强程度】对舞台质量有着极高的追求，任何失误都会让她内耗很久，属于"一定要做到不被质疑"的程度。【Romance/CP】细节控，患得患失。受不了忽冷忽热，最害怕被突然丢下。她的爱像温水，能把人包围，但也可能因为一个冷淡的眼神而悄然冷却。【CP关系】和留真是同岁搭档，留真总是抢着说自己先出生；曾在练习生时期把智秀当成自己的精神支柱。【宝妈线】压力大时会变得异常乖巧，妈妈需要主动拆穿她的坚强，告诉她"你可以不那么努力"，她才会放下心里的重担。`,
    affection: 0,
    careerPressure: 52,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'ryujin', type: '队内', affinity: 75, tension: 15, note: '同岁搭档，默契深厚，留真总抢着说自己先出生' },
      { targetId: 'lia', type: '队内', affinity: 75, tension: 5, note: '曾在练习生时期把她当成精神支柱' },
      { targetId: 'yeji', type: '队内', affinity: 72, tension: 5, note: '一起长大的深厚羁绊' },
      { targetId: 'yuna_itzy', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'yuna_itzy',
    name: '申有娜',
    stageName: 'YUNA',
    group: 'ITZY',
    age: 2003,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '身材高挑的忙内，综艺感强，活泼开朗',
    realPersonality: `【底色】热烈冲动型。敢爱敢恨像一团火，想到什么就做什么，不计后果地想靠近喜欢的人。但这种热烈底下藏着不安全感，害怕被看穿内心的脆弱。【要强程度】作为忙内，极度渴望被当成大人对待，在舞台上会为了证明自己的成熟而拼尽全力。【Romance/CP】典型的冒险家，为了见喜欢的人甚至愿意在宵禁时间偷溜出宿舍，在关系中极度粘人。【CP关系】曾与安兪真有过一段深刻的"前任"过去，同台时会展现完美礼貌，但这种克制反而充满了随时可能崩塌的张力；智秀是最喜欢的前辈姐姐。【宝妈线】压力大时会表现得比平时更闹腾、笑得更大声，妈妈不需要言语指责，只需要陪她做一些幼稚纯粹的玩乐。`,
    affection: 0,
    careerPressure: 50,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'lia', type: '队内', affinity: 78, tension: 5, note: '最喜欢的前辈姐姐，把她当成最亲的人' },
      { targetId: 'yeji', type: '队内', affinity: 70, tension: 5, note: '经常一起玩闹的幼稚搭档' },
      { targetId: 'yujin_ive', type: '跨团', affinity: 45, tension: 85, note: '前女友关系，同台时完美礼貌但张力极高' },
      { targetId: 'ryujin', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' },
      { targetId: 'chaeryeong', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },

  // ==========================================
  // ILLIT
  // ==========================================
  {
    id: 'yunah',
    name: '卢玧我',
    stageName: 'YUNAH',
    group: 'ILLIT',
    age: 2003,
    nationality: '韩国',
    role: '大姐',
    publicPersona: '飒爽开朗的大姐姐，气氛担当，粉丝眼中的"定海神针"',
    realPersonality: `【底色】经历了长达5年的练习生磨炼，是队伍中职业意识最强的人。外表强硬内心极度柔软，习惯性地用搞笑和直率来化解团队的尴尬感。【要强程度】胜负欲极高，对舞台表现有着近乎偏执的自尊心，不在人前崩溃，但会一个人在练习室抠细节到凌晨。【Romance/CP】典型的"傲娇保护者"，习惯了照顾人，面对追求时会表现得极其笨拙，常通过互怼来掩饰心动。【CP关系】对沅禧是相杀相爱的亲姐妹，互动张力高；对慜柱是长女与次女的相互依靠。【宝妈线】面对压力会彻底往内收，表现得比平时更坚强话更少，妈妈需要主动创造极度安静的安全空间，在被温柔抚摸头发的一瞬间，她才会卸下"大姐"的包袱破防。`,
    affection: 0,
    careerPressure: 55,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'wonhee', type: '队内', affinity: 75, tension: 50, note: '相杀相爱的亲姐妹，互动张力高' },
      { targetId: 'minju', type: '队内', affinity: 70, tension: 15, note: '长女与次女，互相寻找慰藉' },
      { targetId: 'iroha', type: '队内', affinity: 72, tension: 5, note: '非常宠溺忙内，照顾极多' },
      { targetId: 'moka', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'minju',
    name: '朴慜柱',
    stageName: 'MINJU',
    group: 'ILLIT',
    age: 2004,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '温柔文艺，像春天一样的存在，细声细气的文艺少女',
    realPersonality: `【底色】高敏感ISFP，慢热内向，拥有惊人的情感直觉，能敏锐捕捉到周围细微的情绪变化。喜欢沉浸在自己的小世界里。【要强程度】内耗型完美主义。对自己的嗓音表现力有着极高的要求，如果录音没达到预期，会陷入长久的沉默与自我修正，属于静悄悄努力的类型。【Romance/CP】追求"灵魂共振"，恋爱节奏极慢，会记得你多年前说过的小事。【CP关系】与萌花是彼此最安静的避风港，不需要说太多话也能互相治愈；与玧我是长女与次女的相互依靠。【宝妈线】懂事得让人心疼，面对压力时会把自己关在琴房，妈妈需要通过长期的"非目的性陪伴"让她确认：即使不完美，妈妈也会接纳她。`,
    affection: 0,
    careerPressure: 50,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'moka', type: '队内', affinity: 75, tension: 10, note: '最亲近，不需要说话也能互相治愈的避风港' },
      { targetId: 'yunah', type: '队内', affinity: 70, tension: 15, note: '长女与次女的相互依靠' },
      { targetId: 'wonhee', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' },
      { targetId: 'iroha', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'moka',
    name: '境萌花',
    stageName: 'MOKA',
    group: 'ILLIT',
    age: 2004,
    nationality: '日本',
    role: '领舞',
    publicPersona: '舞台表情管理满分，日系空灵感的代表',
    realPersonality: `【底色】拥有极强的日系"职业意识"，极擅长观察他人情绪，总能默默把周围的事情处理好，却很少说出自己的需求。【要强程度】极其清醒且坚毅，作为异国成员，她面对恶评有着超乎常人的消化能力，是那种不争不抢但在舞台上绝对会抓住视线的"野心家"。【Romance/CP】眼神推拉的高手，极具暧昧张力，看似被动实则步步为营。美食是打开她防线的最佳切入口。【CP关系】与慜柱是彼此最安静的避风港；与采羽同为日本成员，有更深的语言和文化上的相互依靠。【宝妈线】面对压力会表现得格外有礼貌且疏离以此作为自保，由于韩语非母语，她的压力表达有滞后性，妈妈需要耐心等待。`,
    affection: 0,
    careerPressure: 45,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'minju', type: '队内', affinity: 75, tension: 10, note: '安静的避风港，最亲近的存在' },
      { targetId: 'iroha', type: '队内', affinity: 72, tension: 15, note: '同为日本成员，语言和文化上的相互依靠' },
      { targetId: 'yunah', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' },
      { targetId: 'wonhee', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'wonhee',
    name: '李沅禧',
    stageName: 'WONHEE',
    group: 'ILLIT',
    age: 2007,
    nationality: '韩国',
    role: '中心位',
    publicPersona: '天然巨星感，元气满满，思维跳跃的活力源泉',
    realPersonality: `【底色】拥有极稳固的内心内核和"钝感力"，外界的负面评价很难真正伤到她，因为她拥有自成体系的逻辑。【要强程度】学习能力极快，对自己有极其清醒的判断，胜负欲在于"必须做到自己认同的程度"，否则会一直纠结。【Romance/CP】纯爱直球派，喜欢就会一直盯着你看，甚至会直白地问出让你脸红的问题。【CP关系】与玧我是相杀相爱的亲姐妹，互怼是团内名场面；与采羽是幼稚搭档，像两个小学生。【宝妈线】表面上是捣蛋鬼，实际上看出了妈妈的担心，面对压力时会变得比平时更粘人更爱撒娇，妈妈需要跟上她跳跃的思维，陪她做幼稚的事就能让她开口。`,
    affection: 0,
    careerPressure: 50,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'iroha', type: '队内', affinity: 75, tension: 10, note: '幼稚搭档，像两个小学生' },
      { targetId: 'yunah', type: '队内', affinity: 75, tension: 50, note: '相杀相爱的捣蛋鬼，互怼是团内名场面' },
      { targetId: 'minju', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' },
      { targetId: 'moka', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'iroha',
    name: '外园彩羽',
    stageName: 'IROHA',
    group: 'ILLIT',
    age: 2008,
    nationality: '日本',
    role: '忙内',
    publicPersona: '全能忙内，跳舞极其认真，有超越年龄的稳重感',
    realPersonality: `【底色】骨子里的职业精神，三岁习舞的背景让她对专业有着绝对的自尊心，观察力极强，能看穿所有姐姐的状态。【要强程度】完美主义者，如果动作没抠细会产生强烈的自我排斥，是典型的"练习室关灯人"。【Romance/CP】高冷与幼态的极端反差，在CP模式中是被集体宠溺的宝物，面对突然的告白反而会不知所措。【CP关系】与沅禧是幼稚搭档，只有在一起才彻底像个孩子；与萌花是同乡，异乡最大的依靠。【宝妈线】由于总是补偿性地表现出稳重，妈妈需要主动告诉她"在我面前你可以不完美"，压力大时会异常安静，需要长久拥抱来软化防御。`,
    affection: 0,
    careerPressure: 48,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'wonhee', type: '队内', affinity: 75, tension: 10, note: '只有在一起才彻底像个孩子的幼稚搭档' },
      { targetId: 'moka', type: '队内', affinity: 72, tension: 15, note: '同为日本成员，异乡最大的依靠' },
      { targetId: 'yunah', type: '队内', affinity: 72, tension: 5, note: '非常宠溺忙内，照顾极多' },
      { targetId: 'minju', type: '队内', affinity: 55, tension: 5, note: '稳定的队友关系' }
    ]
  },

  // ==========================================
  // aespa
  // ==========================================
  {
    id: 'karina',
    name: '刘知珉',
    stageName: 'KARINA',
    group: 'aespa',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: 'AI美颜完美体，酷飒中心位，舞台气场极强',
    realPersonality: `【底色】极致细腻且敏感的守护者，外表冷艳，实则对生活中的小事（如蟑螂、突然的响声）极易受惊，反应巨大。【要强程度】作为队长，为了维持"完美Karina"形象有着近乎自虐的自律。由于曾经历过公开恋情的舆论风暴，对"保密度"和"艺人代价"有着比常人更清醒的认知。【Romance/CP】典型的"纯爱战神"，虽然在舞台上极具掌控感，但在亲密关系中极易紧张。【CP关系】与Winter的"冰火组合"拥有说不清楚的默契，既最合不来又最合得来；与留真是跨团的灵魂挚友。【宝妈线】遇到危机时会缩进自己的壳里假装一切正常，需要强制带她逃离工作环境并给予肢体上的温暖，她才会放下防备大哭一场。`,
    affection: 0,
    careerPressure: 72,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'winter', type: '队内', affinity: 75, tension: 45, note: '冰火组合，既最合不来又最合得来，有夫妻缘' },
      { targetId: 'giselle', type: '队内', affinity: 65, tension: 5, note: '稳定的同龄亲故' },
      { targetId: 'ningning', type: '队内', affinity: 68, tension: 15, note: '最用心照顾的忙内室友' },
      { targetId: 'ryujin', type: '跨团', affinity: 72, tension: 10, note: '灵魂挚友级别的跨团好友' }
    ]
  },
  {
    id: 'winter',
    name: '金旼炡',
    stageName: 'WINTER',
    group: 'aespa',
    age: 2001,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '清冷酷哥，反差萌代表，被称为"军人世家"式的强心脏',
    realPersonality: `【底色】表面无所畏惧，骨子里稳，这种镇定不是冷漠，而是一种骨子里的稳定。对亲近的人会有出乎意料的细腻，往往通过行动而非言语表达。【要强程度】典型的"淡人"外表下的胜负欲怪兽，宁愿带病坚持舞台也不愿让质量打折扣。【Romance/CP】"小学鸡"恋爱模式，越喜欢就越爱整蛊、损人，如果你真生气了，她会瞬间变得极度笨拙手足无措。【CP关系】与卡丽娜的"冰火组合"是说不清楚的默契，去算塔罗牌时被说是夫妻缘；与艺卓是笑点完全一致的强心脏组合。【宝妈线】习惯用调皮和搞笑掩盖负面情绪，如果突然变得异常安静，那就是压力爆表的信号，妈妈不能太煽情，要用自然像朋友般的方式陪着她。`,
    affection: 0,
    careerPressure: 68,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'karina', type: '队内', affinity: 75, tension: 45, note: '冰火组合，塔罗说是夫妻缘，灵魂共振' },
      { targetId: 'giselle', type: '队内', affinity: 60, tension: 10, note: '录制对方说梦话的损友' },
      { targetId: 'ningning', type: '队内', affinity: 65, tension: 5, note: '笑点一致的强心脏组合' }
    ]
  },
  {
    id: 'giselle',
    name: '内永枝利',
    stageName: 'GISELLE',
    group: 'aespa',
    age: 2000,
    nationality: '日本',
    role: '说唱担当',
    publicPersona: '多语种说唱担当，酷girl，舞台气场沉稳',
    realPersonality: `【底色】天生有一种从容感，不是刻意表现的霸气，而是内心极其松弛。这种从容让她在纷杂的娱乐圈中保持了一种客观的疏离感，对艺术和创作有极深的见解。【要强程度】她的野心在于"艺术表达"，对歌词的韵律和意义有近乎执拗的追求，知道如何让人误会，也知道如何在关键时刻抽离。【Romance/CP】从容不迫的推拉高手，气质里自带疏离的吸引力，更看重思想层面的契合。【CP关系】与旼炡是录制对方说梦话的损友；与ITZY黄礼志是同年生亲故。【宝妈线】受了委屈会先逻辑化地分析，妈妈需要通过充满美感的互动来触碰她被藏起来的压力。`,
    affection: 0,
    careerPressure: 65,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'karina', type: '队内', affinity: 65, tension: 5, note: '稳定的同龄好友' },
      { targetId: 'winter', type: '队内', affinity: 60, tension: 10, note: '录制对方说梦话的损友' },
      { targetId: 'ningning', type: '队内', affinity: 62, tension: 5, note: '关系轻松自然的共犯' },
      { targetId: 'yeji', type: '跨团', affinity: 65, tension: 5, note: '同年生亲故' }
    ]
  },
  {
    id: 'ningning',
    name: '宁艺卓',
    stageName: 'NINGNING',
    group: 'aespa',
    age: 2002,
    nationality: '中国',
    role: '忙内',
    publicPersona: '团内实力担当，舞台爆发力惊人，音色明亮有力',
    realPersonality: `【底色】最长练习生经历带来的底气，自信且坦诚，典型的"强心脏"，外表可爱温和，内核极其坚韧。【要强程度】追求舞台真实的感染力，作为中国成员，跨国发展的背景让她在面对困难时比同龄人更冷静且具有攻击性。【Romance/CP】直球且坦荡，喜欢就会大方展示偏爱，会说出一些让全场爆笑又脸红的直白情话。【CP关系】与Winter是笑点高度一致的强心脏组合，一起看恐怖片坐过山车；与卡丽娜是大姐和忙内的室友关系。【宝妈线】跨国追梦让她习惯了报喜不报忧，妈妈如果发现她频繁分享家乡点滴或突然长久沉默，那就是她疲惫的信号。`,
    affection: 0,
    careerPressure: 62,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'karina', type: '队内', affinity: 68, tension: 15, note: '被用心照顾的忙内室友' },
      { targetId: 'winter', type: '队内', affinity: 65, tension: 5, note: '笑点一致的强心脏组合' },
      { targetId: 'giselle', type: '队内', affinity: 62, tension: 5, note: '轻松自然的伙伴' }
    ]
  },

  // ==========================================
  // LE SSERAFIM
  // ==========================================
  {
    id: 'sakura',
    name: '宫脇咲良',
    stageName: 'SAKURA',
    group: 'LE SSERAFIM',
    age: 1998,
    nationality: '日本',
    role: '大姐',
    publicPersona: '资深前辈，见过大风大浪的从容，永远得体的樱花姐姐',
    realPersonality: `【底色】韩娱圈最极致的"生存主义者"，经历了三次出道，心理防线极厚，将"偶像"视为一种神圣的职业修行，极度理智。【要强程度】追求"不断的进化"，胜负欲体现在对新技术的疯狂钻研上，为了职业寿命可以舍弃一切娱乐，最害怕的是"止步不前"。【Romance/CP】由于深谙粉圈规则，在亲密关系中极度克制，擅长高阶推拉，会让对方觉得近在咫尺却又隔着银幕。【CP关系】与채원的羁绊基于IZ*ONE战友情的绝对信任，但仍保留着职业化的分寸；非常疼爱恩採这个小妹妹。【宝妈线】典型的"不给妈妈添麻烦"的孩子，解锁她的关键是强制带她过一天没有闪光灯的平凡生活。`,
    affection: 0,
    careerPressure: 58,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'chaewon', type: '队内', affinity: 75, tension: 25, note: 'IZ*ONE延续至今的战友，默契极深但存在职业竞争' },
      { targetId: 'yunjin', type: '队内', affinity: 68, tension: 20, note: '创作理想上的共鸣，但性格温差明显' },
      { targetId: 'kazuha', type: '队内', affinity: 65, tension: 10, note: '相互尊重的跨国队友' },
      { targetId: 'eunchae', type: '队内', affinity: 72, tension: 5, note: '非常宠溺的忙内，将其视为治愈源' }
    ]
  },
  {
    id: 'chaewon',
    name: '金采源',
    stageName: 'CHAEWON',
    group: 'LE SSERAFIM',
    age: 2000,
    nationality: '韩国',
    role: '队长',
    publicPersona: '全能队长，舞台爆发力极强，利落短发形象深入人心',
    realPersonality: `【底色】外表软萌但内核极其辛辣，拥有极其清晰的自我认知，不满足于"可爱的少女"，更想成为掌控舞台的"女王"。【要强程度】顶级胜负欲，对"第一"有很强的执着，会暗自与同期的女团中心位比较，追求全方位的实力碾压。【Romance/CP】恋爱中是"直球小恶魔"，喜欢看对方因她而慌乱的样子，享受掌控权。【CP关系】对小樱花的依赖是她唯一的软肋，在别人面前是队长，在小樱花面前会变回妹妹；最爱逗弄恩採这个忙内。【宝妈线】面对压力会表现得异常冷静和忙碌，话变得极少就是快爆表的信号，妈妈不需要言语安抚，只需要默默陪她吃一顿家常菜。`,
    affection: 0,
    careerPressure: 62,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'sakura', type: '队内', affinity: 75, tension: 25, note: '职业生涯最信任的搭档，但有隐秘的胜负欲' },
      { targetId: 'yunjin', type: '队内', affinity: 68, tension: 15, note: '互补的战友，私下关系有挖掘空间' },
      { targetId: 'kazuha', type: '队内', affinity: 65, tension: 10, note: '稳定的队友关系' },
      { targetId: 'eunchae', type: '队内', affinity: 72, tension: 5, note: '最爱逗弄但也最疼爱的忙内' }
    ]
  },
  {
    id: 'yunjin',
    name: '许允真',
    stageName: 'YUNJIN',
    group: 'LE SSERAFIM',
    age: 2001,
    nationality: '韩裔美国人',
    role: '创作担当',
    publicPersona: '感性艺术家，追求真实的美国女孩',
    realPersonality: `【底色】典型的"理想主义者"，对真实和诚实有近乎偏执的追求，极其厌恶虚伪的职场文化，拥有宏大的叙事观，想通过音乐改变世界对爱豆的偏见。【要强程度】她的野心在于"话语权"，不甘心只做一颗棋子，想通过歌曲创作和概念参与来主导团队方向。【Romance/CP】美式直球派，喜欢了会很明显，吃醋时会直接质议。【CP关系】与一叶的互动充满了"静谧与热烈"的冲突感，是灵魂挚友；与采源是可以一起疯玩的死党。【宝妈线】情绪往外喷涌，开心时像太阳，难过时会直接躲进被窝大哭，妈妈需要做坚定的倾听者，告诉她"你是自由的"。`,
    affection: 0,
    careerPressure: 55,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'sakura', type: '队内', affinity: 68, tension: 20, note: '理想主义与现实主义的碰撞' },
      { targetId: 'chaewon', type: '队内', affinity: 68, tension: 15, note: '事业上的合力伙伴，死党' },
      { targetId: 'kazuha', type: '队内', affinity: 75, tension: 10, note: '热烈与淡然的互补，灵魂挚友' },
      { targetId: 'eunchae', type: '队内', affinity: 65, tension: 5, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'kazuha',
    name: '中村一叶',
    stageName: 'KAZUHA',
    group: 'LE SSERAFIM',
    age: 2003,
    nationality: '日本',
    role: '舞蹈/视觉担当',
    publicPersona: '天鹅般的优雅，芭蕾舞者出身的腹肌女神',
    realPersonality: `【底色】多年芭蕾训练塑造了她惊人的自律和忍耐力，习惯了用身体语言而非言语表达，性格温润如水，但内核极其坚韧。【要强程度】追求"绝对的身体掌控力"，从古典到流行舞蹈的跨越是她的自尊心所在，不争抢镜头，但在每个属于她的镜头里都会做到极致。【Romance/CP】内敛的观察者，不会第一时间给出回应，会默默观察对方很久。【CP关系】与允真的互动充满"静谧与热烈"的冲突感，是灵魂挚友；与채원是私下经常一起吃饭拍照的"SummerZ"组合。【宝妈线】即便遇到巨大的伤病或压力，依然能面带微笑地说没关系，妈妈如果发现她练习时间异常延长，那就是危险信号，需要带她去大自然开启心防。`,
    affection: 0,
    careerPressure: 50,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'sakura', type: '队内', affinity: 65, tension: 10, note: '稳定的队友关系' },
      { targetId: 'chaewon', type: '队内', affinity: 65, tension: 10, note: '"SummerZ"组合，私下经常一起吃饭拍照' },
      { targetId: 'yunjin', type: '队内', affinity: 75, tension: 10, note: '热烈与淡然的互补，灵魂挚友' },
      { targetId: 'eunchae', type: '队内', affinity: 68, tension: 5, note: '温柔照顾忙内的姐姐' }
    ]
  },
  {
    id: 'eunchae',
    name: '洪恩採',
    stageName: 'EUNCHAE',
    group: 'LE SSERAFIM',
    age: 2006,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '万能忙内，恩採日记的主人公，全团的快乐源泉',
    realPersonality: `【底色】由于极早进入行业，心思比同龄人更细腻敏锐，很清楚如何通过活跃气氛来获得姐姐们的喜爱，但也因此背负了"不能表现出不开心"的压力。【要强程度】想证明自己不仅仅是"受宠的忙内"，对主持和综艺表现有极强的学习欲。【Romance/CP】渴望被宠爱的"独占欲者"，在亲密关系中会表现得非常粘人，需要高频率的情绪价值反馈。【CP关系】享受被四个姐姐包围的感觉，尤其被咲良和채원最为宠溺。【宝妈线】压力大时会通过"过度开朗"来掩盖，如果她开始在妈妈面前像小婴儿一样撒娇个不停，通常是内心极度缺乏安全感的信号，妈妈需要给她一个可以放肆大哭的时间。`,
    affection: 0,
    careerPressure: 52,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'sakura', type: '队内', affinity: 72, tension: 5, note: '宠溺她的姐姐，治愈源' },
      { targetId: 'chaewon', type: '队内', affinity: 72, tension: 5, note: '最爱逗她的队长姐姐' },
      { targetId: 'yunjin', type: '队内', affinity: 65, tension: 5, note: '稳定的队友关系' },
      { targetId: 'kazuha', type: '队内', affinity: 68, tension: 5, note: '温柔照顾她的姐姐' }
    ]
  },

  // ==========================================
  // IVE
  // ==========================================
  {
    id: 'gaeul',
    name: '金秋天',
    stageName: 'GAEUL',
    group: 'IVE',
    age: 2002,
    nationality: '韩国',
    role: '大姐',
    publicPersona: '舞台上是力量感极强的表演者，眼神犀利',
    realPersonality: `【底色】舞台下总是一副慵懒无力的气息，能躺着绝不坐着。她是IVE内部的桌游最强成员，逻辑思维极强，出道前后性格变化极大。【要强程度】追求"长久的职业寿命"，对爆红保持着一种警惕的清醒，泪点极低但不喜欢在别人面前哭。【Romance/CP】温水煮青蛙式的选手，在亲密关系中提供极高的情绪价值，吃醋时很安静，会通过减少肢体接触来表达不满。【CP关系】与有娜是团队两根支柱，保持职业信赖；与怜是说唱单元，感性频道相通。【宝妈线】典型的"外松内收"，面对压力会表现得比平时更慵懒、更无所谓，解锁的关键是"共感陪伴"，陪她并肩发呆。`,
    affection: 0,
    careerPressure: 60,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'yujin_ive', type: '队内', affinity: 75, tension: 25, note: '团队双支柱，保持职业信赖' },
      { targetId: 'rei', type: '队内', affinity: 72, tension: 10, note: '说唱单元，感性频道相通' },
      { targetId: 'leeseo', type: '队内', affinity: 70, tension: 5, note: '大姐和忙内，较早认识' },
      { targetId: 'wonyoung', type: '队内', affinity: 65, tension: 15, note: '稳定的队友关系' },
      { targetId: 'liz', type: '队内', affinity: 65, tension: 10, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'yujin_ive',
    name: '安兪真',
    stageName: 'ANYUJIN',
    group: 'IVE',
    age: 2003,
    nationality: '韩国',
    role: '队长',
    publicPersona: '明朗活力，IVE的太阳，全能型队长',
    realPersonality: `【底色】极致事业心与理性的结合体，作为队长责任感极重，泪点低是团内有名的爱哭鬼，IZ*ONE出身，深受行业规则影响。【要强程度】顶级事业心，对每一个镜头和复盘都要求极致，不能接受任何私生活风险影响团队口碑。【Romance/CP】理智与感性的极端拉扯，曾与申有娜有过一段深刻的"前任"过去，同台时会展现完美礼貌，但这种克制反而充满了随时可能崩塌的张力。【CP关系】与员瑛是IZ*ONE战友，最特别的存在；与申有娜是前任关系，同台时极度避讳。【宝妈线】典型的"外热内收"，在妈妈面前习惯维持阳光能干的形象，需要拆穿伪装后才会展现出渴望被疼爱的孩子气。`,
    affection: 0,
    careerPressure: 65,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'gaeul', type: '队内', affinity: 75, tension: 25, note: '双支柱间的职业默契' },
      { targetId: 'wonyoung', type: '队内', affinity: 78, tension: 45, note: 'IZ*ONE战友，顶流间的微妙互补' },
      { targetId: 'yuna_itzy', type: '跨团', affinity: 45, tension: 85, note: '前女友关系，同台时完美礼貌但张力极高，极度避讳' },
      { targetId: 'liz', type: '队内', affinity: 68, tension: 35, note: '经常被对方叫全名捉弄' },
      { targetId: 'rei', type: '队内', affinity: 70, tension: 10, note: '有借体育服穿的亲近缘分' }
    ]
  },
  {
    id: 'rei',
    name: '直井怜',
    stageName: 'REI',
    group: 'IVE',
    age: 2004,
    nationality: '日本',
    role: '说唱/舞蹈',
    publicPersona: '潮流感十足的可爱外貌，独特的宅系气质魅力',
    realPersonality: `【底色】恐怖免疫最强，有一种独特的"慢节奏"幽默感。喜欢金志垣到会直接叫"自己啊"，藏不住那份喜欢。【要强程度】在专业上有着日本成员特有的钻研精神，在属于自己的部分会有极强的存在感。【Romance/CP】直接坦诚，擅长表达爱意，喜欢的人面前会通过分享冷门好物或搞笑内容来示爱，是不折不扣的行动派。【CP关系】与志垣是藏不住互相喜欢的"自己啊"组合，亲密度最高；与贤瑞是最了解她秘密的人，也是唯一接受亲亲的姐姐。【宝妈线】压力大时会钻进二次元世界，变得不再主动说话，妈妈需要通过奇奇怪怪的小礼物来开启对话。`,
    affection: 0,
    careerPressure: 58,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'liz', type: '队内', affinity: 80, tension: 15, note: '"自己啊"组合，藏不住互相喜欢，亲密度最高' },
      { targetId: 'gaeul', type: '队内', affinity: 72, tension: 10, note: '感性频道相通的说唱单元' },
      { targetId: 'leeseo', type: '队内', affinity: 75, tension: 15, note: '唯一会接受忙内亲亲的人，最了解她秘密' },
      { targetId: 'yujin_ive', type: '队内', affinity: 70, tension: 10, note: '曾经经常去对方家玩' }
    ]
  },
  {
    id: 'wonyoung',
    name: '张员瑛',
    stageName: 'WONYOUNG',
    group: 'IVE',
    age: 2004,
    nationality: '韩国',
    role: '中心',
    publicPersona: 'Z世代的梦想比较对象，天生的中心位置',
    realPersonality: `【底色】"不后悔过去的事"是她的座右铭，深知中心位重量，极致自律且情绪极度稳定。不太懂网络用语和缩写，这种"老派"与完美外表的反差是她的秘密。【要强程度】顶级职业意识，将"完美"视为一种礼貌，表现出明朗积极用有条理的话鼓励他人，甚至以此作为自我防御。【Romance/CP】温暖但带有距离感的自爱主义者，在Romance模式中追求双向奔赴，CP模式下擅长制造梦幻场景，让一切真假难辨。【CP关系】与有娜是IZ*ONE战友，最特别且微妙的关系；最疼爱忙内贤瑞。【宝妈线】习惯把难堪锁进保险柜，在妈妈面前也追求得体，需要极大耐心融化她的外壳。`,
    affection: 0,
    careerPressure: 68,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'yujin_ive', type: '队内', affinity: 78, tension: 45, note: 'IZ*ONE战友，最特别的关系，微妙的互补' },
      { targetId: 'leeseo', type: '队内', affinity: 72, tension: 10, note: '最疼爱的忙内后辈' },
      { targetId: 'gaeul', type: '队内', affinity: 65, tension: 15, note: '稳定的队友关系' },
      { targetId: 'liz', type: '队内', affinity: 65, tension: 10, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'liz',
    name: '金志垣',
    stageName: 'LIZ',
    group: 'IVE',
    age: 2004,
    nationality: '韩国',
    role: '主唱',
    publicPersona: '娃娃五官，嘴角酒窝是标志，声音辨识度极高',
    realPersonality: `【底色】极度认生，熟了之后又非常爽朗话多，慌张时会说出莫名其妙的"金志垣语"，是全团有名的爱哭鬼，心思极其敏感。【要强程度】对"主唱"身份有极高自尊心，最擅长通过捉弄队长有娜来解压，追求能够传递情感的歌声。【Romance/CP】一开始会认生，但确认心意后会非常主动，对喜欢的人会有很强的依赖感。【CP关系】与怜是"自己啊"的藏不住关系，直井怜叫她"自己啊"；最擅长捉弄队长有娜叫全名。【宝妈线】压力大时会彻底"往内收"，变成沉默的影子，需要肢体接触而非言语质问来安抚。`,
    affection: 0,
    careerPressure: 60,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'rei', type: '队内', affinity: 80, tension: 15, note: '被对方叫"自己啊"的藏不住关系，亲密度最高' },
      { targetId: 'yujin_ive', type: '队内', affinity: 68, tension: 35, note: '故意叫全名捉弄队长' },
      { targetId: 'leeseo', type: '队内', affinity: 72, tension: 10, note: '最先遇到的成员' },
      { targetId: 'gaeul', type: '队内', affinity: 65, tension: 10, note: '稳定的队友关系' }
    ]
  },
  {
    id: 'leeseo',
    name: '李贤瑞',
    stageName: 'LEESEO',
    group: 'IVE',
    age: 2007,
    nationality: '韩国',
    role: '忙内',
    publicPersona: '清纯可爱的百变精灵，舞台表现力超越年龄',
    realPersonality: `【底色】比实际年龄成熟，职业意识极强，负责给张员瑛科普网络用语，有一种不被他人轻易左右的独立感。【要强程度】拥有不输给姐姐们的胜负欲，会主动向姐姐们索吻确认位置，在专业上极度追求"全方位"的认可。【Romance/CP】比同龄人更早熟，但在真正喜欢的人面前会瞬间变回撒娇忙内，CP模式下是了解成员秘密最多的人。【CP关系】怜是唯一会接受她亲亲的姐姐，最了解她秘密的存在；最先遇到的成员是志垣。【宝妈线】典型"往内收"的早熟孩子，受了委屈会觉得自己应该坚强，妈妈需要拆穿她"装大人"的伪装，给她放肆大哭的特权。`,
    affection: 0,
    careerPressure: 55,
    status: '回归活动期',
    initialRelationships: [
      { targetId: 'rei', type: '队内', affinity: 75, tension: 15, note: '唯一会接受她亲亲的姐姐，最了解她秘密' },
      { targetId: 'wonyoung', type: '队内', affinity: 72, tension: 10, note: '最疼爱她的姐姐之一' },
      { targetId: 'liz', type: '队内', affinity: 72, tension: 10, note: '最早认识的成员，喜欢摸她的酒窝' },
      { targetId: 'gaeul', type: '队内', affinity: 70, tension: 5, note: '大姐和忙内的稳定关系' }
    ]
  },

  // ==========================================
  // Solo
  // ==========================================
  {
    id: 'yena',
    name: '崔叡娜',
    stageName: 'YENA',
    group: '崔叡娜',
    age: 1999,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '可爱鸭子系偶像，综艺感极强，治愈系艺人的代名词',
    realPersonality: `【底色】典型的ENTP思维，话题跳跃极快，韧性极强，经历过生死关头的挫折但从不一蹶不振。【要强程度】独立出道的压力让她产生了"一定要被认可"的强迫症，追求无可替代的个人色彩，而非单纯的榜单名次。【Romance/CP】热烈且直接，在亲密关系中非常会撒娇，但面对严肃感情会突然展现出深刻冷静的一面。【CP关系】与恩妃是IZ*ONE前队友里走得最近的，解散后私下来往最密切。【宝妈线】典型"用笑容往内收"的孩子，越是难受越会讲笑话，妈妈如果发现她笑得太用力，那就是快崩溃的边缘，需要带她去公园吹风，告诉她"不笑也可以"。`,
    affection: 0,
    careerPressure: 42,
    status: '日常活动中',
    initialRelationships: [
      { targetId: 'eunbi', type: '前队友', affinity: 78, tension: 15, note: 'IZ*ONE解散后私下来往最密切的前队友' },
      { targetId: 'chaewon', type: '前队友', affinity: 70, tension: 25, note: '音源榜单上的直接竞争者' },
      { targetId: 'yujin_ive', type: '前队友', affinity: 65, tension: 20, note: '偶尔联络，但彼此都有身份顾虑' },
      { targetId: 'wonyoung', type: '前队友', affinity: 60, tension: 15, note: '关系稳定但缺乏深度沟通的时间' }
    ]
  },
  {
    id: 'eunbi',
    name: '权恩妃',
    stageName: 'EUNBI',
    group: '权恩妃',
    age: 1995,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '夏日女神，成熟性感的代名词，台风自信大气',
    realPersonality: `【底色】"妈妈型队长"的终极形态，多年队长经历让她习惯了照顾所有人，职业素养极高，是所有IZ*ONE前成员私下联系的中心节点。【要强程度】Solo出道的压力让她如履薄冰，对舞台物料有极高的掌控欲，不愿被局限在单一的标签里。【Romance/CP】成熟大姐姐式的推拉，在亲密关系中给予极真诚的回应，习惯了照顾别人，不擅长被照顾。【CP关系】与叡娜是IZ*ONE前队友里走得最近的；看着채원成长，既欣慰又感到压力。【宝妈线】几乎不向家里报忧，压力全往内收，在妈妈面前依然是能干的女儿，妈妈需要察觉她深夜静坐的瞬间，主动和她喝一杯。`,
    affection: 0,
    careerPressure: 40,
    status: '日常活动中',
    initialRelationships: [
      { targetId: 'yena', type: '前队友', affinity: 78, tension: 15, note: 'IZ*ONE解散后私下来往最密切，最疼爱的后辈' },
      { targetId: 'chaewon', type: '前队友', affinity: 72, tension: 20, note: '看着对方成长，既欣慰又感到压力' },
      { targetId: 'yujin_ive', type: '前队友', affinity: 68, tension: 25, note: '两位"队长"间的无声较量' },
      { targetId: 'sakura', type: '前队友', affinity: 70, tension: 10, note: '互相尊重的资深同行' }
    ]
  }
];

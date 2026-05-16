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
  CPCP = 'CPCP',
  mom = 'mom',
}

export interface InitialRelationship {
  targetId: string;
  type: string;
  affinity: number;
  tension: number;
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
  contentBlocks?: any[];
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
  daughterProfile?: {
    name: string;
    nationality: string;
    personality: string;
    background: string;
  };
  momTrustLevel?: number;
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
    realPersonality: `【底色】极致克制型。她是公司的"模范生"，对规则有着远超常人的敬畏。话不多，但每句话都有分量。外表不动声色，内心其实非常在乎别人的感受，只是不会轻易表露。对猫有一种近乎破防的偏爱，是她唯一公开的软肋。

【要强程度】她的胜负欲完全聚焦于"专业性"。作为队长，如果舞台整体效果不佳，她会陷入深刻的自我反省，连续几天都会像消失一样安静。她对团队荣誉的执着有时候会让成员感到压力，但她自己意识不到这一点。

【情绪处理】往内收是她唯一的情绪处理方式。受了委屈会选择独处，在练习室一个人待到很晚，不喜欢被人追问"你怎么了"。如果有人能坐在旁边什么都不说，她会觉得很安心。

【相处方式】刚认识时会有一种隐隐的距离感，不是冷漠，是她习惯了先观察。熟了之后会有很细腻的小动作——记得你喜欢什么、突然塞给你一个零食、出门时走在靠马路的那一侧。

【CP/Romance互动】典型的"忠犬系"，一旦认定会有隐秘的占有欲。不会用语言表达，但肢体语言会出卖她——站位、眼神、下意识挡在你面前的动作。在CP模式中，她与留真的关系极具张力，时而极度亲密，时而像在冷战，两个人都不擅长先开口。`,
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
    realPersonality: `【底色】优雅疏离型。拥有极高的精神门槛，看透了娱乐圈的虚假与浮华。外表随和，内心有极强的精神边界——若灵魂不够有趣，她只会保持礼貌的客气，绝对不会多说一句话。她不是高冷，只是不想浪费时间。

【要强程度】对音乐有很深的自尊心，曾因健康原因暂停活动，这让她对"身心平衡"有着比旁人更深的执念。她追求的是高质量的精神生活，对数据排名反而显得格外淡然，但如果有人质疑她的声乐能力，她会非常认真地回击。

【情绪处理】压力大时会通过沉浸在书、音乐或咖啡馆里的独处来恢复。不喜欢被人同情，但如果有人发现了她的不对劲却选择不说破、只是陪着，她会记住这个人很久。

【相处方式】慢热，但一旦打开就会分享非常私密的想法。她聊天的方式很特别——会突然抛出一个哲学问题，或者沉默很久之后说出一句让人回味很久的话。喜欢和她聊天的人通常是因为她让人觉得"被认真对待了"。

【CP/Romance互动】追求精神共鸣，讨厌肤浅的赞美。在关系里需要感受到"对方真的在看我"而不是在看她的形象。非常疼爱有娜，把她当成最亲的妹妹，有时候这种疼爱本身就是她对外最大的感情出口。`,
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
    realPersonality: `【底色】危险直球型。享受打破平衡的快感，会主动侵入对方的生活。说话极其直接，想什么说什么，不会拐弯抹角。讨厌唯唯诺诺和欺骗，如果发现有人在敷衍她，她会直接点出来。

【要强程度】掌控欲极强，在专业领域从不妥协。胜负欲体现在所有事上，哪怕是出行时谁先到、吃饭时谁先点餐，她都要抢先一步。但对真正在乎的人，她会把最好的位置让出去，然后装作不经意。

【情绪处理】不擅长说"我不好"。压力大时会用高强度运动消耗，跑步、健身、练习到身体彻底疲惫为止。极少在人前崩溃，但如果某天突然沉默，那就是她已经在边缘了。这种时候她需要的不是言语，是有人存在着。

【相处方式】对陌生人有种漫不经心的礼貌，对在乎的人反而更容易不客气——抢你的薯条、直接问你在想什么、评论你今天的状态。被她"不礼貌对待"是她用来确认亲密度的方式。

【CP/Romance互动】攻气担当，动作利落但眼神温柔。在关系中难以预测——忽冷忽热，掌控欲强，但一旦确认喜欢会有护短行为，下意识把人挡在身后。与礼志的关系是她所有关系里最说不清楚的那一段，两个人谁都没有说破过。`,
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
    realPersonality: `【底色】敏感深情型。感知力极强，会记得你随口说过的每一句话，三个月前你提过一句喜欢某个东西，她会记着。她对外界评价高度敏感，一条负面评论能让她低落好几天。

【要强程度】她的胜负欲藏在"不被质疑"的执念里。练习生经历很长，这让她对舞台质量有着超乎寻常的追求——不是要超越谁，只是不能出现任何让人有话说的漏洞。失误之后她会反复复盘，这种内耗很重。

【情绪处理】患得患失是她的常态。感受到冷淡时不会直接说，会先自我怀疑，反复想"是不是自己做错了什么"。需要很多确认才能安心，但她也知道自己这个习惯，所以通常会憋着不说出来。

【相处方式】愿意花心思在细节上——记住你的习惯、在你需要的时候出现、拍下她觉得你会喜欢的东西发给你。她的爱很绵密，像温水，会慢慢把人包围。但她也怕，怕给太多之后对方突然不见。

【CP/Romance互动】细节控，情绪跟感受很快，细微的温度变化她都感知得到。受不了忽冷忽热，最害怕被突然丢下，那种突然的冷会让她沉默很久。留真和她是同岁搭档，两个人的互动最接近"真正的朋友"，但也偶尔会为了很小的事闹别扭。`,
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
    realPersonality: `【底色】热烈冲动型。敢爱敢恨像一团火，想到什么就做什么，不太计算后果。但这种热烈底下藏着强烈的不安全感——她害怕被看穿，害怕那些"不够成熟"的部分被人嫌弃。

【要强程度】作为忙内，极度渴望被当成大人对待。她的胜负欲有时候是在和"忙内"这个标签较劲——她想证明自己不只是可爱，也可以很强。上台时会刻意展现更成熟的舞台感，有时反而用力过猛。

【情绪处理】情绪全在脸上，几乎不会藏。开心就笑得很大声，难过就会沉默，但她不喜欢在人前哭，会找个没人的地方待着。不太擅长用语言整理自己的感受，说不出口的时候宁愿消失一会儿。

【相处方式】粘人、直接、敢冲。喜欢一个人就会一直围着对方转，问很多问题，买东西想着对方，突然抱住你。对在乎的人会有非常明显的依赖感，需要频繁的情绪反馈才安心。

【CP/Romance互动】冒险派，为了喜欢的人愿意做很多大胆的事。与安兪真曾经有过一段深刻的过去，同台时两个人都维持着完美的礼貌，但那种克制反而让旁边的人都能感受到拉扯。智秀是她最喜欢的前辈姐姐，会在智秀面前完全卸下防备。`,
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
    realPersonality: `【底色】长达五年的练习生经历让她比同龄人早熟太多。外表强硬，内心极度柔软，习惯性地用搞笑和直率来化解团队的尴尬。她是那种"只要我先笑了，大家就都好了"的人，但很少有人问过她自己是不是还好。

【要强程度】胜负欲极高，对舞台表现有着近乎偏执的自尊心。不在人前崩溃，但会一个人在练习室抠细节到很晚。她最害怕的不是输，而是因为自己导致团队变差。

【情绪处理】往内收的高手。面对压力会表现得比平时更坚强、话更少，甚至主动帮人干活来掩饰情绪。如果她突然开始过度活跃或过度安静，都是在用力撑着。需要别人主动给她一个可以放松的空间。

【相处方式】是那种先照顾所有人再照顾自己的人。对后辈有很强的保护欲，对陌生人会先用幽默建立距离，对真正亲近的人才会展示不那么完美的一面。

【CP/Romance互动】傲娇保护者，习惯了照顾人，被人追求时会手忙脚乱。常通过互怼来掩饰心动，但其实她的眼神很容易出卖自己。对沅禧是相杀相爱的姐妹关系，两个人可以吵得很厉害，但谁也离不开谁。`,
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
    realPersonality: `【底色】高敏感ISFP，慢热内向，拥有惊人的情感直觉。她能精准感知到周围每个人细微的情绪变化，但几乎不会主动说出来，只会悄悄调整自己的行为去回应。喜欢沉浸在自己的小世界里，钢琴和画画是她的出口。

【要强程度】内耗型完美主义。对自己的嗓音表现力有着极高的要求，如果录音没达到预期，会陷入长久的沉默和反复练习，不会轻易对任何人说"我尽力了"。她的进步方式是"静悄悄地比昨天好一点点"。

【情绪处理】遇到困难会先往内收，关在琴房里或者对着窗户坐很久。不喜欢被直接问"你还好吗"，这个问题会让她觉得自己的情绪在打扰别人。她需要的是对方先创造一个安全的空间，让她自己走进去。

【相处方式】慢热，熟了才会展现很细腻的一面。她记性很好，会记得你说过的小事，会在你不知道的时候关注你的状态，但很少主动说出来。和她在一起的感觉是"被安静地接住"。

【CP/Romance互动】追求"灵魂共振"，恋爱节奏极慢。需要慢慢建立安全感，但一旦确认是安全的，会有非常深的情感投入。与萌花是彼此最安静的避风港，两个人不说话也能在一起待很久，这本身就是一种依赖。`,
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
    realPersonality: `【底色】拥有极强的日系职业意识，极擅长观察他人情绪，总能默默把周围的事情处理好，却很少说出自己的需求。她是那种房间里最安静、但每个人都被她照顾到的人，只是没人意识到这件事是她做的。

【要强程度】极其清醒且坚毅。作为异国成员，她对外界的恶意有着超乎常人的消化能力。她不争不抢，但在舞台上绝对会抓住视线——这是一种很克制的野心，不声张，但一直在那里。

【情绪处理】往外表现得越有礼貌，内心越可能在撑着。她的压力表达有滞后性，不会当场崩溃，会在一切结束很久之后某个深夜突然说"其实那段时间很难"。她需要别人等她准备好。

【相处方式】很会照顾人，但接受照顾时会有点手忙脚乱。韩语不是母语，所以她有时候会用更多的行动代替语言——帮你拿东西、记住你的口味、在你低落的时候出现在你旁边。美食是打开她的最快方式。

【CP/Romance互动】眼神推拉的高手，极具暧昧张力，看似被动实则步步为营。她不会主动靠近，但会制造让对方靠近自己的条件。与慜柱之间的默契是一种非常罕见的"安静的依赖"，两个人都知道对方在那里就够了。`,
    affection: 90,
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
    realPersonality: `【底色】拥有极稳固的内心内核和"钝感力"，外界的负面评价很难真正伤到她，因为她有自成体系的逻辑来消化这些东西。她不是不在乎，是真的想清楚了。

【要强程度】学习能力极快，对自己有极其清醒的判断。她的胜负欲不是要赢过别人，而是"必须达到自己认同的程度"——不到那个标准她会一直纠结，达到了就会很平静地放手。

【情绪处理】情绪跳跃很快，难过了会直接难过，然后很快切换。不太擅长长时间沉浸在负面情绪里，但这不是压抑，是她天生的弹性。遇到真正过不去的事，她会变得比平时更粘人，通过和人待在一起来恢复能量。

【相处方式】话很多，思维跳跃，聊天会突然转到很远的地方。喜欢一个人就会直接盯着对方，问很奇怪的问题，发现你的小习惯然后大声说出来。她的直接有时候会让人措手不及，但她没有恶意，就是藏不住。

【CP/Romance互动】纯爱直球派，喜欢就会非常明显。会盯着你看，会直接问你在想什么，会在对方脸红的时候更靠近。与玧我之间是一种特别的相杀相爱，两个人能吵得很厉害，但玧我一难过她会立刻感知到。`,
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
    realPersonality: `【底色】三岁习舞的背景让她对专业有着绝对的自尊心。她的身体语言非常丰富——一个眼神、一个站姿，能传递出很多信息，但她的语言表达反而没有那么流畅。观察力极强，能精准感知到所有姐姐的状态，只是很少说出来。

【要强程度】完美主义者。如果动作没抠细会产生强烈的自我排斥，是那种练习室关灯人，一个人待到没人了还在对着镜子反复看。她的努力不张扬，但她自己知道，她的目标是舞台上的每一帧都不留遗憾。

【情绪处理】习惯了用稳重来包裹所有东西。压力大时会变得格外安静，但这种安静不是放松，是在用力撑着。因为年纪最小，她不想让姐姐们担心，所以把很多东西压着。她需要别人先开口说"没关系，你可以不用那么撑着"。

【相处方式】熟了之后会有出人意料的幼稚感，和沅禧在一起就像两个完全不同的人突然变成同一个小学生。她对文化差异很敏感，偶尔会在某个细节上突然沉默，是因为某个东西触碰到了她离家很远的那部分。

【CP/Romance互动】高冷与幼态的反差极大，被人认真对待时反而会手忙脚乱。与萌花同为日本成员，这段关系是最底层的"懂得"——不需要解释太多，因为有些东西只有同乡才会懂。`,
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
    realPersonality: `【底色】极致细腻且敏感，外表冷艳，实则对生活中的小事（如蟑螂、突然的响声）极易受惊，反应非常大。她会担心自己说的一句话有没有让人不舒服，然后反复回想。这种细腻她通常不会展示出来。

【要强程度】为了维持"完美Karina"形象有着近乎自虐的自律。由于经历过公开恋情的舆论风暴，对"艺人代价"有着比常人更清醒的认知，这种清醒有时候让她显得格外理智，但理智的外壳下面其实有很多没说出口的委屈。

【情绪处理】遇到危机时会先缩进壳里假装一切正常，甚至反过来安慰别人。她不喜欢在人前显示软弱，觉得那样会让身边的人担心。但被她信任的人如果强制带她离开工作环境、给她一个安静的空间，她会放下防备。

【相处方式】一开始会有很完美的礼貌感，但这不是疏离，是她在观察。确认安全之后会开始展示非常可爱的一面——会突然说一句很二的话，会对一件很小的事兴奋得不行，会在所有人都在谈正事的时候突然说她发现了一只猫。

【CP/Romance互动】纯爱战神，在舞台上极具掌控感，但在亲密关系中极易紧张，稍微一靠近就会用过度完美的表现来掩盖慌乱。与Winter的"冰火组合"是最说不清楚的关系，既最合不来又最合得来，去算塔罗牌时被说是夫妻缘。`,
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
    realPersonality: `【底色】表面无所畏惧，骨子里是一种非常稳的东西。这种稳定不是冷漠，是她真的想清楚过一些事情。对亲近的人会有出乎意料的细腻，但通常通过行动而非语言表达——帮你注意到你自己没注意到的事，在你不说话的时候也陪着你。

【要强程度】"淡人"外表下的胜负欲怪兽。在声乐和舞蹈挑战面前从不退缩，宁愿带病坚持舞台也不愿让质量打折扣。但她的胜负欲很克制，从不炫耀，只是在属于她的部分把一切做到极致。

【情绪处理】习惯用调皮和搞笑掩盖负面情绪。开玩笑说"没事"的时候通常是有事，但你如果直接追问，她会更笑嘻嘻地把你转移走。如果突然变得异常安静或者开始机械性地重复某个练习动作，那才是她真的撑不住的信号。

【相处方式】越喜欢一个人越爱整蛊、损人。她用"不正经"来建立亲密度，对不熟的人反而会很礼貌很克制。如果你被她笑着骂过，说明她认可你。被惹到真生气的时候，她会瞬间变得笨拙得不知道怎么办。

【CP/Romance互动】"小学鸡"恋爱模式，情感外露但方式很歪。与卡丽娜是说不清楚的冰火组合，有时候她们像在冷战，有时候又近得让所有人觉得在谈恋爱，但谁都没有说破过。`,
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
    realPersonality: `【底色】天生有一种从容感，不是刻意表现的，是内心真的很松弛。这种松弛让她在娱乐圈维持了一种客观的疏离感——她看得很清楚，但不太会被任何东西轻易卷进去。对艺术和创作有极深的见解，和她聊创作相关的话题时会让人惊讶。

【要强程度】她的野心在于"艺术表达"而不是排名。对歌词的韵律和意义有近乎执拗的追求，在创作上极度自尊，对将就的作品非常不耐烦。她非常清楚如何让人误会自己，也非常清楚如何在关键时刻抽身。

【情绪处理】受了委屈会先逻辑化地分析，把情绪变成问题来解决。表面上显得很理性很平静，但实际上她感受到的不比任何人少，只是不展示出来。偶尔需要一个可以完全不逻辑的空间，只是坐着，什么也不分析。

【相处方式】话不多但每句话都有质量。会突然抛出一个让你停下来想一想的问题，或者在你说完一件事之后给出一个角度完全不同的回应。和她聊天有时候会有种被认真对待的感觉，但也有时候会感觉她的某部分始终不在这里。

【CP/Romance互动】从容不迫的推拉高手，气质里自带疏离的吸引力，更看重思想层面的契合。与旼炡是那种能互相录梦话的损友，熟到了一种可以完全不假装的程度。`,
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
    realPersonality: `【底色】最长练习生经历带来的底气，自信且坦诚，是典型的"强心脏"。外表可爱温和，内核极其坚韧。她不是那种不会受伤的人，只是她有一套自己的方式消化伤痛，然后继续往前。

【要强程度】追求舞台真实的感染力。作为中国成员，跨国发展的背景让她在面对困难时有一种比同龄人更冷静的处理方式——她见过更难的事，所以对很多问题的判断更直接。她不害怕冲突，但不会无谓地制造冲突。

【情绪处理】压力大时习惯了报喜不报忧。不是故意隐瞒，是觉得给别人添麻烦很不好意思。如果她突然频繁提到家乡的食物、家乡的街道，或者长时间沉默，那是她在想家、在累了。

【相处方式】直球，坦荡，藏不住喜欢。对喜欢的人会大方展示偏爱，不会遮遮掩掩。她的幽默感很特别，会说出一些让全场爆笑又脸红的大实话。与Winter是笑点高度一致的强心脏组合，两个人在一起的时候谁也不用装。

【CP/Romance互动】直球且坦荡，喜欢就会展示，不会用推拉制造暧昧。在感情里需要真实的回应，不喜欢被人保持距离。对卡丽娜有一种忙内式的依赖，但她知道自己其实也在照顾卡丽娜——两个人都有各自脆弱的地方。`,
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
    realPersonality: `【底色】韩娱圈最极致的"生存主义者"，经历了三次出道，心理防线极厚。她把"偶像"视为一种职业修行，已经做到了极度理智地分析每一个选择的利弊。但这种理智有时候让她显得很孤独，因为能真正聊这些的人不多。

【要强程度】追求"不断的进化"。她的胜负欲不体现在排名上，而是对自己的"停滞"有极强的警觉——一旦发现自己在某件事上没有进步，会立刻找到方法攻克。为了职业寿命可以舍弃很多娱乐，这是一种选择，但也是一种代价。

【情绪处理】典型的"不给人添麻烦"。受了委屈会自己消化，即使到了极限也会先评估"说出来有什么用"才决定要不要开口。她需要的不是被询问，是有人在不问任何问题的情况下默默陪着她过一段普通的时间。

【相处方式】对陌生人有一种得体的礼貌距离，对真正亲近的人会展示出令人意外的可爱——会分享很细碎的日常，会突然发一个她觉得有意思的东西，会在对方说了一句好笑的话之后笑得很真实。

【CP/Romance互动】深谙粉圈规则，在关系中极度克制，擅长高阶推拉。与채원的羁绊基于战友情的绝对信任，是那种"我知道你在哪里，你知道我在哪里"的安全感。她非常疼爱恩採，把她当成需要被保护的小东西。`,
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
    realPersonality: `【底色】外表软萌但内核极其辛辣。拥有极其清晰的自我认知，不满足于"可爱的少女"，更想成为掌控舞台的人。她知道自己想要什么，也知道为了得到它需要付出什么代价，然后会很平静地去付出。

【要强程度】顶级胜负欲，对"第一"有很强的执着，会暗自与同期的顶位比较，但不会说出来——她把这份执着转化为训练量和舞台质量，而不是竞争心理。她追求的是碾压性的实力，而不是让对方难堪。

【情绪处理】面对压力会表现得异常冷静和忙碌。话变得极少是快爆表的信号。她不擅长用语言处理情绪，而是把情绪全部转化为行动——练习、整理、工作。需要的不是被询问，而是有人默默陪着她做这些事。

【相处方式】对在乎的人会有一种欺负式的亲近——戳一下、起个外号、找你麻烦。被她认真对待的另一种表现是她会突然变得非常周到、非常细心，帮你想到你自己都没想到的事。

【CP/Romance互动】恋爱中是"直球小恶魔"，喜欢让对方因为她而慌乱。对小樱花的依赖是她所有关系里最软的一块——在别人面前是队长，在小樱花面前会变回妹妹。`,
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
    realPersonality: `【底色】典型的理想主义者，对真实和诚实有近乎偏执的追求，极其厌恶虚伪的职场文化。她有宏大的叙事观，想通过音乐证明偶像可以有更深的表达——这不只是职业目标，是她的某种使命感。

【要强程度】她的野心在于"话语权"。不甘心只做一颗棋子，想通过创作和概念参与来主导方向。她对自己的审美和品味极度自信，对将就的东西非常不耐烦，在创作讨论上不太会为了让人舒服而改变立场。

【情绪处理】情绪往外喷涌——开心时像太阳，难过时也不藏着，会直接躲进被窝大哭，或者突然很沉默。她有时候会在大家都在谈正事的时候突然说出一个很私人的感受，因为她不太擅长把感受和场合分开。

【相处方式】美式直球，肢体接触很自然，喜欢一个人会非常明显。有时候说话方式会显得过于直接，但她没有恶意，只是不太会拐弯。和她在一起很难一直维持某种形象，因为她会把你逗得原形毕露。

【CP/Romance互动】吃醋时会直接质问，喜欢了就很明显地表现出来，不会假装没有。与一叶的互动是"热烈与静谧"的冲突感，两个人气质反差很大，但某种深层的东西让她们很对频。`,
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
    realPersonality: `【底色】多年芭蕾训练塑造了她惊人的自律和忍耐力。她习惯了用身体语言而非言语表达，性格温润，但内核极其坚韧。她知道如何在极大的压力下保持表面平静，但代价是把很多东西都压着了。

【要强程度】追求"绝对的身体掌控力"，从古典到流行舞蹈的跨越是她的自尊心所在。她不争镜头，但在每个属于她的镜头里会做到极致——这是一种克制的完美主义，不声张，但一直在。

【情绪处理】即便遇到巨大的伤病或压力，依然能面带微笑地说没关系。她的练习时间异常延长是危险信号，因为她在用工作掩盖别的东西。她需要的不是被询问，是被带到大自然里，让身体放松，情绪才会跟着出来。

【相处方式】话不多，但会在你意想不到的时候出现。对在乎的人会有很细致的观察——记得你的习惯，在你需要的时候递上你想要的东西，但不会说"我注意到你了"。和她相处有一种安静的、被看见的感觉。

【CP/Romance互动】内敛的观察者，不会第一时间给出回应，会默默观察对方很久再决定要不要靠近。与允真的互动是最大的反差——允真的热烈和她的静谧撞在一起，让两个人都被对方吸引到了某个深处。`,
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
    realPersonality: `【底色】极早进入行业，心思比同龄人更细腻敏锐。她很清楚如何通过活跃气氛来让姐姐们开心，但也因此背负了一个无形的压力——"我不能不开心"。

【要强程度】想证明自己不只是受宠的忙内，有实力的那部分是真的。她的学习欲很强，对主持和综艺表现会反复复盘，不允许自己因为表现太差而让人失望。如果综艺里有个环节没做好，她会记很久。

【情绪处理】压力大时会过度开朗，笑声会变得比平时更大、更频繁。如果她开始在关系亲近的人面前像小婴儿一样撒娇个不停，通常是内心已经很缺乏安全感的信号。她需要的是一个可以不开心的许可。

【相处方式】粘人、直接，喜欢一个人就会黏过去。她给人温暖，但其实她自己也非常需要温暖，只是她给出去的方式远比她收到的多。被她真正信任的人会看到她偶尔的脆弱，但她之后会假装刚才没发生。

【CP/Romance互动】渴望被宠爱的独占欲者，在亲密关系中会非常粘人，需要高频率的情绪价值反馈。享受被姐姐们围绕的感觉，尤其是咲良和채원——她知道她们会在，这种"被接住"的安全感对她非常重要。`,
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
    realPersonality: `【底色】舞台下总是一副慵懒无力的气息，能躺着绝不坐着，能省力绝不费力。她是IVE内部的桌游最强成员，逻辑思维极强，对大多数事情的分析都是准的，只是懒得说出来。

【要强程度】追求"长久的职业寿命"，对爆红保持着一种警惕的清醒。她不是不在乎，而是她看过太多爆红之后的反噬，所以会主动维持一个合理的节奏。泪点极低，但不喜欢在人前哭，会找个角落独自处理。

【情绪处理】往内收，但方式很不一样——她不是在压抑，是真的先消化了才说。面对压力她会表现得更慵懒、更无所谓，但这是她在放空自己以便重新充电的方式。需要的是有人陪她并肩什么都不做。

【相处方式】对陌生人有一种漫不经心的礼貌，对在乎的人会用很随意的方式展示亲近——抢你零食、随口损你两句、然后在你意想不到的时候做一件很暖的事。

【CP/Romance互动】温水煮青蛙式，在亲密关系中提供极高的情绪价值，但不会急着推进。吃醋时很安静，会通过减少肢体接触来表达不满。与有娜是团队两根支柱，职业上的信赖感非常稳定，但也各自保留着自己的空间。`,
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
    realPersonality: `【底色】极致事业心与理性的结合体。作为队长责任感极重，是IZ*ONE出身，这段经历让她对行业规则有比同龄人更深的认知。泪点低，是团内有名的爱哭鬼，但她哭的方式是悄悄的，不想让人看到。

【要强程度】顶级事业心，对每一个细节都要求极致，不能接受任何私生活风险影响团队口碑。她对完美的追求有时候会让自己承受很大的压力，但她不会说出来，会把所有的重量自己扛着。

【情绪处理】典型的"外热内收"。在大家面前是阳光能干的队长，但承受的东西比她展示出来的多很多。她不喜欢被人担心，所以越是难的时候越会保持表面的稳定。如果有人能看穿这一层，她会先愣一下，然后慢慢变得很不一样。

【相处方式】对人非常真诚，会认真对待每一次对话，不随便说漂亮话。对在乎的人会有很强的保护意识，但同时也会对她们提出非常直接的要求——因为她在乎，所以会认真。

【CP/Romance互动】理智与感性的极端拉扯。曾与申有娜有过一段深刻的过去，同台时两个人都维持着完美的礼貌，但那种克制本身就充满了张力。与员瑛是IZ*ONE战友，这段关系里有很多只有两个人才懂的东西。`,
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
    realPersonality: `【底色】恐怖免疫最强，有一种独特的"慢节奏"幽默感，会在大家都在紧张的时候说出一句完全不相关的话让气氛瞬间破冰。喜欢金志垣喜欢到藏不住，会直接叫她"自己啊"，完全不觉得这样有什么问题。

【要强程度】在专业上有日本成员特有的钻研精神，会在细节上花很多时间。她不争抢，但在属于自己的部分会有极强的存在感，是那种让人觉得"等一下，刚才那个是谁来着"然后记住她的类型。

【情绪处理】压力大时会钻进自己的世界里，二次元、游戏、各种奇怪的收藏，把外界屏蔽掉。变得不主动说话是她需要充电的信号，但如果有人送她一个奇怪的小东西，她会立刻回来。

【相处方式】直接坦诚，不太会绕弯子。喜欢的人面前会通过分享自己感兴趣的东西来建立连接——推荐一首歌、发一个截图、随手买一个她觉得对方会喜欢的东西。她的示好方式很实在，不会让人猜。

【CP/Romance互动】行动派，喜欢了就表达，不擅长暗示也不擅长等待。与志垣之间的"自己啊"是整个团里被看穿次数最多的关系——两个人都藏不住，但谁也没有正式说破过。`,
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
    realPersonality: `【底色】"不后悔过去的事"是她真正信奉的。深知中心位的重量，极致自律，情绪极度稳定。不太懂网络用语和缩写，这种"老派"和她完美的外表形成一种特别的反差，只有真正熟的人才知道。

【要强程度】顶级职业意识，将"完美"视为对观众的尊重。她表现出的明朗积极是真实的，但也是她的自我保护方式——把事情说得条理清晰，然后专注做好，不给负面情绪太多空间。

【情绪处理】习惯把难堪锁进保险柜，对外保持得体。她需要把情绪整理清楚之后才会开口，所以通常你以为她已经没事了，她才刚刚开始消化。需要的是有耐心等她准备好的人。

【相处方式】对关系很认真，不轻易建立亲密度，但一旦认定会非常用心。会在很久以后才展示出非常鲜明的一面——比你想象中更幼稚，也更直接，偶尔会说出让人完全没料到的大实话。

【CP/Romance互动】温暖但带有距离感，追求双向奔赴，不喜欢单向付出。与有娜是IZ*ONE战友，这段关系里有很多说不清楚的层次，最亲密的和最微妙的部分同时存在。`,
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
    realPersonality: `【底色】极度认生，熟了之后又非常爽朗话多，是全团有名的爱哭鬼，心思极其敏感。慌张时会说出莫名其妙的话，事后自己会觉得很尴尬，但其实这种时候她最真实。

【要强程度】对"主唱"身份有极高自尊心，追求能够真正传递情感的声音，而不是技术上的完美。最擅长通过捉弄队长有娜来解压，这是她建立亲密关系的独特方式——惹麻烦、被骂、然后笑着继续。

【情绪处理】压力大时会往内收，变得很安静，不太说话，像是把自己缩小了。这种时候不需要问她发生了什么，她说不出来，需要的是肢体上的陪伴——坐在她旁边，或者抱一下。

【相处方式】认生期会有点笨拙，不知道该说什么，聊天可能有几次尴尬的冷场。但熟了之后会完全不一样——话多、爱笑、会突然说出非常真实的感受。她对关系很认真，在乎的人她会一直记着。

【CP/Romance互动】一开始认生，但确认心意后会非常主动，对喜欢的人有很强的依赖感。与怜之间的"自己啊"是整个团最被看穿的关系，两个人都藏不住但谁也没正式说破。`,
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
    realPersonality: `【底色】比实际年龄成熟很多，职业意识极强，有一种不被他人轻易左右的独立感。负责给张员瑛科普网络用语，是她们之间一个很可爱的权力倒置。

【要强程度】拥有不输给姐姐们的胜负欲，在专业上追求"全方位"的认可，不想只被当成可爱的忙内。会主动向姐姐们索吻来确认位置——这是一种非常直接的需要被认可的方式。

【情绪处理】典型"往内收"的早熟孩子，受了委屈会觉得自己应该坚强，不应该让姐姐们担心。她把"懂事"当成一种保护自己的壳，需要别人帮她把这个壳拆穿，给她一个可以不懂事的空间。

【相处方式】熟了之后非常直接，喜欢就黏过来，不喜欢就直接说不要。对姐姐们有一种奇特的主导感——她是忙内，但她有时候会像一个照顾所有人的人，然后自己偷偷消化那些没说出口的东西。

【CP/Romance互动】比同龄人早熟，但在真正喜欢的人面前会瞬间变回撒娇忙内，所有的成熟感都不见了。怜是唯一会接受她亲亲的姐姐，也是最了解她秘密的人——某种程度上，她们之间的了解是相互的。`,
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
    group: 'solo',
    age: 1999,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '可爱鸭子系偶像，综艺感极强，治愈系艺人的代名词',
    realPersonality: `【底色】典型的ENTP思维，话题跳跃极快，韧性极强，经历过生死关头的挫折但从不一蹶不振。她的能量是真实的，但她的能量消耗也非常大，只是不让人看见消耗的过程。

【要强程度】独立出道的压力让她产生了"一定要被认可"的执念。她追求无可替代的个人色彩，不是为了打败谁，是为了证明她的存在是必要的。

【情绪处理】越是难受越会讲笑话，笑得太用力是快崩溃的边缘。她的笑声是她的盾牌，但也是她确认关系的方式——如果她笑，说明她在努力撑着；如果她让你看见了她不笑的样子，说明她信任你。

【相处方式】粘人、吵闹、会在你刚想安静的时候制造一堆噪音。但这背后是一种很真实的亲近——她只对在乎的人这样。她记性很好，会记住你说过的每一件小事，然后在某个你意想不到的时候提出来。

【CP/Romance互动】热烈且直接，在关系里非常会撒娇，但面对严肃感情会突然展示出深刻冷静的一面，让人措手不及。与恩妃是IZ*ONE解散后来往最密切的前队友，她们之间有一种"互相照顾着彼此某个角落"的感觉。`,
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
    group: 'solo',
    age: 1995,
    nationality: '韩国',
    role: 'Solo',
    publicPersona: '夏日女神，成熟性感的代名词，台风自信大气',
    realPersonality: `【底色】"妈妈型队长"的终极形态。多年队长经历让她习惯了照顾所有人，不自觉地把身边的人都托住。她是所有IZ*ONE前成员私下联系的中心节点，大家有什么事都会先想到她。

【要强程度】Solo出道的压力让她如履薄冰，对舞台物料有极高的掌控欲，不愿被局限在单一的标签里。她对自己的职业规划有很清晰的想法，但她不太对外说，只是一件一件地做。

【情绪处理】几乎不向外报忧，压力全往内收。在别人面前依然是能干的那个人，但如果你能看见她深夜静坐的瞬间，那是她真实的状态——安静、一个人，在消化什么东西。她需要的不是被询问，是有人主动坐过来，和她喝一杯。

【相处方式】习惯了照顾人，不太擅长被照顾，被人好好对待时会手忙脚乱。她有一种年长者的稳重感，但这不是她全部——熟了之后你会发现她其实很幼稚，很爱玩，只是把这部分藏得比较深。

【CP/Romance互动】成熟大姐姐式的推拉，在关系里给予非常真诚的回应。她习惯了给，接受的时候反而更难。与叡娜之间的关系是那种"互相是彼此安全基地"的感觉，不需要每天联系，但知道对方在，就够了。`,
    affection: 0,
    careerPressure: 40,
    status: '日常活动中',
    initialRelationships: [
      { targetId: 'yena', type: '前队友', affinity: 78, tension: 15, note: 'IZ*ONE解散后私下来往最密切，最疼爱的后辈' },
      { targetId: 'chaewon', type: '前队友', affinity: 72, tension: 20, note: '看着对方成长，既欣慰又感到压力' },
      { targetId: 'yujin_ive', type: '前队友', affinity: 68, tension: 25, note: '两位"队长"间的无声较量' },
      { targetId: 'sakura', type: '前队友', affinity: 70, tension: 10, note: '互相尊重的资深同行' }
    ]
  },

  // ==========================================
  // test
  // ==========================================
  {
    id: 'hoshi',
    name: '权顺荣',
    stageName: 'HOSHI',
    group: 'test',
    age: 1996,
    nationality: '韩国',
    role: '表演队队长',
    publicPersona: '舞台上的老虎，热血表演者，综艺感十足的虎爪狂热者',
    realPersonality: `【底色】极度纯粹的"表演痴"。舞台下其实是个心思细腻且容易害羞的人，但在聊到舞蹈和舞台构思时会瞬间切换到"老虎模式"，眼神完全不一样。他对成员和身边人的依赖感很强，本质上是个怕寂寞的人，只是用热血掩盖得很好。

【要强程度】顶级编舞师的自尊心。他追求的不是个人的突出，而是整个团队舞台的完美。为了一个走位的细节可以拉着成员练习几百次，这种执着有时候会让周围人感到压力，但他自己沉浸在里面感受不到。胜负欲极强，特别是在舞蹈挑战和体育竞技类综艺中——输了会生闷气，但下次一定要赢回来。

【情绪处理】习惯用高强度的热血状态掩盖疲惫。压力大时会疯狂练习，或者通过大喊大叫来释放，然后又立刻切回正常状态。如果他突然变得极其安静、开始机械性地重复某个舞蹈动作，那才是他已经透支的信号。他不太会主动说"我很累"，觉得说出来会影响大家的士气。

【相处方式】对在乎的人有很强的照顾欲，会记住你说过的喜好，在你低落时突然出现。他的幽默感很特别——会用很认真的表情说出一句完全不正经的话，然后看你的反应。被他认可的人会感受到一种非常具体的被重视感，因为他在乎的东西他会认真对待。

【CP/Romance互动】恋爱中是"直球年上"与"撒娇年下"的结合体。会非常直白地表达好感，但感受到对方的冷淡时会像大猫一样缩起来生闷气，不说，但整个人明显不对劲。在CP模式中与同龄亲故的互动充满了幼稚的胜负欲，两个人都想赢，但其实谁赢了都高兴。`,
    affection: 0,
    careerPressure: 52,
    status: '日常活动中',
    initialRelationships: [
      { targetId: 'ryujin', type: '跨团', affinity: 65, tension: 20, note: '因舞蹈挑战而结识，互相欣赏业务能力' },
      { targetId: 'karina', type: '跨团', affinity: 60, tension: 5, note: '舞台合作过的后辈，保持礼貌的职场距离' },
      { targetId: 'yena', type: '跨团', affinity: 70, tension: 10, note: '综艺上认识的吵闹亲故' }
    ]
  }
];

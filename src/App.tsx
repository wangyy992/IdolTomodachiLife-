import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, Info, Users, Eye, MapPin, Gamepad2, Heart, Zap, Sparkles, MessageCircle, CheckCheck, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GameState, INITIAL_MEMBERS, ChatMessage, MessageRole, Member, TheqooPost, SetupStep, GameMode } from './types';
import { callGeminiAPI } from './geminiService';

const LOCAL_STORAGE_KEY = 'star_reality_kpop_game_state';

// 杏色主题色板
// 背景: #FAF7F2 奶油白
// 强调: #C4936A 杏色
// 浅强调: #F5E6D0
// 边框: #EAE0D5
// 深文字: #3D2B1F
// 次要文字: #A0663A

const KKTMessageUI = ({ data }: { data: any }) => (
  <div className="my-6 max-w-xs mx-auto font-sans">
    <div className="relative bg-[#1A1A1A] rounded-[2.5rem] p-3 shadow-2xl">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#111] rounded-full flex items-center justify-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#333]"></div>
        <div className="w-3 h-3 rounded-full bg-[#2a2a2a] border border-[#444]"></div>
      </div>
      <div className="bg-[#F5F0EA] rounded-[2rem] overflow-hidden mt-4">
        <div className="bg-[#F5F0EA] px-5 pt-3 pb-1 flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-500">9:41</span>
        </div>
        <div className="bg-[#FAE100] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-lg">{data.avatar || '👤'}</div>
          <div>
            <div className="text-[13px] font-black text-[#3A1F00]">{data.sender}</div>
            <div className="text-[9px] text-[#3A1F00]/60">카카오톡</div>
          </div>
        </div>
        <div className="px-4 py-4 space-y-3 min-h-[80px] bg-[#B2C7D9]/20">
          {data.messages?.map((msg: any, idx: number) => (
            <div key={idx} className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FAE100] flex items-center justify-center text-sm flex-shrink-0">{data.avatar || '👤'}</div>
              <div className="flex flex-col gap-0.5 max-w-[75%]">
                <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2 shadow-sm">
                  <p className="text-[12px] text-gray-800 leading-relaxed font-medium">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 pl-1">
                  <span className="text-[9px] text-gray-400">{msg.time}</span>
                  {!msg.isRead && <span className="text-[9px] text-[#FAE100] font-black">1</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white pb-2 flex justify-center"><div className="w-24 h-1 bg-gray-300 rounded-full"></div></div>
      </div>
    </div>
    <div className="text-center mt-2"><span className="text-[10px] text-[#A0663A] font-bold uppercase tracking-widest">KakaoTalk</span></div>
  </div>
);

const WeversePostUI = ({ data }: { data: any }) => (
  <div className="my-6 max-w-sm mx-auto font-sans bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EAE0D5]">
    <div className="px-4 py-3 flex items-center justify-between border-b border-[#EAE0D5]">
      <div className="flex items-center gap-3">
        <span className="text-[#A0663A] text-lg">{'<'}</span>
        <div className="text-center">
          <div className="text-[14px] font-bold text-[#3D2B1F]">帖子</div>
          <div className="text-[10px] text-[#C4936A]">前往社区 {'>'}</div>
        </div>
      </div>
      <div className="flex gap-4 text-[#A0663A] text-lg"><span>↗</span><span>✕</span></div>
    </div>
    <div className="px-4 pt-4 pb-2 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-[#F5E6D0] flex items-center justify-center flex-shrink-0">
        <span className="text-[#A0663A] font-black text-sm">{data.artist?.[0] || '★'}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-[14px] font-bold text-[#3D2B1F]">{data.artist}</span>
          <span className="text-[#C4936A] text-[14px]">✓</span>
        </div>
        <div className="text-[11px] text-[#A0663A]">{data.time}</div>
        <div className="text-[11px] text-[#C4936A] mt-0.5">查看原文 (한국어)</div>
      </div>
      <span className="text-[#A0663A] text-lg">⋯</span>
    </div>
    <div className="px-4 pb-3">
      <p className="text-[14px] text-[#3D2B1F] leading-relaxed">{data.content}</p>
    </div>
    {data.imageDesc && (
      <div className="w-full bg-[#F5E6D0] aspect-[4/3] flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#EAE0D5] flex items-center justify-center">
          <span className="text-[#A0663A] text-xl">🖼</span>
        </div>
        <p className="text-[11px] text-[#A0663A]">图片</p>
      </div>
    )}
    <div className="px-4 py-3 flex items-center gap-6 border-t border-[#EAE0D5]">
      <button className="flex items-center gap-1.5 text-[#A0663A]">
        <Heart className="w-5 h-5" />
        <span className="text-[12px]">{(data.likes || 0).toLocaleString()}</span>
      </button>
      <button className="text-[#A0663A] text-xl">🔖</button>
    </div>
  </div>
);

const BubbleMessageUI = ({ data }: { data: any }) => (
  <div className="my-6 max-w-sm mx-auto font-sans bg-[#F0EBE3] rounded-3xl overflow-hidden shadow-sm">
    <div className="px-4 py-3 flex items-center justify-between bg-[#F0EBE3] border-b border-[#EAE0D5]">
      <span className="text-[#C4936A] text-[14px]">{'<'}</span>
      <span className="text-[16px] font-bold text-[#3D2B1F]">{data.artist}</span>
      <div className="flex gap-4">
        <span className="text-[#A0663A]">🔍</span>
        <span className="text-[#A0663A]">⋯</span>
      </div>
    </div>
    <div className="px-4 py-4 space-y-2">
      {data.messages?.map((msg: any, idx: number) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#3D2B1F] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[16px]">🐱</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold text-white bg-[#C4936A] px-1.5 py-0.5 rounded">ARTIST</span>
              <span className="text-[12px] font-bold text-[#3D2B1F]">{data.artist}</span>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2 inline-block max-w-[85%] border border-[#EAE0D5]">
              <p className="text-[13px] text-[#3D2B1F] leading-relaxed">{msg.text}</p>
              {msg.translation && (
                <p className="text-[12px] text-[#C4936A] mt-0.5 leading-relaxed">{msg.translation}</p>
              )}
            </div>
            <div className="text-[10px] text-[#A0663A] mt-1 pl-1">{msg.time}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="px-4 py-3 bg-[#F0EBE3] border-t border-[#EAE0D5] flex items-center justify-end gap-4">
      <span className="text-[#A0663A] text-xl">☺</span>
      <span className="text-[#C4936A] text-xl">➤</span>
    </div>
  </div>
);

const TheqooPostUI = ({ post }: { post: TheqooPost }) => (
  <div className="bg-[#F2F2F2] border border-gray-200 rounded-3xl overflow-hidden shadow-sm my-6 max-w-lg mx-auto font-sans">
    <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div><div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div></div>
      <div className="bg-gray-100 px-8 py-1 rounded-full text-[10px] text-gray-400">theqoo.net</div>
      <div className="w-6"></div>
    </div>
    <div className="bg-white overflow-hidden">
      <div className="p-5 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[#D32F2F] text-white text-[9px] px-1.5 py-0.5 rounded font-black">HOT</div>
          <span className="text-[#333] text-[10px] font-black uppercase border-b-2 border-[#D32F2F]">Community theqoo</span>
        </div>
        <h2 className="text-lg font-bold leading-tight text-gray-900 mb-3">{post.title}</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400">
          <span className="text-[#D32F2F] font-black">{post.category}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {(post.viewsCount || 0).toLocaleString()}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {(post.likesCount || 0).toLocaleString()}</span>
          <span className="font-bold text-gray-600">Comments {post.commentsCount || 0}</span>
        </div>
      </div>
      <div className="divide-y divide-[#F8F8F8]">
        {post.comments.slice(0, 6).map((comment, idx) => (
          <div key={idx} className="p-4 bg-white">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F5E6D0] flex-shrink-0 flex items-center justify-center text-[#A0663A] font-black text-xs">{idx + 1}</div>
              <div className="flex-1">
                <span className="text-[10px] font-black text-[#A0663A]">@{comment.authorId}</span>
                <p className="text-sm font-medium text-gray-800 mt-1 leading-relaxed">{comment.content}</p>
                {comment.translation && <p className="text-[11px] text-gray-500 italic mt-1">{comment.translation}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CharacterCardUI = ({ card }: any) => {
  if (!card || typeof card !== 'object') return null;
  const name = card.name || '未知角色';
  const stageName = card.stageName || '';
  const group = card.group || '未知团体';
  const status = card.status || '活跃中';
  const persona = card.publicPersona || '暂无信息';
  const personality = card.realPersonality || '暂无信息';
  const traits = card.weaknesses || [];
  const story = card.hiddenStory;
  return (
    <div className="bg-white border border-[#EAE0D5] rounded-3xl overflow-hidden shadow-sm my-6 max-w-md mx-auto font-sans">
      <div className="bg-[#C4936A] p-5 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles className="w-12 h-12" /></div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Artist Profile</div>
        <h3 className="text-xl font-bold">{name} {stageName ? `(${stageName})` : ''}</h3>
      </div>
      <div className="p-5 space-y-4 text-left">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE0D5]"><div className="text-[#A0663A] font-black mb-1 uppercase text-[9px]">Group</div><div className="font-bold text-[#3D2B1F]">{group}</div></div>
          <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE0D5]"><div className="text-[#A0663A] font-black mb-1 uppercase text-[9px]">Status</div><div className="font-bold text-[#3D2B1F]">{status}</div></div>
        </div>
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE0D5] text-xs"><span className="font-black text-[#C4936A] block uppercase text-[9px] mb-1">Public Persona</span><p className="text-[#3D2B1F] italic">"{persona}"</p></div>
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE0D5] text-xs"><span className="font-black text-[#A0663A] block uppercase text-[9px] mb-1">Real Personality</span><p className="text-[#3D2B1F]">{personality}</p></div>
        {Array.isArray(traits) && traits.length > 0 && (
          <div className="flex flex-wrap gap-2">{traits.map((item: string, i: number) => <span key={i} className="text-[10px] px-3 py-1 bg-[#F5E6D0] text-[#A0663A] rounded-full border border-[#EAE0D5] font-bold"># {item}</span>)}</div>
        )}
        {story && <div className="pt-2 border-t border-dashed border-[#EAE0D5]"><span className="font-black text-[#A0663A] block uppercase text-[9px] mb-1">Hidden Story</span><p className="text-[11px] text-[#A0663A] italic">{story}</p></div>}
      </div>
    </div>
  );
};

const MusicShowUI = ({ result }: { result: any }) => (
  <div className="bg-white border border-[#EAE0D5] rounded-[2rem] overflow-hidden shadow-sm my-6 max-w-lg mx-auto font-sans">
    <div className="bg-[#C4936A] p-5 text-white text-center relative">
      <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Music Bank / Inkigayo</div>
      <h3 className="text-xl font-black tracking-widest">WEEKLY CHAMPION</h3>
      <div className="absolute top-2 right-4 opacity-30"><Sparkles className="w-8 h-8" /></div>
    </div>
    <div className="p-5 space-y-4">
      <div className="flex flex-col items-center py-4 bg-[#FAF7F2] rounded-3xl border border-[#EAE0D5]">
        <div className="text-[10px] font-black text-[#A0663A] uppercase mb-1">本次优胜 / Winner</div>
        <div className="text-2xl font-black text-[#3D2B1F]">{result.winner}</div>
        <div className="mt-2 flex gap-1">{[1,2,3].map(i => <Sparkles key={i} className="w-4 h-4 text-[#C4936A] animate-pulse" />)}</div>
      </div>
      <div className="space-y-3">
        {result.scores?.map((score: any, idx: number) => (
          <div key={idx} className={`p-4 rounded-2xl border ${score.group === result.winner ? 'bg-[#F5E6D0] border-[#C4936A]' : 'bg-white border-[#EAE0D5]'}`}>
            <div className="flex justify-between items-center mb-2"><span className="font-bold text-sm text-[#3D2B1F]">{score.group}</span><span className="font-black text-[#C4936A] text-sm">{score.total} pt</span></div>
            <div className="grid grid-cols-5 gap-1">
              {['digital','physical','sns','preVote','broadcast'].map((key, i) => (
                <div key={i} className="text-center"><div className="text-[8px] text-[#A0663A] font-bold uppercase truncate">{['音源','销量','SNS','投票','放送'][i]}</div><div className="text-[10px] font-bold text-[#3D2B1F]">{score[key]}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OptionsUI = ({ options, onSelect, disabled, isLatest }: { options: any[], onSelect: (a: string) => void, disabled: boolean, isLatest: boolean }) => {
  if (!isLatest || !options?.length) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {options.map((opt: any, i) => {
        const text = typeof opt === 'string' ? opt : opt.text;
        const action = typeof opt === 'string' ? opt : opt.action;
        return <button key={i} onClick={() => onSelect(action)} disabled={disabled}
          className="px-6 py-3 bg-[#C4936A] text-white font-bold rounded-3xl hover:bg-[#A0663A] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-sm shadow-sm">{text}</button>;
      })}
    </div>
  );
};

const MobileDrawer = ({ gameState, onClose }: { gameState: GameState, onClose: () => void }) => {
  const targetMembers = gameState.members.filter(m => gameState.targets.includes(m.id));
  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-[#FAF7F2] rounded-t-[2rem] shadow-2xl border-t border-[#EAE0D5] max-h-[70vh] overflow-y-auto"
    >
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-[#EAE0D5] rounded-full"></div>
      </div>
      <div className="flex items-center justify-between px-6 pb-4 border-b border-[#EAE0D5]">
        <h3 className="font-black text-[#C4936A] text-sm uppercase tracking-widest">角色状态</h3>
        <button onClick={onClose} className="p-2 hover:bg-[#F5E6D0] rounded-full transition-all"><X className="w-4 h-4 text-[#A0663A]" /></button>
      </div>
      <div className="p-5 space-y-5">
        {targetMembers.length > 0 && (
          <section>
            <h4 className="text-[10px] font-black text-[#A0663A] uppercase tracking-widest mb-3 flex items-center gap-2"><Heart className="w-3 h-3" /> 攻略目标</h4>
            <div className="space-y-3">
              {targetMembers.map(member => (
                <div key={member.id} className="bg-white p-4 rounded-2xl border border-[#EAE0D5]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-[#3D2B1F]">{member.name}</span>
                    <span className="text-[11px] text-[#C4936A] font-mono font-bold">{member.affection}/100</span>
                  </div>
                  <div className="h-2 bg-[#F5E6D0] rounded-full overflow-hidden mb-1">
                    <motion.div animate={{ width: `${member.affection}%` }} className="h-full bg-[#C4936A] rounded-full" />
                  </div>
                  <div className="text-[10px] text-[#A0663A]">{member.status}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h4 className="text-[10px] font-black text-[#A0663A] uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-3 h-3" /> 当前状态</h4>
          <div className="bg-white p-4 rounded-2xl border border-[#EAE0D5] space-y-2">
            <div className="flex justify-between text-xs"><span className="text-[#A0663A]">场景</span><span className="font-bold text-[#3D2B1F]">{gameState.currentScene}</span></div>
            <div className="flex justify-between text-xs"><span className="text-[#A0663A]">第几周</span><span className="font-bold text-[#C4936A]">Week {gameState.turnCount || 1}</span></div>
            {gameState.isComebackSetting && <div className="text-[10px] font-black text-[#A0663A] bg-[#F5E6D0] px-2 py-1 rounded-lg">回归期进行中</div>}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const CharacterCreationWizard = ({ onComplete, onReset, members }: { onComplete: (data: any) => void, onReset: () => void, members: Member[] }) => {
  const [step, setStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [data, setData] = useState({ playerName: '', playerAge: 19, identity: [] as string[], gameMode: GameMode.ROMANCE, targets: [] as string[], selectedCPs: [] as string[] });

  const ids = ["韩国留学生","便利店/咖啡厅打工人","娱乐公司实习生","音乐节目工作人员","妆造师/发型助理","翻译/海外商务助理","娱乐记者/博主","普通粉丝","资深粉丝","公寓同栋住户"];
  const modes = [
    { id: GameMode.ROMANCE, name: '攻略模式', desc: '和自担谈恋爱' },
    { id: GameMode.MIXED, name: '助攻模式', desc: '给家产拉红线' },
    { id: GameMode.OBSERVER, name: '宝妈模式', desc: '把宝宝养大' }
  ];

  // 按团体分组
  const soloIds = ['yena', 'eunbi'];
  const groups = Array.from(new Set(members.filter(m => !soloIds.includes(m.id)).map(m => m.group)));
  const groupedMembers: Record<string, Member[]> = {};
  groups.forEach(g => { groupedMembers[g] = members.filter(m => m.group === g); });
  groupedMembers['Solo'] = members.filter(m => soloIds.includes(m.id));
  const allGroups = [...groups, 'Solo'];

  const toggleTarget = (id: string, max?: number) => {
    if (data.targets.includes(id)) {
      setData({...data, targets: data.targets.filter(x => x !== id)});
    } else {
      if (max && data.targets.length >= max) return;
      setData({...data, targets: [...data.targets, id]});
    }
  };

  // 选人面板（带团体二级目录）
  const MemberPicker = ({ max, label }: { max?: number, label: string }) => (
    <div className="space-y-3">
      <label className="text-xs font-black text-[#A0663A] uppercase">{label}{max ? `（选${max}人）` : '（可多选）'}</label>
      {/* 团体标签 */}
      <div className="flex flex-wrap gap-2">
        {allGroups.map(g => (
          <button key={g} onClick={() => setSelectedGroup(selectedGroup === g ? null : g)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${selectedGroup === g ? 'bg-[#C4936A] border-[#C4936A] text-white' : 'bg-white border-[#EAE0D5] text-[#3D2B1F]'}`}>
            {g}
          </button>
        ))}
      </div>
      {/* 成员列表 */}
      {selectedGroup && (
        <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 custom-scrollbar">
          {(groupedMembers[selectedGroup] || []).map(m => {
            const selected = data.targets.includes(m.id);
            const disabled = !selected && !!max && data.targets.length >= max;
            return (
              <button key={m.id} onClick={() => !disabled && toggleTarget(m.id, max)}
                className={`p-3 rounded-2xl border text-[11px] transition-all flex flex-col items-center gap-1 ${selected ? 'bg-[#F5E6D0] border-[#C4936A] text-[#A0663A] font-bold' : disabled ? 'bg-white border-[#EAE0D5] text-gray-300 cursor-not-allowed' : 'bg-white border-[#EAE0D5] text-[#3D2B1F]'}`}>
                <div className="font-black text-xs">{m.name}</div>
                <div className="text-[9px] opacity-60">{m.stageName}</div>
              </button>
            );
          })}
        </div>
      )}
      {data.targets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {data.targets.map(id => {
            const m = members.find(x => x.id === id);
            return m ? (
              <span key={id} className="text-[10px] bg-[#F5E6D0] text-[#A0663A] px-2 py-1 rounded-full border border-[#EAE0D5] font-bold flex items-center gap-1">
                {m.name}
                <button onClick={() => toggleTarget(id)} className="text-[#C4936A] hover:text-[#A0663A]">×</button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );

  const canProceedStep4 = () => {
    if (data.gameMode === GameMode.MIXED) return data.targets.length === 2;
    return data.targets.length >= 1;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-[#EAE0D5] rounded-[2.5rem] shadow-sm w-full max-w-xl overflow-hidden flex flex-col">
        <div className="bg-[#C4936A] p-8 text-white text-center relative">
          <button onClick={onReset} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full"><RefreshCw className="w-4 h-4" /></button>
          <h2 className="text-2xl font-bold tracking-widest mb-1">爱豆收集梦想生活</h2>
          <p className="text-xs opacity-80">Step {step} of 4</p>
        </div>
        <div className="p-8 flex-1 overflow-y-auto max-h-[65vh] custom-scrollbar bg-[#FAF7F2]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="space-y-2"><label className="text-xs font-black text-[#A0663A] uppercase">你的名字</label><input type="text" value={data.playerName} onChange={e => setData({...data, playerName: e.target.value})} className="w-full bg-white border border-[#EAE0D5] rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#C4936A] outline-none text-[#3D2B1F]" placeholder="请输入角色昵称..." /></div>
                <div className="space-y-2"><label className="text-xs font-black text-[#A0663A] uppercase">年龄</label><input type="number" value={data.playerAge} onChange={e => setData({...data, playerAge: parseInt(e.target.value)})} className="w-full bg-white border border-[#EAE0D5] rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#C4936A] outline-none text-[#3D2B1F]" /></div>
                <button onClick={() => setStep(2)} disabled={!data.playerName} className="w-full bg-[#C4936A] text-white py-4 rounded-2xl font-bold disabled:opacity-50 hover:bg-[#A0663A] transition-all">继续</button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <label className="text-xs font-black text-[#A0663A] uppercase">选择你的身份 (可多选)</label>
                <div className="grid grid-cols-2 gap-2">{ids.map(i => <button key={i} onClick={() => setData({...data, identity: data.identity.includes(i) ? data.identity.filter(x => x !== i) : [...data.identity, i]})} className={`p-3 rounded-xl border text-[11px] transition-all ${data.identity.includes(i) ? 'bg-[#F5E6D0] border-[#C4936A] text-[#A0663A] font-bold' : 'bg-white border-[#EAE0D5] text-[#3D2B1F]'}`}>{i}</button>)}</div>
                <div><input type="text" placeholder="或手动输入自定义身份..." className="w-full bg-white border border-[#EAE0D5] rounded-xl p-3 text-[11px] focus:ring-1 focus:ring-[#C4936A] outline-none text-[#3D2B1F]" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value.trim(); if (val && !data.identity.includes(val)) { setData({...data, identity: [...data.identity, val]}); (e.target as HTMLInputElement).value = ''; } e.preventDefault(); } }} /></div>
                <button onClick={() => {
                  const inputEl = document.querySelector('input[placeholder="或手动输入自定义身份..."]') as HTMLInputElement;
                  if (inputEl?.value.trim() && !data.identity.includes(inputEl.value.trim())) {
                    setData(d => ({...d, identity: [...d.identity, inputEl.value.trim()]}));
                  }
                  setStep(3);
                }} disabled={data.identity.length === 0 && !(document.querySelector('input[placeholder="或手动输入自定义身份..."]') as HTMLInputElement)?.value.trim()} ...>继续</button>              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <label className="text-xs font-black text-[#A0663A] uppercase">选择模式</label>
                <div className="space-y-3">{modes.map(m => (
                  <button key={m.id} onClick={() => {
                    setData({...data, gameMode: m.id as GameMode, targets: []});
                    setSelectedGroup(null);
                  }} className={`w-full p-4 rounded-2xl border text-left transition-all ${data.gameMode === m.id ? 'bg-[#F5E6D0] border-[#C4936A] text-[#A0663A]' : 'bg-white border-[#EAE0D5] text-[#3D2B1F]'}`}>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-[10px] opacity-60 mt-1">{m.desc}</div>
                  </button>
                ))}</div>
                <button onClick={() => setStep(4)} className="w-full bg-[#C4936A] text-white py-4 rounded-2xl font-bold hover:bg-[#A0663A] transition-all">下一步</button>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                {data.gameMode === GameMode.ROMANCE && (
                  <MemberPicker label="选择你的自担" />
                )}
                {data.gameMode === GameMode.MIXED && (
                  <MemberPicker label="选两个人来拉郎" max={2} />
                )}
                {data.gameMode === GameMode.OBSERVER && (
                  <MemberPicker label="选择你的宝宝" />
                )}
                <button onClick={() => onComplete(data)} disabled={!canProceedStep4()} className="w-full bg-[#C4936A] text-white py-4 rounded-2xl font-bold hover:bg-[#A0663A] transition-all disabled:opacity-50">开启追星之旅</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

function extractBlock(text: string, startTag: string, endTag: string): { content: string; remaining: string } | null {
  const start = text.indexOf(startTag);
  if (start === -1) return null;
  const end = text.indexOf(endTag, start + startTag.length);
  if (end === -1) return null;
  const content = text.slice(start + startTag.length, end).trim();
  const remaining = text.slice(0, start) + text.slice(end + endTag.length);
  return { content, remaining };
}

function parseOptions(text: string): { text: string; action: string }[] {
  const abcdPattern = /^([A-C])[\.、。\s]+(.+)$/gm;
  const options: { text: string; action: string }[] = [];
  let match;
  while ((match = abcdPattern.exec(text)) !== null) {
    const content = match[2].trim();
    if (content.length > 2 && !content.includes('自由行动')) {
      options.push({ text: `${match[1]}. ${content}`, action: content });
    }
  }
  if (options.length >= 2) return options;
  const jsonMatch = text.match(/\[[\s\S]*?\]/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((o: any) => typeof o === 'string' ? { text: o, action: o } : o);
      }
    } catch(e) {}
  }
  return [];
}

export default function App() {
  const getInitialGameState = (): GameState => ({
    members: INITIAL_MEMBERS, exposure: 0, relationships: [], currentScene: '首尔', history: [],
    turnCount: 1, identity: [], setupStep: SetupStep.CREATION, playerName: '', playerAge: 20,
    playerMoney: 2300000, playerMood: 80, targets: [], selectedCPs: [], collectedCards: [],
    playerImpact: { albumImpact: 0, voteImpact: 0 }
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) { try { const p = JSON.parse(saved); return { ...p, collectedCards: p.collectedCards || [], playerImpact: p.playerImpact || { albumImpact: 0, voteImpact: 0 } }; } catch(e) {} }
    return getInitialGameState();
  });

  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState)); }, [gameState]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [gameState.history]);
  useEffect(() => { setApiKeyMissing(!import.meta.env.VITE_DEEPSEEK_API_KEY); }, []);

  const handleCreationComplete = (data: any) => {
    const targetNames = INITIAL_MEMBERS.filter(m => data.targets.includes(m.id)).map(m => m.name);
    const summary = `我的名字是 ${data.playerName}，身份是 ${data.identity.join(', ')}。我想关注 ${targetNames.join(', ')}。游戏模式：${data.gameMode}。故事开始。`;
    const newState: GameState = { ...gameState, ...data, setupStep: SetupStep.CARDS, history: [] };
    setGameState(newState);
    handleAIStep(summary, newState);
  };

  const handleAIStep = async (userContent: string, stateToUse: GameState) => {
    try {
      const response = await Promise.race([
        callGeminiAPI(stateToUse.history.slice(-6), stateToUse),
        new Promise((_, reject) => setTimeout(() => reject(new Error("通讯超时，请重试。")), 60000))
      ]) as string;
      processAIResponse(response, stateToUse);
    } catch(e) {
      setGameState(prev => ({ ...prev, history: [...prev.history, { role: MessageRole.ASSISTANT, content: `抱歉，出现错误。\n错误信息: ${e instanceof Error ? e.message : String(e)}`, timestamp: Date.now() }] }));
    } finally { setIsLoading(false); }
  };

  const handleReset = () => setShowConfirmReset(true);
  const executeReset = () => { localStorage.removeItem(LOCAL_STORAGE_KEY); setShowConfirmReset(false); setGameState(getInitialGameState()); setInput(''); setIsLoading(false); };

  const processAIResponse = (response: string, stateAtCall: GameState) => {
    let remaining = response;
    let snapshot: any = null, theqooPost: any = null, musicResult: any = null;
    let kktMessage: any = null, weversePost: any = null, bubbleMessage: any = null;
    let cards: any[] = [];

    const snapshotBlock = extractBlock(remaining, 'SNAPSHOT_START', 'SNAPSHOT_END');
    if (snapshotBlock) { remaining = snapshotBlock.remaining; try { snapshot = JSON.parse(snapshotBlock.content); } catch(e) {} }

    const theqooBlock = extractBlock(remaining, 'THEQOO_START', 'THEQOO_END');
    if (theqooBlock) { remaining = theqooBlock.remaining; try { theqooPost = JSON.parse(theqooBlock.content); } catch(e) {} }

    const musicBlock = extractBlock(remaining, 'MUSICSHOW_START', 'MUSICSHOW_END');
    if (musicBlock) { remaining = musicBlock.remaining; try { musicResult = JSON.parse(musicBlock.content); } catch(e) {} }

    const kktBlock = extractBlock(remaining, 'KKTMSG_START', 'KKTMSG_END');
    if (kktBlock) { remaining = kktBlock.remaining; try { kktMessage = JSON.parse(kktBlock.content); } catch(e) {} }

    const weverseBlock = extractBlock(remaining, 'WEVERSE_START', 'WEVERSE_END');
    if (weverseBlock) { remaining = weverseBlock.remaining; try { weversePost = JSON.parse(weverseBlock.content); } catch(e) {} }

    const bubbleBlock = extractBlock(remaining, 'BUBBLE_START', 'BUBBLE_END');
    if (bubbleBlock) { remaining = bubbleBlock.remaining; try { bubbleMessage = JSON.parse(bubbleBlock.content); } catch(e) {} }

    let cardBlock = extractBlock(remaining, 'CARD_START', 'CARD_END');
    while (cardBlock) {
      remaining = cardBlock.remaining;
      try {
        const card = JSON.parse(cardBlock.content);
        const existingNames = (stateAtCall.collectedCards || []).map((c: any) => c.name);
        if (card?.name && !existingNames.includes(card.name)) cards.push(card);
      } catch(e) {}
      cardBlock = extractBlock(remaining, 'CARD_START', 'CARD_END');
    }

    const options = parseOptions(remaining);

    const displayContent = remaining
      .replace(/^[A-D][\.、。\s]+.+$/gm, '')
      .replace(/\[必须包含.*?\]/g, '')
      .replace(/^选项[：:]\s*$/gm, '')
      .replace(/^状态快照[：:]\s*$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    setGameState(prev => {
      let next = { ...prev };
      const isWeekEnd = snapshot?.isWeekEnd === true;
      if (snapshot) {
        next = { ...next,
          currentScene: snapshot.currentScene ?? next.currentScene,
          turnCount: snapshot.weekCount ?? snapshot.week ?? next.turnCount,
          hiddenSummary: snapshot.hiddenSummary ?? next.hiddenSummary,
          isComebackSetting: snapshot.isComebackSetting ?? false,
          groupHeats: snapshot.groupHeats ?? next.groupHeats,
          currentMusicShow: musicResult || next.currentMusicShow,
          members: next.members.map(m => { const u = snapshot.members?.find((sm: any) => sm.id === m.id); return u ? { ...m, ...u } : m; })
        };
      }
      if (musicResult) next.musicShowHistory = [...(next.musicShowHistory || []), musicResult];
      if (cards.length > 0) next.collectedCards = [...(next.collectedCards || []), ...cards];
      if (cards.length > 0 && prev.setupStep === SetupStep.CARDS) next.setupStep = SetupStep.STARTED;

      return {
        ...next,
        history: [...next.history, {
          role: MessageRole.ASSISTANT,
          content: (snapshot?.isComebackSetting && !prev.isComebackSetting)
            ? "回归期开始！即将开启打歌活动。\n\n" + (displayContent || '')
            : ((displayContent && displayContent.trim()) || (cards.length > 0 ? "（剧情准备就绪）" : "（剧情推进中...）")),
          timestamp: Date.now(),
          theqooPost,
          cardData: cards.length > 0 ? cards : undefined,
          currentMusicShow: musicResult || undefined,
          options: options.length > 0 ? options : undefined,
          isComebackSetup: false,
          isWeekEnd,
          kktMessage,
          weversePost,
          bubbleMessage,
        }]
      };
    });
  };

  const handleSend = async (content?: any, stateUpdate?: Partial<GameState>) => {
    const textToSend = typeof content === 'string' ? content : input;
    if ((!textToSend || !textToSend.trim()) && !stateUpdate) return;
    if (isLoading) return;
    setInput(''); setIsLoading(true);
    let nextState: GameState = { ...gameState, ...(stateUpdate || {}) };
    if (textToSend?.trim()) nextState.history = [...nextState.history, { role: MessageRole.USER, content: textToSend, timestamp: Date.now() }];
    setGameState(nextState);
    await handleAIStep(textToSend, nextState);
  };

  if (gameState.setupStep === SetupStep.CREATION) return <CharacterCreationWizard onComplete={handleCreationComplete} onReset={executeReset} members={gameState.members} />;

  const primaryTarget = gameState.members.find(m => gameState.targets.includes(m.id));

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden relative">
      {showConfirmReset && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center space-y-6 border border-[#EAE0D5]">
            <div className="w-20 h-20 bg-[#F5E6D0] rounded-full flex items-center justify-center mx-auto"><RefreshCw className="w-10 h-10 text-[#C4936A] animate-spin-slow" /></div>
            <div><h3 className="text-xl font-black text-[#3D2B1F]">确定重置吗？</h3><p className="text-sm text-[#A0663A] mt-2">所有进度将永久删除。</p></div>
            <div className="flex flex-col gap-3">
              <button onClick={executeReset} className="w-full py-4 bg-[#3D2B1F] text-white rounded-3xl font-black text-sm hover:bg-black transition-all">确认重置</button>
              <button onClick={() => setShowConfirmReset(false)} className="w-full py-4 bg-[#F5E6D0] text-[#A0663A] rounded-3xl font-black text-sm hover:bg-[#EAE0D5] transition-all">返回</button>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setShowDrawer(false)} />
            <MobileDrawer gameState={gameState} onClose={() => setShowDrawer(false)} />
          </>
        )}
      </AnimatePresence>

      {/* 桌面侧边栏 */}
      <aside className="w-72 bg-[#FAF7F2] border-r border-[#EAE0D5] flex-shrink-0 flex-col hidden lg:flex">
        <div className="p-6 border-b border-[#EAE0D5]">
          <h1 className="text-base font-black text-[#C4936A] tracking-tighter flex items-center gap-2"><Gamepad2 className="w-5 h-5" /> 爱豆收集梦想生活</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] bg-[#C4936A] text-white px-2 py-0.5 rounded-full font-black uppercase">{gameState.gameMode === GameMode.ROMANCE ? '攻略' : gameState.gameMode === GameMode.OBSERVER ? '宝妈' : '助攻'}</span>
            <span className="text-[10px] text-[#A0663A] font-bold">Idol Tomodachi Life</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          <section>
            <h3 className="text-[10px] font-black text-[#A0663A] uppercase tracking-widest mb-3 flex items-center gap-2"><Users className="w-3 h-3" /> 角色状态</h3>
            <div className="space-y-2">{gameState.members.filter(m => gameState.targets.includes(m.id)).map(member => (
              <div key={member.id} className="bg-white p-4 rounded-2xl border border-[#EAE0D5]">
                <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-[#3D2B1F]">{member.name}</span><span className="text-[10px] text-[#C4936A] font-mono font-bold">{member.affection}/100</span></div>
                <div className="h-1.5 bg-[#F5E6D0] rounded-full overflow-hidden"><motion.div animate={{ width: `${member.affection}%` }} className="h-full bg-[#C4936A] rounded-full" /></div>
                <div className="text-[9px] text-[#A0663A] mt-1">{member.status}</div>
              </div>
            ))}</div>
          </section>
        </div>
        <div className="p-5 border-t border-[#EAE0D5]">
          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#A0663A] rounded-2xl text-[10px] font-black uppercase border border-[#EAE0D5] hover:bg-[#F5E6D0] transition-all"><RefreshCw className="w-4 h-4" /> Reset</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-white lg:rounded-l-[2rem] lg:shadow-sm overflow-hidden">
        <header className="h-16 bg-white border-b border-[#EAE0D5] px-4 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="lg:hidden p-2 text-[#C4936A] hover:bg-[#F5E6D0] rounded-xl"><RefreshCw className="w-4 h-4" /></button>
            <div>
              <div className="text-[10px] text-[#A0663A] font-black uppercase tracking-widest">Scene</div>
              <h2 className="text-sm font-bold flex items-center gap-1 text-[#3D2B1F]"><MapPin className="w-3 h-3 text-[#C4936A]" /> {gameState.currentScene}</h2>
            </div>
          </div>
          {primaryTarget && (
            <button onClick={() => setShowDrawer(true)} className="lg:hidden flex items-center gap-2 bg-[#FAF7F2] px-3 py-2 rounded-2xl border border-[#EAE0D5] active:scale-95 transition-all">
              <Heart className="w-3 h-3 text-[#C4936A]" />
              <span className="text-[11px] font-bold text-[#3D2B1F]">{primaryTarget.name}</span>
              <span className="text-[11px] font-black text-[#C4936A]">{primaryTarget.affection}</span>
              <ChevronUp className="w-3 h-3 text-[#A0663A]" />
            </button>
          )}
          {apiKeyMissing && <div className="bg-[#F5E6D0] text-[#A0663A] text-[10px] font-black px-3 py-1 rounded-full border border-[#EAE0D5] animate-pulse">API KEY MISSING</div>}
          <div className="text-right">
            <div className="text-[10px] text-[#A0663A] font-bold uppercase">Week</div>
            <div className="text-sm font-bold text-[#C4936A]">{gameState.turnCount || 1}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-white">
          <AnimatePresence initial={false}>
            {gameState.history.map((msg, i) => {
              const isLatest = i === gameState.history.length - 1;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[92%] md:max-w-2xl ${msg.role === MessageRole.USER ? 'ml-8' : 'mr-8'}`}>
                    {msg.role === MessageRole.ASSISTANT && <div className="text-[9px] font-black text-[#A0663A] uppercase tracking-widest ml-3 mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> NARRATIVE</div>}
                    <div className={`p-5 md:p-6 rounded-[1.5rem] text-sm leading-relaxed markdown-container ${msg.role === MessageRole.USER ? 'bg-[#C4936A] text-white rounded-tr-none' : 'bg-[#FAF7F2] border border-[#EAE0D5] text-[#3D2B1F] rounded-tl-none'}`}>
                      <Markdown>{msg.content}</Markdown>
                      {msg.cardData?.map((card: any, idx: number) => <CharacterCardUI key={idx} card={card} />)}
                      {(msg as any).kktMessage && <KKTMessageUI data={(msg as any).kktMessage} />}
                      {(msg as any).weversePost && <WeversePostUI data={(msg as any).weversePost} />}
                      {(msg as any).bubbleMessage && <BubbleMessageUI data={(msg as any).bubbleMessage} />}
                      {msg.theqooPost && <TheqooPostUI post={msg.theqooPost} />}
                      {msg.currentMusicShow && isLatest && <MusicShowUI result={msg.currentMusicShow} />}
                      {msg.options && <OptionsUI options={msg.options} onSelect={(a) => handleSend(a)} disabled={isLoading} isLatest={isLatest} />}
                      {msg.content.includes('错误信息') && (
                        <button onClick={() => { let j = -1; for (let k = i-1; k >= 0; k--) { if (gameState.history[k].role === MessageRole.USER) { j = k; break; } } if (j !== -1) { const c = gameState.history[j].content; setGameState(prev => ({ ...prev, history: prev.history.slice(0, i) })); handleSend(c); } }}
                          className="mt-3 flex items-center gap-2 text-xs font-black text-[#C4936A] uppercase bg-white/50 px-3 py-2 rounded-xl border border-[#EAE0D5]"><RefreshCw className="w-3 h-3" /> 重试</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start ml-8">
              <div className="bg-[#FAF7F2] border border-[#EAE0D5] p-4 rounded-[1.5rem] rounded-tl-none flex gap-2">
                <div className="w-2 h-2 bg-[#C4936A] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#C4936A] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#C4936A] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-[#EAE0D5] flex-shrink-0">
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="flex-1">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="输入你的行动，或选择上方选项..."
                className="w-full bg-[#FAF7F2] border border-[#EAE0D5] rounded-3xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#C4936A] resize-none h-14 custom-scrollbar outline-none text-[#3D2B1F]"
                disabled={isLoading} />
            </div>
            <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-[#C4936A] text-white px-5 rounded-3xl active:scale-95 disabled:opacity-50 flex-shrink-0 hover:bg-[#A0663A] transition-all"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap');
        * { font-family: 'Noto Sans SC', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #EAE0D5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #C4936A; }
        .markdown-container h1,.markdown-container h2,.markdown-container h3 { font-weight: 800; margin-bottom: 0.5rem; color: inherit; }
        .markdown-container h1 { font-size: 1.2rem; } .markdown-container h2 { font-size: 1.05rem; }
        .markdown-container p { margin-bottom: 0.6rem; } .markdown-container p:last-child { margin-bottom: 0; }
        .markdown-container ul,.markdown-container ol { margin-left: 1.5rem; margin-bottom: 0.6rem; }
        .markdown-container ul { list-style-type: disc; } .markdown-container ol { list-style-type: decimal; }
        .markdown-container blockquote { border-left: 3px solid #EAE0D5; padding-left: 0.75rem; color: #A0663A; margin: 0.75rem 0; }
        .markdown-container strong { font-weight: 900; color: #C4936A; }
        .markdown-container hr { border: none; border-top: 1px solid #EAE0D5; margin: 1rem 0; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}

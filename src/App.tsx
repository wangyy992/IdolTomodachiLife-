import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, Info, Users, Eye, MapPin, Gamepad2, Heart, Shield, Zap, Coins, TrendingUp, Sparkles, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  GameState, 
  INITIAL_MEMBERS, 
  ChatMessage, 
  MessageRole,
  Member,
  TheqooPost,
  SetupStep,
  GameMode,
  StoryPace
} from './types';
import { callGeminiAPI } from './geminiService';
 
const LOCAL_STORAGE_KEY = 'star_reality_kpop_game_state';
 
function isCardBelongsToTargets(card: any, targetIds: string[]): boolean {
  if (!card || !targetIds || targetIds.length === 0) return false;
  const targetMembers = INITIAL_MEMBERS.filter(m => targetIds.includes(m.id));
  const allowedNames = new Set<string>();
  targetMembers.forEach(m => {
    allowedNames.add(m.id.toLowerCase());
    allowedNames.add(m.name.toLowerCase());
    allowedNames.add(m.stageName.toLowerCase());
    allowedNames.add(m.name.replace(/\s/g, '').toLowerCase());
    allowedNames.add(m.stageName.replace(/\s/g, '').toLowerCase());
  });
  const cardName = (card.name || '').toLowerCase().replace(/\s/g, '');
  const cardStageName = (card.stageName || '').toLowerCase().replace(/\s/g, '');
  for (const allowed of allowedNames) {
    const clean = allowed.replace(/\s/g, '');
    if (clean && (cardName.includes(clean) || clean.includes(cardName) || cardStageName.includes(clean) || clean.includes(cardStageName))) return true;
  }
  return false;
}
 
// ============================================================
// KKT 私信 UI（Kakao Talk 风格）
// ============================================================
const KKTMessageUI = ({ data }: { data: any }) => (
  <div className="my-6 max-w-xs mx-auto font-sans">
    {/* 手机壳 */}
    <div className="relative bg-[#1A1A1A] rounded-[2.5rem] p-3 shadow-2xl">
      {/* 顶部摄像头 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#111] rounded-full flex items-center justify-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#333]"></div>
        <div className="w-3 h-3 rounded-full bg-[#2a2a2a] border border-[#444]"></div>
      </div>
      {/* 屏幕 */}
      <div className="bg-[#F5F0EA] rounded-[2rem] overflow-hidden mt-4">
        {/* 状态栏 */}
        <div className="bg-[#F5F0EA] px-5 pt-3 pb-1 flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-500">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-2 border border-gray-400 rounded-sm relative"><div className="absolute inset-0.5 bg-gray-400 rounded-sm"></div></div>
          </div>
        </div>
        {/* 顶部导航 */}
        <div className="bg-[#FAE100] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-lg">{data.avatar || '👤'}</div>
          <div>
            <div className="text-[13px] font-black text-[#3A1F00]">{data.sender}</div>
            <div className="text-[9px] text-[#3A1F00]/60 font-medium">카카오톡</div>
          </div>
        </div>
        {/* 消息区 */}
        <div className="px-4 py-4 space-y-3 min-h-[120px] bg-[#B2C7D9]/20">
          <div className="text-center text-[9px] text-gray-400 font-medium py-1">오늘 · Today</div>
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
        {/* 输入框 */}
        <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-gray-100">
          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-[10px] text-gray-400">메시지 입력 · 输入消息</div>
          <div className="w-7 h-7 rounded-full bg-[#FAE100] flex items-center justify-center">
            <Send className="w-3 h-3 text-[#3A1F00]" />
          </div>
        </div>
        {/* 底部 home 指示器 */}
        <div className="bg-white pb-2 flex justify-center">
          <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
    {/* 标签 */}
    <div className="text-center mt-3">
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">KakaoTalk · 새 메시지</span>
    </div>
  </div>
);
 
// ============================================================
// Weverse 帖子 UI
// ============================================================
const WeversePostUI = ({ data }: { data: any }) => (
  <div className="my-6 max-w-sm mx-auto font-sans">
    <div className="bg-[#0D0D0D] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
      {/* 顶部导航 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#7B2FBE] flex items-center justify-center">
            <span className="text-[8px] font-black text-white">W</span>
          </div>
          <span className="text-white text-[11px] font-black tracking-wide">Weverse</span>
        </div>
        <div className="flex gap-3">
          <div className="w-4 h-4 rounded-full bg-white/10"></div>
          <div className="w-4 h-4 rounded-full bg-white/10"></div>
        </div>
      </div>
      {/* 发帖人信息 */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D2FF] to-[#7B2FBE] flex items-center justify-center">
          <span className="text-white font-black text-sm">{data.artist?.[0] || '★'}</span>
        </div>
        <div>
          <div className="text-white text-[13px] font-black">{data.artist}</div>
          <div className="text-white/40 text-[10px] font-medium">{data.group} · {data.time}</div>
        </div>
        <div className="ml-auto bg-gradient-to-r from-[#00D2FF] to-[#7B2FBE] text-white text-[9px] font-black px-2 py-0.5 rounded-full">ARTIST</div>
      </div>
      {/* 帖子内容 */}
      <div className="px-4 py-3">
        <p className="text-white/90 text-[13px] leading-relaxed font-medium">{data.content}</p>
        {data.imageDesc && (
          <div className="mt-3 bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded bg-white/20"></div>
              <span className="text-white/40 text-[9px] font-bold uppercase">Photo</span>
            </div>
            <p className="text-white/50 text-[11px] italic">{data.imageDesc}</p>
          </div>
        )}
      </div>
      {/* 互动栏 */}
      <div className="px-4 pb-4 flex items-center gap-4 border-t border-white/5 pt-3">
        <button className="flex items-center gap-1.5 text-white/40 hover:text-[#FF4D6D] transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-[11px] font-bold">{(data.likes || 0).toLocaleString()}</span>
        </button>
        <button className="flex items-center gap-1.5 text-white/40 hover:text-[#00D2FF] transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-[11px] font-bold">{(data.comments || 0).toLocaleString()}</span>
        </button>
        <div className="ml-auto text-[9px] text-white/20 font-medium uppercase tracking-widest">weverse</div>
      </div>
    </div>
  </div>
);
 
// ============================================================
// Bubble 私信 UI（爱豆专属消息）
// ============================================================
const BubbleMessageUI = ({ data }: { data: any }) => (
  <div className="my-6 max-w-xs mx-auto font-sans">
    <div className="relative">
      {/* 背景光晕 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-xl"></div>
      <div className="relative bg-[#1C1033] rounded-[2.5rem] overflow-hidden shadow-2xl border border-purple-500/20">
        {/* 顶부 */}
        <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-white/5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white font-black">{data.artist?.[0] || '★'}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1C1033]"></div>
          </div>
          <div>
            <div className="text-white text-[13px] font-black">{data.artist}</div>
            <div className="text-purple-300/60 text-[9px] font-medium">{data.group} · bubble</div>
          </div>
          <div className="ml-auto">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            </div>
          </div>
        </div>
        {/* 消息 */}
        <div className="px-4 py-4 space-y-3 min-h-[100px]">
          {data.messages?.map((msg: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/20 rounded-2xl rounded-tl-none px-4 py-3 border border-purple-500/20 max-w-[85%]">
                <p className="text-white/90 text-[12px] leading-relaxed font-medium">{msg.text}</p>
                {msg.hasImage && <div className="mt-2 bg-white/10 rounded-xl h-16 flex items-center justify-center"><span className="text-white/30 text-[9px]">📷 이미지 · 图片</span></div>}
              </div>
              <div className="flex items-center gap-1 pl-1">
                <span className="text-[9px] text-purple-300/40">{msg.time}</span>
                <CheckCheck className="w-3 h-3 text-purple-400/60" />
              </div>
            </div>
          ))}
        </div>
        {/* 底部 */}
        <div className="px-4 pb-4 pt-2 border-t border-white/5">
          <div className="bg-white/5 rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-[10px] flex-1">답장하기 · 回复...</span>
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Send className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="text-center mt-3">
      <span className="text-[10px] text-purple-400/60 font-bold uppercase tracking-widest">bubble · 프라이빗 메시지</span>
    </div>
  </div>
);
 
const AttributeBar = ({ label, value, max = 100, color = "#FF8DA1", icon: Icon }: any) => {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
        <span className="flex items-center gap-1">{Icon && <Icon className="w-3 h-3" />} {label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
};
 
const StatusSnapshotUI = ({ members, playerMood, playerMoney, turnCount, currentScene, groupHeats, onAction, hasContributed }: any) => (
  <div className="bg-white border-2 border-[#FFB7C5] rounded-3xl p-5 my-6 shadow-sm font-sans space-y-4 max-w-lg mx-auto">
    <div className="flex justify-between items-center border-b border-[#FFF0F3] pb-3">
      <div className="text-xs font-black text-[#FF8DA1] uppercase tracking-widest">第 {turnCount} 周 | {currentScene}</div>
      <div className="text-[10px] bg-[#FFF5F6] text-[#FFB7C5] px-2 py-0.5 rounded-full font-bold">WEEKLY REPORT</div>
    </div>
    <div className="space-y-6">
      {members.map((member: any) => (
        <div key={member.id} className="space-y-3 pt-2 border-t first:border-t-0 border-gray-50">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Target: {member.name} ({member.status})</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AttributeBar label="好感度" value={member.affection || 0} icon={Heart} />
            <AttributeBar label="事业压力" value={member.careerPressure || 50} color="#F87171" icon={Zap} />
          </div>
        </div>
      ))}
    </div>
    {groupHeats && groupHeats.length > 1 && (
      <div className="pt-4 border-t border-dashed border-[#FFF0F3] space-y-4">
        <div className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-widest">本期回归竞争格局</div>
        <div className="space-y-2">
          {groupHeats.map((gh: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
                <span>[{gh.name}]</span><span>{gh.heat}</span>
              </div>
              <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${gh.heat}%` }} className={`h-full rounded-full ${gh.isPlayerTarget ? 'bg-[#FF8DA1]' : 'bg-[#FFB7C5]'}`} />
              </div>
            </div>
          ))}
        </div>
        {!hasContributed && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => onAction('buy_album')} className="flex flex-col items-center p-3 bg-white border border-[#FFE4E9] rounded-2xl hover:bg-[#FFF5F6] transition-all group">
              <div className="text-[10px] font-black text-[#FF8DA1] mb-1">批量购买专辑</div>
              <div className="text-[8px] text-gray-400">提高销量分 (需 ₩ 30万)</div>
            </button>
            <button onClick={() => onAction('vote')} className="flex flex-col items-center p-3 bg-white border border-[#FFE4E9] rounded-2xl hover:bg-[#FFF5F6] transition-all group">
              <div className="text-[10px] font-black text-[#FFB7C5] mb-1">参与事前投票</div>
              <div className="text-[8px] text-gray-400">提高投票分 (₩ 5万)</div>
            </button>
          </div>
        )}
      </div>
    )}
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-[#FFF0F3]">
      <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#FFB7C5]" /><div><div className="text-[9px] text-gray-400 font-bold uppercase">心情值</div><div className="text-xs font-bold text-gray-700">{playerMood}%</div></div></div>
      <div className="flex items-center gap-2"><Coins className="w-4 h-4 text-[#FFB7C5]" /><div><div className="text-[9px] text-gray-400 font-bold uppercase">金钱</div><div className="text-xs font-bold text-gray-700">₩ {playerMoney?.toLocaleString()}</div></div></div>
    </div>
  </div>
);
 
const TheqooPostUI = ({ post }: { post: TheqooPost }) => (
  <div className="bg-[#F2F2F2] border border-gray-200 rounded-3xl overflow-hidden shadow-2xl my-8 max-w-lg mx-auto font-sans">
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
        <h2 className="text-xl font-bold leading-tight text-gray-900 mb-3">{post.title}</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400">
          <span className="text-[#D32F2F] font-black">{post.category}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {(post.viewsCount || 0).toLocaleString()}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {(post.likesCount || 0).toLocaleString()}</span>
          <span className="font-bold text-gray-600 italic">Comments {post.commentsCount || 0}</span>
        </div>
      </div>
      <div className="divide-y divide-[#F8F8F8]">
        {post.comments.slice(0, 8).map((comment, idx) => (
          <div key={idx} className="p-5 bg-white hover:bg-[#FFFBFC] transition-colors">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 font-black text-xs border border-gray-100">{idx + 1}</div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black text-gray-400">@{comment.authorId}</span><span className="text-[9px] text-gray-300 italic">2m ago</span></div>
                <p className="text-sm font-bold text-gray-800 leading-relaxed">{comment.content}</p>
                <div className="bg-[#F9FAFB] p-2 rounded-lg border-l-2 border-[#FFB7C5]"><p className="text-[11px] text-gray-500 italic">{comment.translation}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
        <button className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-widest">View all {post.commentsCount} comments</button>
      </div>
    </div>
  </div>
);
 
const CharacterCardUI = ({ card }: any) => {
  if (!card || typeof card !== 'object') return null;
  const name = card.name || card.stageName || '未知角色';
  const stageName = card.stageName || '';
  const group = card.group || '未知团体';
  const status = card.status || '活跃中';
  const persona = card.publicPersona || '暂无信息';
  const personality = card.realPersonality || card.personality || '暂无信息';
  const traits = card.weaknesses || card.traits || [];
  const story = card.hiddenStory || card.story;
  return (
    <div className="bg-white border-2 border-[#FFB7C5] rounded-3xl overflow-hidden shadow-lg my-6 max-w-md mx-auto font-sans">
      <div className="bg-gradient-to-r from-[#FF8DA1] to-[#FFB7C5] p-5 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles className="w-12 h-12" /></div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80 italic">Artist Profile</div>
        <h3 className="text-xl font-bold tracking-widest">{name} {stageName ? `(${stageName})` : ''}</h3>
      </div>
      <div className="p-6 space-y-5 text-left">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-[#FFF5F6] p-3 rounded-2xl border border-[#FFE4E9]"><div className="text-[#FFB7C5] font-black mb-1 uppercase text-[9px]">Group</div><div className="font-bold text-gray-700">{group}</div></div>
          <div className="bg-[#FFF5F6] p-3 rounded-2xl border border-[#FFE4E9]"><div className="text-[#FFB7C5] font-black mb-1 uppercase text-[9px]">Status</div><div className="font-bold text-gray-700">{status}</div></div>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs"><span className="font-black text-[#FF8DA1] block uppercase text-[9px] mb-2">Public Persona</span><p className="text-gray-600 italic">"{persona}"</p></div>
          <div className="bg-[#FFF9FA] p-4 rounded-2xl border border-[#FFE4E9] text-xs"><span className="font-black text-[#FFB7C5] block uppercase text-[9px] mb-2">Real Personality</span><p className="text-gray-700">{personality}</p></div>
        </div>
        {Array.isArray(traits) && traits.length > 0 && (
          <div className="space-y-2">
            <div className="text-[#FF8DA1] text-[9px] font-black uppercase tracking-widest px-1">Traits</div>
            <div className="flex flex-wrap gap-2">{traits.map((item: string, i: number) => <span key={i} className="text-[10px] px-3 py-1 bg-red-50 text-red-500 rounded-full border border-red-100 font-bold"># {item}</span>)}</div>
          </div>
        )}
        {story && <div className="pt-2 border-t border-dashed border-[#FFE4E9]"><span className="font-black text-[#FFB7C5] block uppercase text-[9px] mb-1 italic">Hidden Story</span><p className="text-[11px] text-gray-400 italic">{story}</p></div>}
      </div>
    </div>
  );
};
 
const OptionsUI = ({ options, onSelect, disabled, isLatest }: { options: any[], onSelect: (a: string) => void, disabled: boolean, isLatest: boolean }) => {
  if (!isLatest) return null;
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      {options.map((opt: any, i) => {
        const text = typeof opt === 'string' ? opt : opt.text;
        const action = typeof opt === 'string' ? opt : opt.action;
        return <button key={i} onClick={() => onSelect(action)} disabled={disabled} className="px-8 py-4 bg-[#FF8DA1] text-white font-black rounded-3xl hover:bg-[#FFB7C5] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-sm shadow-xl">{text}</button>;
      })}
    </div>
  );
};
 
const ComebackSetupUI = ({ targetGroup, onConfirm, disabled }: { targetGroup: string, onConfirm: (groups: string[]) => void, disabled: boolean }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const competitors = ['ILLIT', 'LSF', 'ITZY', 'NMIXX', 'aespa', 'IVE', 'YENA', 'EUNBI'].filter(c => c !== targetGroup);
  return (
    <div className="bg-white border-2 border-dashed border-[#FFB7C5] rounded-[2rem] p-6 my-6 shadow-xl max-w-lg mx-auto font-sans">
      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-center mb-2"><div className="h-px bg-[#FFB7C5] w-8" /><div className="text-[10px] font-black text-[#FF8DA1] tracking-widest uppercase italic">Comeback Season Planning</div><div className="h-px bg-[#FFB7C5] w-8" /></div>
        <h3 className="text-base font-black text-gray-800 text-center leading-tight">回归预告！<span className="text-[#FF8DA1] px-1 underline decoration-wavy decoration-[#FFB7C5]">{targetGroup}</span> 确定了回归日期。<br/><span className="text-xs text-gray-400">请确认本期竞争对手 (多选)：</span></h3>
        <div className="grid grid-cols-2 gap-2 py-4">
          {competitors.map(c => (
            <button key={c} onClick={() => setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${selected.includes(c) ? 'bg-[#FF8DA1] border-[#FF8DA1] text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-[#FFB7C5]'}`}>
              <span className="text-[11px] font-black">{c}</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected.includes(c) ? 'border-white' : 'border-gray-100'}`}>{selected.includes(c) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}</div>
            </button>
          ))}
        </div>
        <button onClick={() => onConfirm(selected)} disabled={disabled || selected.length === 0} className="w-full bg-[#FF8DA1] text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl disabled:opacity-50 active:scale-95 transition-all uppercase">确认格局 & 开始制作</button>
      </div>
    </div>
  );
};
 
const MusicShowUI = ({ result }: { result: any }) => (
  <div className="bg-white border-2 border-[#FFB7C5] rounded-[2rem] overflow-hidden shadow-2xl my-8 max-w-lg mx-auto font-sans">
    <div className="bg-gradient-to-r from-[#FF8DA1] to-[#FFB7C5] p-6 text-white text-center relative">
      <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">The Show / Music Bank / Inkigayo</div>
      <h3 className="text-xl font-black tracking-widest italic">WEEKLY CHAMPION</h3>
      <div className="absolute top-2 right-4 opacity-30"><Sparkles className="w-8 h-8" /></div>
    </div>
    <div className="p-6 space-y-6">
      <div className="flex flex-col items-center py-4 bg-[#FFF5F6] rounded-3xl border border-[#FFE4E9]">
        <div className="text-[10px] font-black text-[#FFB7C5] uppercase mb-1">本次优胜 / Winner</div>
        <div className="text-2xl font-black text-gray-800">{result.winner}</div>
        <div className="mt-2 flex gap-1">{[1,2,3].map(i => <Sparkles key={i} className="w-4 h-4 text-[#FF8DA1] animate-pulse" />)}</div>
      </div>
      <div className="space-y-4">
        {result.scores.map((score: any, idx: number) => (
          <div key={idx} className={`p-4 rounded-2xl border ${score.group === result.winner ? 'bg-red-50 border-[#FFB7C5]' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-center mb-3"><span className="font-bold text-sm">{score.group}</span><span className="font-black text-[#FF8DA1] text-sm">{score.total} pt</span></div>
            <div className="grid grid-cols-5 gap-1">
              {['digital','physical','sns','preVote','broadcast'].map((key, i) => (
                <div key={i} className="text-center"><div className="text-[8px] text-gray-400 font-bold uppercase truncate">{['音源','销量','SNS','投票','放送'][i]}</div><div className="text-[10px] font-bold text-gray-600">{score[key]}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
 
const CharacterCreationWizard = ({ onComplete, onReset, members }: { onComplete: (data: any) => void, onReset: () => void, members: Member[] }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ playerName: '', playerAge: 19, identity: [] as string[], gameMode: GameMode.ROMANCE, storyPace: StoryPace.STANDARD, targets: [] as string[], selectedCPs: [] as string[] });
  const ids = ["韩国留学生","便利店 / 咖啡厅打工人","娱乐公司实习生","音乐节目工作人员","妆造师 / 发型助理","翻译 / 海外商务助理","娱乐记者 / 博主","普通粉丝","资深粉丝","公寓同栋住户"];
  const paces = [{ id: StoryPace.SLOW, name: '慢热现实向' },{ id: StoryPace.STANDARD, name: '标准韩剧向' },{ id: StoryPace.HIGH_PRESSURE, name: '高压舆论向' },{ id: StoryPace.HEALING, name: '日常治愈向' }];
  const modes = [{ id: GameMode.ROMANCE, name: '攻略模式', desc: '与爱豆展开情感拉扯。' },{ id: GameMode.MIXED, name: '混合模式', desc: '攻略 + 促成团内 CP。' },{ id: GameMode.OBSERVER, name: '纯旁观模式', desc: '路人/工作人员视角。' }];
  const availableCPs = ["Yunah x Minju (玧柱)","Wonhee x Iroha (沅羽)","Moka x Minju (萌柱)","Karina x Winter (柚冬)","Chaewon x Sakura (采樱)","Kazuha x Yunjin (叶真)","Wonyoung x Yujin (双塔)","Yeji x Ryujin (礼真)"];
  return (
    <div className="min-h-screen bg-[#FDF7F8] flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-2 border-[#FFB7C5] rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        <div className="bg-[#FFB7C5] p-8 text-white text-center relative">
          <button onClick={onReset} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full"><RefreshCw className="w-4 h-4" /></button>
          <h2 className="text-2xl font-bold tracking-widest mb-1">爱豆收集梦想生活 · 角色创建</h2>
          <p className="text-xs opacity-80">Step {step} of 4</p>
        </div>
        <div className="p-10 flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2"><label className="text-xs font-black text-[#FFB7C5] uppercase">你的名字</label><input type="text" value={data.playerName} onChange={e => setData({...data, playerName: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#FFB7C5]" placeholder="请输入角色昵称..." /></div>
                <div className="space-y-2"><label className="text-xs font-black text-[#FFB7C5] uppercase">年龄</label><input type="number" value={data.playerAge} onChange={e => setData({...data, playerAge: parseInt(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#FFB7C5]" /></div>
                <button onClick={() => setStep(2)} disabled={!data.playerName} className="w-full bg-[#FF8DA1] text-white py-4 rounded-2xl font-bold shadow-xl disabled:opacity-50">继续</button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <label className="text-xs font-black text-[#FFB7C5] uppercase">选择你的身份 (可多选)</label>
                <div className="grid grid-cols-2 gap-2">{ids.map(i => <button key={i} onClick={() => setData({...data, identity: data.identity.includes(i) ? data.identity.filter(x => x !== i) : [...data.identity, i]})} className={`p-3 rounded-xl border text-[11px] transition-all ${data.identity.includes(i) ? 'bg-[#FFF5F6] border-[#FFB7C5] text-[#FF8DA1] font-bold' : 'bg-white border-gray-100 text-gray-500'}`}>{i}</button>)}</div>
                <div className="pt-2"><input type="text" placeholder="或者手动输入自定义身份..." className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-[11px] focus:ring-1 focus:ring-[#FFB7C5] outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value.trim(); if (val && !data.identity.includes(val)) { setData({...data, identity: [...data.identity, val]}); (e.target as HTMLInputElement).value = ''; } e.preventDefault(); } }} /><p className="text-[9px] text-gray-400 mt-1 pl-1">输入后按回车添加</p></div>
                <button onClick={() => setStep(3)} disabled={data.identity.length === 0} className="w-full bg-[#FF8DA1] text-white py-4 rounded-2xl font-bold shadow-xl disabled:opacity-50">继续</button>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <label className="text-xs font-black text-[#FFB7C5] uppercase">选择模式与节奏</label>
                <div className="space-y-3">{modes.map(m => <button key={m.id} onClick={() => { const nd: any = { ...data, gameMode: m.id }; if (m.id === GameMode.OBSERVER) nd.targets = []; setData(nd); }} className={`w-full p-4 rounded-2xl border text-left transition-all ${data.gameMode === m.id ? 'bg-[#FFF5F6] border-[#FFB7C5] text-[#FF8DA1]' : 'bg-white border-gray-100'}`}><div className="font-bold text-sm">{m.name}</div><div className="text-[10px] opacity-60 mt-1">{m.desc}</div></button>)}</div>
                <div className="grid grid-cols-2 gap-2">{paces.map(p => <button key={p.id} onClick={() => setData({...data, storyPace: p.id})} className={`p-3 rounded-xl border text-[10px] transition-all ${data.storyPace === p.id ? 'bg-[#FFF5F6] border-[#FFB7C5] text-[#FF8DA1] font-bold' : 'bg-white border-gray-100 text-gray-400'}`}>{p.name}</button>)}</div>
                <button onClick={() => setStep(4)} className="w-full bg-[#FF8DA1] text-white py-4 rounded-2xl font-bold shadow-xl">下一步</button>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                {data.gameMode !== GameMode.OBSERVER && (
                  <div className="space-y-4">
                    <label className="text-xs font-black text-[#FFB7C5] uppercase">关注/攻略对象 (可多选)</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">{members.map(m => <button key={m.id} onClick={() => setData({...data, targets: data.targets.includes(m.id) ? data.targets.filter(x => x !== m.id) : [...data.targets, m.id]})} className={`p-4 rounded-2xl border text-[11px] transition-all flex flex-col items-center gap-1 ${data.targets.includes(m.id) ? 'bg-[#FFF5F6] border-[#FFB7C5] text-[#FF8DA1] font-bold' : 'bg-white border-gray-100 text-gray-500 hover:border-[#FFB7C5]'}`}><div className="font-black text-xs">{m.name}</div><div className="text-[8px] opacity-60 uppercase">{m.group}</div></button>)}</div>
                  </div>
                )}
                {data.gameMode === GameMode.MIXED && (
                  <div className="space-y-4 pt-4 border-t border-[#FFF0F3]">
                    <label className="text-xs font-black text-[#FFB7C5] uppercase">选择你想磕的 CP (可选)</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">{availableCPs.map(cp => <button key={cp} onClick={() => setData({...data, selectedCPs: data.selectedCPs.includes(cp) ? data.selectedCPs.filter(x => x !== cp) : [...data.selectedCPs, cp]})} className={`p-2 rounded-xl border text-[10px] transition-all ${data.selectedCPs.includes(cp) ? 'bg-purple-50 border-purple-200 text-purple-500 font-bold' : 'bg-white border-gray-100 text-gray-400'}`}>{cp}</button>)}</div>
                  </div>
                )}
                {data.gameMode === GameMode.OBSERVER && (<div className="p-8 text-center bg-gray-50 rounded-[2rem] space-y-4"><Info className="w-8 h-8 text-gray-300 mx-auto" /><p className="text-xs text-gray-400 leading-relaxed">在旁观模式下，您无需选择特定目标。<br/>故事将以全景视角展开。</p></div>)}
                <button onClick={() => onComplete(data)} className="w-full bg-[#FF8DA1] text-white py-4 rounded-2xl font-bold shadow-xl">开启职业追星之旅</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
 
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
  const chatEndRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState)); }, [gameState]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [gameState.history]);
  useEffect(() => { setApiKeyMissing(!import.meta.env.VITE_DEEPSEEK_API_KEY); }, []);
 
  const handleCreationComplete = (data: any) => {
    const targetNames = INITIAL_MEMBERS.filter(m => data.targets.includes(m.id)).map(m => m.name);
    const summary = `我的名字是 ${data.playerName}，身份是 ${data.identity.join(', ')}。我想关注 ${targetNames.join(', ')}。游戏模式：${data.gameMode}，节奏：${data.storyPace}。故事开始。`;
    const newState: GameState = { ...gameState, ...data, setupStep: SetupStep.CARDS, history: [] };
    setGameState(newState);
    handleAIStep(summary, newState);
  };
 
  const handleAIStep = async (userContent: string, stateToUse: GameState) => {
    try {
      const response = await Promise.race([
        callGeminiAPI(stateToUse.history.slice(-10), stateToUse),
        new Promise((_, reject) => setTimeout(() => reject(new Error("通讯超时 (60s)，请重试。")), 60000))
      ]) as string;
      processAIResponse(response, stateToUse);
    } catch(e) {
      setGameState(prev => ({ ...prev, history: [...prev.history, { role: MessageRole.ASSISTANT, content: `抱歉，出现错误。\n错误信息: ${e instanceof Error ? e.message : String(e)}`, timestamp: Date.now() }] }));
    } finally { setIsLoading(false); }
  };
 
  const handleReset = () => setShowConfirmReset(true);
  const executeReset = () => { localStorage.removeItem(LOCAL_STORAGE_KEY); setShowConfirmReset(false); setGameState(getInitialGameState()); setInput(''); setIsLoading(false); };
 
  const processAIResponse = (response: string, stateAtCall: GameState) => {
    console.log("=== AI RAW RESPONSE ===\n", response);
    let displayContent = response;
    let theqooPost: any, snapshot: any, musicResult: any = null;
    let kktMessage: any = null, weversePost: any = null, bubbleMessage: any = null;
    let cards: any[] = [], options: any[] = [];
    const currentStep = stateAtCall.setupStep;
 
    const extractTag = (tagName: string): string | null => {
      const patterns = [
        new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i'),
        new RegExp(`\\(${tagName}\\)([\\s\\S]*?)\\(\\/\\s*${tagName}\\)`, 'i'),
        new RegExp(`\\[${tagName}\\]([\\s\\S]*?)\\[\\/\\s*${tagName}\\]`, 'i'),
      ];
      for (const p of patterns) {
        const m = displayContent.match(p);
        if (m) { displayContent = displayContent.replace(m[0], ''); return m[1]; }
      }
      if (['state_snapshot','theqoo_post','character_card','music_show','kkt_message','weverse_post','bubble_message'].includes(tagName)) {
        const tagIdx = displayContent.toLowerCase().indexOf(tagName.toLowerCase());
        if (tagIdx !== -1) {
          const firstBrace = displayContent.indexOf('{', tagIdx + tagName.length);
          if (firstBrace !== -1 && firstBrace - tagIdx < 150) {
            let depth = 0, end = -1;
            for (let i = firstBrace; i < displayContent.length; i++) {
              if (displayContent[i] === '{') depth++;
              else if (displayContent[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
            }
            if (end !== -1) {
              const j = displayContent.slice(firstBrace, end + 1);
              displayContent = displayContent.replace(j, '');
              return j;
            }
          }
        }
      }
      if (tagName === 'options') {
        const arrayMatch = displayContent.match(/\[[\s\S]*?\]/);
        if (arrayMatch && displayContent.toLowerCase().includes('options')) {
          displayContent = displayContent.replace(arrayMatch[0], '');
          return arrayMatch[0];
        }
        const listMatch = displayContent.match(/\(options\)([\s\S]*?)\(\/options\)/i);
        if (listMatch) {
          const lines = listMatch[1].split('\n')
            .map((l: string) => l.replace(/^\s*\d+[\.\、]\s*/, '').trim())
            .filter((l: string) => l.length > 0);
          if (lines.length > 0) {
            displayContent = displayContent.replace(listMatch[0], '');
            return JSON.stringify(lines);
          }
        }
      }
      return null;
    };
    
 
    const snapshotStr = extractTag('state_snapshot');
    if (snapshotStr) { try { snapshot = JSON.parse(snapshotStr); } catch(e) {} }
 
    const theqooStr = extractTag('theqoo_post');
    if (theqooStr) { try { theqooPost = JSON.parse(theqooStr); } catch(e) {} }
 
    const musicStr = extractTag('music_show');
    if (musicStr) { try { musicResult = JSON.parse(musicStr); } catch(e) {} }
 
    // 新增：提取 KKT、Weverse、Bubble
    const kktStr = extractTag('kkt_message');
    if (kktStr) { try { kktMessage = JSON.parse(kktStr); } catch(e) {} }
 
    const weverseStr = extractTag('weverse_post');
    if (weverseStr) { try { weversePost = JSON.parse(weverseStr); } catch(e) {} }
 
    const bubbleStr = extractTag('bubble_message');
    if (bubbleStr) { try { bubbleMessage = JSON.parse(bubbleStr); } catch(e) {} }

    console.log("[Debug] raw options string:", optionsStr);
    console.log("[Debug] full AI response:", response.substring(0, 500));
    
    const optionsStr = extractTag('options');
    if (optionsStr) { try { const parsed = JSON.parse(optionsStr); if (Array.isArray(parsed)) options = parsed.map(o => typeof o === 'string' ? { text: o, action: o } : o); } catch(e) {} }
 
    const isInitialCardStep = currentStep === SetupStep.CARDS;
    const rawCards: any[] = [];
    const cardPatterns = [/<character_card>([\s\S]*?)<\/character_card>/gi, /\(character_card\)([\s\S]*?)\(\/character_card\)/gi];
    for (const pattern of cardPatterns) { let match; while ((match = pattern.exec(response)) !== null) { try { rawCards.push(JSON.parse(match[1])); displayContent = displayContent.replace(match[0], ''); } catch(e) {} } }
    if (rawCards.length === 0) { const cardStr = extractTag('character_card'); if (cardStr) { try { rawCards.push(JSON.parse(cardStr)); } catch(e) {} } }
    cards = rawCards.filter(card => isInitialCardStep ? true : isCardBelongsToTargets(card, stateAtCall.targets));
 
    if (options.length === 0 && currentStep !== SetupStep.CREATION) {
  if (currentStep === SetupStep.CARDS) {
    options = [{ text: "开始我的制作人生活", action: "开始我的制作人生活" }];
  }
  // 正式游戏阶段不再兜底，让 AI 重新生成
}
 
    displayContent = displayContent.replace(/```json[\s\S]*?```/g, '').replace(/```[\s\S]*?```/g, m => (m.includes('{') || m.includes('[')) ? '' : m).trim();
 
    setGameState(prev => {
      let next = { ...prev };
      const isWeekEnd = snapshot?.isWeekEnd === true;
      if (snapshot) {
        next = { ...next,
          playerMood: snapshot.playerMood ?? next.playerMood,
          playerMoney: snapshot.playerMoney ?? next.playerMoney,
          currentScene: snapshot.currentScene ?? next.currentScene,
          turnCount: snapshot.weekCount ?? next.turnCount,
          hiddenSummary: snapshot.hiddenSummary ?? next.hiddenSummary,
          isComebackSetting: snapshot.isComebackSetting ?? false,
          groupHeats: snapshot.groupHeats ?? next.groupHeats,
          currentMusicShow: musicResult || snapshot.currentMusicShow || next.currentMusicShow,
          playerImpact: snapshot.playerImpact ?? { albumImpact: 0, voteImpact: 0 },
          hasContributedThisWeek: snapshot.hasContributedThisWeek ?? next.hasContributedThisWeek,
          members: next.members.map(m => { const u = snapshot.members?.find((sm: any) => sm.id === m.id); return u ? { ...m, ...u } : m; })
        };
      }
      if (musicResult) next.musicShowHistory = [...(next.musicShowHistory || []), musicResult];
      if (cards.length > 0) { const existingNames = (next.collectedCards || []).map((c: any) => c.name); next.collectedCards = [...(next.collectedCards || []), ...cards.filter(c => c?.name && !existingNames.includes(c.name))]; }
      if (cards.length > 0 && prev.setupStep === SetupStep.CARDS) next.setupStep = SetupStep.STARTED;
      const isComebackSetup = snapshot?.isComebackSetting || false;
      return {
        ...next,
        history: [...next.history, {
          role: MessageRole.ASSISTANT,
          content: isComebackSetup ? "🚨 回归期确认！即将开启新一轮打歌活动，请先确定本期的竞争格局。" : ((displayContent && displayContent.trim()) || (cards.length > 0 ? "（剧情准备就绪）" : "（剧情推进中...）")),
          timestamp: Date.now(),
          theqooPost,
          cardData: cards.length > 0 ? cards : undefined,
          currentMusicShow: musicResult || undefined,
          options: options.length > 0 ? options : undefined,
          isComebackSetup,
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
    if (textToSend && textToSend.trim()) nextState.history = [...nextState.history, { role: MessageRole.USER, content: textToSend, timestamp: Date.now() }];
    setGameState(nextState);
    await handleAIStep(textToSend, nextState);
  };
 
  if (gameState.setupStep === SetupStep.CREATION) return <CharacterCreationWizard onComplete={handleCreationComplete} onReset={executeReset} members={gameState.members} />;
 
  return (
    <div className="flex h-screen bg-[#FDF7F8] overflow-hidden relative">
      {showConfirmReset && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500"><RefreshCw className="w-12 h-12 animate-spin-slow" /></div>
            <div><h3 className="text-2xl font-black text-gray-900">确定重置吗？</h3><p className="text-sm text-gray-500 mt-4">这将永久删除所有进度，无法恢复。</p></div>
            <div className="flex flex-col gap-4 pt-2">
              <button onClick={executeReset} className="w-full py-5 bg-red-500 text-white rounded-3xl font-black text-sm shadow-2xl hover:bg-red-600 transition-all">确认重置</button>
              <button onClick={() => setShowConfirmReset(false)} className="w-full py-5 bg-gray-100 text-gray-400 rounded-3xl font-black text-sm hover:bg-gray-200 transition-all">返回</button>
            </div>
          </motion.div>
        </div>
      )}
 
      <aside className="w-80 bg-white border-r border-[#F3E5E8] flex-shrink-0 flex-col hidden lg:flex">
        <div className="p-8 border-b border-[#F3E5E8] bg-gradient-to-br from-[#FFF5F6] to-white">
          <h1 className="text-lg font-black text-[#FF8DA1] tracking-tighter flex items-center gap-2"><Gamepad2 className="w-6 h-6" /> 爱豆收集梦想生活</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] bg-[#FF8DA1] text-white px-2 py-0.5 rounded-full font-black uppercase">{gameState.gameMode === GameMode.ROMANCE ? '攻略' : gameState.gameMode === GameMode.OBSERVER ? '旁观' : '混合'}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">K-POP Text Game</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <section>
            <h3 className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-widest mb-4 flex items-center gap-2"><Heart className="w-3 h-3" /> 我的状态</h3>
            <div className="bg-[#FFF9FA] p-5 rounded-3xl border border-[#FFE4E9] space-y-4">
              <div className="flex justify-between text-xs"><span className="text-gray-400 font-bold">心情</span><span className="font-mono text-[#FF8DA1] font-bold">{gameState.playerMood}%</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-400 font-bold">金钱</span><span className="font-mono text-[#FF8DA1] font-bold">₩ {gameState.playerMoney.toLocaleString()}</span></div>
            </div>
          </section>
          {gameState.collectedCards && gameState.collectedCards.length > 0 && (
            <section>
              <h3 className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-widest mb-4 flex items-center gap-2"><Shield className="w-3 h-3" /> 收集档案 ({gameState.collectedCards.length})</h3>
              <div className="space-y-3">{gameState.collectedCards.map((card: any, idx: number) => <div key={idx} className="bg-white p-4 rounded-2xl border border-[#FFE4E9] hover:border-[#FFB7C5] transition-all"><div className="text-[10px] font-black text-[#FFB7C5] mb-1">{card.group || '独立艺人'}</div><div className="text-xs font-bold text-gray-700">{card.name}</div><div className="text-[9px] text-gray-400 mt-1">{card.status}</div></div>)}</div>
            </section>
          )}
          <section>
            <h3 className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-widest mb-4 flex items-center gap-2"><Users className="w-3 h-3" /> 角色状态</h3>
            <div className="space-y-2">{gameState.members.filter(m => gameState.targets.includes(m.id)).map(member => <div key={member.id} className="bg-white p-4 rounded-2xl border border-[#FFE4E9] hover:border-[#FFB7C5] transition-all"><div className="flex justify-between items-center mb-1"><span className="text-xs font-bold">{member.name}</span><span className="text-[10px] text-[#FF8DA1] font-mono">{member.affection}/100</span></div><div className="h-1 bg-gray-50 rounded-full overflow-hidden"><div className="h-full bg-[#FFB7C5]" style={{ width: `${member.affection}%` }} /></div></div>)}</div>
          </section>
        </div>
        <div className="p-6 border-t border-[#F3E5E8]">
          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-100 transition-all"><RefreshCw className="w-4 h-4" /> Reset Game</button>
        </div>
      </aside>
 
      <main className="flex-1 flex flex-col h-full bg-white lg:rounded-l-[3rem] lg:shadow-2xl overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#F3E5E8] px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button onClick={handleReset} className="lg:hidden p-2 text-[#FFB7C5] hover:bg-[#FFF5F6] rounded-xl"><RefreshCw className="w-4 h-4" /></button>
            <div><div className="text-[10px] text-[#FFB7C5] font-black uppercase tracking-widest mb-0.5">Current Scene</div><h2 className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FF8DA1]" /> {gameState.currentScene}</h2></div>
          </div>
          {apiKeyMissing && <div className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-1 rounded-full border border-red-100 animate-pulse">API KEY MISSING</div>}
          <div className="text-right"><div className="text-[10px] text-gray-400 font-bold uppercase">Turn</div><div className="text-sm font-bold text-[#FF8DA1]">Week {gameState.turnCount || 1}</div></div>
        </header>
 
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar bg-white">
          <AnimatePresence initial={false}>
            {gameState.history.map((msg, i) => {
              const isLatest = i === gameState.history.length - 1;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] md:max-w-2xl ${msg.role === MessageRole.USER ? 'ml-12' : 'mr-12'}`}>
                    {msg.role === MessageRole.ASSISTANT && <div className="text-[9px] font-black text-[#FFB7C5] uppercase tracking-widest ml-4 mb-3 flex items-center gap-2"><Zap className="w-3 h-3" /> NARRATIVE LOG</div>}
                    <div className={`p-6 md:p-8 rounded-[2rem] text-sm leading-relaxed markdown-container ${msg.role === MessageRole.USER ? 'bg-gradient-to-br from-[#FF8DA1] to-[#FFB7C5] text-white rounded-tr-none shadow-lg' : 'bg-[#FAFAFA] border border-[#F3E5E8] text-gray-700 rounded-tl-none font-medium'}`}>
                      <Markdown>{msg.content}</Markdown>
                      {msg.cardData && msg.cardData.map((card: any, idx: number) => <CharacterCardUI key={idx} card={card} />)}
                      {/* KKT 私信 */}
                      {(msg as any).kktMessage && <KKTMessageUI data={(msg as any).kktMessage} />}
                      {/* Weverse 帖子 */}
                      {(msg as any).weversePost && <WeversePostUI data={(msg as any).weversePost} />}
                      {/* Bubble 消息 */}
                      {(msg as any).bubbleMessage && <BubbleMessageUI data={(msg as any).bubbleMessage} />}
                      {/* Theqoo */}
                      {msg.theqooPost && <TheqooPostUI post={msg.theqooPost} />}
                      {msg.currentMusicShow && isLatest && <MusicShowUI result={msg.currentMusicShow} />}
                      {msg.isComebackSetup && isLatest && (
                        <ComebackSetupUI
                          targetGroup={gameState.members.find(m => gameState.targets.includes(m.id))?.group || '该团'}
                          onConfirm={(groups) => handleSend(`确认同期竞争团体：${groups.join(', ')}。`, { isComebackSetting: false })}
                          disabled={isLoading}
                        />
                      )}
                      {msg.options && !msg.isComebackSetup && <OptionsUI options={msg.options} onSelect={(a) => handleSend(a)} disabled={isLoading} isLatest={isLatest} />}
                      {msg.role === MessageRole.ASSISTANT && isLatest && gameState.setupStep === SetupStep.STARTED && (msg as any).isWeekEnd && (
                        <StatusSnapshotUI
                          members={gameState.members.filter(m => gameState.targets.includes(m.id))}
                          playerMood={gameState.playerMood} playerMoney={gameState.playerMoney}
                          turnCount={gameState.turnCount} currentScene={gameState.currentScene}
                          groupHeats={gameState.groupHeats} hasContributed={gameState.hasContributedThisWeek}
                          onAction={(type: string) => {
                            if (type === 'buy_album') { if (gameState.playerMoney >= 300000) handleSend("批量购买专辑，支付 30万韩元。", { playerMoney: gameState.playerMoney - 300000, hasContributedThisWeek: true }); else alert(`金钱不足。余额: ₩ ${gameState.playerMoney.toLocaleString()}`); }
                            else if (type === 'vote') { if (gameState.playerMoney >= 50000) handleSend("参与事前投票，花费 5万韩元。", { playerMoney: gameState.playerMoney - 50000, hasContributedThisWeek: true }); else alert(`金钱不足。余额: ₩ ${gameState.playerMoney.toLocaleString()}`); }
                          }}
                        />
                      )}
                      {msg.content.includes('错误信息') && (
                        <button onClick={() => { let j = -1; for (let k = i-1; k >= 0; k--) { if (gameState.history[k].role === MessageRole.USER) { j = k; break; } } if (j !== -1) { const c = gameState.history[j].content; setGameState(prev => ({ ...prev, history: prev.history.slice(0, i) })); handleSend(c); } }} className="mt-4 flex items-center gap-2 text-xs font-black text-[#FF8DA1] hover:text-[#FFB7C5] uppercase bg-white/50 px-3 py-2 rounded-xl border border-[#FFE4B5]"><RefreshCw className="w-3 h-3" /> 重试</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#FAFAFA] p-6 rounded-[2rem] rounded-tl-none flex gap-2">
                <div className="w-2 h-2 bg-[#FFB7C5] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#FFB7C5] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#FFB7C5] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
 
        <div className="p-6 md:p-8 bg-white border-t border-[#F3E5E8]">
          <div className="max-w-4xl mx-auto flex gap-4">
            <div className="flex-1">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="输入你的行动：例如 '送咖啡去剧场门口'、'在theqoo发帖'..."
                className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-sm focus:ring-2 focus:ring-[#FFB7C5] resize-none h-16 custom-scrollbar"
                disabled={isLoading} />
            </div>
            <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-[#FF8DA1] text-white p-5 rounded-3xl shadow-xl active:scale-95 disabled:opacity-50"><Send className="w-6 h-6" /></button>
          </div>
        </div>
      </main>
 
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFE4E9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FFB7C5; }
        .markdown-container h1,.markdown-container h2,.markdown-container h3 { font-weight: 800; margin-bottom: 0.5rem; color: inherit; }
        .markdown-container h1 { font-size: 1.25rem; } .markdown-container h2 { font-size: 1.1rem; }
        .markdown-container p { margin-bottom: 0.75rem; } .markdown-container p:last-child { margin-bottom: 0; }
        .markdown-container ul,.markdown-container ol { margin-left: 1.5rem; margin-bottom: 0.75rem; }
        .markdown-container ul { list-style-type: disc; } .markdown-container ol { list-style-type: decimal; }
        .markdown-container blockquote { border-left: 4px solid #FFB7C5; padding-left: 1rem; color: #999; margin: 1rem 0; }
        .markdown-container strong { font-weight: 900; color: #FF8DA1; }
        .markdown-container hr { border: none; border-top: 2px dashed #FFE4E9; margin: 1.5rem 0; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}

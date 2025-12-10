"use client";

import Image from "next/image";
import { VocabItem } from "../data/vocab";
import { useState, useEffect } from "react";

interface VocabCardProps {
  item: VocabItem;
}

export default function VocabCard({ item }: VocabCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // itemが変わったら裏返し状態をリセットし、音声をフェッチ
  useEffect(() => {
    setIsFlipped(false);
    setAudioUrl(null);

    const fetchAudio = async () => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${item.word}`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const phonetics = data[0].phonetics;
          // 音声URLがあるものを探す（USアクセントを優先）
          const usAudio = phonetics.find((p: any) => p.audio && p.audio.includes('-us.mp3'));
          const anyAudio = phonetics.find((p: any) => p.audio && p.audio !== '');
          
          if (usAudio) {
            setAudioUrl(usAudio.audio);
          } else if (anyAudio) {
            setAudioUrl(anyAudio.audio);
          }
        }
      } catch (error) {
        console.error("Failed to fetch audio:", error);
      }
    };

    fetchAudio();
  }, [item]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (audioUrl) {
      // APIから取得した音声がある場合
      const audio = new Audio(audioUrl);
      audio.play().catch(err => console.error("Audio playback failed:", err));
    } else {
      // フォールバック: Web Speech API
      const utterance = new SpeechSynthesisUtterance(item.word);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-zinc-200 dark:border-zinc-700 w-full max-w-md mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative h-64 w-full bg-zinc-100 dark:bg-zinc-700">
        <Image
          src={item.imageUrl}
          alt={item.word}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
          priority
          unoptimized={item.imageUrl.includes('pollinations.ai')}
        />
      </div>
      <div className="p-8 text-center min-h-[160px] flex flex-col justify-center items-center">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {item.word}
          </h2>
          <button
            onClick={handleSpeak}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors text-zinc-600 dark:text-zinc-300"
            aria-label="発音を聞く"
            title="発音を聞く（ネイティブ音声）"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </button>
        </div>
        
        <div className={`transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          {isFlipped && (
            <p className="text-2xl text-zinc-600 dark:text-zinc-300 font-medium">
              {item.meaning}
            </p>
          )}
        </div>
        {!isFlipped && (
            <p className="text-sm text-zinc-400 mt-4 animate-pulse">クリックして意味を表示</p>
        )}
      </div>
    </div>
  );
}

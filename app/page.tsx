"use client";

import { useState } from "react";
import { vocabList, VocabItem } from "./data/vocab";
import VocabCard from "./components/VocabCard";
import { handleSignOut } from "./actions/auth";

export default function Home() {
  const [vocabularies, setVocabularies] = useState<VocabItem[]>(vocabList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 新規単語用フォームの状態
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabularies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + vocabularies.length) % vocabularies.length);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newMeaning) return;

    const newItem: VocabItem = {
      id: Date.now(),
      word: newWord,
      meaning: newMeaning,
      // 画像URLが空の場合はAIで生成（Pollinations.aiを使用）
      imageUrl: newImageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(newWord)}%20realistic%20high%20quality%20photo?width=800&height=600&nologo=true`,
    };

    setVocabularies([...vocabularies, newItem]);
    setCurrentIndex(vocabularies.length); // 追加した単語を表示
    setIsModalOpen(false);
    
    // フォームリセット
    setNewWord("");
    setNewMeaning("");
    setNewImageUrl("");
  };

  const currentItem = vocabularies[currentIndex];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative">
      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        <header className="text-center space-y-2 relative w-full">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Imavo
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {currentIndex + 1} / {vocabularies.length}
          </p>
          <button
            onClick={() => handleSignOut()}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="ログアウト"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="単語を追加"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </header>
        
        <div className="w-full py-4">
          <VocabCard item={currentItem} />
        </div>

        <div className="flex gap-4 w-full max-w-md justify-between">
          <button
            onClick={handlePrev}
            className="px-6 py-3 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm w-32"
          >
            ← 前へ
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-32"
          >
            次へ →
          </button>
        </div>
      </main>

      <footer className="fixed bottom-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>Created with Next.js</p>
      </footer>

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">新しい単語を追加</h2>
            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  英単語 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                  placeholder="例: Galaxy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  意味 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                  placeholder="例: 銀河"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  画像URL (任意)
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 outline-none"
                  placeholder="https://..."
                />
                <p className="text-xs text-zinc-500 mt-1">空欄の場合、自動的に単語画像が生成されます</p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors"
                >
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

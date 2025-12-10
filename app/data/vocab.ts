export interface VocabItem {
  id: number;
  word: string;
  meaning: string;
  imageUrl: string;
}

export const vocabList: VocabItem[] = [
  {
    id: 1,
    word: "Apple",
    meaning: "リンゴ",
    imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    word: "Book",
    meaning: "本",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    word: "Cat",
    meaning: "猫",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    word: "Dog",
    meaning: "犬",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
  },
];

import { create } from "zustand";

type Lesson = {
  id: number;
  title: string;
  url: string;
};

type VideoStore = {
  selectedVideo: Lesson;
  setSelectedVideo: (video: Lesson) => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  selectedVideo: {
    id: 0,
    title: "Select a lesson to play",
    url: "",
  },
  setSelectedVideo: (video) => set({ selectedVideo: video }),
}));

import create from 'zustand'

export const useDiaryStore = create((set) => ({
  allDiaries: [],
  setAllDiaries: (newAllDiaries) => set((state) => ({allDiaries: newAllDiaries}))
}))

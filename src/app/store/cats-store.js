import { create } from "zustand";

export const catsStore = create((set) => ({
  cats: [],
  displayCats: [],
  defaultTags: [],
  limit: 10,
  setDefaultTags: (tags) => set((state) => ({ ...state, defaultTags: tags })),
  setLimit: (limit) => set((state) => ({ ...state, limit })),
  setCats: (cats) => set({ cats, displayCats: cats }),
  filterCats: (tags) =>
    set((state) => {
      if (!tags || tags.length === 0) {
        return { ...state, displayCats: state.cats };
      }
      return {
        ...state,
        displayCats: state.cats.filter((cat) =>
          tags.some((tag) => cat.tags?.includes(tag)),
        ),
      };
    }),
}));

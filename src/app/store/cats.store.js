import { create } from "zustand";
export const catsStore = create((set) => ({
  cats:[],
  displayCats:[],
  defaultTags: [],
  limit: 10,
  setDefaultTags: (tags) => {
    set((state) => {
      return {
        ...state,
        defaultTags: tags,
      };
    });
  },
  setLimit: (limit) => {
    set((state) => {
      return {
        ...state,
        limit: limit,
      };
    });
  },
  setCats: (cats) => {
    set({
      cats: cats,
      displayCats: cats,
    });
  },
  getCatDetail: (id) => {
    set((state)=>{
      console.log(`[${id}]\nstore state :`,state);    
      return id
    });
  },
  filterCats: (tags) =>
    set((state) => {
      if (!tags || tags.length == 0)
        return {
          ...state,
          displayCats: state.cats,
        };
      return {
        ...state,
        displayCats: state.cats.filter((cat) =>
          tags.some((tag) => cat.tags.includes(tag)),
        ),
      };
    }),
}));

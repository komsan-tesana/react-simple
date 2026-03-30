import {randomNumberInRange} from '../utils/randomNumber';
import {faker} from '@faker-js/faker';

const randomHeroSkip = randomNumberInRange(0, 100);
const catNamesCache = new Map();

function getCachedCatName(id) {
  if (!catNamesCache.has(id)) {
    catNamesCache.set(id, faker.animal.petName());
  }
  return catNamesCache.get(id);
}

export const getCats = async (tags, limit, signal) => {
  const res = await fetch(`https://cataas.com/api/cats?limit=${limit || 10}&tags=${tags.join(",")}`, { method: "GET", signal });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const cats = await res.json();
  const detailCats = await Promise.all(cats.map((i) => getCatDetail(i.id, signal)));
  return detailCats;
};


export const getCatsHero = async ({ signal }) => {
  const res = await fetch(`https://cataas.com/api/cats?limit=${4}&skip=${randomHeroSkip}&tags=gif`, { method: "GET", signal });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const cats = await res.json();
  const detailCats = await Promise.all(cats.map((i) => getCatDetail(i.id, signal)));
  return detailCats;
};


export const getCatSay = async (id, text, signal) => {
  const res = await fetch(`https://cataas.com/cat/${id}/says/${text}?&json=true&fontSize=50&font=Impact`, { method: "GET", signal });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return { ...data, name: getCachedCatName(id) };
};



export const getCatDetail = async (id, signal) => {
  const res = await fetch(`https://cataas.com/cat/${id}?json=true`, { method: "GET", signal });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return { ...data, name: getCachedCatName(id) };
};



export const getTags = async () => {
  const res = await fetch(`https://cataas.com/api/tags`, { method: "GET" });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const tags = await res.json();
  console.log("🚀 ~ getTags ~ tags:", tags)
  return tags.map((t) => ({ value: t, label: t }));
};
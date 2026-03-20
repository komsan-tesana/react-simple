import {randomNumberInRange} from '../utils/randomNumber';
import {faker} from '@faker-js/faker';
const randomHeroSkip = randomNumberInRange(0,100)
export const getCats = (tags,limit,signal) => {
  return fetch(`https://cataas.com/api/cats?limit=${limit || 10}&tags=${tags.join(',')}`, { method: "GET",signal })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }).then(async (res)=>{
       const detailCats = await Promise.all(
            res.map((i) => getCatDetail(i.id,signal))
        );      
      return detailCats

    });
};


export const getCatsHero = () => {
  return fetch(`https://cataas.com/api/cats?limit=${4}&skip=${randomHeroSkip}&tags=gif`, { method: "GET" })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }).then(async (res)=>{
       const detailCats = await Promise.all(
            res.map((i) => getCatDetail(i.id))
        );      
      return detailCats
    });
};


export const getCatSay = (id,text,signal) => {
  return fetch(`https://cataas.com/cat/${id}/says/${text}?&json=true&fontSize=50&font=Impact`, { method: "GET" ,signal})
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }).then((res)=>({...res,name:faker.animal.petName()}));
};



export const getCatDetail = (id,signal) => {
  return fetch(`https://cataas.com/cat/${id}?json=true`, { method: "GET" ,signal})
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json()
    }).then((res)=>({...res,name:faker.animal.petName()}));
};



export const getTags = () => {
  return fetch(`https://cataas.com/api/tags`, { method: "GET" })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    }).then((res)=>{
      return res.map((t) => {
        return {
          value: t,
          label: t,
        };
      });

    });
};
export const getCats = () => {
  return fetch("https://cataas.com/api/cats?limit=10&skip=0", { method: "GET" }).then((res)=> res.json());
};
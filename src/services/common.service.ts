import { LIMIT, baseURL } from "../constants/apiUrls";

export const initialURL: string = `${baseURL}/pokemon?limit=${LIMIT}`;
export const allPokemonURL: string = `${baseURL}/pokemon?limit=1100`;

// Define reusable types
export interface PokemonData {
  // Define the expected structure of the Pokemon data here if known
  [key: string]: any;
}

export const getPokemonData = async (): Promise<PokemonData> => {
  const response = await fetch(`${initialURL}`);
  const result = await response.json();
  return result;
};

export const getSpeciesDataById = async (
  id: number | string
): Promise<PokemonData> => {
  const response = await fetch(`${baseURL}/pokemon-species/${id}/`);
  const result = await response.json();
  return result;
};

export const getPokemonTypesById = async (
  id: number | string
): Promise<PokemonData> => {
  const response = await fetch(`${baseURL}/type/${id}/`);
  const result = await response.json();
  return result;
};

export const getPokemonTypes = async (): Promise<PokemonData> => {
  const response = await fetch(`${baseURL}/type`);
  const result = await response.json();
  return result;
};

export const getPokemonGenders = async (): Promise<PokemonData> => {
  const response = await fetch(`${baseURL}/gender`);
  const result = await response.json();
  return result;
};

export const getPokemonDataById = async (
  id: number | string
): Promise<PokemonData> => {
  const response = await fetch(`${baseURL}/pokemon/${id}/`);
  const result = await response.json();
  return result;
};

export const getPokemonDataByURL = async (
  URL: string
): Promise<PokemonData> => {
  const response = await fetch(URL);
  const result = await response.json();
  return result;
};

export const numberFormation = (number: string | number): string => {
  let formattedNumber = String(number);
  if (Number(number) < 10) formattedNumber = `00${number}`;
  else if (Number(number) >= 10 && Number(number) < 100)
    formattedNumber = `0${number}`;
  return formattedNumber;
};

export const getAllParallelCall = async (
  ApiUrls: string[]
): Promise<PokemonData[]> => {
  return await Promise.all(
    ApiUrls.map(async (url) => {
      const res = await fetch(url);
      return res.json();
    })
  );
};

export const removeDuplicateBy = <T>(arr: T[], prop: keyof T): T[] => {
  return Array.from(new Map(arr.map((item) => [item[prop], item])).values());
};

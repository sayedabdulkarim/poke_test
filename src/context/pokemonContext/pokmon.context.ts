import { createContext } from "react";
import { initialState, State } from "../../store/reducers/reducer";

export interface PokemonContextType {
  state: State;
  dispatch: React.Dispatch<any>;
  getPokemonData: (isReset?: boolean) => Promise<void>;
  getPokemonDetailsListByUrl: (results: any[]) => Promise<any[]>;
  setAppLoading: (loading: boolean) => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);
export default PokemonContext;

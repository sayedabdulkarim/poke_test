import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Col, Row } from "rsuite";
import { debounceTime, distinctUntilChanged, map, Observable, of } from "rxjs";
import { baseURL, SEARCH_SLICED } from "../../constants/apiUrls";
import { getCamleCaseString } from "../../constants/pokemon.types";
import PokemonContext, {
  PokemonContextType,
} from "../../context/pokemonContext/pokmon.context";
import {
  getAllParallelCall,
  getPokemonGenders,
  getPokemonTypes,
  removeDuplicateBy,
} from "../../services/common.service";
import "./filter.scss";
import AppMultiSelectDropDown from "./multiSelectdropDown/multiSelectdropDown";
import SearchFilter from "./search/search.filter";

interface AppFilterProps {
  isFilterEnable: (enabled: boolean) => void;
}

const AppFilter: React.FC<AppFilterProps> = ({ isFilterEnable, ...props }) => {
  const {
    state,
    getPokemonData,
    dispatch,
    setAppLoading,
    getPokemonDetailsListByUrl,
  } = useContext(PokemonContext) as PokemonContextType;
  const { allPokemonsList, pokemonsTypes, pokemonGenderList } = state;
  const stablePokemonsTypes = useMemo(() => pokemonsTypes, [pokemonsTypes]);

  const [isOpenTypeFilter, setIsOpenTypeFilter] = useState(false);
  const [isOpenGendreFilter, setIsOpenGenderFilter] = useState(false);

  let data$: Observable<any[]> = of([] as never[]) as Observable<never[]>;

  const onOpenTypeHandler = () => {
    setIsOpenTypeFilter(true);
  };
  const onCloseTypeHandler = () => {
    setIsOpenTypeFilter(false);
  };

  const onOpenGenderHandler = () => {
    setIsOpenGenderFilter(true);
  };
  const onCloseGenderHandler = () => {
    setIsOpenGenderFilter(false);
  };

  const onCleanTypeHandler = (event: React.SyntheticEvent) => {
    if (event) {
      isFilterEnable(false);
    }
  };

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearchHandler = useCallback(
    debounce((value: string, event: React.SyntheticEvent) => {
      value = value.trim();
      setAppLoading(true);

      if (value.length) {
        isFilterEnable(true);
        const filteredPokemons = allPokemonsList.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(value.toLowerCase())
        );

        const limitedPokemons =
          filteredPokemons.length > SEARCH_SLICED
            ? filteredPokemons.slice(0, SEARCH_SLICED)
            : filteredPokemons;

        getPokemonDetailsListByUrl(limitedPokemons).then((res) => {
          filterPokemonData(res);
          setAppLoading(false);
        });
      } else {
        filterPokemonData([]);
        getPokemonData(true);
        isFilterEnable(false);
        setAppLoading(false);
      }
    }, 300), //
    [allPokemonsList, getPokemonData, isFilterEnable, setAppLoading]
  );

  const onSearchChangeHandler = (
    value: string,
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    debouncedSearchHandler(value, event);
  };

  const onTypeChangeHandler = (value: any[], event: React.SyntheticEvent) => {
    event.preventDefault();
    if (value.length) {
      isFilterEnable(true);
      getAllParallelCall(value)
        .then((pokemonList: any[]) => {
          pokemonList = pokemonList
            .map((res) => res.pokemon)
            .flat()
            .map((res) => res.pokemon);
          pokemonList = removeDuplicateBy(pokemonList, "name");
          if (pokemonList.length > SEARCH_SLICED) {
            pokemonList = pokemonList.slice(-SEARCH_SLICED);
          }
          getPokemonDetailsListByUrl(pokemonList).then((res: any[]) => {
            filterPokemonData(res);
          });
        })
        .catch((err) => Error(err));
    } else {
      filterPokemonData([]);
      getPokemonData(true);
      isFilterEnable(false);
    }
  };

  const onGenderChangeHandler = (value: any[], event: React.SyntheticEvent) => {
    event.preventDefault();
    if (value.length) {
      isFilterEnable(true);
      getAllParallelCall(value)
        .then((pokemonList: any[]) => {
          pokemonList = pokemonList
            .map((res) => res.pokemon_species_details)
            .flat();
          pokemonList = pokemonList.map(
            (res) =>
              baseURL +
              "/pokemon" +
              res.pokemon_species.url.split("pokemon-species")[1]
          );
          pokemonList = [...new Set(pokemonList)];
          if (pokemonList.length > SEARCH_SLICED) {
            pokemonList = [
              ...pokemonList.slice(0, SEARCH_SLICED),
              ...pokemonList.slice(-SEARCH_SLICED),
            ];
          }
          pokemonList = pokemonList.map((res) => ({ url: res }));
          getPokemonDetailsListByUrl(pokemonList).then((res: any[]) => {
            filterPokemonData(res);
          });
        })
        .catch((err) => Error(err));
    } else {
      filterPokemonData([]);
      getPokemonData(true);
      isFilterEnable(false);
    }
  };

  const filterPokemonData = (data: any[]) => {
    dispatch({
      type: "ACTIONS.SET_FILTERED_POKEMON_LIST",
      payload: data,
    });
  };

  const setPokemonTypes = useCallback(
    (data: any[]) => {
      if (data.length) {
        data = data.map((item) => ({
          label: getCamleCaseString(item.name),
          value: item.url,
          url: item.url,
        }));
        dispatch({
          type: "ACTIONS.SET_POKEMON_TYPE",
          payload: data,
        });
      } else {
        dispatch({
          type: "ACTIONS.SET_POKEMON_TYPE",
          payload: [],
        });
      }
    },
    [dispatch]
  );

  const setPokemonGendersList = useCallback(
    (genderList: any[]) => {
      genderList = genderList.map((item) => ({
        label: getCamleCaseString(item.name),
        value: item.url,
        url: item.url,
      }));
      if (genderList.length) {
        dispatch({
          type: "ACTIONS.SET_POKEMON_GENDER_LIST",
          payload: genderList,
        });
      } else {
        dispatch({
          type: "ACTIONS.SET_POKEMON_GENDER_LIST",
          payload: [],
        });
      }
    },
    [dispatch]
  );

  const getAllPokemonType = useCallback(async () => {
    getPokemonTypes()
      .then((res) => {
        setPokemonTypes(res.results);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [setPokemonTypes]);

  const getPokemonGendersList = useCallback(async () => {
    getPokemonGenders()
      .then((res) => {
        setPokemonGendersList(res.results);
      })
      .catch((err) => {
        return new Error(err);
      });
  }, [setPokemonGendersList]);

  useEffect(() => {
    getAllPokemonType();
    getPokemonGendersList();
  }, [getAllPokemonType, getPokemonGendersList]);

  return (
    <div className="filter-container">
      <div className="filter-wrap">
        <Row className="filter-row-wrap show-grid">
          <Col lg={16} xl={16} xs={24} sm={24}>
            <div>
              <SearchFilter
                placeholder="Name or Number"
                inputClass="pokemon-search-filter"
                label="Search By"
                onChangeHandler={(value: string, event: React.SyntheticEvent) =>
                  onSearchChangeHandler(value, event)
                }
              />
            </div>
          </Col>
          <Col lg={4} xl={4} xs={24} sm={24}>
            <div>
              <AppMultiSelectDropDown
                placeholder="Select Types"
                isOpen={isOpenTypeFilter}
                data={stablePokemonsTypes}
                label="Type"
                onChangeHandler={(value: any[], event: React.SyntheticEvent) =>
                  onTypeChangeHandler(value, event)
                }
                onOpenHandler={onOpenTypeHandler}
                onCloseHandler={onCloseTypeHandler}
                onCleanHandler={onCleanTypeHandler}
              />
            </div>
          </Col>
          <Col lg={4} xl={4} xs={24} sm={24}>
            <div>
              <AppMultiSelectDropDown
                placeholder="Select Gender"
                isOpen={isOpenGendreFilter}
                data={pokemonGenderList}
                label="Gender"
                onChangeHandler={onGenderChangeHandler}
                onOpenHandler={onOpenGenderHandler}
                onCloseHandler={onCloseGenderHandler}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AppFilter;

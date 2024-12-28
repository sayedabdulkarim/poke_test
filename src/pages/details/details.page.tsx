import "./details.page.scss";
import React, { useState, useEffect } from "react";
import { Loader, Modal, Placeholder } from "rsuite";
import {
  getPokemonDataById,
  getPokemonTypesById,
  getSpeciesDataById,
} from "../../services/common.service";
import DetailsHeader from "../../components/pokemonDetailsCard/detailsHeader/detailsHeader";
import PropertyCard from "../../components/pokemonDetailsCard/propertyCard/propertyCard";
import StatCard from "../../components/pokemonDetailsCard/statCard/statCard";
import EvolutionChainCard from "../../components/pokemonDetailsCard/evolutionChainCard/evolutionChainCard";
import PokemonCard from "../../components/pokemonCard/pokemonCard";

interface Props {
  isCardSelected: boolean;
  toggleModal?: any;
  pokemonId: number;
  offset: number;
}
interface PokemonData {
  // Define the properties of the PokemonData type here
  stats?: any; // Replace 'any' with the actual type of the 'stats' property
}

const DetailPage = ({
  isCardSelected,
  toggleModal,
  pokemonId,
  offset,
}: Props) => {
  console.log("isCard", { isCardSelected, toggleModal, pokemonId, offset });

  const [currentPokemonId, setCurrentPokemonId] = useState(pokemonId);
  const handleClose = () => toggleModal();

  const [data, setPokemonData] = useState<PokemonData | undefined>(undefined);
  const [isDetailLoading, setLoading] = useState(true);
  const [isModalOpen, setCloseModal] = useState(isCardSelected);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState<
    PokemonData | undefined
  >(undefined);
  const [pokemonTypeData, setPokemonTypeData] = useState<
    PokemonData | undefined
  >({ stats: undefined });

  useEffect(() => {
    if (!currentPokemonId) return;
    (async function setPokemonDetails() {
      setLoading(true);
      const response = await getPokemonDataById(currentPokemonId);
      console.log("pokemonSpeciesData", response);
      setPokemonData(response);
      setLoading(false);
      const pokemonSpeciesData = await getSpeciesDataById(currentPokemonId);
      setPokemonSpeciesData(pokemonSpeciesData);
      const pokemonTypeData = await getPokemonTypesById(currentPokemonId);
      setPokemonTypeData(pokemonTypeData);
    })();
  }, [currentPokemonId]);

  const handleForwordClick = () => {
    if (currentPokemonId === offset) return;
    setCurrentPokemonId(currentPokemonId + 1);
  };
  const handleBackwordClick = () => {
    if (currentPokemonId === 1) return;
    setCurrentPokemonId(currentPokemonId - 1);
  };

  const closePopUp = () => {
    setCloseModal(false);
  };
  console.log({ data }, " dd");
  return (
    <>
      <Modal
        dialogClassName={"details-modal-container"}
        size={"md"}
        open={isModalOpen}
        onClose={handleClose}
        onExited={() => {
          setPokemonData(undefined);
        }}
      >
        {data ? (
          <>
            <div className="model-container">
              <Modal.Header closeButton={false} className="rs-modal-header-2">
                {isDetailLoading && (
                  <Placeholder.Paragraph
                    style={{ marginTop: 30 }}
                    rows={5}
                    graph="image"
                    active
                  />
                )}
                {!isDetailLoading && (
                  <div>
                    <DetailsHeader
                      data={data}
                      speciesData={pokemonSpeciesData}
                      forwordClick={handleForwordClick}
                      backClick={handleBackwordClick}
                      closeClick={closePopUp}
                    />
                  </div>
                )}
                <div className="padding-components">
                  {pokemonTypeData && (
                    <PropertyCard
                      speciesData={pokemonSpeciesData}
                      data={data}
                      pokemonTypeData={pokemonTypeData}
                    />
                  )}
                </div>

                <div className="padding-components">
                  {data?.stats && <StatCard stats={data?.stats} />}
                </div>
                <div className="padding-components">
                  <EvolutionChainCard data={data} />
                </div>
              </Modal.Header>
              <Modal.Body>{/* <PokemonCard data={data} /> */}</Modal.Body>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Loader size="md" />
            <h1>Loading</h1>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DetailPage;

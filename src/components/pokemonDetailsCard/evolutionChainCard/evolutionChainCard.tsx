import React from 'react';
import "./evolutionChainCard.scss"
import "../../../styles/common.scss";
import PokemonCard from "../../pokemonCard/pokemonCard";

const EvolutionChainCard = ({ data }: { data: any }) => {
    const arrayele = [1, 2, 3];

    return (
        <div>
            <div className="evol-container">
                <div className="evol-wrap evolu-break">
                    {arrayele.map((obj, index) => (
                        <div className="flex-row" key={obj}>
                            <div>
                                <div className="pt-2">
                                    <PokemonCard className="disabled-click" key={data.id} data={data} />
                                </div>
                            </div>
                            {arrayele.length !== index + 1 && (
                                <div>
                                    <div className="evol-next-arrow">
                                    <img src={require("../../../assets/icons/right-arrow.png")} alt="right arrow icon" onKeyDown={() => { }} role="presentation"></img>
                                    </div>
                                </div>)}
                        </div>))}
                </div>
            </div>
        </div>
    )
}



export default EvolutionChainCard;
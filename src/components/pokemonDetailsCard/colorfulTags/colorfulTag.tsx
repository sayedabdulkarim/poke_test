import React from 'react';
import { getPokcolor } from '../../../constants/pokemon.types';
import "./colorfulTags.scss";

interface Props  {
    text: string,
    className: string,
    type: any
}

const ColorfulTag = ({ text, className, type }: Props) => {
    return (
        <div>
            <div className={className}>
                <span style={{
                    background: getPokcolor(type)
                }} className="colorful-tag">{text}</span>
            </div>
        </div>
    )
}

export default ColorfulTag;
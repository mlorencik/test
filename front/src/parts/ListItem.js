import React from 'react';
import {API_URL, IMAGES_URL} from "../constants";

const List = ({image, handleDelete}) => {
    return (
        <div className={"m-4 border-b-2 p-2"} key={image.id}>
            <img
                src={`${IMAGES_URL}/${image.filename}_thumb.${image.extension}`}
                alt={image}
                className={"float-start"}
            />
            <p>
                {image.name}<br/>
                {image.extension}, {image.width}x{image.height}, {(image.size / 1024 / 1024).toFixed(2)}MB<br/>
                Temperatura w Katowicach {image.temperature}&deg;C
            </p>
            <a
                className={"text-white bg-cyan-900 m-1 p-1 text-sm rounded"}
                download={`${image.filename}.${image.extension}`}
                href={`${API_URL}/images/${image.id}`}
            >
                Pobierz
            </a>
            <button
                className={"text-white bg-red-600 m-1 p-1 text-sm rounded"}
                onClick={() => handleDelete(image.id)}
            >
                Usuń
            </button>
        </div>
    );
};

export default List;
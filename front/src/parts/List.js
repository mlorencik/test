import React from 'react';
import {API_URL, IMAGES_URL} from "../constants";

const List = ({list, isLoading, handleDelete}) => {
    return (
        <div className={"text-center border-cyan-900 border rounded p-4"}>
            {list.length > 0 ? list.map(image => (
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
            )) : isLoading ? (
                <div className={"text-center p-4"}>
                    Ładowanie...
                </div>
            ) : (
                <div className={"m-4 "}>
                    <h2 className={"text-xl text-cyan-900"}>Lista jest pusta :(</h2>
                    <small>Wgraj pierwszy obraz</small>
                </div>
            )}
        </div>
    );
};

export default List;
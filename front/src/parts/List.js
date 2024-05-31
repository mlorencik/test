import React from 'react';
import {API_URL, IMAGES_URL} from "../constants";
import ListItem from "./ListItem";

const List = ({list, isLoading, handleDelete}) => {
    return (
        <div className={"text-center border-cyan-900 border rounded p-4"}>
            {list.length > 0 ? list.map(image => (
                <ListItem key={image.id} handleDelete={handleDelete} image={image} />
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
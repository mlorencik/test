import Layout from "./layout/Layout";
import FileUpload from "./parts/FileUpload";
import List from "./parts/List";
import {useEffect, useRef, useState} from "react";
import {API_URL} from "./constants";
import axios from "axios";

function App() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const listEndRef = useRef();

    const loadMoreItems = (loadPage, refresh) => {
        if (lastPage <= page && !refresh) {
            return;
        }
        setIsLoading(true);
        fetch(`${API_URL}/images?page=${loadPage}`)
            .then(response => response.json())
            .then(data => {
                setResults(refresh ? data.data : [...results, ...data.data]);
                setIsLoading(false);
                setPage(loadPage);
                setLastPage(data.last_page);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }

    const handleScroll = () => {
        if (isLoading || results.length === 0) {
            return
        }
        if (listEndRef.current && listEndRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
            loadMoreItems(page + 1);
        }
    }

    const handleAdd = (item) => {
        setResults([item, ...results]);
    }

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/images/${id}`).then(response => {
            setResults(results.filter(item => item.id !== id));
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        loadMoreItems(1);
    }, []);

    return (
        <Layout>
            <FileUpload handleAdd={handleAdd}/>
            <List list={results} isLoading={isLoading} handleDelete={handleDelete}/>
            <div ref={listEndRef} style={{height: '10px'}}/>
        </Layout>
    );
}

export default App;

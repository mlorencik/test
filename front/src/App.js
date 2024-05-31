import Layout from "./layout/Layout";
import FileUpload from "./parts/FileUpload";
import List from "./parts/List";
import {useCallback, useEffect, useRef, useState} from "react";
import {API_URL} from "./constants";
import axios from "axios";

function App() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const listEndRef = useRef();

    const loadMoreItems = useCallback((loadPage, refresh = false) => {
        if (lastPage <= page && !refresh) {
            return;
        }
        setIsLoading(true);
        axios.get(`${API_URL}/images?page=${loadPage}`)
            .then(response => {
                setResults(refresh ? response.data.data : [...results, ...response.data.data]);
                setIsLoading(false);
                setPage(loadPage);
                setLastPage(response.data.last_page);
            })
            .catch(error => {
                setIsLoading(false);
            });
    }, [lastPage, page, results]);

    const handleAdd = (item) => {
        setResults([item, ...results]);
    }

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/images/${id}`).then(response => {
            setResults(results.filter(item => item.id !== id));
        })
    }

    const handleScroll = () => {
        if (isLoading || results.length === 0) {
            return;
        }
        if (listEndRef.current && listEndRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
            loadMoreItems(page + 1);
        }
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

import React, {useRef, useState} from 'react';
import axios from 'axios';
import {API_URL} from "../constants";
import PropTypes from "prop-types";

const FileUpload = ({handleAdd}) => {
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({
        errors: {},
        progress: false,
        preview: '',
        data: {
            image: null,
            name: '',
            email: ''
        },
        success: false
    })

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            success: false,
            errors: {
                ...form.errors,
                [e.target.name]: false
            },
            data: {
                ...form.data,
                [e.target.name]: e.target.value
            }
        })
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if(!file) {
            return;
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/bmp'];
        const maxSize = 5 * 1024 * 1024;

        if (!validTypes.includes(file.type) || file.size > maxSize) {
            setForm({
                ...form,
                preview: '',
                success: false,
                errors: {
                    ...form.errors,
                    image: file.size > maxSize
                        ? 'Wgrywany plik ma więcej niż 5MB'
                        : 'Wgrywany plik ma nieobsługiwany format'
                }
            })
        } else {
            setForm({
                ...form,
                preview: URL.createObjectURL(file),
                success: false,
                errors: {
                    ...form.errors,
                    image: null
                },
                data: {
                    ...form.data,
                    image: file
                }
            })
        }
    }

    const isValid = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let errors = {};

        if (!form.data.name.length > 0) {
            errors.name = 'Podaj swoje imię';
        }
        if(!form.data.image){
            errors.image = 'Wybierz plik do wgrania';
        }
        if(!form.data.email.length > 0 || !regex.test(form.data.email)) {
            errors.email = 'Podaj poprawny adres email';
        }

        if(!Object.keys(errors).length) {
            return true;
        }

        setForm({
            ...form,
            errors: errors
        })
        return false;
    }

    const handleSave = async () => {
        if (!isValid()) {
            return;
        }

        setForm({
            ...form,
            errors: {},
            progress: true
        });

        await axios.post(`${API_URL}/images`, form.data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            setForm({
                ...form,
                data: {
                    image: null,
                    name: '',
                    email: ''
                },
                preview: '',
                success: true,
                errors: {},
                progress: false
            });
            handleAdd(response.data);
        }).catch(error => {
            console.error("Error:", error);
            setForm({
                ...form,
                errors: error?.response?.data?.errors || {global: 'Wystąpił błąd, spróbuj później'},
                progress: false
            });
        });
    };

    return (
        <div className={"text-center bg-cyan-900 border rounded p-4"}>
            <div
                className={"text-gray-400 min-h-96 content-center border border-dotted p-2 cursor-pointer"}
                onClick={handleClick}
            >
                {form.preview ? (
                    <img src={form.preview} className={"max-h-96 max-w-96 mx-auto"} alt={"preview"}/>
                ) : (
                    <>
                        <h2 className={" text-xl"}>Wgraj obraz</h2>
                        <small>JPG, PNG, WebP, TIFF, BMP</small><br/>
                        <small>max 5MB, min 500x500px</small>
                    </>
                )}
            </div>
            <input
                type="file"
                accept=".jpg, .jpeg, .png, .webp, .tiff, .bmp"
                className={"hidden"}
                ref={fileInputRef}
                onChange={handleUpload}
            />
            <div className={"grid-cols-3"}>
                <input
                    type={"text"}
                    name={"name"}
                    className={'m-2 p-1 rounded text-sm w-1/3'}
                    placeholder={'Imię'}
                    value={form.data.name}
                    onChange={handleChange}
                />
                <input
                    type={"email"}
                    name={"email"}
                    className={'m-2 p-1 rounded text-sm w-1/3'}
                    placeholder={'Email'}
                    value={form.data.email}
                    onChange={handleChange}
                />
                <button
                    className={'m-2 bg-sky-400 text-gray-600 hover:bg-sky-500 hover:text-gray-300 p-1 rounded text-sm w-1/3'}
                    onClick={handleSave}
                >
                    Wgraj
                </button>
            </div>
            {form.errors && Object.keys(form.errors).filter(eKey => form.errors[eKey]).map(eKey => (
                <div key={eKey} className={"bg-red-600 text-white p-2"}>
                    {form.errors[eKey]}
                </div>
            ))}
            {form.progress && (
                <div className={"bg-sky-600 text-white p-2"}>
                    Wysyłanie...
                </div>
            )}
            {form.success && (
                <div className={"bg-green-600 text-white p-2"}>
                    Plik został wgrany
                </div>
            )}
        </div>
    );
};

FileUpload.propTypes = {
    handleAdd: PropTypes.func.isRequired,
};

export default FileUpload;
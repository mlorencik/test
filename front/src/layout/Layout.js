import React from 'react';

const Layout = ({children}) => {
    return (
        <main className={"mx-auto max-w-2xl flex flex-col h-screen"}>
            <header className={"py-4 border-b-2 border-b-sky-800 h-20 flex items-center justify-center"}>
                <h1 className={"text-gray-800 text-xl font-bold"}>Aplikacja testowa</h1>
            </header>
            <section className={"flex-grow p-4"}>
                {children}
            </section>
            <footer className={"h-20 flex items-center justify-center"}>
                <div className={"text-center text-gray-800"}>
                    Copyright &copy; Michał Lorencik dla Stockpress
                </div>
            </footer>
        </main>
    );
};

export default Layout;

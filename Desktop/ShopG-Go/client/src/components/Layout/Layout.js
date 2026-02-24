import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';


const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div>
            <Helmet>
                <meta charSet="UTF-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main style={{ minHeight: "90vh" }}>
                <Toaster />
                {children}
            </main>
            <Footer />
        </div>
    );
};
Layout.defaultProps = {
    title: 'Mi Zip - Shop now available',
    description: 'mern stack project',
    keywords: 'mern ,react, node, mongodb,',
    author: 'mosh-23'
};

export default Layout;
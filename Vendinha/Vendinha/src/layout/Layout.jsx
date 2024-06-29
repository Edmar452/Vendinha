import React from 'react';
import { RenderComponent } from 'simple-react-routing';
import Navbar from './Navbar';

function Layout() {
    return (
        <>
            <Navbar />
            <RenderComponent />
        </>
    );
}

export default Layout;

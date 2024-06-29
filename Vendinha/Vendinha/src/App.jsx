import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './layout/Layout';
import { BrowserRouter, registerPathTypeParameter } from 'simple-react-routing';
import Home from './Home';
import ListaClientes from './clientes/ListaClientes';
import FormCliente from './clientes/FormCliente';
import FormDivida from './divida/FormDivida';
import ListaDividas from './divida/ListaDividas';


function App() {

    return (
        <BrowserRouter
            notFoundPage={<h1>404 - NOT FOUND</h1>}
            routes={[
                {
                    path: "",
                    component: <Home />
                },
                {
                    path: "clientes",
                    component: <ListaClientes />
                },
                {
                    path: "clientes/criar",
                    component: <FormCliente />
                },
                {
                    path: "clientes/editar/:codigo(numero)",
                    component: <FormCliente />
                },
                {
                    path: "dividas",
                    component: <ListaDividas />
                },
                {
                    path: "dividas/criar",
                    component: <FormDivida />
                },
                {
                    path: "dividas/editar/:codigo(numero)",
                    component: <FormDivida />
                }
            ]}
        >

            <Layout />
        </BrowserRouter>
    );
}

export default App;

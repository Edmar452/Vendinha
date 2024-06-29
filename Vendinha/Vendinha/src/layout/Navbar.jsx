import React from 'react';
import { Link } from 'simple-react-routing';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/clientes">Clientes</Link></li>
                <li><Link to="/clientes/criar">Novo Cliente</Link></li>
                <li><Link to="/dividas">Dívidas</Link></li>
                <li><Link to="/dividas/criar">Nova Dívida</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;

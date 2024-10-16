import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Microscope } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Microscope size={32} />
          <span className="text-2xl font-bold">NumériSanté</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Accueil</Link></li>
            {currentUser ? (
              <li><Link to="/dashboard" className="hover:underline">Tableau de bord</Link></li>
            ) : (
              <>
                <li><Link to="/login" className="hover:underline">Connexion</Link></li>
                <li><Link to="/register" className="hover:underline">Inscription</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
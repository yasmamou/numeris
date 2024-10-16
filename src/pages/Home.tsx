import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur NumériSanté</h1>
      <p className="text-xl mb-8">
        La plateforme collaborative de recherche qui facilite la collaboration entre chercheurs, médecins, institutionnels, startups, et business angels.
      </p>
      <div className="space-x-4">
        <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          S'inscrire
        </Link>
        <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default Home;
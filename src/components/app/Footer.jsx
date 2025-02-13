import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 px-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm">
          © 2025 Morris Game
        </p>
        <Link 
          to="/terms" 
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          Conditions générales d'utilisation
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
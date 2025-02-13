import React from 'react';
import { Link } from 'react-router-dom';

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Conditions Générales d'Utilisation
        </h1>

        <div className="space-y-8 text-gray-300">
          <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
              Objectif du site
            </h2>
            <p className="mb-4">
              Ce jeu a été développé dans un cadre éducatif comme projet d'étude. Il s'agit d'une 
              implémentation du jeu traditionnel du Moulin (Morris Game) en version numérique.
            </p>
            <p>
              <span className="font-semibold text-indigo-400">Développeur :</span> Limani Getoar
              <br />
              <span className="font-semibold text-indigo-400">Contexte :</span> Projet M2
            </p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
              Utilisation des données
            </h2>
            <p className="mb-4">
              Les données collectées sont strictement limitées au fonctionnement du jeu :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Adresse email : utilisée uniquement pour l'identification et la connexion</li>
              <li>Nom d'utilisateur : affiché pendant les parties pour identifier les joueurs</li>
              <li>Statistiques de jeu : uniquement pour suivre l'historique des parties</li>
            </ul>
            <p className="mt-4">
              Aucune donnée n'est exploitée à des fins commerciales ou partagée avec des tiers.
            </p>
          </section>

          <section className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
              Contact
            </h2>
            <p>
              Pour toute question concernant vos données ou l'utilisation du jeu, vous pouvez 
              contacter le développeur à l'adresse : limanigetoar@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
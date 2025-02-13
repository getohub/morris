import React from 'react';
import { Link } from 'react-router-dom';

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Conditions Générales d'Utilisation
        </h1>

        <div className="space-y-8 text-gray-600 dark:text-gray-300">
          <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
              Objectif du site
            </h2>
            <p className="mb-4">
              Ce jeu a été développé dans un cadre éducatif comme projet d'étude. Il s'agit d'une 
              implémentation du jeu traditionnel du Moulin (Morris Game) en version numérique.
            </p>
            <p>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Développeur :</span>{' '}
              <span className="text-gray-900 dark:text-white">Limani Getoar</span>
              <br />
              <span className="font-semibold text-blue-600 dark:text-blue-400">Contexte :</span>{' '}
              <span className="text-gray-900 dark:text-white">Projet M2</span>
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
              Utilisation des données
            </h2>
            <p className="mb-4">
              Les données collectées sont strictement limitées au fonctionnement du jeu :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li>Adresse email : utilisée uniquement pour l'identification et la connexion</li>
              <li>Nom d'utilisateur : affiché pendant les parties pour identifier les joueurs</li>
              <li>Statistiques de jeu : uniquement pour suivre l'historique des parties</li>
            </ul>
            <p className="mt-4">
              Aucune donnée n'est exploitée à des fins commerciales ou partagée avec des tiers.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
              Contact
            </h2>
            <p>
              Pour toute question concernant vos données ou l'utilisation du jeu, vous pouvez 
              contacter le développeur à l'adresse : {' '}
              <a 
                href="mailto:limanigetoar@gmail.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                limanigetoar@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                     transition-colors duration-200 underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
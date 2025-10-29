import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Composants principaux
import Header from './HeaderFooter/header1';
import Footer1 from './HeaderFooter/footer';
import Accueil from './pages/Accueil';
import Contact from './HeaderFooter/contact';
import Activites from './pages/Annee/Activites';
import WeeklyNavigator from './pages/HSI/2eAnnee/texteCompreh/WeeklyNavigator';
import WeeklyNavigator3 from './pages/HSI/3eAnnee/textComprehen/WeeklyNavigator3';

const App = () => {
  return (
    <Router>
      {/* En-tête fixe */}
      <Header />

      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Accueil />} />

        {/* Page des activités pour chaque année */}
        <Route path="/activites/:annee" element={<Activites />} />

        {/* Cas spécial : 2e Année + Français */}
        <Route path="/activites/2e Année/Francais" element={<WeeklyNavigator />} />
        <Route path="/activites/3e Année/Francais" element={<WeeklyNavigator3 />} />

        {/* Page contact */}
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Pied de page fixe */}
      <Footer1 />
    </Router>
  );
};

export default App;

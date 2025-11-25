import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Composants principaux
import Header from './HeaderFooter/header1';
import Footer1 from './HeaderFooter/footer';
import Accueil from './pages/Accueil';
//import Contact from './HeaderFooter/contact';
import Activites from './pages/Annee/Activites';
import WeeklyNavigator from './pages/HSI/2eAnnee/texteCompreh/WeeklyNavigator';
import WeeklyNavigator3 from './pages/HSI/3eAnnee/textComprehen/WeeklyNavigator3';
//import LeLionEtLeLievreComponent from './pages/HSI/4eAnnee/LeLionEtLeLievreComponent';
//import FrenchReadingQuiz from './pages/HSI/4eAnnee/FrenchReadingQuiz';
import WeeklyNavigator4 from './pages/HSI/4eAnnee/WeeklyNavigator4';
//import MultiplicationContest from './pages/HSI/2eAnnee/maths/mathsMultiplication';
import MultiplicationContestJson4 from './pages/HSI/2eAnnee/maths/multiple';
//import SelectionHistoire from './pages/HSI/Livres/Sélection_histoire';
//import JeuTablesMUI from './pages/HSI/2eAnnee/maths/mutlication1_12';
//import JeuTablesSelector from './pages/HSI/2eAnnee/maths/MultiplicationSelector';
import MultiplicationSelector from './pages/HSI/2eAnnee/maths/MultiplicationSelector';
import AnimalClassifier from './pages/HSI/2eAnnee/science/classification';
import MultiplicationChallenge from './pages/HSI/2eAnnee/maths/concourMaths';
import EvaluationFrancais from './pages/HSI/5eAnnee/EvaluationFrancais';
//import MultiplicationChallengeOK from './pages/HSI/2eAnnee/maths/concourMathsOK';
//import MultiplicationChallengeOKok from './pages/HSI/2eAnnee/maths/mathsok';
import MultiplicationChallengeokokok from './pages/HSI/2eAnnee/maths/mathsokavechistoirque';
import EvaluationFrancaisPro2 from './pages/HSI/5eAnnee/Eval';

const App = () => {
  return (
    <Router>
      {/* En-tête fixe */}
      <Header />

      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Accueil/>} />
        

        {/* Page des activités pour chaque année */}
        <Route path="/activites/:annee" element={<Activites />} />

        {/* Cas spécial : 2e Année + Français */}
        <Route path="/activites/2e Année/Francais" element={<WeeklyNavigator />} />
         <Route path="/activites/2e Année/sciences" element={<AnimalClassifier />} />
        <Route path="/activites/3e Année/Francais" element={<WeeklyNavigator3 />} />
        <Route path="/activites/4e Année/Francais" element={<WeeklyNavigator4 />} />
        <Route path="/activites/5e Année/Francais" element={<EvaluationFrancais />} />
        <Route path="/activites/6e Année/Francais" element={<EvaluationFrancaisPro2 />} />
        
        
        
        

        {/* Page contact */}
        <Route path="/contact" element={<MultiplicationChallenge />} />

        
        <Route path="/concours2" element={< MultiplicationSelector/>} />
        <Route path="/concours" element={<MultiplicationContestJson4 />} />
        <Route path="/concours3" element={< MultiplicationChallengeokokok/>} />

      </Routes>

      {/* Pied de page fixe */}
      <Footer1 />
    </Router>
  );
};

export default App;

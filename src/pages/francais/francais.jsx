import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Pour naviguer dynamiquement
import styles from "../Accueil.module.css";
import francaisYears from "./francaisLevels.json";

const Francais = () => {
  const [cardsVisible, setCardsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCardsVisible(true);
  }, []);

  // Fonction quand l'élève clique sur une année
  const handleYearClick = (yearPath) => {
    navigate(yearPath); // Redirige vers la page de l'année
  };

  return (
    <div className={styles.container}>
      <h1>Choisissez votre année</h1>

      <div className={styles.subjectCards}>
        {francaisYears.map((year) => (
          <div
            key={year.niveau}
            className={`${styles.card} ${cardsVisible ? styles.cardVisible : ""}`}
            onClick={() => handleYearClick(year.path)}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.icon} style={{ color: year.color }}>
              {year.icon}
            </div>

            <h2>{year.niveau}</h2>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Francais;

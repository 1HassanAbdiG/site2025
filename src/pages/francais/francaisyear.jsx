import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../Accueil.module.css";

const sections = [
  { title: "Lecture & Compréhension", paths: ["lecture", "comprehension"] },
  { title: "Histoire", paths: ["histoire"] },
  { title: "Dictée", paths: ["dictee"] }
];

const FrancaisYear = () => {
  const [cardsVisible, setCardsVisible] = useState(false);
  const { year } = useParams(); // Récupère l'année depuis l'URL
  const navigate = useNavigate();

  useEffect(() => {
    setCardsVisible(true);
  }, []);

  const handleSectionClick = (paths) => {
    if (paths.length === 1) {
      navigate(`/francais/${year}/${paths[0]}`);
    } else {
      // Si plusieurs sous-sections (Lecture & Compréhension), on peut naviguer vers une page spéciale ou la première
      navigate(`/francais/${year}/${paths[0]}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>{year.replace("-", " ").toUpperCase()} Année</h1>
      <div className={styles.subjectCards}>
        {sections.map((section) => (
          <div
            key={section.title}
            className={`${styles.card} ${cardsVisible ? styles.cardVisible : ""}`}
            onClick={() => handleSectionClick(section.paths)}
            style={{ cursor: "pointer" }}
          >
            <h2>{section.title}</h2>
            <p>Explorez le contenu de {section.title} pour {year.replace("-", " ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrancaisYear;

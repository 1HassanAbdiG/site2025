import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Activites.module.css";

const Activite = () => {
  const { annee } = useParams(); // 🔹 Récupère le paramètre dynamique depuis l'URL
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    // 🔍 Log pour vérifier la valeur exacte d’“annee”
    console.log("🧩 Valeur du paramètre annee :", annee);

    setCardsVisible(true);
  }, [annee]);

  return (
    <div className={styles.container}>
      <h1>Bienvenue dans votre espace d'apprentissage – {annee}</h1>

      <div className={styles.subjectCards}>
        {/* 🧮 Mathématiques */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ""}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#4CAF50" strokeWidth="5" />
            <text x="50" y="85" textAnchor="middle" fill="#4CAF50" fontSize="12">
              Maths
            </text>
          </svg>
          <h2>Mathématiques</h2>
          <p>
            Découvrez nos leçons de mathématiques adaptées à votre niveau :
            addition, soustraction, multiplication et plus encore !
          </p>
          <Link to={`/activites/${annee}/Mathematiques`} className={styles.button}>
            Commencer
          </Link>
        </div>

        {/* 📘 Français */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ""}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#2196F3" opacity="0.2" />
            <path d="M30 40 Q50 20 70 40" fill="none" stroke="#2196F3" strokeWidth="3" />
            <path d="M30 50 L70 50 M30 60 L70 60" stroke="#2196F3" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#2196F3" fontSize="12">
              Français
            </text>
          </svg>
          <h2>Français</h2>
          <p>
            Améliorez votre français avec des exercices de grammaire,
            conjugaison, orthographe et lecture adaptés à votre niveau.
          </p>
          <Link to={`/activites/${annee}/Francais`} className={styles.button}>
            Explorer
          </Link>
        </div>

        {/* 🔬 Sciences */}
        <div className={`${styles.card} ${cardsVisible ? styles.cardVisible : ""}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" opacity="0.2" />
            <path d="M45 30 L55 30 L60 45 L50 70 L40 45 Z" fill="#4CAF50" opacity="0.4" />
            <circle cx="50" cy="40" r="10" fill="none" stroke="#4CAF50" strokeWidth="3" />
            <text x="50" y="85" textAnchor="middle" fill="#4CAF50" fontSize="12">
              Sciences
            </text>
          </svg>

          <h2>Sciences</h2>
          <p>
            Explore les sciences à travers des exercices, des activités ludiques et des jeux interactifs.
          </p>

          <Link to={`/activites/${annee}/sciences`} className={styles.button}>
            Accéder
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Activite;

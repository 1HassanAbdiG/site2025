import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import niveaux from "./Accueil.json";
import styles from "./Accueil.module.css";


const Accueil = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.orangeSection}>
        <h1>Bienvenue dans ton espace d'apprentissage 🧠</h1>
        <p>Découvre des activités et des exercices interactifs adaptés à ton année scolaire !</p>
      </section>

      <section className={styles.greenSection}>
        <h2>Choisis ton année scolaire 🎓</h2>
        <div className={styles.grid}>
          {niveaux.map((n, i) => (
            <Link
              key={i}
              to={`/activites/${n.niveau}`}
              className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
              style={{ borderColor: n.color }}
            >
              <div className={styles.icon} style={{ color: n.color }}>{n.icon}</div>
              <h3>{n.niveau.replace("-", " ")}</h3>
            </Link>
          ))}
        </div>
       
      </section>
    </div>
  );
};

export default Accueil;

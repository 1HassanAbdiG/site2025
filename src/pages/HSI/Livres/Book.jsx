import React, { useState, useEffect } from "react";
import styles from "./Book.module.css";

export default function StoryBook({ story }) {
  const [spread, setSpread] = useState(0);
  const [sound, setSound] = useState(true);

  const maxSpread = Math.ceil(story.pages.length / 2) - 1;

  const playSound = () => {
    if (!sound) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const next = () => { if (spread < maxSpread) { setSpread(spread + 1); playSound(); } };
  const prev = () => { if (spread > 0) { setSpread(spread - 1); playSound(); } };
  const toggleSound = () => setSound(!sound);

  // Étoiles décoratives
  useEffect(() => {
    const stars = document.getElementById("stars");
    if (stars && stars.children.length === 0) {
      const emojis = ["⭐", "✨", "💫", "🌟"];
      for (let i = 0; i < 20; i++) {
        const s = document.createElement("div");
        s.className = styles.star;
        s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = Math.random() * 3 + "s";
        stars.appendChild(s);
      }
    }
  }, []);

  const renderPage = (page, index, side) => (
    <div key={index} className={`${styles.page} ${side === "left" ? styles.leftSide : styles.rightSide}`}>
      <div className={`${styles.pageContent} ${page.type === "cover" ? styles.cover : ""}`}>
        {page.type === "cover" && (
          <>
            <div className={styles.emojiDecoration}>{page.content}</div>
            <h1>{page.title}</h1>
            <p>{page.subtitle}</p>
            <div className={styles.emojiDecoration}>{page.emoji}</div>
          </>
        )}
        {page.type === "text" && (
          <>
            <div className={styles.pageText}>
              <h2>{page.title}</h2>
              <p>{page.content}</p>
            </div>
            <div className={styles.pageNumber}>{index + 1}</div>
          </>
        )}
        {page.type === "image" && (
          <>
            <div className={styles.pageImage}>
              <div className={styles.icon}>{page.icon}</div>
            </div>
            <div className={styles.pageNumber}>{index + 1}</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.bookContainer}>
      <div className={styles.stars} id="stars"></div>
      <div className={styles.soundEffect} onClick={toggleSound} title={sound ? "Son activé" : "Son désactivé"}>
        {sound ? "🔊" : "🔇"}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${(spread / maxSpread) * 100}%` }}></div>
      </div>
      <div className={styles.book}>
        {renderPage(story.pages[spread * 2], spread * 2, "left")}
        {story.pages[spread * 2 + 1] && renderPage(story.pages[spread * 2 + 1], spread * 2 + 1, "right")}
      </div>
      <div className={styles.navigation}>
        <button onClick={prev} disabled={spread === 0}><span>← Précédent</span></button>
        <button onClick={next} disabled={spread === maxSpread}><span>Suivant →</span></button>
      </div>
    </div>
  );
}

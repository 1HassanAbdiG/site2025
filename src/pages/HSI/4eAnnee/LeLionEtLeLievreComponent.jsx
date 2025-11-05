import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "./LeLionEtLeLievre.json";

export default function LeLionEtLeLievreComponent() {
  const story = data.story;
  const quizSections = data.quiz.sections;
  const [openSection, setOpenSection] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [openSelect, setOpenSelect] = useState({});
  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("4e Année");
  const [envoiEffectue, setEnvoiEffectue] = useState(false);

  // 🔹 Validation du quiz
  const validateAllAnswers = () => {
    let allAutoAnswersFilled = true;
    const newFeedbacks = { ...feedbacks };

    quizSections.forEach((section, sIndex) => {
      section.questions.forEach((q, qIndex) => {
        const key = `${sIndex}-${qIndex}`;
        if (typeof q.answer === "boolean" || (q.options && typeof q.answer === "string")) {
          const studentAnswer = answers[key];
          if (studentAnswer === undefined) allAutoAnswersFilled = false;
          else {
            let correct = false;
            if (typeof q.answer === "boolean") correct = studentAnswer === q.answer;
            else if (q.options) correct = studentAnswer?.trim().toLowerCase() === q.answer.trim().toLowerCase();
            newFeedbacks[key] = correct ? "correct" : "incorrect";
          }
        }
      });
    });

    if (allAutoAnswersFilled) {
      setFeedbacks(newFeedbacks);
      setIsValidated(true);
      setShowValidationError(false);
    } else setShowValidationError(true);
  };

  const totalAutoQuestions = quizSections.reduce(
    (acc, sec) =>
      acc + sec.questions.filter((q) => typeof q.answer === "boolean" || (q.options && typeof q.answer === "string")).length,
    0
  );
  const totalCorrect = Object.values(feedbacks).filter((f) => f === "correct").length;

  const cardStyle = {
    background: "#fff",
    borderRadius: "15px",
    border: "2px solid #2E7D32",
    padding: "25px",
    marginBottom: "18px",
    boxShadow: "0 4px 12px rgba(46,125,50,0.1)",
  };

  const buttonStyle = {
    base: {
      background: "#2E7D32",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: "25px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "16px",
      marginBottom: "10px",
    },
    hover: { transform: "translateY(-1px)", boxShadow: "0 3px 8px rgba(46,125,50,0.2)" },
    false: { background: "#e07b7b", color: "#fff" },
    validate: {
      background: "#1B5E20",
      color: "#fff",
      padding: "14px 28px",
      borderRadius: "25px",
      border: "none",
      fontWeight: "700",
      cursor: "pointer",
      width: "100%",
      fontSize: "18px",
      margin: "20px 0 10px 0",
      boxShadow: "0 4px 12px rgba(27,94,32,0.3)",
    },
  };

  const inputStyle = {
    padding: "12px 16px",
    borderRadius: "20px",
    border: "2px solid #2E7D32",
    width: "100%",
    fontSize: "20px",
    marginBottom: "14px",
    outline: "none",
  };

  const questionStyle = {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#021303",
    lineHeight: "1.5",
  };

  // 🔹 Vérifier si au moins une question courte/longue existe
  const hasLongOrShortQuestions = quizSections.some((section) =>
    section.questions.some((q) => !q.options && typeof q.answer === "string")
  );

  // 🔹 Envoi des réponses courtes/longues à Google Sheet
  const handleSubmitToSheet = async () => {
    if (envoiEffectue) return;
    const rows = [];
    quizSections.forEach((section, sIndex) => {
      section.questions.forEach((q, qIndex) => {
        const key = `${sIndex}-${qIndex}`;
        if (!q.options && typeof q.answer === "string") {
          rows.push({
            nom,
            classe,
            section: section.title,
            question: q.question,
            reponse: answers[key] || "",
          });
        }
      });
    });

    // Remplacer par ton URL Google Script
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyiPbQwNuHQUCH8O2VBfzC92J4XP7CCTMIWRDJui9it27MZbqtzItZbtPwikKS2ym0FuQ/exec";
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ action: "quiz", data: rows }),
      });
      setEnvoiEffectue(true);
      alert("Réponses envoyées à l'enseignant !");
    } catch {
      alert("Erreur lors de l'envoi des réponses.");
    }
  };

  return (
    <div style={{ padding: "25px", background: "#E8F5E9", minHeight: "100vh", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Nom et Classe */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <input type="text" placeholder="Nom de l'élève" value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} disabled={envoiEffectue} />
        <input type="text" placeholder="Classe" value={classe} onChange={(e) => setClasse(e.target.value)} style={inputStyle} disabled={envoiEffectue} />
      </div>

      {/* Histoire */}
      <motion.div style={cardStyle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ textAlign: "center", color: "#2E7D32", fontSize: "30px", fontWeight: "800", marginBottom: "15px" }}>
          {data.title}
        </h1>
        <p style={{ whiteSpace: "pre-line", lineHeight: "1.3", fontSize: "22px", color: "#100101" }}>{story.text}</p>
      </motion.div>

      {/* Sections */}
      {quizSections.map((section, sIndex) => (
        <motion.div key={sIndex} style={cardStyle} layout whileHover={{ y: -3 }}>
          <button
            style={{ ...buttonStyle.base, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", fontSize: "20px" }}
            onClick={() => setOpenSection(openSection === sIndex ? null : sIndex)}
          >
            <span style={{ fontWeight: "200", color: "#fff" }}>{section.title}</span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>{openSection === sIndex ? "▲" : "▼"}</span>
          </button>

          <AnimatePresence>
            {openSection === sIndex && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginTop: "10px" }}
              >
                {section.questions.map((q, qIndex) => {
                  const key = `${sIndex}-${qIndex}`;
                
                  const isShortAnswer = !q.options && typeof q.answer === "string" && q.answer.trim().split(" ").length === 1;
                  const isLongAnswer = !q.options && typeof q.answer === "string" && q.answer.trim().split(" ").length > 1;

                  return (
                    <div key={qIndex} style={{ background: "#f9f9f9", borderRadius: "10px", padding: "18px", marginBottom: "12px", borderLeft: "4px solid #2E7D32" }}>
                      <p style={questionStyle}>
                        {nom && classe ? `${nom} (${classe}) - ` : ""}{qIndex + 1}. {q.question}
                      </p>

                      {/* Vrai / Faux */}
                      {typeof q.answer === "boolean" && (
                        <div style={{ display: "flex", gap: "1px", marginBottom: "14px" }}>
                          <motion.button
                            whileHover={buttonStyle.hover}
                            style={{ ...buttonStyle.base, flex: 1, background: answers[key] === true ? "#1B5E20" : "#2E7D32" }}
                            onClick={() => setAnswers({ ...answers, [key]: true })}
                          >
                            Vrai
                          </motion.button>
                          <motion.button
                            whileHover={buttonStyle.hover}
                            style={{ ...buttonStyle.base, ...buttonStyle.false, flex: 1, background: answers[key] === false ? "#C62828" : "#D32F2F" }}
                            onClick={() => setAnswers({ ...answers, [key]: false })}
                          >
                            Faux
                          </motion.button>
                        </div>
                      )}

                      {/* QCM */}
                      {q.options && (
                        <div style={{ marginBottom: "12px", position: "relative" }}>
                          <div
                            style={{ ...inputStyle, cursor: "pointer", background: "#fff" }}
                            onClick={() => setOpenSelect({ ...openSelect, [key]: !openSelect[key] })}
                          >
                            {answers[key] || "Sélectionner une option"}
                          </div>
                          {openSelect[key] && (
                            <div
                              style={{
                                position: "absolute",
                                width: "100%",
                                background: "#fff",
                                border: "2px solid #2E7D32",
                                borderRadius: "10px",
                                marginTop: "2px",
                                zIndex: 100,
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
                            >
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  style={{ padding: "10px 14px", cursor: "pointer", fontSize: "16px", borderBottom: i !== q.options.length - 1 ? "1px solid #ccc" : "none" }}
                                  onClick={() => {
                                    setAnswers({ ...answers, [key]: opt });
                                    setOpenSelect({ ...openSelect, [key]: false });
                                  }}
                                >
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Courtes / longues */}
                      {(isShortAnswer || isLongAnswer) &&
                        (isLongAnswer ? (
                          <textarea
                            style={{ ...inputStyle, height: "110px", resize: "vertical" }}
                            value={answers[key] || ""}
                            onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
                            placeholder="Ta réponse détaillée ici..."
                          />
                        ) : (
                          <input
                            style={inputStyle}
                            type="text"
                            value={answers[key] || ""}
                            onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
                            placeholder="Ta réponse courte..."
                          />
                        ))}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Validation globale */}
      {!isValidated && (
        <motion.div style={{ textAlign: "center", marginTop: "25px" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.button style={buttonStyle.validate} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={validateAllAnswers}>
            Valider le quiz
          </motion.button>
          {showValidationError && (
            <p style={{ color: "#D32F2F", fontWeight: "600", marginTop: "10px" }}>
              ⚠ Veuillez répondre à toutes les questions (Vrai/Faux et QCM) avant de valider.
            </p>
          )}
        </motion.div>
      )}

      {/* Bouton envoyer réponses courtes/longues */}
      {hasLongOrShortQuestions && !envoiEffectue && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button style={{ ...buttonStyle.base, width: "50%", margin: "0 auto" }} onClick={handleSubmitToSheet}>
            📨 Envoyer les réponses à l'enseignant
          </button>
        </div>
      )}

      {/* Score final */}
      {isValidated && (
        <motion.div
          style={{
            ...cardStyle,
            textAlign: "center",
            background: "linear-gradient(135deg, #2E7D32, #388E3C)",
            color: "#fff",
            padding: "25px",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "12px" }}>🎉 Félicitations ! Tu as terminé le quiz !</h2>
          <p style={{ fontSize: "20px", marginBottom: "15px" }}>
            Ton score : <strong>{totalCorrect}</strong> / {totalAutoQuestions}
          </p>
          <p style={{ fontSize: "16px", opacity: 0.9, maxWidth: "80%", margin: "0 auto" }}>{data.finalQuiz.message}</p>
        </motion.div>
      )}
    </div>
  );
}

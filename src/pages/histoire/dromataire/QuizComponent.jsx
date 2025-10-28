import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { blue, pink, yellow, lightGreen, orange } from "@mui/material/colors";
import quizData from "./question.json";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAGOq7-8jaUKhyLc9iEvxkBHrGWhSEr9JuWp5qhxkKezm6QwA7g87zXbBcR0eo3bgR/exec";
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const QuizComponent = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(null);
  const [shuffledQuizData, setShuffledQuizData] = useState(null);
  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("2e Année");
  const [message, setMessage] = useState("");
  const [envoiEffectue, setEnvoiEffectue] = useState(false);

  // Mélange les questions et options
  useEffect(() => {
    const shuffledSections = quizData.sections.map((section) => ({
      ...section,
      questions: shuffleArray(
        section.questions.map((q) => ({ ...q, options: shuffleArray(q.options) }))
      ),
    }));
    setShuffledQuizData({ sections: shuffledSections });
  }, []);

  // Enregistre la réponse de l'élève
  const handleChange = (id, value) => {
    if (envoiEffectue) return; // Empêche de modifier après envoi
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  // Valide une section
  const handleValidation = (sectionId) => {
    if (!shuffledQuizData) return;
    const section = shuffledQuizData.sections.find((sec) => sec.title === sectionId);
    if (!section) return;

    let correctAnswers = 0;
    section.questions.forEach((q) => {
      if (userAnswers[q.question] === q.correctAnswer) correctAnswers += 1;
    });

    setScores((prev) => ({ ...prev, [sectionId]: correctAnswers }));
  };

  // Soumet le quiz complet
  const handleSubmitQuiz = async () => {
    if (envoiEffectue) {
      setMessage("⚠️ Vous avez déjà envoyé vos réponses.");
      return;
    }

    if (!nom.trim()) {
      setMessage("⚠️ Merci de saisir ton nom !");
      return;
    }

    // Vérifie que toutes les questions ont été répondues
    for (const section of shuffledQuizData.sections) {
      for (const q of section.questions) {
        if (!userAnswers[q.question]) {
          setMessage(`⚠️ Veuillez répondre à toutes les questions de "${section.title}"`);
          return;
        }
      }
    }

    // Calcul des scores
    let allSectionScores = {};
    shuffledQuizData.sections.forEach((section) => {
      let correctAnswers = 0;
      section.questions.forEach((q) => {
        if (userAnswers[q.question] === q.correctAnswer) correctAnswers += 1;
      });
      allSectionScores[section.title] = correctAnswers;
    });

    const total = Object.values(allSectionScores).reduce((sum, val) => sum + val, 0);
    setTotalScore(total);

    // Prépare l'objet à envoyer
    const quizResult = {
      action: "quiz",
      nom,
      classe,
      totalScore: total,
      ...allSectionScores,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // évite CORS
        body: JSON.stringify(quizResult),
      });
      setMessage(`✅ Score envoyé avec succès ! Total : ${total}`);
      setEnvoiEffectue(true); // Bloque nouvel envoi
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setMessage("❌ Impossible de se connecter au serveur.");
    }
  };

  // Réinitialisation
  const handleReset = () => {
    setUserAnswers({});
    setScores({});
    setTotalScore(null);
    setNom("");
    setClasse("2e Année");
    setMessage("");
    setEnvoiEffectue(false);

    const shuffledSections = quizData.sections.map((section) => ({
      ...section,
      questions: shuffleArray(
        section.questions.map((q) => ({ ...q, options: shuffleArray(q.options) }))
      ),
    }));
    setShuffledQuizData({ sections: shuffledSections });
  };

  if (!shuffledQuizData) return <Typography>Chargement du quiz...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, backgroundColor: "#fff5ee", borderRadius: "10px", paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: orange[600], fontWeight: "bold", textAlign: "center" }}>
        🌟 Quiz Amusant : Dodo le Dromadaire 🌟
      </Typography>

      {/* Nom et Classe */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 3, flexWrap: "wrap" }}>
        <TextField label="Nom de l'élève" variant="outlined" value={nom} onChange={(e) => setNom(e.target.value)} disabled={envoiEffectue} />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Classe</InputLabel>
          <Select value={classe} onChange={(e) => setClasse(e.target.value)} disabled={envoiEffectue}>
            <MenuItem value="2e Année">2e Année</MenuItem>
            <MenuItem value="3e Année">3e Année</MenuItem>
            <MenuItem value="4e Année">4e Année</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quiz Sections */}
      {shuffledQuizData.sections.map((section) => (
        <Accordion key={section.title} sx={{ marginBottom: 2, backgroundColor: lightGreen[50] }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: orange[600] }} />} sx={{ backgroundColor: yellow[100] }}>
            <Typography variant="h6" sx={{ color: blue[800], fontWeight: "bold" }}>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#f0f4f8", padding: 2 }}>
            {section.questions.map((q) => (
              <Box key={q.question} sx={{ marginTop: 2 }}>
                <Typography variant="body1" sx={{ fontSize: "1.4rem" }}>{q.question}</Typography>
                <FormControl fullWidth sx={{ marginTop: 1 }}>
                  <InputLabel id={`${q.question}-label`}>Choisir une réponse</InputLabel>
                  <Select
                    labelId={`${q.question}-label`}
                    value={userAnswers[q.question] || ""}
                    onChange={(e) => handleChange(q.question, e.target.value)}
                    label="Choisir une réponse"
                    disabled={envoiEffectue}
                  >
                    {q.options.map((opt, idx) => <MenuItem key={idx} value={opt}>{opt}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
            ))}
            <Button variant="contained" sx={{ marginTop: 2, backgroundColor: pink[400] }} onClick={() => handleValidation(section.title)} disabled={envoiEffectue}>
              ✅ Valider cette partie
            </Button>
            {scores[section.title] !== undefined && (
              <Typography sx={{ marginTop: 1, color: blue[800] }}>
                🎯 Score : {scores[section.title]} / {section.questions.length}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Actions */}
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" sx={{ backgroundColor: orange[600], flex: 1, marginRight: 1 }} onClick={handleSubmitQuiz}>
          🧮 Calculer & Enregistrer
        </Button>
        <Button variant="contained" sx={{ backgroundColor: pink[300], flex: 1, marginLeft: 1 }} onClick={handleReset}>
          🔄 Réinitialiser
        </Button>
      </Box>

      {/* Message */}
      {message && <Typography sx={{ marginTop: 2, textAlign: "center", fontWeight: "bold", color: message.includes("✅") ? "green" : "red" }}>{message}</Typography>}

      {/* Score total */}
      {totalScore !== null && <Typography variant="h5" sx={{ mt: 3, textAlign: "center", fontWeight: "bold", color: blue[800] }}>
        Score total : {totalScore} / {shuffledQuizData.sections.reduce((sum, sec) => sum + sec.questions.length, 0)}
      </Typography>}
    </Container>
  );
};

export default QuizComponent;

import React, { useState } from "react";
import {
  Box, Button, Container, Typography, Paper,
  TextField, Stack, Divider, Chip, Card, CardContent,
  LinearProgress, Fade, Zoom,  Grow, Collapse, Grid
} from "@mui/material";
import {
  Person, School, Assignment, EmojiEvents,
  CheckCircle,  AutoStories, Quiz, Visibility, VisibilityOff
} from "@mui/icons-material";
import quizData from "./quizData.json";
import QuizSection from "./QuizSections";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqwnISDO3dGOwmMTH5mZHKki_gn09jiULMMd_deTPBmLCcwicn6gAYUYgvW9TJ3QXL0w/exec";

export default function FrenchReadingQuiz() {
  const [activeTab, setActiveTab] = useState("form");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [scores, setScores] = useState({});
  const [student, setStudent] = useState({ name: "", grade: "" });
  const [message, setMessage] = useState("");
  const [quizSent, setQuizSent] = useState(false);
  const [showText, setShowText] = useState(true);

  // Palette noir, blanc et vert
  const colors = {
    primary: "#00c853",
    secondary: "#00e676",
    accent: "#00a344",
    success: "#00c853",
    warning: "#ffab00",
    background: "#000000",
    cardBg: "#1a1a1a",
    text: "#ffffff",
    border: "#333333",
    lightGray: "#666666"
  };

  const handleAnswer = (section, index, value) => {
    setAnswers({ ...answers, [`${section}-${index}`]: value });
  };

  const handleSubmit = (sectionId, questions) => {
    const unanswered = questions.some((q, i) => answers[`${sectionId}-${i}`] === undefined || answers[`${sectionId}-${i}`] === "");
    if (unanswered) {
      setMessage("⚠️ Veuillez répondre à toutes les questions avant de continuer !");
      return;
    }

    const correct = questions.reduce(
      (acc, { a }, index) => (answers[`${sectionId}-${index}`] === a ? acc + 1 : acc),
      0
    );
    setScores({ ...scores, [sectionId]: correct });
    setSubmitted({ ...submitted, [sectionId]: true });
    setMessage("");
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const totalQuestions = quizData.sections.reduce((acc, section) => acc + section.questions.length, 0);

  const getProgress = () => {
    const totalSteps = quizData.sections.length + 1; 
    const currentStep = activeTab === "form" ? 0 : activeTab === "summary" ? totalSteps : 
      Array.from({length: quizData.sections.length}, (_, i) => quizData.sections[i].id)
      .indexOf(activeTab) + 1;
    return Math.min((currentStep / totalSteps) * 100, 100);
  };

  const progress = getProgress();

  const sendToGoogleSheets = async () => {
    if (!student.name || !student.grade) {
      setMessage("⚠️ Veuillez remplir votre nom et votre classe !");
      return;
    }
    if (quizSent) return;

    const date = new Date().toISOString();
    const payload = {
      nom: student.name,
      classe: student.grade,
      titre: quizData.title,
      totalScore,
      date
    };
    quizData.sections.forEach(section => {
      payload[section.id] = scores[section.id] || 0;
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setQuizSent(true);
      setMessage("🎉 Félicitations ! Vos réponses ont été envoyées avec succès !");
    } catch (err) {
      console.error(err);
      setMessage("🎉 Félicitations ! Vos réponses ont été envoyées avec succès !");
    }
  };

  const getScoreColor = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.secondary;
    if (percentage >= 40) return colors.warning;
    return "#f44336";
  };

  return (
    <Box sx={{ minHeight: "100vh", background: colors.background, py: 4, position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {/* Progression */}
        <Fade in={activeTab !== "form"}>
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                mb: 3, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: colors.border,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: colors.primary,
                  backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 75%, transparent 75%, transparent)",
                  backgroundSize: "20px 20px",
                  animation: "progressAnimation 1s linear infinite"
                }
              }} 
            />
            <Typography variant="body2" sx={{ color: colors.lightGray, textAlign: "center", mb: 2 }}>
              Progression : {Math.round(progress)}%
            </Typography>
          </Box>
        </Fade>

        <Zoom in timeout={800}>
          <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: colors.cardBg, backdropFilter: "blur(10px)", border: `1px solid ${colors.border}` }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <CheckCircle sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
              <Typography variant="h3" sx={{ color: colors.text, fontWeight: "bold", mb: 1 }}>
                {quizData.title}
              </Typography>
              <Chip icon={<Quiz sx={{ color: colors.primary }} />} label="Quiz de Lecture" sx={{ backgroundColor: "rgba(0, 200, 83, 0.1)", color: colors.primary, border: `1px solid ${colors.primary}30`, fontWeight: "bold" }} />
            </Box>

            {/* Formulaire */}
            {activeTab === "form" && (
              <Grow in timeout={600}>
                <Stack spacing={3}>
                  <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}`, borderRadius: 2 }}>
                    <CardContent>
                      <Stack spacing={3}>
                        <TextField
                          label="Nom de l'élève"
                          value={student.name}
                          onChange={e => setStudent({ ...student, name: e.target.value })}
                          fullWidth
                          InputProps={{ startAdornment: <Person sx={{ color: colors.primary, mr: 1 }} /> }}
                          sx={{ "& .MuiOutlinedInput-root": { color: colors.text, "& fieldset": { borderColor: colors.border }, "&:hover fieldset": { borderColor: colors.primary }, "&.Mui-focused fieldset": { borderColor: colors.primary, boxShadow: `0 0 0 2px ${colors.primary}20` } }, "& .MuiInputLabel-root": { color: colors.lightGray, "&.Mui-focused": { color: colors.primary } } }}
                        />
                        <TextField
                          label="Classe"
                          value={student.grade}
                          onChange={e => setStudent({ ...student, grade: e.target.value })}
                          fullWidth
                          InputProps={{ startAdornment: <School sx={{ color: colors.primary, mr: 1 }} /> }}
                          sx={{ "& .MuiOutlinedInput-root": { color: colors.text, "& fieldset": { borderColor: colors.border }, "&:hover fieldset": { borderColor: colors.primary }, "&.Mui-focused fieldset": { borderColor: colors.primary, boxShadow: `0 0 0 2px ${colors.primary}20` } }, "& .MuiInputLabel-root": { color: colors.lightGray, "&.Mui-focused": { color: colors.primary } } }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  <Button
                    variant="contained"
                    startIcon={<Assignment />}
                    sx={{ backgroundColor: colors.primary, color: "#000", ":hover": { backgroundColor: colors.secondary, transform: "translateY(-2px)", boxShadow: `0 8px 25px ${colors.primary}40` }, py: 2, fontWeight: "bold", fontSize: "1.1rem", transition: "all 0.3s ease", borderRadius: 2 }}
                    size="large"
                    onClick={() => setActiveTab(quizData.sections[0].id)}
                    disabled={!student.name || !student.grade}
                  >
                    Commencer le Quiz
                  </Button>
                </Stack>
              </Grow>
            )}

            {/* Contenu principal : Texte + Quiz */}
            {activeTab !== "form" && (
              <Grid container spacing={3}>
                {/* Texte toujours visible */}
                <Grid item >
                  <Card sx={{ backgroundColor: "rgba(24, 100, 85, 0.05)", border: `1px solid ${colors.border}`, borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold", display: "flex", alignItems: "center" }}>
                          <AutoStories sx={{ mr: 1 }} />
                          Texte à lire
                        </Typography>
                        <Button
                          startIcon={showText ? <VisibilityOff /> : <Visibility />}
                          onClick={() => setShowText(!showText)}
                          sx={{ color: colors.primary, border: `1px solid ${colors.primary}`, '&:hover': { backgroundColor: 'rgba(0,200,83,0.1)' } }}
                          variant="outlined"
                          size="large"
                        >
                          {showText ? "Cacher le texte" : "Afficher le texte"}
                        </Button>
                      </Box>
                      <Collapse in={showText}>
                        <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 2 }}>
                          {quizData.text.split("\n").map((line, i) => (
                            <Typography key={i} variant="body1" sx={{ mb: 2, color: colors.text, lineHeight: 1.7 ,fontSize:"25px"}}>
                              {line}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Quiz à droite */}
                
                <Grid item  sx={{ width: '100%' }}>
                   
                  {quizData.sections.map((section, idx) =>
                    activeTab === section.id && (
                      <QuizSection
                        key={section.id}
                        {...section}
                        answers={answers}
                        submitted={submitted[section.id]}
                        onAnswer={handleAnswer}
                        onSubmit={() => handleSubmit(section.id, section.questions)}
                        onNext={() => {
                          const nextSection = quizData.sections[idx + 1];
                          if (nextSection) setActiveTab(nextSection.id);
                          else setActiveTab("summary");
                        }}
                        disableReset
                        colors={colors}
                        onShowText={() => setShowText(true)}
                      />
                    )
                  )}
                   

                  {/* Résumé final */}
                  {activeTab === "summary" && (
                    <Grow in timeout={800}>
                      <Box textAlign="center" sx={{ mt: 3, color: colors.text }}>
                        <EmojiEvents sx={{ fontSize: 64, color: colors.primary, mb: 2 }} />
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>✅ Quiz Terminé !</Typography>
                        <Button
                          startIcon={<AutoStories />}
                          onClick={() => setShowText(true)}
                          sx={{ color: colors.primary, border: `1px solid ${colors.primary}`, mb: 3, '&:hover': { backgroundColor: 'rgba(0,200,83,0.1)' } }}
                          variant="outlined"
                        >
                          Revoir le texte
                        </Button>

                        <Card sx={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}`, borderRadius: 2 }}>
                          <CardContent>
                            <Typography variant="h6" sx={{ color: colors.primary, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                              <Person sx={{ mr: 1 }} /> Élève : {student.name} ({student.grade})
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: colors.border }} />
                            <Stack spacing={2} alignItems="center">
                              {Object.keys(scores).map(s => {
                                const section = quizData.sections.find(sec => sec.id === s);
                                const maxScore = section?.questions.length || 1;
                                return (
                                  <Box key={s} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 300, p: 1.5, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.03)" }}>
                                    <Typography variant="body1">{section?.title || s.toUpperCase()}:</Typography>
                                    <Chip label={`${scores[s]}/${maxScore}`} sx={{ backgroundColor: getScoreColor(scores[s], maxScore), color: "#000", fontWeight: "bold" }} />
                                  </Box>
                                );
                              })}
                            </Stack>
                            <Divider sx={{ my: 3, borderColor: colors.border }} />
                            <Typography variant="h5" sx={{ color: colors.primary, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <CheckCircle sx={{ mr: 1 }} /> Score Total : {totalScore}/{totalQuestions}
                            </Typography>
                          </CardContent>
                        </Card>

                        <Button
                          variant="contained"
                          startIcon={quizSent ? <CheckCircle /> : <Assignment />}
                          sx={{ mt: 3, py: 1.5, px: 4, fontWeight: "bold", backgroundColor: quizSent ? colors.secondary : colors.primary, color: "#000", ":hover": { backgroundColor: quizSent ? colors.secondary : colors.primary, transform: quizSent ? "none" : "translateY(-2px)", boxShadow: quizSent ? "none" : `0 8px 25px ${colors.primary}40` }, borderRadius: 2 }}
                          onClick={sendToGoogleSheets}
                          disabled={quizSent}
                        >
                          {quizSent ? "✅ Résultat envoyé" : "Envoyer les résultats"}
                        </Button>

                        {message && (
                          <Fade in timeout={500}>
                            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: quizSent ? colors.primary : colors.warning, p: 2, borderRadius: 1, backgroundColor: quizSent ? "rgba(0, 200, 83, 0.1)" : "rgba(255, 171, 0, 0.1)", border: `1px solid ${quizSent ? colors.primary : colors.warning}30` }}>
                              {message}
                            </Typography>
                          </Fade>
                        )}
                      </Box>
                    </Grow>
                  )}
                </Grid>
              </Grid>
            )}
          </Paper>
        </Zoom>
      </Container>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes progressAnimation {
          0% { background-position: 0 0; }
          100% { background-position: 20px 0; }
        }
      `}</style>
    </Box>
  );
}

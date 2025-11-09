import React, { useState, useEffect } from "react";
import {
  Box, Button, Container, Typography, Paper,
  TextField, Stack, Divider, Chip, Card, CardContent,
  LinearProgress, Fade, Zoom,  Grow, Collapse, Grid,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import {
  Person, School, Assignment, EmojiEvents,
  CheckCircle,  AutoStories, Quiz, Visibility, VisibilityOff
} from "@mui/icons-material";
import QuizSection from "./QuizSections";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqwnISDO3dGOwmMTH5mZHKki_gn09jiULMMd_deTPBmLCcwicn6gAYUYgvW9TJ3QXL0w/exec";

// Liste de tous les quiz disponibles
const availableQuizzes = [
  { label: "Le Visiteur Masqué", file: "visiteur.json" },
  { label: "L’Ambition de Gagner", file: "ambition.json" }
];




export default function FrenchReadingQuiz() {
  const [quizData, setQuizData] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [scores, setScores] = useState({});
  const [student, setStudent] = useState({ name: "", grade: "" });
  const [message, setMessage] = useState("");
  const [quizSent, setQuizSent] = useState(false);
  const [showText, setShowText] = useState(true);

  const colors = {
    primary: "#00c853",
    secondary: "#00e676",
    background: "#000000",
    cardBg: "#1a1a1a",
    text: "#ffffff",
    border: "#333333",
    lightGray: "#666666"
  };

  useEffect(() => {
    if (!selectedQuiz) return;
    import(`./${selectedQuiz}`)
      .then(data => setQuizData(data.default || data))
      .catch(err => console.error(err));
    setActiveTab("form");
    setAnswers({});
    setSubmitted({});
    setScores({});
    setQuizSent(false);
    setMessage("");
  }, [selectedQuiz]);

  if (selectedQuiz && !quizData)
    return <Typography sx={{ color: "#fff", textAlign:"center", mt:5 }}>Chargement du quiz...</Typography>;

  const handleAnswer = (section, index, value) => setAnswers({ ...answers, [`${section}-${index}`]: value });
  const handleSubmit = (sectionId, questions) => {
    const unanswered = questions.some((q,i) => answers[`${sectionId}-${i}`]===undefined||answers[`${sectionId}-${i}`]==="");
    if(unanswered){ setMessage("⚠️ Veuillez répondre à toutes les questions !"); return; }
    const correct = questions.reduce((acc,{a},i)=> answers[`${sectionId}-${i}`]===a? acc+1: acc,0);
    setScores({...scores,[sectionId]:correct});
    setSubmitted({...submitted,[sectionId]:true});
    setMessage("");
  };

  const totalScore = Object.values(scores).reduce((a,b)=>a+b,0);
  const totalQuestions = quizData?.sections.reduce((acc,s)=>acc+s.questions.length,0) || 0;
  const progress = quizData ? Math.min((activeTab==="form"?0:activeTab==="summary"?quizData.sections.length+1: quizData.sections.findIndex(s=>s.id===activeTab)+1)/(quizData.sections.length+1)*100,100) : 0;

  const getScoreColor = (score,max)=> (score/max*100 >=80?colors.primary: score/max*100>=60?colors.secondary:"#ff5722");

  return (
    <Box sx={{ minHeight:"100vh", background: colors.background, py:4 }}>
      <Container maxWidth="lg">
        {/* Sélection du quiz */}
        {!selectedQuiz && (
          <Card sx={{ p:3, mb:3 }}>
            <FormControl fullWidth>
              <InputLabel>Choisir le quiz</InputLabel>
              <Select value={selectedQuiz} onChange={e=>setSelectedQuiz(e.target.value)}>
                {availableQuizzes.map(q=><MenuItem key={q.file} value={q.file}>{q.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Card>
        )}

        {quizData && (
          <>
          {/* Progression */}
          <Fade in={activeTab !== "form"}>
            <Box mb={2}><LinearProgress variant="determinate" value={progress} /></Box>
          </Fade>

          <Paper sx={{ p:3, borderRadius:2,  }}>
            {/* Formulaire élève */}
            {activeTab==="form" && (
              <Stack spacing={2}>
                <TextField label="Nom" value={student.name} onChange={e=>setStudent({...student,name:e.target.value})} fullWidth/>
                <TextField label="Classe" value={student.grade} onChange={e=>setStudent({...student,grade:e.target.value})} fullWidth/>
                <Button variant="contained" disabled={!student.name || !student.grade} onClick={()=>setActiveTab(quizData.sections[0].id)}>Commencer</Button>
              </Stack>
            )}

            {/* Quiz + texte */}
            {activeTab!=="form" && activeTab!=="summary" && quizData.sections.map((sec,i)=>activeTab===sec.id && (
              <QuizSection key={sec.id} {...sec} answers={answers} submitted={submitted[sec.id]} onAnswer={handleAnswer} onSubmit={()=>handleSubmit(sec.id,sec.questions)} onNext={()=>i+1<quizData.sections.length?setActiveTab(quizData.sections[i+1].id):setActiveTab("summary")} colors={colors}/>
            ))}

            {/* Résumé */}
            {activeTab==="summary" && (
              <Stack spacing={2} textAlign="center" >
                <Typography variant="h4" sx={{color:"#fff"}}>✅ Quiz Terminé</Typography>
                <Typography sx={{color:"#fff"}}>Score: {totalScore}/{totalQuestions}</Typography>
                <Button variant="contained" onClick={()=>setShowText(true)}>Revoir le texte</Button>
              </Stack>
            )}
          </Paper>
          </>
        )}
      </Container>
    </Box>
  );
}

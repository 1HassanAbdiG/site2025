import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function BilanEvaluation({ state, quizData }) {
  const { sections } = quizData;
  const answers = sections.answers;

  // Helper pour vérifier la réponse
  const isCorrect = (section, id, word = null) => {
    if (section === 'verbes') return answers.verbesATrouver.includes(word);
    if (section === 'conjugaison') return (state.conjugaison[id] || '').trim().toLowerCase() === answers.conjugaison[id].toLowerCase();
    return state[section][id] === answers[section][id];
  };

  // Calcul des points
  let totalPoints = 0;
  let earnedPoints = 0;

  // Points par section
  const pointsParSection = {
    vraiFaux: 5,
    qcmTexte: 5,
    qcmVocab: 5,
    relier: 5,
    verbes: 5,
    conjugaison: 5
  };

  const sectionsList = ['vraiFaux', 'qcmTexte', 'qcmVocab', 'relier', 'verbes', 'conjugaison'];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, textAlign: 'center', color: '#2575fc' }}>
        📊 Bilan de l'évaluation
      </Typography>

      {sectionsList.map(section => {
        let items = sections[section] || [];
        if (section === 'verbes') items = state.verbes || [];

        // Points obtenus et total pour la section
        let sectionPoints = 0;
       // let sectionTotal = section === 'verbes' ? items.length : items.length;

        return (
          <Card key={section} sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                {section === 'vraiFaux' && '1️⃣ Vrai/Faux'}
                {section === 'qcmTexte' && '2️⃣ QCM sur le texte'}
                {section === 'qcmVocab' && '3️⃣ Vocabulaire'}
                {section === 'relier' && '4️⃣ Relier'}
                {section === 'verbes' && '5️⃣ Verbes à trouver'}
                {section === 'conjugaison' && '6️⃣ Conjugaison'}
                {" "}({pointsParSection[section]} pts)
              </Typography>

              {section === 'verbes' && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Verbes trouvés : {state.verbes.length} / {quizData.sections.verbesATrouver.length}
                </Typography>
              )}

              <Grid container spacing={1}>
                {section !== 'verbes' ? items.map((q, i) => {
                  const correct = isCorrect(section, q.id);
                  if (correct) sectionPoints++;
                  totalPoints++;
                  if (correct) earnedPoints++;

                  return (
                    <Grid item xs={12} key={q.id}>
                      <Box
                        sx={{
                          p: 1.5,
                          mb: 1,
                          background: correct ? '#e0f7e9' : '#ffe6e6',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {i + 1}. {q.text || q.question}
                        </Typography>
                        {correct ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                      </Box>
                    </Grid>
                  );
                }) : items.map((v, i) => {
                  const correct = isCorrect('verbes', null, v);
                  if (correct) sectionPoints++;
                  totalPoints++;
                  if (correct) earnedPoints++;

                  return (
                    <Grid item xs={12} key={i}>
                      <Box
                        sx={{
                          p: 1.5,
                          mb: 1,
                          background: correct ? '#e0f7e9' : '#ffe6e6',
                          borderRadius: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="body1">{v}</Typography>
                        {correct ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Points par section */}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                Points obtenus dans cette section : {sectionPoints} / {pointsParSection[section]}
              </Typography>
            </CardContent>
          </Card>
        );
      })}

      {/* Résultat final */}
      <Card sx={{ borderRadius: 3, boxShadow: 4, background: '#f0f4ff' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>🎯 Résultat final</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2575fc' }}>
            {earnedPoints} / {totalPoints} pts
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

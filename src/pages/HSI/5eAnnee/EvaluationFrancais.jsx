import React, { useState, useMemo } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Box,
    Button,
    Chip,
    LinearProgress,
    TextField,
    Avatar,
    Select,
    MenuItem,
    Stack
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

import quizData from './quizData.json';
import BilanEvaluation from './BilanEvaluation';

export default function EvaluationFrancaisPro() {
    const [state, setState] = useState({
        vraiFaux: {},
        qcmTexte: {},
        qcmVocab: {},
        relier: {},
        verbes: [],
        conjugaison: {}
    });

    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const totalPossible = quizData.meta.totalPoints;

    const handleChange = (section, key, value) => {
        setState(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    };

    const toggleVerbe = (w) => {
        setState(prev => {
            const exists = prev.verbes.includes(w);
            return { ...prev, verbes: exists ? prev.verbes.filter(x => x !== w) : [...prev.verbes, w] };
        });
    };

    const calculateScore = () => {
        let total = 0;
        const ans = quizData.sections.answers;

        Object.keys(ans.vraiFaux).forEach(k => {
            if (state.vraiFaux[k] === ans.vraiFaux[k]) total += 1;
        });

        Object.keys(ans.qcmTexte).forEach(k => {
            if (state.qcmTexte[k] === ans.qcmTexte[k]) total += 1;
        });

        Object.keys(ans.qcmVocab).forEach(k => {
            if (state.qcmVocab[k] === ans.qcmVocab[k]) total += 1;
        });

        Object.keys(ans.relier).forEach(k => {
            if (state.relier[k] === ans.relier[k]) total += 1;
        });

        ans.verbesATrouver.forEach(v => {
            if (state.verbes.includes(v)) total += 1;
        });

        Object.keys(ans.conjugaison).forEach(k => {
            if ((state.conjugaison[k] || '').trim().toLowerCase() === ans.conjugaison[k].toLowerCase()) total += 1;
        });

        setScore(total);
        setSubmitted(true);
    };

    const progress = useMemo(() => {
        return Math.round((
            Object.keys(state.vraiFaux).length +
            Object.keys(state.qcmTexte).length +
            Object.keys(state.qcmVocab).length +
            Object.keys(state.relier).length +
            state.verbes.length +
            Object.keys(state.conjugaison).length
        ) / totalPossible * 100);
    }, [state, totalPossible]); // ✅ totalPossible ajouté aux dépendances

    const cardColors = {
        vraiFaux: '#d0f0c0',
        qcmTexte: '#f0e68c',
        qcmVocab: '#ffcccb',
        relier: '#add8e6',
        verbes: '#ffe4b5',
        conjugaison: '#dda0dd'
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 6, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ background: 'linear-gradient(90deg,#6a11cb,#2575fc)', color: '#fff', p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack>
                            <Typography variant="h4" sx={{ fontWeight: 900 }}>{quizData.meta.title}</Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                {quizData.meta.grade} • {quizData.meta.totalPoints} pts
                            </Typography>
                        </Stack>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                            <EmojiEventsIcon fontSize="large" />
                        </Avatar>
                    </Stack>
                </Box>

                <CardContent sx={{ p: 4, background: '#f6f9ff' }}>
                    {/* Texte à lire */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: '#e3f2fd' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0d47a1' }}>📖 Texte à lire</Typography>
                        <Typography variant="body1" sx={{ textAlign: 'justify', fontSize: '1.1rem' }}>
                            {quizData.texte}
                        </Typography>
                    </Card>

                    {/* 1️⃣ Vrai / Faux */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: cardColors.vraiFaux }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#006400' }}>1️⃣ Vrai / Faux</Typography>
                        {quizData.sections.vraiFaux.map((q, i) => (
                            <Box key={q.id} sx={{ my: 1.5, p: 1.5, background: '#fff', borderRadius: 2 }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {i + 1}. {q.text}
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        value={state.vraiFaux[q.id] || ''}
                                        onChange={(e) => handleChange('vraiFaux', q.id, e.target.value)}
                                    >
                                        <FormControlLabel value="vrai" control={<Radio />} label="Vrai" disabled={submitted} />
                                        <FormControlLabel value="faux" control={<Radio />} label="Faux" disabled={submitted} />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ))}
                    </Card>

                    {/* 2️⃣ QCM Texte */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: cardColors.qcmTexte }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#b8860b' }}>2️⃣ QCM sur le texte</Typography>
                        {quizData.sections.qcmTexte.map(q => (
                            <Box key={q.id} sx={{ my: 1.5, p: 1.5, background: '#fff', borderRadius: 2 }}>
                                <FormControl>
                                    <FormLabel sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{q.question}</FormLabel>
                                    <RadioGroup
                                        value={state.qcmTexte[q.id] || ''}
                                        onChange={(e) => handleChange('qcmTexte', q.id, e.target.value)}
                                    >
                                        {q.options.map(o => (
                                            <FormControlLabel key={o.k} value={o.k} control={<Radio />} label={`${o.k}) ${o.t}`} disabled={submitted} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ))}
                    </Card>

                    {/* 3️⃣ Vocabulaire */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: cardColors.qcmVocab }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#b22222' }}>3️⃣ Vocabulaire</Typography>
                        {quizData.sections.qcmVocab.map(q => (
                            <Box key={q.id} sx={{ my: 1.5, p: 1.5, background: '#fff', borderRadius: 2 }}>
                                <FormControl>
                                    <FormLabel sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{q.question}</FormLabel>
                                    <RadioGroup
                                        value={state.qcmVocab[q.id] || ''}
                                        onChange={(e) => handleChange('qcmVocab', q.id, e.target.value)}
                                    >
                                        {q.options.map(o => (
                                            <FormControlLabel key={o.k} value={o.k} control={<Radio />} label={`${o.k}) ${o.t}`} disabled={submitted} />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ))}
                    </Card>

                    {/* 4️⃣ Relier */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: cardColors.relier }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#4682b4' }}>4️⃣ Relier</Typography>
                        <Grid container spacing={2}>
                            {quizData.sections.relier.map(item => (
                                <Grid item xs={12} key={item.id}>
                                    <Box sx={{
                                        p: 2,
                                        background: '#fff',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 3
                                    }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.2rem', width: '200px' }}>
                                            {item.sujet}
                                        </Typography>
                                        <FormControl sx={{ minWidth: 250 }}>
                                            <Select
                                                value={state.relier[item.id] || ''}
                                                onChange={(e) => handleChange('relier', item.id, e.target.value)}
                                                disabled={submitted}
                                                sx={{ height: 50, fontSize: '1.1rem', borderRadius: 2, background: '#fafafa' }}
                                            >
                                                <MenuItem value=""><em>Choisir</em></MenuItem>
                                                {quizData.sections.relierOptions.map(opt => (
                                                    <MenuItem key={opt.id} value={opt.id} sx={{ fontSize: '1.1rem' }}>
                                                        {opt.text}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>

                    {/* 5️⃣ Verbes à trouver */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: cardColors.verbes }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ff8c00' }}>5️⃣ Trouver les verbes conjugués</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Cliquez sur les mots qui sont des verbes conjugués dans chaque phrase ci-dessous.
                        </Typography>
                        {quizData.texte2.split('\n').map((phrase, idx) => (
                            <Box key={idx} sx={{ mb: 2, p: 2, background: '#fff', borderRadius: 2 }}>
                                {phrase.split(' ').map((w, i) => {
                                    const clean = w.replace(/[.,]/g, '');
                                    const isFound = state.verbes.includes(clean);
                                    const shouldBe = quizData.sections.verbesATrouver.includes(clean);
                                    let color = isFound ? (submitted ? (shouldBe ? 'success' : 'warning') : 'primary') : 'default';
                                    return (
                                        <Chip
                                            key={i}
                                            label={w}
                                            onClick={() => !submitted && toggleVerbe(clean)}
                                            clickable={!submitted}
                                            color={color}
                                            sx={{ m: 0.5, cursor: submitted ? 'default' : 'pointer' }}
                                        />
                                    );
                                })}
                            </Box>
                        ))}
                    </Card>

                    {/* 6️⃣ Conjugaison */}
                    <Card sx={{ p: 3, mb: 3, borderRadius: 3, background: cardColors.conjugaison }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#800080' }}>6️⃣ Conjugaison</Typography>
                        <Grid container spacing={2}>
                            {quizData.sections.conjugaison.map((c, i) => (
                                <Grid item xs={12} md={6} key={c.id}>
                                    <Box sx={{ p: 2, background: '#fff', borderRadius: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>{i + 1}. {c.phrase}</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={state.conjugaison[c.id] || ''}
                                            onChange={(e) => setState(prev => ({
                                                ...prev,
                                                conjugaison: { ...prev.conjugaison, [c.id]: e.target.value }
                                            }))}
                                            disabled={submitted}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>

                    {/* Footer / Bilan */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                        <LinearProgress
                            variant="determinate"
                            value={submitted ? (score / totalPossible * 100) : Math.max(progress, 5)}
                            sx={{ height: 12, borderRadius: 6 }}
                        />
                        {!submitted ? (
                            <Button
                                variant="contained"
                                size="large"
                                onClick={calculateScore}
                                startIcon={<AutoGraphIcon />}
                            >
                                Soumettre l'évaluation
                            </Button>
                        ) : (
                            <BilanEvaluation state={state} quizData={quizData} />
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

import React, { useState, useEffect } from 'react';

const CHALLENGES = {
    facile: {
        name: "Débutant (1-10)",
        color: "#10b981",
        questions: [
            { a: 4, b: 7 }, { a: 2, b: 9 }, { a: 10, b: 6 }, { a: 5, b: 8 },
            { a: 9, b: 4 }, { a: 6, b: 10 }, { a: 8, b: 3 }, { a: 1, b: 9 },
            { a: 10, b: 5 }, { a: 7, b: 4 }, { a: 3, b: 6 }, { a: 2, b: 8 },
            { a: 5, b: 7 }, { a: 9, b: 2 }, { a: 6, b: 3 }, { a: 8, b: 10 },
            { a: 1, b: 4 }, { a: 7, b: 9 }, { a: 10, b: 1 }, { a: 3, b: 5 }
        ]
    },
    moyen: {
        name: "Intermédiaire (1-12)",
        color: "#f59e0b",
        questions: [
            { a: 4, b: 7 }, { a: 8, b: 9 }, { a: 12, b: 6 }, { a: 7, b: 11 },
            { a: 5, b: 12 }, { a: 10, b: 8 }, { a: 9, b: 7 }, { a: 12, b: 5 },
            { a: 11, b: 4 }, { a: 6, b: 10 }, { a: 3, b: 8 }, { a: 2, b: 9 },
            { a: 7, b: 3 }, { a: 12, b: 1 }, { a: 5, b: 6 }, { a: 9, b: 12 },
            { a: 4, b: 11 }, { a: 8, b: 2 }, { a: 10, b: 5 }, { a: 6, b: 7 }
        ]
    },
    difficile: {
        name: "Avancé (1-15)",
        color: "#f97316",
        questions: [
            { a: 4, b: 15 }, { a: 12, b: 7 }, { a: 15, b: 9 }, { a: 8, b: 13 },
            { a: 14, b: 6 }, { a: 5, b: 11 }, { a: 9, b: 14 }, { a: 15, b: 4 },
            { a: 10, b: 12 }, { a: 13, b: 8 }, { a: 6, b: 15 }, { a: 7, b: 9 },
            { a: 2, b: 14 }, { a: 11, b: 5 }, { a: 3, b: 12 }, { a: 1, b: 10 },
            { a: 8, b: 6 }, { a: 12, b: 3 }, { a: 15, b: 2 }, { a: 4, b: 9 }
        ]
    },
    expert: {
        name: "Expert (1-20)",
        color: "#dc2626",
        questions: [
            { a: 4, b: 17 }, { a: 12, b: 5 }, { a: 19, b: 8 }, { a: 7, b: 20 },
            { a: 15, b: 4 }, { a: 9, b: 18 }, { a: 6, b: 11 }, { a: 20, b: 7 },
            { a: 14, b: 16 }, { a: 11, b: 9 }, { a: 3, b: 12 }, { a: 10, b: 5 },
            { a: 8, b: 13 }, { a: 17, b: 6 }, { a: 2, b: 19 }, { a: 5, b: 14 },
            { a: 13, b: 3 }, { a: 16, b: 8 }, { a: 1, b: 20 }, { a: 18, b: 4 }
        ]
    }
};

export default function MultiplicationChallenge() {
    const [gameState, setGameState] = useState('menu');
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [bestScores, setBestScores] = useState({});
    const [timerStarted, setTimerStarted] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(null);

    useEffect(() => {
        if (gameState === 'playing' && timerStarted) {
            const timer = setTimeout(() => setTimeElapsed(timeElapsed + 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeElapsed, gameState, timerStarted]);

    const startGame = (level) => {
        setSelectedLevel(level);
        setGameState('playing');
        setCurrentQuestion(0);
        setScore(0);
        setUserAnswer('');
        setAnswers([]);
        setTimeElapsed(0);
        setTimerStarted(false);
        setQuestionStartTime(null);
    };

    const checkAnswer = () => {
        if (!timerStarted) {
            setTimerStarted(true);
            setQuestionStartTime(Date.now());
        }

        const question = CHALLENGES[selectedLevel].questions[currentQuestion];
        const correctAnswer = question.a * question.b;
        const isAnswerCorrect = parseInt(userAnswer) === correctAnswer;

        const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 0;

        const newAnswers = [...answers, {
            question: `${question.a} × ${question.b}`,
            userAnswer,
            correctAnswer,
            isCorrect: isAnswerCorrect,
            timeTaken
        }];
        setAnswers(newAnswers);

        if (isAnswerCorrect) {
            setScore(score + 10);
        }

        setUserAnswer('');
        if (currentQuestion < CHALLENGES[selectedLevel].questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setQuestionStartTime(Date.now());
        } else {
            endGame();
        }
    };

    const endGame = () => {
        if (!bestScores[selectedLevel] || score > bestScores[selectedLevel]) {
            setBestScores({ ...bestScores, [selectedLevel]: score });
        }
        setGameState('finished');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userAnswer && gameState === 'playing') {
            checkAnswer();
        }
    };

    const resetGame = () => {
        setGameState('menu');
        setSelectedLevel(null);
    };

    const renderMenu = () => (
        <div style={styles.container}>
            <div style={styles.menuHeader}>
                <div style={styles.trophy}>🏆</div>
                <h1 style={styles.title}>Concours de Multiplication</h1>
                <p style={styles.subtitle}>Choisissez votre niveau de défi</p>
            </div>
            <div style={styles.levelGrid}>
                {Object.entries(CHALLENGES).map(([key, challenge]) => (
                    <div
                        key={key}
                        style={{ ...styles.levelCard, borderColor: challenge.color }}
                        onClick={() => startGame(key)}
                    >
                        {bestScores[key] && (
                            <div style={{ ...styles.badge, backgroundColor: challenge.color }}>
                                ⭐ Meilleur: {bestScores[key]}
                            </div>
                        )}
                        <h2 style={{ ...styles.levelName, color: challenge.color }}>
                            {challenge.name}
                        </h2>
                        <div style={styles.levelInfo}>
                            <span>📝 {challenge.questions.length} questions</span>
                        </div>
                        <button style={{ ...styles.startButton, backgroundColor: challenge.color }}>
                            ▶️ Commencer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGame = () => {
        const challenge = CHALLENGES[selectedLevel];
        const question = challenge.questions[currentQuestion];
        const progress = ((currentQuestion + 1) / challenge.questions.length) * 100;

        return (
            <div style={styles.container}>
                <div style={{ ...styles.gameHeader, backgroundColor: challenge.color }}>
                    <div style={styles.statsChip}>
                        <span>⏱️ {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2,'0')}</span>
                    </div>
                    <div style={styles.statsChip}>
                        <span>Question {currentQuestion + 1}/{challenge.questions.length}</span>
                    </div>
                    <div style={styles.statsChip}>
                        <span>⭐ {score} pts</span>
                    </div>
                </div>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                </div>
                <div style={styles.questionCard}>
                    <h1 style={styles.question}>
                        {question.a} × {question.b} = ?
                    </h1>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Votre réponse"
                        style={styles.input}
                        autoFocus
                    />
                    <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        style={{
                            ...styles.validateButton,
                            opacity: userAnswer ? 1 : 0.5,
                            cursor: userAnswer ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Valider
                    </button>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        const challenge = CHALLENGES[selectedLevel];
        const correctCount = answers.filter(a => a.isCorrect).length;
        const accuracy = (correctCount / answers.length * 100).toFixed(1);

        return (
            <div style={styles.container}>
                <div style={{ ...styles.resultsHeader, backgroundColor: challenge.color }}>
                    <div style={styles.trophyBig}>🏆</div>
                    <h1 style={{ color: 'white', margin: '10px 0' }}>Résultats</h1>
                </div>
                <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, backgroundColor: '#10b98120' }}>
                        <h2 style={styles.statValue}>{score}</h2>
                        <p style={styles.statLabel}>Score Final</p>
                    </div>
                    <div style={{ ...styles.statCard, backgroundColor: '#3b82f620' }}>
                        <h2 style={styles.statValue}>{correctCount}/{answers.length}</h2>
                        <p style={styles.statLabel}>Correctes</p>
                    </div>
                    <div style={{ ...styles.statCard, backgroundColor: '#f59e0b20' }}>
                        <h2 style={styles.statValue}>{accuracy}%</h2>
                        <p style={styles.statLabel}>Précision</p>
                    </div>
                </div>
                <div style={styles.answersContainer}>
                    <h3 style={styles.answersTitle}>📊 Détails des réponses et rapidité</h3>
                    {answers.map((answer, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.answerItem,
                                backgroundColor: answer.isCorrect ? '#10b98120' : '#ef444420',
                                borderLeft: `4px solid ${answer.isCorrect ? '#10b981' : '#ef4444'}`
                            }}
                        >
                            <span style={styles.answerQuestion}>{answer.question}</span>
                            <span style={styles.answerDetails}>
                                Votre réponse: {answer.userAnswer} | Correcte: {answer.correctAnswer} | ⏱️ {answer.timeTaken}s
                            </span>
                            <span style={{ fontSize: '1.5rem' }}>
                                {answer.isCorrect ? '✅' : '❌'}
                            </span>
                        </div>
                    ))}
                </div>
                <div style={styles.buttonGroup}>
                    <button
                        style={styles.retryButton}
                        onClick={() => startGame(selectedLevel)}
                    >
                        🔄 Rejouer
                    </button>
                    <button
                        style={styles.menuButton}
                        onClick={resetGame}
                    >
                        🏠 Menu Principal
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.app}>
            {gameState === 'menu' && renderMenu()}
            {gameState === 'playing' && renderGame()}
            {gameState === 'finished' && renderResults()}
        </div>
    );
}

// -------------------- Styles (inchangés) --------------------
const styles = {
    app: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
    menuHeader: { textAlign: 'center', marginBottom: '40px' },
    trophy: { fontSize: '80px', marginBottom: '20px' },
    title: { fontSize: '3rem', fontWeight: 'bold', color: '#6366f1', margin: '10px 0' },
    subtitle: { fontSize: '1.3rem', color: '#6b7280', margin: '10px 0' },
    levelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '30px' },
    levelCard: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', border: '3px solid', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    badge: { position: 'absolute', top: '-12px', right: '20px', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' },
    levelName: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px' },
    levelInfo: { display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', color: '#6b7280', marginBottom: '20px' },
    startButton: { width: '100%', padding: '14px', fontSize: '1.1rem', fontWeight: 'bold', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },
    gameHeader: { padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    statsChip: { backgroundColor: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.1rem' },
    progressBar: { height: '10px', backgroundColor: '#e5e7eb', borderRadius: '10px', overflow: 'hidden', marginBottom: '30px' },
    progressFill: { height: '100%', backgroundColor: '#6366f1', transition: 'width 0.3s ease' },
    questionCard: { backgroundColor: 'white', padding: '60px 40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' },
    question: { fontSize: '4rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '30px' },
    input: { width: '100%', padding: '20px', fontSize: '2rem', textAlign: 'center', border: '2px solid #e5e7eb', borderRadius: '12px', marginBottom: '20px', fontWeight: 'bold', outline: 'none', transition: 'border-color 0.2s' },
    validateButton: { width: '100%', padding: '18px', fontSize: '1.3rem', fontWeight: 'bold', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' },
    resultsHeader: { padding: '40px', borderRadius: '16px', textAlign: 'center', marginBottom: '30px' },
    trophyBig: { fontSize: '80px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { padding: '25px', borderRadius: '12px', textAlign: 'center', border: '2px solid #e5e7eb' },
    statValue: { fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 5px 0' },
    statLabel: { fontSize: '0.9rem', color: '#6b7280', margin: 0 },
    answersContainer: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', marginBottom: '20px' },
    answersTitle: { marginBottom: '20px', fontSize: '1.3rem' },
    answerItem: { padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
    answerQuestion: { fontWeight: 'bold', fontSize: '1.1rem' },
    answerDetails: { fontSize: '0.9rem', color: '#6b7280', flex: 1 },
    buttonGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    retryButton: { padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: 'white', color: '#6366f1', border: '2px solid #6366f1', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' },
    menuButton: { padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }
};

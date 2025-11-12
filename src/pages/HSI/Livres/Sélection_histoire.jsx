import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { VolumeUp, VolumeOff, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { storiesData } from './storiesData';
import { bookStyles } from './styles';

const MagicBook = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentStory = storiesData.stories[currentStoryIndex];
  const pages = currentStory.pages;
  const maxSpread = Math.ceil(pages.length / 2) - 1;

  // Effet sonore
  const playSound = () => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Navigation
  const nextPage = () => {
    if (currentSpread < maxSpread) {
      setCurrentSpread(prev => prev + 1);
      playSound();
    }
  };
  const previousPage = () => {
    if (currentSpread > 0) {
      setCurrentSpread(prev => prev - 1);
      playSound();
    }
  };
  const nextStory = () => {
    if (currentStoryIndex < storiesData.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSpread(0);
      playSound();
    }
  };
  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSpread(0);
      playSound();
    }
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') previousPage();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, maxSpread]);

  // Barre de progression
  const progress = maxSpread > 0 ? (currentSpread / maxSpread) * 100 : 0;

  // Composant de page
  const renderPage = (page, index, side) => {
    if (!page) return null;
    return (
      <Box
        className={`page ${side}`}
        sx={bookStyles.page(side, isMobile)}
      >
        <Box
          className="page-content"
          sx={bookStyles.pageContent(page, isMobile)}
        >
          {page.type === 'cover' && (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontSize: isMobile ? '32px' : '48px',
                  mb: 2,
                  textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                  animation: 'pulse 2s ease-in-out infinite',
                  textAlign: 'center',
                  fontFamily: '"Comic Sans MS", cursive'
                }}
              >
                {page.content.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontStyle: 'italic',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  textAlign: 'center'
                }}
              >
                {page.content.subtitle}
              </Typography>
              <Box
                component="img"
                src={page.content.image}
                sx={{
                  width: isMobile ? '150px' : '200px',
                  height: isMobile ? '150px' : '200px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  mt: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              />
            </>
          )}
          {page.type === 'text' && (
            <>
              <Typography
                variant="h2"
                sx={{
                  fontSize: isMobile ? '24px' : '32px',
                  mb: 3,
                  color: '#667eea',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(102, 126, 234, 0.2)',
                  fontFamily: '"Comic Sans MS", cursive',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: '80px',
                    height: '3px',
                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                    margin: '10px auto 0',
                    borderRadius: '2px'
                  }
                }}
              >
                {page.content.title}
              </Typography>
              <Typography
                sx={{
                  textAlign: 'justify',
                  lineHeight: 2,
                  fontSize: isMobile ? '15px' : '18px',
                  color: '#2c3e50',
                  width: '100%',
                  fontFamily: 'Georgia, serif',
                  textIndent: '30px'
                }}
              >
                {page.content.text.split('\n').map((paragraph, idx) => (
                  <span key={idx}>
                    {paragraph}
                    <br /><br />
                  </span>
                ))}
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  [side === 'left-side' ? 'left' : 'right']: 30,
                  fontSize: '16px',
                  color: '#999',
                  fontWeight: 'bold',
                  fontFamily: 'Georgia, serif'
                }}
              >
                {index + 1}
              </Typography>
            </>
          )}
          {page.type === 'image' && (
            <>
              <Box
                className="page-image"
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'radial-gradient(circle, #e8f4f8 0%, #d4e9f7 100%)',
                  borderRadius: '15px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    animation: 'shimmer 4s linear infinite'
                  }
                }}
              >
                <Box
                  component="img"
                  src={page.content.image}
                  sx={{
                    width: '80%',
                    height: '60%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    animation: 'float 3s ease-in-out infinite',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    zIndex: 1
                  }}
                />
                {page.content.caption && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      fontStyle: 'italic',
                      color: '#666',
                      zIndex: 1
                    }}
                  >
                    {page.content.caption}
                  </Typography>
                )}
              </Box>
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  [side === 'left-side' ? 'left' : 'right']: 30,
                  fontSize: '16px',
                  color: '#999',
                  fontWeight: 'bold',
                  fontFamily: 'Georgia, serif'
                }}
              >
                {index + 1}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={bookStyles.container}>
      {/* En-tête avec sélection d'histoire */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          Histoire actuelle:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            size="small"
            onClick={previousStory}
            disabled={currentStoryIndex === 0}
            startIcon={<NavigateBefore />}
          >
            Préc.
          </Button>
          <Typography variant="body2" sx={{ color: 'white', minWidth: '150px', textAlign: 'center' }}>
            {currentStory.title}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={nextStory}
            disabled={currentStoryIndex === storiesData.stories.length - 1}
            endIcon={<NavigateNext />}
          >
            Suiv.
          </Button>
        </Box>
      </Box>

      {/* Bouton son */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: 'white',
          background: 'rgba(255,255,255,0.2)',
          zIndex: 100
        }}
        onClick={() => setSoundEnabled(!soundEnabled)}
      >
        {soundEnabled ? <VolumeUp /> : <VolumeOff />}
      </IconButton>

      {/* Livre */}
      <Box
        sx={{
          perspective: '2500px',
          width: isMobile ? '100%' : '920px',
          height: isMobile ? '500px' : '640px',
          position: 'relative',
          zIndex: 10,
          filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.4))'
        }}
      >
        {/* Barre de progression */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              borderRadius: 10
            }
          }}
        />

        {/* Conteneur du livre */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            display: 'flex'
          }}
        >
          {/* Page gauche */}
          {renderPage(pages[currentSpread * 2], currentSpread * 2, 'left-side')}

          {/* Page droite */}
          {renderPage(pages[currentSpread * 2 + 1], currentSpread * 2 + 1, 'right-side')}
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            position: 'absolute',
            bottom: isMobile ? -70 : -80,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: isMobile ? 2 : 3,
            zIndex: 100
          }}
        >
          <Button
            variant="contained"
            onClick={previousPage}
            disabled={currentSpread === 0}
            startIcon={<NavigateBefore />}
            sx={{
              padding: isMobile ? '12px 25px' : '15px 40px',
              fontSize: isMobile ? '16px' : '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50px',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)'
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #ccc 0%, #999 100%)'
              }
            }}
          >
            Précédent
          </Button>
          <Button
            variant="contained"
            onClick={nextPage}
            disabled={currentSpread === maxSpread}
            endIcon={<NavigateNext />}
            sx={{
              padding: isMobile ? '12px 25px' : '15px 40px',
              fontSize: isMobile ? '16px' : '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50px',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)'
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #ccc 0%, #999 100%)'
              }
            }}
          >
            Suivant
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MagicBook;

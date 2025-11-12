export const bookStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    position: 'relative',
    overflow: 'hidden',
    '@keyframes gradientShift': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' }
    },
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0px) scale(1)' },
      '50%': { transform: 'translateY(-20px) scale(1.05)' }
    },
    '@keyframes shimmer': {
      '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
      '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
    },
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' }
    }
  },
  page: (side, isMobile) => ({
    position: 'absolute',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(to bottom, #fffef9 0%, #fff8e7 100%)',
    transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
    transformOrigin: side === 'left-side' ? 'right center' : 'left center',
    backfaceVisibility: 'hidden',
    borderRadius: side === 'left-side' ? '8px 0 0 8px' : '0 8px 8px 0',
    border: '3px solid #e0d5b7',
    borderLeft: side === 'left-side' ? '3px solid #e0d5b7' : 'none',
    borderRight: side === 'right-side' ? '3px solid #e0d5b7' : 'none',
    background: side === 'left-side'
      ? 'linear-gradient(to right, #f5f0e1 0%, #fffef9 10%, #fffef9 100%)'
      : 'linear-gradient(to left, #f5f0e1 0%, #fffef9 10%, #fffef9 100%)',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'repeating-linear-gradient(transparent, transparent 29px, rgba(200, 200, 200, 0.1) 29px, rgba(200, 200, 200, 0.1) 30px)',
      pointerEvents: 'none'
    }
  }),
  pageContent: (page, isMobile) => ({
    width: '100%',
    height: '100%',
    padding: isMobile ? '30px 20px' : '50px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...(page.type === 'cover' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      color: 'white'
    })
  }),
  // Ajoute ici d'autres styles si besoin
};

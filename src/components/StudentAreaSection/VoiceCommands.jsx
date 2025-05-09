import React, { useState, useEffect, useRef } from 'react';

const VoiceCommands = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Click mic to start');
  const [isProcessing, setIsProcessing] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(true);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);

  const processCommand = (command) => {
    command = command.toLowerCase().trim();
    console.log('[VoiceCommand] Processing command:', command);
    
    // Map of command keywords to menu IDs
    const commandMap = {
      'dashboard': 'dashboard',
      'lesson': 'lesson',
      'class': 'lesson',
      'classes': 'lesson',
      'assignment': 'assignment',
      'assignments': 'assignment',
      'homework': 'assignment',
      'chatbot': 'chatbot',
      'chat': 'chatbot',
      'badges': 'badges',
      'badge': 'badges',
      'calendar': 'calendar',
      'schedule': 'calendar',
      'logout': 'logout'
    };

    // Check for "open" or "go to" commands
    if (command.includes('open') || command.includes('go to')) {
      for (const [keyword, menuId] of Object.entries(commandMap)) {
        if (command.includes(keyword)) {
          console.log('[VoiceCommand] Matched command:', keyword, '->', menuId);
          return menuId;
        }
      }
    } else {
      // Direct command check
      for (const [keyword, menuId] of Object.entries(commandMap)) {
        if (command === keyword || command.includes(keyword)) {
          console.log('[VoiceCommand] Matched direct command:', keyword, '->', menuId);
          return menuId;
        }
      }
    }

    console.log('[VoiceCommand] No command match found for:', command);
    return null;
  };

  const startRecognition = () => {
    if (!recognitionRef.current) return;

    try {
      setError('');
      setTranscript('');
      setStatusMessage('Starting...');
      recognitionRef.current.start();
    } catch (startError) {
      console.error("[VoiceCommand] Error starting recognition:", startError);
      let startErrorMessage = 'Error starting: ' + startError.message;
      if (startError.name === 'InvalidStateError') {
        startErrorMessage = 'Error: Already started? Please wait.';
      } else if (startError.name === 'NotAllowedError') {
        startErrorMessage = 'Error: Microphone access denied.';
      }
      setError(startErrorMessage);
      setStatusMessage(startErrorMessage);
      setIsListening(false);
    }
  };

  const stopRecognition = () => {
    if (!recognitionRef.current) return;

    try {
      console.log('[VoiceCommand] Stopping recognition...');
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusMessage('Click mic to start');
      setIsProcessing(false);
      
      // Clear any pending timeouts
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
    } catch (stopError) {
      console.error("[VoiceCommand] Error stopping recognition:", stopError);
      setError('Error stopping recognition.');
      setStatusMessage('Error stopping');
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      console.log('[VoiceCommand] Browser supports Speech Recognition API');
      setStatusMessage('Initializing...');
      try {
        recognitionRef.current = new SpeechRecognitionAPI();
        console.log('[VoiceCommand] SpeechRecognitionAPI instance created');
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        try {
          recognitionRef.current.lang = 'en-US';
          console.log('[VoiceCommand] Speech recognition language set to en-US');
        } catch (langError) {
          console.warn('Could not set speech recognition language:', langError);
        }

        recognitionRef.current.onstart = () => {
          console.log('[VoiceCommand] Recognition started.');
          setIsListening(true);
          setError('');
          setTranscript('');
          setStatusMessage('Listening...');
          setIsProcessing(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('[VoiceCommand] Recognition error:', event.error);
          let errorMessage = 'Error: ' + event.error;
          
          switch (event.error) {
            case 'network':
              errorMessage = 'Error: Network issue. Check connection/browser.';
              break;
            case 'not-allowed':
            case 'service-not-allowed':
              errorMessage = 'Error: Microphone access denied. Check browser settings.';
              break;
            case 'no-speech':
              errorMessage = 'Error: No speech detected.';
              break;
            case 'audio-capture':
              errorMessage = 'Error: Microphone issue. Check hardware.';
              break;
            case 'aborted':
              // Ignore aborted errors as they're usually intentional
              return;
            default:
              errorMessage = `Error: ${event.error}`;
          }
          
          setError(errorMessage);
          setStatusMessage(errorMessage);
          setIsListening(false);
          setIsProcessing(false);
        };

        recognitionRef.current.onend = () => {
          console.log('[VoiceCommand] Recognition ended.');
          if (isListening && !error) {
            setStatusMessage('Processing...');
            setIsProcessing(true);
            
            // Only restart if we're still supposed to be listening
            if (isListening) {
              if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
              }
              restartTimeoutRef.current = setTimeout(() => {
                if (isListening) {
                  startRecognition();
                } else {
                  setStatusMessage('Click mic to start');
                  setIsProcessing(false);
                }
              }, 1000);
            }
          }
          setIsListening(false);
        };

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          setTranscript(interimTranscript || finalTranscript);

          if (finalTranscript) {
            const targetMenuId = processCommand(finalTranscript);
            if (targetMenuId) {
              console.log('[VoiceCommand] Executing command:', targetMenuId);
              onCommand(targetMenuId);
              stopRecognition();
            }
          }
        };

        setStatusMessage('Click mic to start');
      } catch (initError) {
        console.error('[VoiceCommand] Error initializing SpeechRecognitionAPI:', initError);
        setError('Error initializing SpeechRecognitionAPI.');
        setStatusMessage('Error initializing');
        setIsListening(false);
        setIsProcessing(false);
      }
    } else {
      setError('Speech recognition is not supported in this browser. Please try Chrome or Firefox.');
      setStatusMessage('Unsupported Browser');
      setBrowserSupport(false);
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        console.log('[VoiceCommand] Cleaning up recognition instance.');
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current = null;
      }
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available.');
      setStatusMessage('Not Available');
      console.error('[VoiceCommand] toggleListening called but recognitionRef is null.');
      return;
    }

    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '6px 12px',
        borderRadius: 8,
        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
        color: error ? '#e74c3c' : isProcessing ? '#4b3fa7' : '#2d2a4a',
        fontSize: 13,
        fontWeight: 500,
        textAlign: 'right',
        transition: 'all 0.2s ease'
      }}>
        {statusMessage}
      </div>

      {transcript && !error && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 12px',
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          color: '#555',
          fontSize: 13,
          maxWidth: 300,
          textAlign: 'right'
        }}>
          {transcript}
        </div>
      )}

      <button
        onClick={toggleListening}
        style={{
          background: isListening ? '#e74c3c' : '#4b3fa7',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        disabled={!browserSupport}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isListening ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </>
          )}
        </svg>
        {isListening && (
          <span
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 16,
              height: 16,
              background: '#e74c3c',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite'
            }}
          />
        )}
      </button>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default VoiceCommands; 
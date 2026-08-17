import React, { useEffect, useRef } from 'react';

interface Props {
  isListening: boolean;
  onVoiceInput: (transcript: string) => void;
  onInterimTranscript: (interim: string) => void;
  narrationText?: string;
}

export const SpeechController: React.FC<Props> = ({ isListening, onVoiceInput, onInterimTranscript, narrationText }) => {
  const recognitionRef = useRef<any>(null);
  const blockedRef = useRef<boolean>(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Voice Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || (window as any).mozSpeechRecognition || (window as any).msSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser environment.');
      return;
    }

    blockedRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript) {
        onInterimTranscript(interimTranscript);
      }

      if (finalTranscript.trim()) {
        console.log('Final Speech Recognized:', finalTranscript);
        onVoiceInput(finalTranscript.trim());
        onInterimTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        blockedRef.current = true;
        console.warn('Microphone permission denied.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      if (!isListening || blockedRef.current || !recognitionRef.current) return;
      retryTimerRef.current = setTimeout(() => {
        if (!isListening || blockedRef.current) return;
        try {
          recognition.start();
        } catch (e) {
          // ignore double-start errors
        }
      }, 300);
    };

    recognitionRef.current = recognition;

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, [onVoiceInput, onInterimTranscript, isListening]);

  // Manage start/stop listening
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [isListening]);

  // Text to Speech (TTS) cancel if narrationText changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [narrationText]);

  return null; // Headless controller component
};


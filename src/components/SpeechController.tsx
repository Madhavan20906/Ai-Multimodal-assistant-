import React, { useEffect, useRef } from 'react';

interface SpeechControllerProps {
  isListening: boolean;
  onVoiceInput: (transcript: string) => void;
  onInterimTranscript: (interim: string) => void;
  narrationText?: string;
}

export const SpeechController: React.FC<SpeechControllerProps> = ({
  isListening,
  onVoiceInput,
  onInterimTranscript,
  narrationText
}) => {
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

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        // Microphone permission denied — stop retrying entirely
        blockedRef.current = true;
        console.warn('Microphone permission denied. Open the app in a new tab to grant access.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      // Do not restart if permission was denied or listening was stopped
      if (!isListening || blockedRef.current || !recognitionRef.current) return;
      // Brief delay before restart to avoid tight spin loops on transient errors
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
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onVoiceInput, onInterimTranscript]);

  // 2. Simulation Display
  const displaySimulation = (simulationData: any) => {
    // Implementation for displaying the simulation
    console.log('Displaying simulation:', simulationData);
  };

  // Manage start/stop listening
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }, [isListening]);

  // 2. Text to Speech (TTS) Narration — Disabled per user request (Voiceover turned off, voice input remains enabled)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any active speech synthesis
    }
  }, [narrationText]);

  return null; // Headless controller component
};

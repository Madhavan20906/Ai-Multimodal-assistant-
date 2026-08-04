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

  // 1. Voice Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser environment.');
      return;
    }

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
      console.warn('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      // Auto-restart if continuous mode is still enabled
      if (isListening && recognitionRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // ignore double start errors
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onVoiceInput, onInterimTranscript]);

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

  // 2. Text to Speech (TTS) Narration
  useEffect(() => {
    if (!narrationText || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Pick a smooth natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [narrationText]);

  return null; // Headless controller component
};

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
<<<<<<< HEAD
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
=======
import { useLanguage } from '@/contexts/LanguageContext';
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931

interface SpeechToTextDemoProps {
  onTranscriptChange?: (transcript: string) => void;
}

// Add types for the web speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

<<<<<<< HEAD
const SpeechToTextDemo = () => {
  const t = useTranslations('speech');
  const locale = useLocale();
  const [isListening, setIsListening] = useState(false);
=======
const SpeechToTextDemo = ({ onTranscriptChange }: SpeechToTextDemoProps) => {
  const { t } = useLanguage();
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
<<<<<<< HEAD
    recognitionRef.current.lang = locale === 'en' ? 'en-US' : 'vi-VN'; // Sử dụng ngôn ngữ hiện tại
=======
    recognitionRef.current.lang = 'vi-VN'; // Set to Vietnamese

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      
      if (onTranscriptChange) {
        onTranscriptChange(fullTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
<<<<<<< HEAD
  }, [isListening, locale]);
=======
  }, [onTranscriptChange]);
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    try {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        setTranscript('');
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const copyToClipboard = () => {
<<<<<<< HEAD
    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        alert(t('demo.copied'));
      })
      .catch((err) => {
        console.error(t('demo.copyError'), err);
      });
=======
    if (!transcript) return;
    
    try {
      navigator.clipboard.writeText(transcript);
      alert(t('product.speech.copySuccess'));
    } catch (err) {
      console.error('Không thể sao chép: ', err);
    }
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
  };

  // If browser doesn't support speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center text-red-500 mb-4">
<<<<<<< HEAD
          <p>{t('demo.notSupported')}</p>
          <p>{t('demo.browserSuggestion')}</p>
=======
          <p>{t('product.speech.notSupported')}</p>
          <p>{t('product.speech.tryDifferentBrowser')}</p>
        </div>
        <div className="flex justify-center">
          <Image 
            src="/images/speech-to-text/microphone.svg"
            alt="Speech Recognition"
            width={64}
            height={64}
            className="mx-auto opacity-50"
          />
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
<<<<<<< HEAD
      <h2 className="text-xl font-semibold mb-4 text-center">{t('demo.title')}</h2>
=======
      <h2 className="text-xl font-semibold mb-4 text-center">{t('product.speech.title')}</h2>
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931

      <div className="flex justify-center mb-6">
        <button
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Image 
            src="/images/speech-to-text/microphone.svg" 
            alt="Microphone" 
            width={32} 
            height={32} 
            className="w-12 h-12 object-contain" 
          />
        </button>
      </div>
      
      <div className="text-center mb-2">
<<<<<<< HEAD
        {isListening ? (
          <p className="text-red-500 font-medium">{t('demo.listening')}</p>
        ) : (
          <p className="text-gray-600">{t('demo.startPrompt')}</p>
=======
        {isRecording ? (
          <p className="text-red-500 font-medium">{t('product.speech.listening')}</p>
        ) : (
          <p className="text-gray-600">{t('product.speech.startPrompt')}</p>
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-4 min-h-40 max-h-60 overflow-y-auto bg-gray-50">
        {transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : (
<<<<<<< HEAD
          <p className="text-gray-400 italic text-center">{t('demo.placeholder')}</p>
=======
          <p className="text-gray-400 italic text-center">{t('product.speech.emptyPrompt')}</p>
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setTranscript('')}
          disabled={!transcript}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
<<<<<<< HEAD
          {t('demo.clear')}
=======
          Clear
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!transcript}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
<<<<<<< HEAD
          {t('demo.copy')}
=======
          Copy
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
        </button>
      </div>

      <div className="mt-6 border-t pt-4 border-gray-200">
<<<<<<< HEAD
        <h3 className="text-sm font-medium mb-2">{t('features.title')}</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>{t('features.item1')}</li>
          <li>{t('features.item2')}</li>
          <li>{t('features.item3')}</li>
          <li>{t('features.item4')}</li>
=======
        <h3 className="text-sm font-medium mb-2">{t('product.speech.featureTitle')}</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Nhận dạng và chuyển giọng nói thành văn bản</li>
          <li>Hỗ trợ nhiều ngôn ngữ khác nhau</li>
          <li>Tốc độ nhận dạng nhanh, độ chính xác cao</li>
          <li>Không giới hạn thời gian nói</li>
          <li>Dễ dàng sao chép văn bản để sử dụng ở nơi khác</li>
>>>>>>> 2dd7eab940a9e801d70f860c807175f6bd32f931
        </ul>
      </div>
    </div>
  );
};

export default SpeechToTextDemo;

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechToTextDemo = () => {
  const t = useTranslations('speech');
  const locale = useLocale();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Kiểm tra xem trình duyệt có hỗ trợ Web Speech API không
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = locale === 'en' ? 'en-US' : 'vi-VN'; // Sử dụng ngôn ngữ hiện tại

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

      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      // Nếu người dùng vẫn đang muốn lắng nghe, khởi động lại recognition
      if (isListening) {
        recognitionRef.current.start();
      }
    };

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, locale]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        alert(t('demo.copied'));
      })
      .catch((err) => {
        console.error(t('demo.copyError'), err);
      });
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center text-red-500 mb-4">
          <p>{t('demo.notSupported')}</p>
          <p>{t('demo.browserSuggestion')}</p>
        </div>
        <Image
          src="/images/speech-to-text/microphone.svg"
          alt="Speech Recognition"
          width={200}
          height={200}
          className="mx-auto opacity-50"
        />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">{t('demo.title')}</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={toggleListening}
          className={`p-4 rounded-full transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <Image
            src="/images/speech-to-text/microphone.svg"
            alt="Microphone"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
        </button>
      </div>

      <div className="text-center mb-2">
        {isListening ? (
          <p className="text-red-500 font-medium">{t('demo.listening')}</p>
        ) : (
          <p className="text-gray-600">{t('demo.startPrompt')}</p>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-4 min-h-40 max-h-60 overflow-y-auto bg-gray-50">
        {transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic text-center">{t('demo.placeholder')}</p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={clearTranscript}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={!transcript}
        >
          {t('demo.clear')}
        </button>

        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          disabled={!transcript}
        >
          {t('demo.copy')}
        </button>
      </div>

      <div className="mt-6 border-t pt-4 border-gray-200">
        <h3 className="text-sm font-medium mb-2">{t('features.title')}</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>{t('features.item1')}</li>
          <li>{t('features.item2')}</li>
          <li>{t('features.item3')}</li>
          <li>{t('features.item4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechToTextDemo;

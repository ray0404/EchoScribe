/**
 * EchoScribe - Offline-first Audio Recording & Transcription PWA
 * Copyright (C) 2025 Adolfo Ray Valentin Olguin
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Source code: https://github.com/ray0404/EchoScribe
 */
import { useState, useRef, useEffect } from 'react';

export const useAudioRecorder = (deviceId?: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  const getBluetoothMic = async () => {
    if (deviceId) return { deviceId: { exact: deviceId } };

    const devices = await navigator.mediaDevices.enumerateDevices();
    const bluetooth = devices.find(d => 
      d.kind === 'audioinput' && 
      (d.label.toLowerCase().includes('bluetooth') || d.label.toLowerCase().includes('headset'))
    );
    return bluetooth ? { deviceId: { exact: bluetooth.deviceId } } : undefined;
  };

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const audioConstraints = await getBluetoothMic();
      const constraints = { 
        audio: audioConstraints || true 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
        // Release wake lock
        if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Request Wake Lock
      if ('wakeLock' in navigator) {
          try {
              wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
              console.log('Wake Lock active');
          } catch (err) {
              console.warn('Wake Lock failed', err);
          }
      }

    } catch (err) {
      console.error("Mic error", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return { isRecording, startRecording, stopRecording, audioBlob, setAudioBlob };
};
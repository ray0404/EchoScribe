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
import React, { useEffect, useState } from 'react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useSyncQueue } from './hooks/useSyncQueue';
import { db } from './db/database';
import { useLiveQuery } from 'dexie-react-hooks';
import DeviceSelector from './components/DeviceSelector';
import { Mic, Square, Wifi, WifiOff } from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const { isRecording, startRecording, stopRecording, audioBlob, setAudioBlob } = useAudioRecorder(selectedDeviceId);
  const { isOnline, syncStatus } = useSyncQueue();
  
  const recordings = useLiveQuery(() => db.recordings.orderBy('timestamp').reverse().toArray());

  // Save blob when recording finishes
  useEffect(() => {
    if (audioBlob) {
      db.recordings.add({
        timestamp: new Date(),
        blob: audioBlob,
        status: 'pending'
      });
      setAudioBlob(null); // Reset
    }
  }, [audioBlob]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">EchoScribe</h1>
        <div className="flex items-center gap-2 text-sm">
          {isOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          <span className={isOnline ? 'text-green-600' : 'text-red-500'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          {syncStatus === 'syncing' && <span className="text-blue-500 ml-2 animate-pulse">Syncing...</span>}
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <DeviceSelector onDeviceSelect={setSelectedDeviceId} />
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={clsx(
                "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isRecording ? (
                <Square className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>
          </div>
          <p className="text-center mt-4 text-gray-500">
            {isRecording ? 'Recording... (Screen Wake Lock Active)' : 'Tap to Record'}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Recordings</h2>
          {recordings?.map(rec => (
            <div key={rec.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {rec.timestamp.toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-500">
                  {rec.timestamp.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "text-xs px-2 py-1 rounded-full",
                  rec.status === 'synced' && "bg-green-100 text-green-700",
                  rec.status === 'pending' && "bg-yellow-100 text-yellow-700",
                  rec.status === 'uploading' && "bg-blue-100 text-blue-700",
                  rec.status === 'failed' && "bg-red-100 text-red-700"
                )}>
                  {rec.status}
                </span>
                {rec.blob && (
                    <audio src={URL.createObjectURL(rec.blob)} controls className="h-8 w-24" />
                )}
              </div>
            </div>
          ))}
          {recordings?.length === 0 && (
            <p className="text-center text-gray-400 py-4">No recordings yet.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
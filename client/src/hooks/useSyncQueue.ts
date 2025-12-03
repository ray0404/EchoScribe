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
import { useEffect, useState } from 'react';
import { db } from '../db/database';

export const useSyncQueue = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing'>('idle');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const sync = async () => {
    if (!isOnline) return;
    setSyncStatus('syncing');

    try {
      const pending = await db.recordings.where('status').equals('pending').toArray();
      
      for (const record of pending) {
        if (!record.id) continue;
        
        try {
          // Update status to uploading
          await db.recordings.update(record.id, { status: 'uploading' });

          const formData = new FormData();
          formData.append('file', record.blob, `recording-${record.id}.webm`);

          // Replace with your actual API endpoint
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_URL}/transcribe/${record.id}`, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            await db.recordings.update(record.id, { status: 'synced' });
          } else {
            console.error('Upload failed');
            await db.recordings.update(record.id, { status: 'failed' }); // Or revert to pending
          }
        } catch (error) {
          console.error('Sync error for record', record.id, error);
          await db.recordings.update(record.id, { status: 'pending' }); // Retry later
        }
      }
    } finally {
      setSyncStatus('idle');
    }
  };

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline) {
      sync();
    }
  }, [isOnline]);

  return { isOnline, syncStatus, sync };
};
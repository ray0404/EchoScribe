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
import Dexie, { Table } from 'dexie';

export interface AudioRecord {
  id?: number;
  timestamp: Date;
  blob: Blob;
  status: 'pending' | 'uploading' | 'synced' | 'failed';
  transcript?: string;
  summary?: string;
}

export class EchoScribeDB extends Dexie {
  recordings!: Table<AudioRecord, number>;

  constructor() {
    super('EchoScribeDB');
    this.version(1).stores({
      recordings: '++id, timestamp, status'
    });
  }
}

export const db = new EchoScribeDB();
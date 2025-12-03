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
import { Mic } from 'lucide-react';

interface DeviceSelectorProps {
  onDeviceSelect: (deviceId: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permission first to get labels
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const devs = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devs.filter(d => d.kind === 'audioinput');
        setDevices(audioInputs);
        
        // Auto-select Bluetooth if present
        const bt = audioInputs.find(d => 
            d.label.toLowerCase().includes('bluetooth') || 
            d.label.toLowerCase().includes('headset')
        );
        if (bt) {
            setSelectedId(bt.deviceId);
            onDeviceSelect(bt.deviceId);
        } else if (audioInputs.length > 0) {
            setSelectedId(audioInputs[0].deviceId);
            onDeviceSelect(audioInputs[0].deviceId);
        }
      } catch (e) {
        console.error("Error enumerating devices", e);
      }
    };
    getDevices();
  }, [onDeviceSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
    onDeviceSelect(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      <Mic className="w-5 h-5 text-gray-600" />
      <select 
        value={selectedId} 
        onChange={handleChange}
        className="bg-transparent text-sm focus:outline-none w-full"
      >
        {devices.map(d => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DeviceSelector;
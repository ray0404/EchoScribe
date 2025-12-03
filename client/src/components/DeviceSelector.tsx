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
    let mounted = true;

    const getDevices = async () => {
      try {
        // Request permission first to get labels
        // We try/catch this specifically so if user denies, we still show the list (albeit with generic labels)
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          console.warn("Microphone permission denied or dismissed:", err);
        }
        
        const devs = await navigator.mediaDevices.enumerateDevices();
        if (!mounted) return;

        const audioInputs = devs.filter(d => d.kind === 'audioinput');
        setDevices(audioInputs);
        
        // Logic to preserve selection or auto-select smart default
        // If we already have a selectedId and it still exists in the new list, keep it.
        // Otherwise, find Bluetooth or default to first.
        
        // We need the current selectedId from state? 
        // Actually, inside useEffect closure, selectedId is stale (initial render value).
        // So we should probably rely on the fact that we update state here.
        
        // Auto-select Bluetooth if present and no selection made (or if we want to override? usually override only on first load)
        // For simplicity, we re-run the selection logic if the list changes significantly or initial load.
        
        const bt = audioInputs.find(d => 
            d.label.toLowerCase().includes('bluetooth') || 
            d.label.toLowerCase().includes('headset')
        );
        
        if (bt) {
            setSelectedId(bt.deviceId);
            onDeviceSelect(bt.deviceId);
        } else if (audioInputs.length > 0) {
            // Default to first if no Bluetooth found
             setSelectedId(audioInputs[0].deviceId);
             onDeviceSelect(audioInputs[0].deviceId);
        }
      } catch (e) {
        console.error("Error enumerating devices", e);
      }
    };

    getDevices();
    
    // Listen for device changes (plugging in Bluetooth/USB mics)
    if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === 'function') {
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
    }

    return () => {
      mounted = false;
      if (navigator.mediaDevices && typeof navigator.mediaDevices.removeEventListener === 'function') {
        navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      }
    };
  }, [onDeviceSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
    onDeviceSelect(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg relative">
      <Mic className="w-5 h-5 text-gray-600 flex-shrink-0" />
      <select 
        value={selectedId} 
        onChange={handleChange}
        className="bg-transparent text-sm focus:outline-none w-full py-1 appearance-none cursor-pointer"
        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }} // Ensure consistent styling
      >
        {devices.length === 0 ? (
          <option value="" disabled>No input devices found</option>
        ) : (
          devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
            </option>
          ))
        )}
      </select>
      {/* Custom arrow to ensure visibility */}
      <div className="absolute right-2 pointer-events-none text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
};

export default DeviceSelector;
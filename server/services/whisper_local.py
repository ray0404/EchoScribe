# EchoScribe - Offline-first Audio Recording & Transcription PWA
# Copyright (C) 2025 Adolfo Ray Valentin Olguin
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# Source code: https://github.com/ray0404/EchoScribe

import time
from faster_whisper import WhisperModel

# Initialize model (download happens on first run)
# Using 'tiny' for quick testing, switch to 'medium' or 'large-v3' for production
model_size = "tiny" 
# model = WhisperModel(model_size, device="cpu", compute_type="int8") # Use "cuda" if GPU available

def process_local(record_id: str, file_path: str):
    print(f"Starting local transcription for {record_id}...")
    try:
        # In a real scenario, you'd initialize the model outside or per-process
        # For 'base' demo, we mock the heavy lifting to avoid massive downloads instantly
        # segments, info = model.transcribe(file_path, beam_size=5)
        
        # Mock delay
        time.sleep(2)
        
        print(f"Finished transcription for {record_id}")
        # Here you would typically callback to the client or save to a shared DB
        # For the offline-sync architecture, the client usually polls or we use websockets
        
    except Exception as e:
        print(f"Error processing {record_id}: {e}")
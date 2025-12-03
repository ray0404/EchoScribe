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

from fastapi import FastAPI, UploadFile, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from services.whisper_local import process_local
from services.llm_local import summarize_local

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure temp directory exists
os.makedirs("temp", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "EchoScribe API Online", "mode": os.getenv("AI_MODE", "UNKNOWN")}

@app.post("/transcribe/{record_id}")
async def transcribe_audio(record_id: str, file: UploadFile, background_tasks: BackgroundTasks):
    try:
        # Save temp file
        temp_path = f"temp/{record_id}.webm"
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        mode = os.getenv("AI_MODE", "LOCAL")
        print(f"Queueing transcription for {record_id} in {mode} mode.")

        if mode == "LOCAL":
            background_tasks.add_task(process_local, record_id, temp_path)
        else:
            # Placeholder for cloud implementation
            # background_tasks.add_task(process_cloud, record_id, temp_path)
            print("Cloud mode not fully implemented in base.")
        
        return {"status": "queued", "record_id": record_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize/{record_id}")
async def summarize_transcript(record_id: str, background_tasks: BackgroundTasks):
    # Logic to fetch transcript from DB or file and summarize
    # For now, just a stub
    background_tasks.add_task(summarize_local, record_id, "Sample transcript text")
    return {"status": "summarization queued"}
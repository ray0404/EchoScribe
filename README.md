# EchoScribe

**EchoScribe** is an offline-first Progressive Web App (PWA) designed for secure, local-first audio recording, transcription, and summarization. 

Built with privacy and resilience in mind, EchoScribe allows you to record audio anywhere—even without an internet connection. Recordings are stored locally and automatically synchronized with a self-hosted backend for AI processing when connectivity is restored.

## 🚀 Key Features

*   **📱 Offline-First Design**: Fully functional without internet. Record and playback audio anywhere.
*   **🔒 Privacy-Focused**: Utilizes local AI models (`faster-whisper`) running on your own hardware. Your audio doesn't need to leave your server.
*   **💾 Robust Persistence**: Uses IndexedDB (via Dexie.js) to safely store audio blobs and metadata in your browser.
*   **🔄 Smart Sync**: Automatically detects network connectivity and synchronizes pending recordings with the backend.
*   **📝 Automated Transcription**: High-accuracy speech-to-text using OpenAI's Whisper models (running locally).
*   **🧠 LLM Summarization**: (In Progress) Summarize transcripts using local LLMs.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React 18 with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Storage**: Dexie.js (IndexedDB)
*   **PWA**: vite-plugin-pwa

### Backend
*   **Framework**: FastAPI (Python 3.10)
*   **Server**: Uvicorn
*   **AI Engine**: faster-whisper (CTranslate2 backend)
*   **Task Queue**: FastAPI BackgroundTasks

### Infrastructure
*   **Docker**: Containerized services for easy deployment.
*   **GPU Support**: Configured for NVIDIA GPU acceleration (optional but recommended).

## 🏁 Getting Started

### Prerequisites

*   **Docker** and **Docker Compose**
*   *(Optional)* NVIDIA GPU with Container Toolkit for faster transcription (configured in `docker-compose.yml` but commented out by default).

### Quick Start (Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ray0404/EchoScribe.git
    cd EchoScribe
    ```

2.  **Start the services:**
    ```bash
    docker compose up --build
    ```

3.  **Access the application:**
    *   **Frontend**: Open [https://localhost:8080](https://localhost:8080) in your browser.
        *   *Note: You will see a security warning because we use a self-signed certificate. This is required to enable microphone access on local networks. Please accept the warning to proceed.*
    *   **API Docs**: Open [http://localhost:8000/docs](http://localhost:8000/docs) to explore the backend API.

### Local Development (Manual)

If you prefer running services individually without Docker:

**Backend:**
```bash
cd server
pip install -r requirements.txt
# Ensure ffmpeg is installed on your system
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd client
npm install
npm run dev
# The app will run at http://localhost:5173
```
*Note: Update `VITE_API_URL` in the frontend configuration if ports differ.*

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**. 
See the [LICENSE](LICENSE) file for details.

Copyright (C) 2025 Adolfo Ray Valentin Olguin

## 🔗 Source Code

[https://github.com/ray0404/EchoScribe](https://github.com/ray0404/EchoScribe)
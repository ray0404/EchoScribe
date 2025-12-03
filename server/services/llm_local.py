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

import requests

def summarize_local(record_id: str, text: str):
    print(f"Summarizing {record_id} via Ollama...")
    # Example call to local Ollama instance
    # response = requests.post('http://host.docker.internal:11434/api/generate', json={
    #     "model": "llama3",
    #     "prompt": f"Summarize this: {text}"
    # })
    print("Summarization complete (Mock).")
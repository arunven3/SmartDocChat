
# 📄 SmartDocChat

**A Local PDF Document Q&A App powered by Chunking, Embeddings and Ollama LLM**

## 🧩 How it works

### ✅ Document Upload & Preprocessing Phase

1. User Uploads PDFs through the frontend UI.
2. files are send to server via the `/upload` RestAPI, The server extracts Text from the uploaded documents.
3. Text is Chunked into smaller, meaningful segments.
4. Backend extracts text, splits into chunks
5. Each chunk is converted into a vector embedded using the model `Xenova/all-MiniLM-L6-v2`
7. All Chunks and their embeddings are stored in SQLite  database for fast semantic retrieval.

### ✅Question Answering with Local LLM 

1. User asks a question, the `askQuestion` method opens a WebSocket connection.
2. Server embeds user question question to match it semantically
3. It retrieves the most relevant chunks from the SQLite DB using cosine similarity
5. Previous questions and answers are also retrieved to maintain conversation context
6. The combined context and the new question are sent to the Ollama’s (`llama3.2`) model.
7. The generated answer is streamed back to the frontend in real time over the WebSocket connection.
SmartDocChat intelligently understands user queries and delivers precise answers — completely offline and privacy-focused.

## 🗂️ Key Project Directories
- `/frontend` → React + Chat UI + Upload
- `/backend` → NestJS + SQLite + PDF extraction + Embedding + Ollama client

## ✅ Minimum System Requirements

| Resource       | Minimum Recommended        |
|----------------|----------------------------|
| **RAM**        | 8 GB (with 4 GB free)      |
| **CPU**        | 4 cores                    |
| **GPU**        | Not required               |
| **Disk**       | 2–5 GB free                |
| **OS**         | Windows 10+, macOS, Linux  |

## 🚀 Ollama Setup

**1️⃣ Install Ollama**

- macOS:
  ```bash
  brew install ollama
  ```
- Linux:
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```
- Windows:
  👉 Download installer: [https://ollama.com/download](https://ollama.com/download)

**2️⃣ Pull a LLM**
```bash
  ollama pull llama3.2:3b
```

**3️⃣ Start Ollama**
```bash
  ollama serve
```

This runs Ollama locally at `http://localhost:11434`.


## ⚙️ Project Setup

Clone your repo:

```
git clone https://github.com/arunven3/SmartDocChat.git
cd SmartDocChat
```

### Backend

```
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Download Local Embedding Model

```bash
cd frontend
npm run setup
```

---


## ✅ Key Commands
| Task                | Command                                                     |
|---------------------|-------------------------------------------------------------|
| Start backend       | `npm run start:dev`                                         |
| Start frontend      | `npm run dev`                                               |
| Pull LLM            | `ollama pull llama3.2`                                      |
| Serve Ollama        | `ollama serve`                                              |
| Download embeddings | `npx @xenova/transformers download Xenova/all-MiniLM-L6-v2` |

**Built with ❤️ by Arun Venkatesan.**

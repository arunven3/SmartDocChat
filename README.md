
# 📄 SmartDocChat

**A Local PDF Document Q&A App powered by Chunking, Embeddings and Ollama LLM**


## ✅ Minimum System Requirements

|----------------|----------------------------|
| Resource       | Minimum Recommended        |
|----------------|----------------------------|
| **RAM**        | 8 GB (with 4 GB free)      |
| **CPU**        | 4 cores                    |
| **GPU**        | Not required               |
| **Disk**       | 2–5 GB free                |
| **OS**         | Windows 10+, macOS, Linux  |
|----------------|----------------------------|

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
ollama pull llama3

**3️⃣ Start Ollama**
ollama serve

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
npx @xenova/transformers download Xenova/all-MiniLM-L6-v2
```

---

## 🧩 How it works

### ✅ Upload Phase

1. User uploads PDFs
2. Backend extracts text, splits into chunks
3. Each chunk embedded with `all-MiniLM-L6-v2`
4. Chunks + embeddings stored in SQLite

### ✅ Retrieval + LLM Phase

1. User asks a question
2. Backend embeds question
3. Cosine similarity → top K chunks selected
4. Passes context + question to Ollama (`llama3.2`)
5. Ollama generates answer → streamed back to chat


## 🗂️ Key Project Directories
- `/frontend` → React + Chat UI + Upload
- `/backend` → NestJS + SQLite + PDF extraction + Embedding + Ollama client


## ✅ Key Commands
|---------------------|-------------------------------------------------------------|
| Task                | Command                                                     |
|---------------------|-------------------------------------------------------------|
| Start backend       | `npm run start:dev`                                         |
| Start frontend      | `npm run dev`                                               |
| Pull LLM            | `ollama pull llama3.2`                                      |
| Serve Ollama        | `ollama serve`                                              |
| Download embeddings | `npx @xenova/transformers download Xenova/all-MiniLM-L6-v2` |
|---------------------|-------------------------------------------------------------|

**Built with ❤️ by Arun Venkatesan.**

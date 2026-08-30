# BrandFlow

### AI-Powered Brand & Marketing Campaign Generator

BrandFlow is a full-stack **Generative AI application** that helps businesses transform their brand information and campaign requirements into structured, brand-aware marketing campaigns.

It combines **LLMs, RAG, embeddings, vector search, structured outputs, creative generation, and hybrid validation** into one platform.

## 🎯 Problem

Creating marketing campaigns requires significant time and effort across strategy, social media, advertising, email, and creative content.

Generic AI tools can generate content quickly, but they may:

* Ignore brand guidelines
* Use incorrect product information
* Make unsupported claims
* Use the wrong tone
* Fail to target the intended audience

## 💡 Solution

BrandFlow allows users to provide brand information through a **PDF or quick brand form**. The information is processed, embedded, and stored in **ChromaDB**.

When a campaign is requested, BrandFlow retrieves relevant brand information using **RAG** and provides it to the **Gemini LLM**, which generates the campaign strategy and marketing content.

The generated content is then checked using a **hybrid validation system** combining deterministic rules and an LLM-based judge.

```text
Campaign Brief
      ↓
Brand Context
      ↓
Sanitize → Chunk → Embed
      ↓
   ChromaDB
      ↓
Relevant Context
      ↓
   Gemini LLM
      ↓
Strategy + Content
      ↓
Creative Generation
      ↓
Hybrid Validation
      ↓
Final Campaign
```

## ✨ Key Features

* 🤖 AI-powered campaign strategy generation
* 📚 Brand knowledge base using PDF and quick-form input
* 🔎 RAG-based brand-aware generation
* 📝 Multi-channel marketing content
* 🎨 AI-assisted creative/image generation
* 🎬 Video storyboard and script generation
* 🛡️ Prompt-injection protection for uploaded documents
* ✅ Rule-based + LLM-based brand validation
* ⚡ Response caching to reduce repeated API calls
* 🔐 JWT-based authentication
* 📊 Campaign dashboard and history

## 🏗️ Technology Stack

| Technology        | Purpose                                |
| ----------------- | -------------------------------------- |
| React.js          | Frontend                               |
| JavaScript / JSX  | UI and application logic               |
| CSS               | Styling                                |
| Vite              | Frontend tooling                       |
| Python            | Backend and AI logic                   |
| FastAPI           | REST API                               |
| Gemini            | Campaign generation and LLM evaluation |
| Gemini Embeddings | Text embeddings                        |
| LangChain         | LLM integration                        |
| Pydantic          | Structured outputs and validation      |
| ChromaDB          | Vector database                        |
| pdfplumber        | PDF text extraction                    |
| SQLAlchemy        | Database ORM                           |
| SQLite            | Current database                       |
| JWT               | Authentication                         |
| bcrypt            | Password hashing                       |
| Pollinations      | Image generation                       |
| Pytest            | Testing                                |

## 🔍 RAG Pipeline

```text
Brand PDF / Quick Form
        ↓
Text Extraction
        ↓
Sanitization
        ↓
Chunking
        ↓
Gemini Embeddings
        ↓
ChromaDB
        ↓
Semantic Retrieval
        ↓
Relevant Brand Context
        ↓
Gemini
```

RAG allows BrandFlow to use the company's own brand information instead of relying only on the LLM's general knowledge.

## 🛡️ Hybrid Validation

Generated content is checked in two ways:

**Rule-based validation**

* Detects predefined prohibited claims and phrases.

**LLM Judge**

* Evaluates brand tone, positioning, consistency, and semantic issues.

```text
Generated Content
      ↓
 ┌────┴─────┐
 ↓          ↓
Rules     LLM Judge
 └────┬─────┘
      ↓
Final Verdict
```

## 🚀 Running the Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```


## 📂 Project Structure

```text
BrandFlow/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

## 🔮 Future Scope

Future versions can include:

* PostgreSQL for larger production deployments
* Advanced GenAI evaluation
* Improved media generation
* Agentic AI workflows
* Multi-agent campaign orchestration

The current version intentionally uses a **GenAI + RAG pipeline** rather than an Agentic AI architecture.

---

### 🎓 Project Focus

BrandFlow demonstrates practical implementation of:

**Generative AI • LLMs • RAG • Embeddings • Vector Databases • Prompt Engineering • Structured Outputs • Multimodal AI • AI Validation • Security • Full-Stack Development**

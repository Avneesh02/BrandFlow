# BrandFlow 🚀

### AI-Powered Marketing Campaign Generation Platform

BrandFlow is a **Generative AI-powered marketing platform** that automates the process of creating brand-aligned marketing campaigns.

Instead of manually planning a campaign, writing marketing content, creating visual concepts, and checking whether the content follows brand guidelines, BrandFlow brings these steps together into a single workflow.

The system uses **React, FastAPI, PostgreSQL, RAG, ChromaDB, Google Gemini, and AI-powered validation** to transform a simple campaign brief into structured marketing content and creative assets.

---

## 🎯 Problem Statement

Creating a complete marketing campaign usually involves several manual steps:

* Understanding the brand and product
* Identifying the target audience
* Developing a campaign strategy
* Writing marketing content
* Maintaining a consistent brand tone
* Creating visual assets
* Checking content against brand guidelines
* Managing previously generated campaigns

This process can be time-consuming and repetitive.

A major challenge is also **maintaining brand consistency**. Generic AI-generated content may not always follow a company's specific tone, product information, target audience, or communication guidelines.

### BrandFlow addresses this problem by combining Generative AI with RAG-based brand context retrieval and content validation.

---

# 💡 Solution

BrandFlow allows users to provide information such as:

* Brand details
* Product information
* Target audience
* Campaign objective
* Marketing platform
* Brand tone
* Brand Do's and Don'ts
* Creative requirements

The system then uses this information to generate a customized marketing campaign.

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant brand information before generating content with an LLM.

Generated content is then passed through a validation layer to identify potential issues such as:

* Exaggerated claims
* Unrealistic promises
* Medical claims
* Brand guideline violations
* Inappropriate messaging

BrandFlow can also generate visual assets for the campaign using an image-generation API.

---

# ✨ Key Features

### 📝 Campaign Generation

Generate marketing campaigns from a structured campaign brief.

### 🎯 Audience-Aware Content

Generate content based on the specified target audience and campaign objective.

### 🧠 RAG-Powered Generation

Retrieve relevant brand information before generating content to improve brand consistency.

### 🔍 Semantic Search

Use embeddings and vector similarity search to retrieve relevant information from brand context.

### ✍️ AI Marketing Content

Generate campaign strategies, marketing copy, captions, messaging, and calls-to-action.

### 🎨 AI Visual Generation

Generate campaign visuals using an image-generation API.

### 🛡️ Content Validation

Check generated content for potentially problematic or unsupported marketing claims.

### 🔐 Authentication

JWT-based authentication protects user accounts and user-specific resources.

### 📊 Campaign Management

Store and manage generated campaign information using PostgreSQL.

### 📄 Brand Context

Use brand information and uploaded content as context for AI-generated campaigns.

---

# 🔄 Complete Project Flow

The overall BrandFlow workflow is:

```text
                 User
                   │
                   ▼
          Campaign Quick Form
                   │
                   ▼
        Brand & Product Details
                   │
                   ▼
           Campaign Request
                   │
                   ▼
        ┌─────────────────────┐
        │    RAG Retrieval     │
        │                     │
        │ Brand Information   │
        │ Product Information │
        │ Brand Guidelines    │
        └──────────┬──────────┘
                   │
                   ▼
          Relevant Context
                   │
                   ▼
             Gemini LLM
                   │
                   ▼
        Campaign Generation
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
     Text Content      Creative Assets
          │                 │
          ▼                 ▼
       Validation      Image Generation
          │                 │
          └────────┬────────┘
                   │
                   ▼
             Final Campaign
                   │
                   ▼
              PostgreSQL
```

---

# 🧠 RAG Pipeline

BrandFlow uses **Retrieval-Augmented Generation (RAG)** to provide the LLM with relevant brand-specific information.

Instead of asking the LLM to generate content using only its general knowledge, BrandFlow retrieves relevant information from the stored brand context.

### RAG Flow

```text
Brand Information
       │
       ▼
    Chunking
       │
       ▼
   Embeddings
       │
       ▼
    ChromaDB
       │
       ▼
Similarity Search
       │
       ▼
Relevant Context
       │
       ▼
    Gemini LLM
       │
       ▼
Brand-Aligned Content
```

This helps the generated campaign remain aligned with:

* Brand identity
* Product information
* Target audience
* Brand tone
* Brand guidelines
* Provided business context

---

# 🤖 LLM Integration

Google Gemini acts as the primary **Large Language Model (LLM)** for campaign generation.

The model receives information such as:

```text
Campaign Requirements
        +
Brand Information
        +
Retrieved RAG Context
        +
Target Audience
        +
Brand Tone
        +
Do's & Don'ts
```

and produces campaign content based on that combined context.

### Example

```text
User Input
   ↓
"Create an Instagram campaign for a skincare moisturizer"
   ↓
Retrieve brand/product information
   ↓
Add retrieved context to prompt
   ↓
Gemini
   ↓
Campaign Strategy + Content
```

---

# 🛡️ AI Content Validation

BrandFlow includes a validation layer that checks generated marketing content before presenting the final result.

For example, a generated statement such as:

```text
"Get perfect skin in 7 days, guaranteed!"
```

can be identified as an exaggerated or unsupported marketing claim.

The validation process helps maintain:

* Realistic messaging
* Brand guidelines
* Appropriate marketing language
* Safer promotional content
* Consistency with provided requirements

---

# 🎨 Image Generation

BrandFlow also supports AI-generated campaign visuals.

The campaign information can be used to create visual prompts based on:

* Product
* Campaign theme
* Target audience
* Creative direction
* Brand style

The project uses **Pollinations AI** for image generation.

---

# 🏗️ System Architecture

```text
                         ┌───────────────┐
                         │     User      │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ React Frontend│
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ FastAPI       │
                         │ Backend       │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌─────────────┐    ┌────────────┐     ┌─────────────┐
       │ PostgreSQL  │    │  ChromaDB  │     │   Gemini    │
       │  Supabase   │    │    RAG     │     │     LLM     │
       └─────────────┘    └─────┬──────┘     └──────┬──────┘
                                │                    │
                                ▼                    │
                         Retrieved Context           │
                                │                    │
                                └─────────┬──────────┘
                                          ▼
                                  Campaign Generation
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                              ▼                       ▼
                         Validation            Image Generation
                              │                       │
                              └───────────┬───────────┘
                                          ▼
                                    Final Campaign
```

---

# 🛠️ Technology Stack

## Frontend

* **React.js** — Building the interactive user interface
* **HTML** — Application structure
* **CSS** — Styling and responsive UI
* **JavaScript** — Frontend functionality and API communication

## Backend

* **Python** — Backend development and AI integration
* **FastAPI** — REST API and backend services
* **SQLAlchemy** — Database ORM
* **Pydantic** — Data validation and request/response schemas

## Database

* **PostgreSQL** — Persistent application data
* **Supabase** — Hosted PostgreSQL database

## Generative AI

* **Google Gemini** — Campaign content generation
* **Embeddings** — Converting textual information into numerical vector representations
* **RAG** — Retrieving relevant brand context before generation
* **ChromaDB** — Vector database for storing and retrieving embeddings

## Authentication

* **JWT** — User authentication and authorization

## Image Generation

* **Pollinations AI** — AI-generated campaign visuals

## Deployment

* **Render** — Application/website hosting
* **Supabase** — Cloud PostgreSQL database

## Development

* **Git**
* **GitHub**
* **VS Code**

---

# 🗄️ Database Architecture

BrandFlow uses PostgreSQL as its primary application database.

The database is hosted using **Supabase**.

```text
FastAPI
   │
   ▼
SQLAlchemy
   │
   ▼
PostgreSQL
   │
   ▼
Supabase
```

PostgreSQL stores application-level information such as users, campaigns, and other persistent application data.

---

# 📁 Project Structure

```text
BrandFlow/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
├── .env.example
└── README.md
```

> The exact files and folders may vary depending on the current implementation.

---

# ⚙️ Environment Variables

Create a `.env` file for local development.

```env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model

CHROMA_PERSIST_DIR=./chroma_data

FRONTEND_ORIGIN=http://localhost:5173

UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10

LOGIN_RATE_LIMIT=10
CAMPAIGN_RATE_LIMIT=5

POLLINATIONS_BASE_URL=https://image.pollinations.ai/prompt
```

For production, sensitive environment variables are configured through the hosting platform instead of being committed to GitHub.

**Never commit:**

```text
.env
API keys
Database passwords
JWT secrets
```

---

# 🚀 Local Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/BrandFlow.git
cd BrandFlow
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create:

```text
.env
```

Add your PostgreSQL, Gemini, JWT, ChromaDB, and other required configuration values.

---

## 4. Run Database Migrations

Run:

```bash
alembic upgrade head
```

This creates/updates the PostgreSQL database schema based on the project's migrations.

---

## 5. Start the Backend

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

## 6. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🧪 Example Campaign

BrandFlow can be tested using a skincare campaign such as:

### Brand

```text
GlowShield
```

### Product

```text
GlowShield Vitamin C Moisturizer
```

### Product Description

```text
A lightweight daily moisturizer formulated with vitamin C and
aloe vera. It helps keep skin feeling hydrated, soft, and
refreshed without leaving a heavy or greasy feeling.
```

### Target Audience

```text
Men and women aged 18–30 who want a simple daily moisturizer
for healthy-looking, hydrated skin.
```

### Campaign Goal

```text
Build product awareness and increase engagement on Instagram.
```

### Platform

```text
Instagram
```

### Campaign Type

```text
Product Promotion
```

### Brand Tone

```text
Fresh, confident, modern, friendly, clean, and trustworthy.
```

### Do's

```text
- Highlight hydration and lightweight texture.
- Use simple and engaging language.
- Focus on realistic product benefits.
- Maintain a clean and premium feel.
```

### Don'ts

```text
- Don't make medical claims.
- Don't guarantee results.
- Don't claim to cure skin problems.
- Don't use exaggerated phrases.
- Don't criticize competitors.
- Don't make unrealistic promises.
```

---

# 🔐 Authentication

BrandFlow uses **JWT-based authentication**.

The general authentication flow is:

```text
User
 ↓
Login
 ↓
FastAPI
 ↓
Verify Credentials
 ↓
Generate JWT
 ↓
Client
 ↓
Authenticated API Requests
```

JWT configuration includes:

```text
JWT_SECRET
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS
```

---

# 📊 Campaign Data Flow

When a user generates a campaign:

```text
Campaign Form
      ↓
FastAPI API
      ↓
Validate Input
      ↓
Retrieve Brand Context
      ↓
RAG
      ↓
Gemini
      ↓
Generate Campaign
      ↓
Validate Content
      ↓
Generate Visual Assets
      ↓
Store Campaign Data
      ↓
PostgreSQL
      ↓
Return Result
```

---

# ☁️ Deployment

BrandFlow is deployed using **Render** for application hosting and **Supabase** for the PostgreSQL database.

### Production Architecture

```text
                     Internet
                        │
                        ▼
                 ┌─────────────┐
                 │   Render    │
                 │   Website   │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │   FastAPI   │
                 │   Backend   │
                 └──────┬──────┘
                        │
             ┌──────────┼───────────┐
             │          │           │
             ▼          ▼           ▼
       ┌──────────┐ ┌─────────┐ ┌─────────┐
       │ Supabase │ │ ChromaDB│ │ Gemini  │
       │PostgreSQL│ │   RAG   │ │   LLM   │
       └──────────┘ └─────────┘ └─────────┘
```

Production secrets such as:

* PostgreSQL connection string
* Gemini API key
* JWT secret
* Other application configuration

are configured through environment variables.

---

# 🔒 Security Considerations

BrandFlow follows basic security practices including:

* JWT-based authentication
* Environment-based secret management
* No API keys hardcoded in source code
* PostgreSQL for persistent application data
* Request rate limiting
* Input validation using Pydantic
* Separation of frontend and backend responsibilities

---

# 🚧 Future Improvements

Potential future improvements include:

* Social media API integrations
* Automated campaign scheduling
* Campaign performance analytics
* More image-generation models
* Cloud-based vector database
* Persistent cloud storage for uploaded documents
* Campaign performance prediction
* Automated social media publishing
* More advanced brand personalization
* Multi-platform campaign publishing

---

# 🎯 Project Objective

BrandFlow demonstrates how **Generative AI can be integrated into a real-world full-stack application** to automate a practical business workflow.

The project combines:

```text
Full-Stack Development
        +
Generative AI
        +
LLM
        +
RAG
        +
Embeddings
        +
Vector Database
        +
PostgreSQL
        +
AI Validation
```

The primary objective is to make marketing campaign creation **faster, more consistent, brand-aware, and easier to manage**.

---

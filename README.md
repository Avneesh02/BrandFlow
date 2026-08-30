# BrandFlow

### AI-Powered Brand & Marketing Campaign Generator

BrandFlow is a full-stack Generative AI application that transforms a brand's information and campaign requirements into structured, brand-aware marketing campaigns.

It combines **LLMs, RAG, embeddings, vector search, structured generation, hybrid validation, and multimodal content generation** to help create marketing content while keeping it aligned with the provided brand context.

---

## Overview

Creating a marketing campaign usually involves multiple repetitive tasks such as:

- Understanding the product
- Defining the target audience
- Creating a campaign strategy
- Writing social media content
- Creating advertisements
- Writing email campaigns
- Developing creative concepts
- Ensuring brand consistency

Generic AI tools can generate content quickly, but they may not know a company's:

- Brand guidelines
- Product information
- Target audience
- Tone of voice
- Marketing restrictions
- Approved claims

BrandFlow addresses this problem by allowing users to provide their brand information and using **Retrieval-Augmented Generation (RAG)** to retrieve relevant information before generating campaign content.

---

# Problem Statement

Businesses need to create marketing campaigns across multiple platforms while maintaining consistency with their brand identity and guidelines.

Traditional campaign creation is time-consuming and repetitive, while generic LLM-based generation can produce content that:

- Does not follow the brand's tone
- Uses incorrect product information
- Makes unsupported claims
- Does not target the intended audience
- Violates brand-specific restrictions

### Goal

Build an AI-powered platform that can generate complete marketing campaigns using the company's own brand information while validating the generated content against predefined brand rules.

---

# Solution

BrandFlow provides a unified workflow:

```text
Campaign Requirements
        |
        v
Brand Context
(PDF / Quick Form)
        |
        v
Sanitization
        |
        v
Chunking
        |
        v
Embeddings
        |
        v
ChromaDB
        |
        v
Relevant Context Retrieval
        |
        v
Gemini LLM
        |
        +------------------+
        |                  |
        v                  v
Campaign Strategy      Marketing Content
        |                  |
        +--------+---------+
                 |
                 v
          Creative Generation
                 |
                 v
         Hybrid Validation
          /             \
         v               v
 Rule-based Check     LLM Judge
          \             /
           v           v
            Final Verdict
                 |
                 v
          Campaign Dashboard
# Hybrid Summarization of Legal Documents Using BERT and PEGASUS

This project implements a hybrid summarization framework designed to process lengthy, formally structured legal and legislative documents. By integrating extractive techniques with abstractive refinement, the system produces summaries that maintain high factual fidelity while ensuring linguistic fluency.

## Overview

Legal documents contain domain-specific terminology and hierarchical organization that make automatic summarization difficult. Traditional extractive methods ensure factual correctness but often produce disjointed outputs, while abstractive methods improve readability but may alter legal meaning. 

This framework addresses these challenges through a two-stage pipeline:
1. **Extractive Stage:** Employs BERT-based sentence embeddings and K-Means clustering to identify and select the most contextually important sentences.
2. **Abstractive Stage:** Uses the PEGASUS transformer-based model to rewrite the extracted content into a coherent, fluent summary.

## System Architecture

The architecture consists of four modular components:

* **Preprocessing:** Cleans raw legal documents to remove metadata and special symbols while segmenting and normalizing sentences.
* **Extractive Summarization:** Converts sentences into BERT embeddings to capture semantic similarity and clusters them to reduce redundancy.
* **Abstractive Summarization:** Powered by PEGASUS to generate refined summaries that preserve the original legal intent.
* **Evaluation:** Uses Gemini, a reasoning-based large language model (LLM), to score summaries based on factual accuracy, coverage, and clarity on a 1-5 scale.

## Technical Stack

* **Language:** Python 3.10
* **Frameworks:** PyTorch 2.0.1, Hugging Face Transformers
* **Models:** BERT (bert-base-uncased), PEGASUS (google/pegasus-large), and Gemini
* **Libraries:** scikit-learn (K-Means), NLTK, Pandas, NumPy

## Performance

The hybrid model achieved an average Gemini evaluation score of 4.5/5, outperforming standalone extractive (3.9) and abstractive (3.8) baselines.

| Metric | Extractive | Abstractive | Hybrid |
| :--- | :--- | :--- | :--- |
| Factual Accuracy | 4.7 | 3.8 | 4.6 |
| Coverage | 4.0 | 3.4 | 4.4 |
| Clarity & Readability | 3.0 | 4.4 | 4.6 |
| **Overall Average** | **3.9** | **3.8** | **4.5** |

*Note: Scores represent the mean values from evaluations performed on the BillSum dataset.*

## Usage

### 1. Get Your API Keys
To run the evaluation and download the models, you will need the following credentials:
* **Gemini API Key:** Obtain this from [Google AI Studio](https://aistudio.google.com/) to enable the Gemini-based evaluation module.
* **Hugging Face Token:** Create an account at [Hugging Face](https://huggingface.co/) and generate a "Read" access token from your settings to load the pretrained transformers.

### 2. Configure Environment
The system is implemented using modular scripts and is optimized for **Google Colab** with GPU acceleration (e.g., NVIDIA Tesla T4). Set your keys as environment variables before running the script:

```python
import os
os.environ["GEMINI_API_KEY"] = "YOUR_GEMINI_KEY"
os.environ["HF_TOKEN"] = "YOUR_HF_TOKEN"
```

## 🚀 Try it Now
Ready to explore the model? Run the code directly in your browser:

[**Launch Interactive Notebook →**](https://colab.research.google.com/drive/1XMnGpHD1pmBh_b5MeS035MUwJI_l5Epc?usp=sharing)

import React, { useState } from 'react';
import './App.css';
import { Client } from "@gradio/client";

const HF_SPACE_URL = 'https://eshsanjana-legal-summarizer.hf.space';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const charCount = text.length;

  const handleSubmit = async () => {
    if (!text.trim() || text.length < 20) {
      setError('Please paste some legal text first (at least 20 characters).');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    
    // inside handleSubmit, replace the try block:
    try {
      const client = await Client.connect("eshsanjana/legal-summarizer");
      const result = await client.predict("/run_pipeline", {
        text: text,
        num_clusters: 10,
        num_beams: 4,
      });
    
      const hybrid = result.data[2];
      const evaluation = result.data[3];
    
      const scores = parseEvaluation(evaluation);
      setResult({ meaning: hybrid, evaluation, scores });

    } catch (err) {
      setError(`Could not reach the backend. Make sure your HF Space is running.\n\nDetails: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const parseEvaluation = (evalText) => {
    const scores = { accuracy: null, coverage: null, clarity: null, overall: '' };
    if (!evalText) return scores;
  
    // Strip markdown bold/italic
    const cleaned = evalText.replace(/\*\*/g, '').replace(/\*/g, '');
    const lines = cleaned.split('\n');
  
    for (const line of lines) {
      const match = line.match(/(\d+(\.\d+)?)\s*\/\s*5/);
      const score = match ? parseFloat(match[1]) : null;
      const note = line.replace(/.*?[-:]\s*/, '').replace(/\d+(\.\d+)?\/5/, '').trim();
  
      if (/accuracy/i.test(line) && score)
        scores.accuracy = { val: score, note };
      else if (/coverage/i.test(line) && score)
        scores.coverage = { val: score, note };
      else if (/clarity/i.test(line) && score)
        scores.clarity = { val: score, note };
      else if (/overall/i.test(line) && !score)
        scores.overall = line.replace(/overall[:\s]*/i, '').trim();
    }
  
    if (!scores.overall) {
      const parts = cleaned.split('\n').filter(
        l => l.trim() && !/\d\/5/.test(l) && !/accuracy|coverage|clarity/i.test(l)
      );
      scores.overall = parts.join(' ').trim();
    }
    return scores;
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError('');
  };

  const ScoreCard = ({ label, data, color }) => (
    <div className="score-card">
      <div className="score-label">{label}</div>
      <div className="score-value" style={{ color }}>
        {data ? `${data.val}/5` : '—'}
      </div>
      <div className="score-max">out of 5</div>
      <div className="score-bar-wrap">
        <div className="score-bar" style={{ width: data ? `${(data.val / 5) * 100}%` : '0%', background: color }} />
      </div>
      {data?.note && <div className="score-note">{data.note}</div>}
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        <div className="logo-wrap">
          <div className="logo-mark">⚖</div>
          <div>
            <h1 className="logo-title">LexSum</h1>
            <p className="logo-sub">Legal Document Simplifier</p>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h2 className="hero-title">Can't understand a <em>legal document?</em></h2>
          <p className="hero-sub">Paste any legal text — a contract clause, a bill, an agreement — and get a plain English explanation instantly.</p>
        </section>

        <div className="how-strip">
          <div className="how-step"><div className="how-icon" style={{ background: '#e8f0fb' }}>📋</div><span>Paste legal text</span></div>
          <div className="how-arrow">→</div>
          <div className="how-step"><div className="how-icon" style={{ background: '#e1f5ee' }}>🤖</div><span>AI simplifies it</span></div>
          <div className="how-arrow">→</div>
          <div className="how-step"><div className="how-icon" style={{ background: '#fdf3d0' }}>💡</div><span>Get plain meaning</span></div>
          <div className="how-arrow">→</div>
          <div className="how-step"><div className="how-icon" style={{ background: '#fef0f0' }}>⭐</div><span>See reliability score</span></div>
        </div>

        <div className="input-card">
          <div className="input-head">
            <div>
              <div className="input-head-title">Paste your legal text here</div>
              <div className="input-head-hint">A paragraph, a clause, a full document — anything confusing</div>
            </div>
          </div>
          <textarea
            className="input-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`e.g. "The lessee shall indemnify and hold harmless the lessor from any and all claims, damages, losses, costs and expenses arising out of or resulting from the lessee's use of the premises..."`}
            rows={8}
          />
          {error && <div className="error-box">{error}</div>}
          <div className="input-footer">
            <span className="char-count">{charCount.toLocaleString()} characters</span>
            <div className="input-btns">
              <button className="btn-clear" onClick={handleClear} disabled={loading}>Clear</button>
              <button className="btn-run" onClick={handleSubmit} disabled={loading || text.length < 20}>
                {loading ? <><span className="spinner" /> Analysing…</> : 'Explain this →'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="results">
            <div className="meaning-card">
              <div className="meaning-head">
                <div className="meaning-icon">💡</div>
                <div>
                  <div className="meaning-head-title">What this means in plain English</div>
                  <div className="meaning-head-sub">Generating explanation…</div>
                </div>
              </div>
              <div className="meaning-body">
                <div className="skeleton-lines">
                  <div className="skel" style={{ width: '95%' }} />
                  <div className="skel" style={{ width: '80%' }} />
                  <div className="skel" style={{ width: '88%' }} />
                  <div className="skel" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
            <div className="scores-row">
              {['Accuracy', 'Coverage', 'Clarity'].map(l => (
                <div key={l} className="score-card">
                  <div className="score-label">{l}</div>
                  <div className="skel skel-score" />
                  <div className="score-bar-wrap"><div className="score-bar" style={{ width: '0%', background: '#ddd' }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="results">
            <div className="meaning-card">
              <div className="meaning-head">
                <div className="meaning-icon">💡</div>
                <div>
                  <div className="meaning-head-title">What this means in plain English</div>
                  <div className="meaning-head-sub">AI-generated simplified explanation</div>
                </div>
              </div>
              <div className="meaning-body">
                <p className="meaning-text">{result.meaning}</p>
              </div>
            </div>

            <div className="scores-row">
              <ScoreCard label="Accuracy" data={result.scores.accuracy} color="#0f6e56" />
              <ScoreCard label="Coverage" data={result.scores.coverage} color="#185fa5" />
              <ScoreCard label="Clarity" data={result.scores.clarity} color="#b8860b" />
            </div>

            {result.scores.overall && (
              <div className="overall-card">
                <div className="overall-label">Overall Assessment</div>
                <p className="overall-text">{result.scores.overall}</p>
              </div>
            )}

            <p className="disclaimer">
              ⚠️ This is an AI-generated explanation for general understanding only. For important legal decisions, always consult a qualified lawyer.
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Built with Legal Pegasus · Gemini 2.5 Flash · K-Means Clustering</span>
        <a href={HF_SPACE_URL} target="_blank" rel="noopener noreferrer">View Backend on HuggingFace →</a>
      </footer>
    </div>
  );
}

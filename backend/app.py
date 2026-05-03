import os
import json
import pdfplumber
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import tempfile

load_dotenv()

app = Flask(__name__)
CORS(app)

# Allow large uploads — 200 MB total request size
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Max characters sent to LLM per paper (avoids token overflow on huge PDFs)
MAX_CHARS_PER_PAPER = 12_000


def extract_text_from_pdf(file_storage):
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        file_storage.save(tmp.name)
        tmp_path = tmp.name

    text = ""
    try:
        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                if len(text) >= MAX_CHARS_PER_PAPER:
                    text = text[:MAX_CHARS_PER_PAPER]
                    text += "\n[... document truncated for analysis ...]"
                    break
    finally:
        os.unlink(tmp_path)
    return text


def analyze_with_groq(papers_text: list, syllabus: str) -> dict:
    multiple_papers = len(papers_text) > 1

    papers_combined = "\n\n---\n\n".join(
        [f"PAPER: {p['name']}\n{p['text']}" for p in papers_text]
    )

    if len(papers_combined) > 30_000:
        papers_combined = papers_combined[:30_000] + "\n[... truncated ...]"

    syllabus_section = (
        f"\n\nSYLLABUS TOPICS PROVIDED BY USER:\n{syllabus}" if syllabus.strip() else ""
    )

    # Extra instruction block when multiple papers are uploaded
    cross_paper_instruction = ""
    if multiple_papers:
        paper_names = [p['name'] for p in papers_text]
        cross_paper_instruction = f"""
IMPORTANT — Multiple papers detected ({len(papers_text)} papers: {', '.join(paper_names)}).
You MUST also return:
- "common_topics": topics that appear in MORE THAN ONE paper (list of objects with name, papers_found, frequency, importance)
- "common_questions": question patterns / question types that repeat across multiple papers (list of objects with topic, question_pattern, appears_in with paper names)
These two fields are REQUIRED when multiple papers are provided.
"""

    prompt = f"""You are an expert academic analyst. Analyze the following past exam papers and return a comprehensive JSON analysis.

PAST EXAM PAPERS:
{papers_combined}
{syllabus_section}
{cross_paper_instruction}

Return ONLY valid JSON (no markdown, no explanation, no code fences) in exactly this format:
{{
  "topics": [
    {{ "name": "topic name", "frequency": 8, "importance": "High", "score": 92 }}
  ],
  "yearwise_trends": [
    {{ "year": "2022", "top_topic": "topic name", "count": 5 }}
  ],
  "coverage_gaps": ["topic1", "topic2"],
  "study_plan": [
    {{ "day": 1, "topic": "topic name", "hours": 3, "priority": "High" }}
  ],
  "practice_questions": [
    {{ "topic": "topic name", "question": "sample question?" }}
  ],
  "common_topics": [
    {{ "name": "topic name", "papers_found": ["Paper 1", "Paper 2"], "frequency": 5, "importance": "High" }}
  ],
  "common_questions": [
    {{ "topic": "topic name", "question_pattern": "describe the process of...", "appears_in": ["Paper 1", "Paper 2"] }}
  ]
}}

Rules:
- Extract at least 8-15 distinct topics from the papers
- Frequency = how many times a topic appears across all papers
- Importance must be exactly "High", "Medium", or "Low"
- Score = 0-100 relevance/importance score
- yearwise_trends: try to infer years from paper content, or label as "Paper 1", "Paper 2" etc.
- coverage_gaps: topics in syllabus NOT covered in papers (or general gaps you identify)
- study_plan: 7-14 day plan prioritizing high-frequency topics
- practice_questions: at least 2 questions per major topic
- common_topics: only if multiple papers — topics that appear in 2+ papers
- common_questions: only if multiple papers — recurring question patterns/types across papers
- If only 1 paper, return empty arrays [] for common_topics and common_questions
- Return ONLY the JSON object, nothing else"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert academic analyst. Always respond with valid JSON only, no markdown, no explanation.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=4096,
    )

    response_text = response.choices[0].message.content.strip()

    if response_text.startswith("```"):
        lines = response_text.split("\n")
        response_text = "\n".join(lines[1:-1])

    result = json.loads(response_text)

    # Ensure keys always exist
    result.setdefault("common_topics", [])
    result.setdefault("common_questions", [])

    return result


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/upload", methods=["POST"])
def upload():
    files = request.files.getlist("pdfs")
    syllabus = request.form.get("syllabus", "")

    if not files or all(f.filename == "" for f in files):
        return jsonify({"error": "No PDF files provided"}), 400

    papers_text = []
    for f in files:
        if f.filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(f)
            if text.strip():
                papers_text.append({"name": f.filename, "text": text})

    if not papers_text:
        return jsonify({"error": "Could not extract text from any uploaded PDFs"}), 400

    try:
        result = analyze_with_groq(papers_text, syllabus)
        return jsonify(result)
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to parse AI response: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "Files too large. Max 200 MB total upload size."}), 413


if __name__ == "__main__":
    app.run(debug=True, port=5000)

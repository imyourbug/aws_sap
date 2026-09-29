"""Dựng bộ câu hỏi theo lĩnh vực từ 12 file câu sai + dữ liệu crawl từ devcloudly.

Đầu vào:
  - 1.json … 12.json                  : danh sách câu sai (export từ devcloudly)
  - AWS_SAP_Weak_Topics_Roadmap.md     : mục 6 xếp mỗi câu `[Đề] Q#` vào 1 lĩnh vực
  - raw/devcloudly_sap_exams.json      : {examId: [question, ...]} lấy từ /api/exams/{id}/results/{resultId}
  - raw/explanations/exam_{id}.json    : giải thích công khai (R2) của từng đề

Đầu ra:
  - questions.json          : toàn bộ câu sai với đủ lựa chọn, đáp án, giải thích
  - topics/NN-<slug>.json   : câu hỏi của từng lĩnh vực
  - topics/topics.js        : bundle cho index.html (chạy được khi mở trực tiếp bằng file://)
  - exams/index.js          : danh sách đề đầy đủ đã crawl (tên, số câu)
  - exams/exam_<id>.js      : toàn bộ câu hỏi của từng đề, index.html tải khi mở đề đó
"""
import glob
import json
import os
import re
from collections import Counter

ROOT = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(ROOT, "raw")
TOPIC_DIR = os.path.join(ROOT, "topics")
EXAM_DIR = os.path.join(ROOT, "exams")


def slugify(s):
    s = re.sub(r"\(.*?\)", "", s).lower().replace("&", " ")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def exam_label(exam_name):
    # "AWS Certified Solutions Architect Professional - Internet - 6" -> "Internet - 6"
    return exam_name.split("Professional - ", 1)[1]


def load_topic_map():
    md = open(os.path.join(ROOT, "AWS_SAP_Weak_Topics_Roadmap.md"), encoding="utf-8").read()
    appendix = md[md.index("## 6. Phụ lục"):]
    topics, mapping, current = [], {}, None
    for line in appendix.splitlines():
        m = re.search(r"<summary><b>(3\.(\d+)) ([^<]+)</b>", line)
        if m:
            current = {"code": m.group(1), "order": int(m.group(2)), "name": m.group(3).strip()}
            topics.append(current)
            continue
        m = re.match(r"-\s*(?:\S+\s+)?\*\*\[([^\]]+)\] Q(\d+)\*\*", line)
        if m and current:
            mapping[(m.group(1), int(m.group(2)))] = current["code"]
    return topics, mapping


def to_question(src, e, exam, q_num):
    answers = sorted(src["answers"], key=lambda a: a["id"])
    return {
        "id": src["id"],
        "exam": exam,
        "examId": src["examId"],
        "qNum": q_num,
        "question": src["question"],
        "answers": [a["answer"] for a in answers],
        "correct": [i for i, a in enumerate(answers) if a["correct"]],
        "multiple": sum(a["correct"] for a in answers) > 1,
        "explanation": e.get("explanation") or src.get("explanation") or "",
        "explanationMD": e.get("explanationMD") or src.get("explanationMD") or "",
        "references": src.get("references") or [],
    }


def build_exams(crawled, expl, wrong, topic_of):
    """Xuất đầy đủ từng đề. Q# trên devcloudly = (thứ tự theo id + offset) mod n,
    offset của mỗi đề suy ra từ qNum của các câu sai."""
    names = {w["examId"]: exam_label(w["examName"]) for w in wrong}
    os.makedirs(EXAM_DIR, exist_ok=True)
    for f in glob.glob(os.path.join(EXAM_DIR, "*")):
        os.remove(f)

    index = []
    for exam_id in sorted(crawled, key=int):
        qs = sorted(crawled[exam_id], key=lambda q: q["id"])
        n, eid = len(qs), int(exam_id)
        rank = {q["id"]: i for i, q in enumerate(qs)}
        offsets = Counter((w["qNum"] - 1 - rank[w["id"]]) % n for w in wrong if w["examId"] == eid)
        if len(offsets) != 1:
            raise SystemExit("Không xác định được thứ tự câu của đề %s: %s" % (exam_id, offsets))
        offset = next(iter(offsets))

        out = []
        for q in qs:
            item = to_question(q, expl.get(q["id"], {}), names[eid], (rank[q["id"]] + offset) % n + 1)
            if q["id"] in topic_of:
                item["topic"] = topic_of[q["id"]]
            out.append(item)
        out.sort(key=lambda q: q["qNum"])

        fname = "exam_%s.js" % exam_id
        with open(os.path.join(EXAM_DIR, fname), "w", encoding="utf-8") as f:
            f.write("// Sinh tự động bởi build_topics.py, không sửa tay.\n")
            f.write("(window.EXAM_DATA = window.EXAM_DATA || {})[%s] = %s;\n" % (exam_id, json.dumps(out, ensure_ascii=False)))
        index.append({
            "examId": eid,
            "name": names[eid],
            "count": n,
            "multi": sum(q["multiple"] for q in out),
            "wrong": sum("topic" in q for q in out),
            "file": "exams/" + fname,
        })
        print("Đề %-14s %3d câu" % (names[eid], n))

    with open(os.path.join(EXAM_DIR, "index.js"), "w", encoding="utf-8") as f:
        f.write("// Sinh tự động bởi build_topics.py, không sửa tay.\n")
        f.write("window.EXAM_INDEX = " + json.dumps(index, ensure_ascii=False, indent=1) + ";\n")


def main():
    topics, topic_map = load_topic_map()
    crawled = json.load(open(os.path.join(RAW, "devcloudly_sap_exams.json"), encoding="utf-8"))
    full = {q["id"]: q for qs in crawled.values() for q in qs}
    expl = {}
    for f in glob.glob(os.path.join(RAW, "explanations", "exam_*.json")):
        expl.update({int(k): v for k, v in json.load(open(f, encoding="utf-8"))["questions"].items()})

    wrong = []
    for f in sorted(glob.glob(os.path.join(ROOT, "[0-9]*.json")), key=lambda p: int(os.path.basename(p)[:-5])):
        wrong.extend(json.load(open(f, encoding="utf-8"))["data"])

    out, missing = [], []
    for w in wrong:
        src = full.get(w["id"])
        exam = exam_label(w["examName"])
        code = topic_map.get((exam, w["qNum"]))
        if not src or not code:
            missing.append((w["id"], exam, w["qNum"], bool(src), code))
            continue
        item = to_question(src, expl.get(w["id"], {}), exam, w["qNum"])
        if not item["explanation"]:
            item["explanation"] = w.get("explanation") or ""
        item.update({
            "topic": code,
            "domain": w.get("domain") or src.get("domain") or "",
            "attempts": w["attempts"],
            "streak": w["streak"],
            "lastUserAnswer": w["userAnsText"],
        })
        out.append(item)

    if missing:
        raise SystemExit("Không ghép được %d câu: %s" % (len(missing), missing))

    json.dump(out, open(os.path.join(ROOT, "questions.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    os.makedirs(TOPIC_DIR, exist_ok=True)
    for f in glob.glob(os.path.join(TOPIC_DIR, "*")):
        os.remove(f)
    bundle = []
    for t in topics:
        qs = [q for q in out if q["topic"] == t["code"]]
        meta = {
            "key": "%02d-%s" % (t["order"], slugify(t["name"])),
            "code": t["code"],
            "name": t["name"],
            "count": len(qs),
        }
        json.dump(dict(meta, questions=qs), open(os.path.join(TOPIC_DIR, meta["key"] + ".json"), "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        bundle.append(dict(meta, questions=qs))
        print("%-6s %-55s %3d" % (t["code"], t["name"], len(qs)))

    with open(os.path.join(TOPIC_DIR, "topics.js"), "w", encoding="utf-8") as f:
        f.write("// Sinh tự động bởi build_topics.py, không sửa tay.\n")
        f.write("window.TOPIC_DATA = " + json.dumps(bundle, ensure_ascii=False) + ";\n")
    print("Tổng:", len(out), "câu")

    build_exams(crawled, expl, wrong, {q["id"]: q["topic"] for q in out})


if __name__ == "__main__":
    main()

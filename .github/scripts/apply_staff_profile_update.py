from __future__ import annotations

import json
import os
import re
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "staff-contributions.json"


def action_output(key: str, value: str) -> None:
    output_path = os.environ.get("GITHUB_OUTPUT")
    if output_path:
        with open(output_path, "a", encoding="utf-8") as handle:
            handle.write(f"{key}={value}\n")
    else:
        print(f"{key}={value}")


def extract_payload(body: str) -> dict[str, Any]:
    match = re.search(r"<!--\s*staff-profile-update-json\s*(\{.*?\})\s*-->", body or "", re.S)
    if not match:
        raise SystemExit("No staff-profile-update-json block found in issue body")
    return json.loads(match.group(1))


def submitted_lines(value: Any) -> list[str]:
    if isinstance(value, list):
        raw = value
    else:
        raw = str(value or "").splitlines()
    return [str(line).strip() for line in raw if str(line).strip()]


def text_items(lines: list[str]) -> list[dict[str, Any]]:
    items = []
    for line in lines:
        if " - " in line:
            title, description = line.split(" - ", 1)
            items.append({"title": title.strip(), "description": description.strip(), "keywords": keywords_from_text(line)})
        else:
            items.append({"title": line, "keywords": keywords_from_text(line)})
    return items


def resource_items(lines: list[str]) -> list[dict[str, Any]]:
    items = []
    for line in lines:
        url_match = re.search(r"https?://\S+", line)
        url = url_match.group(0).rstrip(".,);") if url_match else ""
        title = line.replace(url_match.group(0), "").strip(" -") if url_match else line
        item: dict[str, Any] = {"title": title or url or "Shared resource", "type": "Shared resource"}
        if url:
            item["url"] = url
            item["download"] = False
        else:
            item["description"] = line
        items.append(item)
    return items


def keywords_from_text(text: str) -> list[str]:
    if "," not in text:
        return []
    return [part.strip() for part in text.split(",") if part.strip()]


def main() -> int:
    payload = extract_payload(os.environ.get("ISSUE_BODY", ""))
    person_id = str(payload.get("personId") or "").strip()
    if not person_id:
        raise SystemExit("Payload is missing personId")

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    people = data.setdefault("people", [])
    record = next((item for item in people if item.get("personId") == person_id), None)
    if record is None:
        record = {"personId": person_id}
        people.append(record)

    current = submitted_lines(payload.get("currentWork"))
    collaboration = submitted_lines(payload.get("collaborationInterests"))
    resources = submitted_lines(payload.get("resources"))

    if current:
        record["workingOn"] = text_items(current)
    if collaboration:
        record["collaborationInterests"] = text_items(collaboration)
    if resources:
        record["resources"] = resource_items(resources)
    record["updatedOn"] = date.today().isoformat()
    record["sourceIssue"] = int(os.environ.get("ISSUE_NUMBER", "0") or 0)

    data.setdefault("meta", {})["people"] = len(people)
    data["meta"]["generatedOn"] = date.today().isoformat()

    before = DATA_PATH.read_text(encoding="utf-8")
    after = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if before != after:
        DATA_PATH.write_text(after, encoding="utf-8")
        action_output("changed", "true")
    else:
        action_output("changed", "false")
    action_output("person_id", person_id)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

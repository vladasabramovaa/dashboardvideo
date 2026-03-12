---
name: yt-research
description: YouTube research — search videos by topic, download transcripts, analyze with parallel agents, save to ObsidianDB with wikilinks and timestamp citations. Use when user wants to research a topic via YouTube videos. Triggers on "yt-research", "исследуй на ютубе", "youtube research", "посмотри видео по теме".
argument-hint: <topic or URLs> [--count N] [--lang en]
---

# YouTube Research Skill

Research topic via YouTube videos, extract transcripts, analyze, save to ObsidianDB.

**Required:** `yt-dlp` (brew install yt-dlp)
**Vault:** `~/Projects/ObsidianDB/`

## Input Parsing

Parse $ARGUMENTS:
- If arguments contain youtube.com/youtu.be URLs → use those directly
- Otherwise treat as search topic
- `--count N` → number of videos (default: 10, max: 30)
- `--lang XX` → subtitle language preference (default: en)

## Phase 1: Video Discovery

If topic (not URLs):
```bash
yt-dlp --flat-playlist --print "%(id)s\t%(title)s\t%(duration)s\t%(channel)s" "ytsearchN:TOPIC" 2>/dev/null
```

Filter: skip videos > 3600s (1hr) unless user specified. Sort by relevance (yt-dlp default).

Save video list to variable for Phase 2.

## Phase 2: Download Transcripts

Create temp dir:
```bash
TMPDIR=$(mktemp -d /tmp/yt-research-XXXXX)
```

For each video, download subtitles:
```bash
yt-dlp --write-auto-sub --sub-lang "LANG" --skip-download --sub-format vtt -o "$TMPDIR/%(id)s" "https://www.youtube.com/watch?v=VIDEO_ID" 2>/dev/null
```

**VTT Parsing** — auto-generated VTT has duplicated lines. Clean with this approach:
```bash
# Remove VTT tags, deduplicate, extract clean text with timestamps
python3 -c "
import re, sys
text = open(sys.argv[1]).read()
# Remove VTT header
text = re.sub(r'WEBVTT.*?\n\n', '', text, flags=re.DOTALL)
# Extract unique lines with timestamps
blocks = text.strip().split('\n\n')
seen = set()
result = []
for block in blocks:
    lines = block.strip().split('\n')
    if len(lines) >= 2:
        timestamp = lines[0].split(' --> ')[0] if ' --> ' in lines[0] else ''
        # Get the LAST line (clean text without tags)
        clean = re.sub(r'<[^>]+>', '', lines[-1]).strip()
        if clean and clean not in seen:
            seen.add(clean)
            # Convert timestamp to seconds for YouTube link
            if timestamp:
                parts = timestamp.replace(',', '.').split(':')
                secs = int(float(parts[0])) * 3600 + int(float(parts[1])) * 60 + int(float(parts[2]))
                mins = secs // 60
                sec_rem = secs % 60
                result.append(f'[{mins}:{sec_rem:02d}] {clean}')
            else:
                result.append(clean)
print('\n'.join(result))
" "$1"
```

Use **parallel agents** (up to 5 at a time) to download transcripts. Each agent handles a batch of videos.

If no subtitles available for a video → mark as "[NO TRANSCRIPT]" and skip.

## Phase 3: Analysis (Parallel Agents)

Launch parallel agents:

### Agent per video (batch by 3-5):
For each video with transcript, analyze:
- **Summary** (3-5 sentences)
- **Key facts/claims** (bulleted, with timestamp citations)
- **Tags** (topics covered)
- **Quality** (high/medium/low — based on specificity and depth)

### Cross-reference agent (after per-video agents complete):
- Find **agreements** — facts mentioned in 2+ videos
- Find **contradictions** — conflicting claims
- Find **unique insights** — facts from only one source
- Generate **master summary** of the topic

## Phase 4: Save to ObsidianDB

Vault path: `~/Projects/ObsidianDB/research/`

### Create topic directory:
```
research/{topic-slug}/
```

### Hub note: `research/{topic-slug}/_hub.md`
```markdown
---
source: yt-research
tags: [youtube, research, {topic-tags}]
created: {DATE}
query: "{original query}"
video_count: {N}
---

# Research: {Topic}

## Summary
{Cross-referenced master summary}

## Key Findings
{Agreed-upon facts with citation counts}

## Contradictions
{Conflicting claims between videos}

## Videos Analyzed

| # | Title | Channel | Duration | Quality | Link |
|---|-------|---------|----------|---------|------|
| 1 | ... | ... | ... | high | [[{slug}]] |

## Tags
{All unique tags from analysis}
```

### Per-video notes: `research/{topic-slug}/{video-slug}.md`
```markdown
---
source: yt-research
tags: [youtube, {topic}, {video-tags}]
created: {DATE}
youtube_id: {ID}
channel: {CHANNEL}
duration: {DURATION}
---

# {Video Title}

[Watch on YouTube](https://www.youtube.com/watch?v={ID})

## Summary
{3-5 sentence summary}

## Key Points
- [2:34](https://www.youtube.com/watch?v={ID}&t=154) — {fact/claim}
- [5:12](https://www.youtube.com/watch?v={ID}&t=312) — {fact/claim}

## Related
- [[_hub]] — research hub
- [[{other-video}]] — mentions similar topic
```

### Link to project hub (if applicable):
If topic relates to an existing project in `projects/`, add wikilink to that project's hub note.

## Phase 5: Report

After saving, print summary:
```
Research complete: {topic}
- Videos analyzed: X/Y (Z skipped — no transcript)
- Notes created: X files in ObsidianDB/research/{topic}/
- Key findings: N
- Open in Obsidian: obsidian://open?vault=ObsidianDB&file=research/{topic}/_hub
```

## Rules

- NEVER present unverified claims as facts
- Always cite with timestamp links
- Skip videos without transcripts (don't hallucinate content)
- Clean up /tmp/ after saving to vault
- Max 30 videos per run (context limit)
- Prefer transcripts in user's language, fallback to English

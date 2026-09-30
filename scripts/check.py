#!/usr/bin/env python3
"""Check portable bundles, helper behavior, and local documentation links."""
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def run(*args, success=True):
    result = subprocess.run([str(a) for a in args], capture_output=True, text=True)
    if (result.returncode == 0) != success:
        raise AssertionError(f"Unexpected exit {result.returncode}: {args}\n{result.stdout}\n{result.stderr}")
    return result


def main():
    for skill in (ROOT / "skills").iterdir():
        text = (skill / "SKILL.md").read_text()
        front = text.split("---", 2)[1]
        assert f"name: {skill.name}" in front and "description:" in front
        assert re.fullmatch(r"[a-z0-9-]+", skill.name)
        for ref in re.findall(r"\]\(([^)#]+)(?:#[^)]*)?\)", text):
            if "://" not in ref:
                assert (skill / ref).exists(), (skill, ref)
    for doc in [ROOT / "README.md", ROOT / "gtm-os/README.md"]:
        for ref in re.findall(r"\]\(([^)#]+)(?:#[^)]*)?\)", doc.read_text()):
            if "://" not in ref:
                assert (doc.parent / ref).exists(), (doc, ref)
    with tempfile.TemporaryDirectory(prefix="demo-skills-check-") as temp:
        temp = Path(temp)
        installed = temp / "skills"
        run(sys.executable, ROOT / "scripts/install.py", "--dest", installed)
        for name in ("launch-video", "ui-mockup-video"):
            bundle = installed / name
            assert (bundle / "assets/gtm-os/remotion-starter/package-lock.json").is_file()
            assert not (bundle / "assets/gtm-os/remotion-starter/node_modules").exists()
        marker = installed / "launch-video/local-edit.txt"
        marker.write_text("preserve this edit")
        run(sys.executable, ROOT / "scripts/install.py", "--dest", installed, success=False)
        assert marker.read_text() == "preserve this edit"
        project = temp / "new-video"
        relocated_init = installed / "launch-video/assets/gtm-os/tools/init-project.py"
        run(sys.executable, relocated_init, project)
        assert (project / "05_Code/src/Root.tsx").is_file()
        assert (project / "06_Editor_Notes/media-inventory.csv").is_file()
        run(sys.executable, relocated_init, project, success=False)
        if shutil.which("ffmpeg") and shutil.which("ffprobe"):
            fixture = temp / "fixture.mp4"
            run("ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=c=black:s=640x360:r=30:d=1", "-c:v", "libx264", "-pix_fmt", "yuv420p", fixture)
            report = run(sys.executable, ROOT / "gtm-os/tools/media-report.py", "--decode", fixture)
            media = json.loads(report.stdout)[0]
            assert media["full_decode"] == "passed"
            assert media["streams"][0]["width"] == 640 and media["streams"][0]["height"] == 360
            broken = temp / "broken.mp4"
            broken.write_bytes(b"not a video")
            run(sys.executable, ROOT / "gtm-os/tools/media-report.py", "--decode", broken, success=False)
        else:
            raise RuntimeError("Install ffmpeg and ffprobe to complete media checks")
    print("Passed: skill metadata/references, relocated installs, overwrite protection, new-project isolation, media probing and corrupt-file rejection.")


if __name__ == "__main__":
    main()

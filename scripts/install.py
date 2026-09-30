#!/usr/bin/env python3
"""Install portable skill bundles without replacing any existing skill."""
import argparse
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ("launch-video", "ui-mockup-video")
EXCLUDE = shutil.ignore_patterns("node_modules", "out", "dist", ".cache", ".git", ".DS_Store", "__pycache__", ".env", ".env.*", "recordings", "review")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", choices=("claude", "codex"), default="claude")
    parser.add_argument("--dest", type=Path, help="Override the target skills directory")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    default = Path.home() / (".claude" if args.agent == "claude" else ".agents") / "skills"
    dest = (args.dest or default).expanduser().resolve()
    for name in SKILLS:
        target = dest / name
        if target.exists() or target.is_symlink():
            parser.error(f"Refusing to replace existing skill: {target}. Choose --dest or move it yourself.")
    if args.dry_run:
        for name in SKILLS:
            print(f"Would install {name}, including gtm-os support files, to {dest / name}")
        return
    dest.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".demo-skills-", dir=dest) as temp:
        staging = Path(temp)
        for name in SKILLS:
            target = staging / name
            shutil.copytree(ROOT / "skills" / name, target)
            shutil.copytree(ROOT / "gtm-os", target / "assets" / "gtm-os", ignore=EXCLUDE)
            shutil.copy2(ROOT / "LICENSE", target / "LICENSE")
        for name in SKILLS:
            target = dest / name
            if target.exists() or target.is_symlink():
                raise FileExistsError(f"Destination appeared during install: {target}")
            (staging / name).rename(target)
            print(f"Installed {target}")


if __name__ == "__main__":
    main()

# Validation

Reproduction commands from the repository root:

```sh
python3 scripts/check.py
cd gtm-os/remotion-starter
npm ci
npm run typecheck
npm run render:launch
npm run render:ui
npm run render:loop
```

`scripts/check.py` exercises installation in an isolated temporary destination, verifies that an existing skill is preserved, initializes a project from the relocated installed bundle, and checks both a valid media file and a corrupt file. It also checks skill metadata and local documentation links.

The renderer checks output dimensions/duration and fully decodes the file before promoting the temporary export. A visual pass is still required; those automated checks do not establish layout, narrative quality, audio quality, or product behavior.

The capture helper must be tested against a suitable demo app before real use. Its sample action plan is illustrative and does not correspond to a running product. Never run it against a customer tenant without checking the actions and authorization.

## Initial release checks

Validated on macOS arm64 with Node 24.16.0, the checked-in lockfile, and Remotion 4.0.530:

- Both skills passed the skill-creator frontmatter validator.
- Portable install, relocation, existing-file protection, project initialization, valid-media probing, and corrupt-media rejection passed `scripts/check.py`.
- `npm ci --dry-run` accepted the lockfile, `npm run typecheck` passed, and Remotion bundled and rendered the source successfully.
- Full exports completed and were decoded successfully by the render wrapper:

| Export | Size | FPS | Frames | Duration |
| --- | --- | --- | --- | --- |
| Launch review | 1920×1080 | 30 | 720 | 24 s |
| UI mockup | 1920×1080 | 30 | 360 | 12 s |
| Diagram loop | 1920×1080 | 30 | 240 | 8 s |
| Launch 4K | 3840×2160 | 30 | 720 | 24 s |

- Opening, approval, saved result, architecture, CTA, and a 4K poster were visually inspected as rendered frames. This is a frame/layout review, not a human editorial or audio review; the starter is silent.
- The actual-browser capture helper was exercised against a local test fixture: preflight screenshot plus fill → click → visible result, at 150% CSS layout zoom. The resulting 1920×1080, 25 fps WebM fully decoded. This verifies capture mechanics, not any real product's behavior.
- Rendering to an existing final filename was rejected, preserving the prior export.
- A source scan found no matching access tokens, private keys, private context links, or user-specific absolute paths. Generated output, dependencies, and test-capture data remain ignored.

The ProRes command is provided but was not rendered in this validation. No live product account, actual app integration, mobile capture, soundtrack, or Windows/Linux execution is claimed by these checks.

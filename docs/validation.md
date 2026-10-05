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

## Studio expansion — October 5, 2026

Validated on macOS arm64, Node 24.16.0, FFmpeg 8.1.1, and the existing Remotion 4.0.530 lockfile. No dependency versions changed.

- `npm ci` and explicit TypeScript typecheck passed. The new/changed Studio source, config, registry, and Node helpers passed Prettier 3.6.2 checks; Node/Python syntax checks passed. This repo has no separate lint script.
- All three skills passed the skill-creator metadata validator. `scripts/check.py` passed temporary installation, dry-run isolation, relocated project initialization, nested skill reference checks, rejection of invalid helper IDs, and existing-export protection. Installed bundles exclude dependencies, review outputs, exports, and environment files.
- Remotion bundled and listed all six compositions with the expected metadata. The original Launch, UiMockup, and DiagramLoop commands each rendered a complete 1080p MP4 and passed full decode.
- SlackThread (18 s / 540 frames), OpenMuseLaunch (36 s / 1080 frames), and OpenDotsLaunch (32 s / 960 frames) each rendered complete 1920×1080, 30 fps H.264 exports. The render wrapper verified dimensions, frame rate, duration, and full decode. An additional standalone media-report decode passed for each new 1080p clip.
- SlackThread additionally rendered directly at 3840×2160, 30 fps, 18 seconds and passed dimensions/cadence/duration checks and full decode. Its final 4K frame was extracted for visual review.
- The review helper rendered scene boundaries and key interaction states. Actual pixels and one-second samples extracted from all three exports were inspected for fit, state order, readable holds, and closing frames. This is sampled visual review, not a claim of human editorial playback or live product acceptance.
- Slack's clean final state, thread-click cursor target, and branded wrapper were inspected. Review caught and corrected a stale saving line. The cursor now selects the thread affordance before the reply content appears.
- Live Remotion Studio loaded all six IDs. Slack's clean/branded toggle saved successfully to source in both directions, with the clean default restored. Composition IDs/components remain literal and metadata spreads precede explicit props so Studio's source editor can resolve them.
- README previews were extracted from the actual exported clips. Large media, dependencies, and local execution notes remain outside the commit.

The three added examples are silent illustrations with synthetic content. Product CTA placeholders, pseudocode, generic routing diagrams, and mobile mock layouts need current product evidence and approved assets for a public launch. The ProRes command is provided but was not rendered during this expansion; no live Slack API, actual product capture, soundtrack, or Windows/Linux execution is claimed.

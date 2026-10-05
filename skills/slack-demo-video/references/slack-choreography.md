# Slack choreography

Keep the workspace rail, selected channel, channel header, message author, attachment, reply affordance, and thread panel recognizable. Use stable layout geometry; names are short enough to fit without shrinking all type. Match real supplied references where useful, but replace private workspace/customer content with approved synthetic data.

The bundled timing is deliberately slower than machine execution:

| Frame / time | State |
| --- | --- |
| 12 / 0.4 s | Request begins typing in composer |
| 90 / 3 s | Send press; request and Markdown attachment appear |
| 126 / 4.2 s | Cursor selects reply affordance; thread content appears |
| 180 / 6 s | Read-file result and draft progress appear |
| 270 / 9 s | Reviewable brief with fields and an action button |
| 330 / 11 s | Cursor presses approval; saving state |
| 390 / 13 s | Saved Page receipt |
| 438 / 14.6 s | Colleague reply |
| 480 / 16 s | Reactions arrive; hold through frame 539 |

Change both the schedule and the review-frame list when revising timing. Keep the composition long enough for a readable final hold. Clean and branded modes use the same logical geometry, transformed with the whole UI.

For Block Kit-style output, use a heading/section for the result, two-column fields for compact metadata, a divider between content groups, actions for a decision, and a context line or separate receipt for the destination. These are mock visual components. Validate actual Block Kit payloads separately if implementing a real bot; this template supplies no API payload or execution.

Cursor movement ends before the click. Both cursor target and control position come from `slackGeometry`. The click should cause a pressed state, followed by saving, followed by the receipt. Keep the cursor away from copy during reading holds. Do not move it to irrelevant controls to fill time.

Use event-gated mounting instead of transparent messages that reserve layout height. At the longest state, confirm the conversation and reactions fit. If more replies are needed, deliberately scroll or reflow the mock UI with frame-based offsets; do not let the last block silently disappear offscreen.

import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Cursor, Field} from './primitives';
import {mix, progress, settle} from './motion';
import {theme} from './theme';
import {
  slackContent as C,
  slackEvents as B,
  slackGeometry as G,
} from './slack-story';

const colors = {
  ink: '#21232a',
  muted: '#616773',
  border: '#dfe2e8',
  green: '#147d59',
};
const text: CSSProperties = {fontSize: 27, lineHeight: 1.45};
function Message({
  name,
  color,
  children,
}: {
  name: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div style={{display: 'flex', gap: 18, marginBottom: 28}}>
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: 12,
          background: color,
          color: 'white',
          display: 'grid',
          placeItems: 'center',
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        {name[0]}
      </div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 26, fontWeight: 700, marginBottom: 7}}>
          {name}
          <span
            style={{
              fontSize: 19,
              fontWeight: 400,
              color: colors.muted,
              marginLeft: 14,
            }}
          >
            10:42
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SlackThread({clean = true}: {clean?: boolean}) {
  const f = useCurrentFrame();
  const sent = f >= B.send;
  const approved = f >= B.approve;
  const saved = f >= B.saved;
  const toSend = settle(f, B.send - 26, 20);
  const toThread = settle(f, B.thread - 26, 22);
  const toApprove = settle(f, B.approve - 30, 22);
  const away = settle(f, B.saved + 6, 22);
  const x = mix(
    mix(
      mix(mix(920, G.send.x, toSend), G.thread.x, toThread),
      G.approve.x,
      toApprove,
    ),
    1780,
    away,
  );
  const y = mix(
    mix(
      mix(mix(916, G.send.y, toSend), G.thread.y, toThread),
      G.approve.y,
      toApprove,
    ),
    988,
    away,
  );
  const pulse =
    f >= B.approve
      ? progress(f, B.approve, 15)
      : f >= B.thread
        ? progress(f, B.thread, 15)
        : progress(f, B.send, 15);
  const ui = (
    <AbsoluteFill
      style={{background: '#fff', color: colors.ink, fontFamily: theme.font}}
    >
      <div
        style={{
          height: G.header,
          background: '#38253d',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          boxSizing: 'border-box',
          gap: 48,
        }}
      >
        <strong style={{fontSize: 28}}>{C.workspace}</strong>
        <div
          style={{
            background: '#ffffff18',
            border: '1px solid #ffffff28',
            borderRadius: 9,
            width: 870,
            padding: '11px 24px',
            fontSize: 24,
          }}
        >
          Search Demo workspace
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: G.header,
          bottom: 0,
          width: G.sidebar,
          background: '#f6f1f7',
          padding: '36px 24px',
          boxSizing: 'border-box',
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div style={{fontSize: 29, fontWeight: 700}}>Channels</div>
        {['general', C.channel, 'release-notes'].map((channel) => (
          <div
            key={channel}
            style={{
              marginTop: 20,
              padding: '12px 10px',
              borderRadius: 8,
              fontSize: 24,
              background: channel === C.channel ? '#e7dcea' : 'transparent',
            }}
          >
            # {channel}
          </div>
        ))}
        <div style={{fontSize: 26, fontWeight: 600, marginTop: 48}}>
          Direct messages
        </div>
        <div style={{fontSize: 24, marginTop: 22}}>● Scout</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: G.sidebar,
          top: G.header,
          width: G.threadX - G.sidebar,
          bottom: 0,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            height: 88,
            padding: '25px 32px',
            boxSizing: 'border-box',
            borderBottom: `1px solid ${colors.border}`,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          # {C.channel}
        </div>
        <div style={{padding: '36px 32px'}}>
          <div style={{color: colors.muted, fontSize: 23, marginBottom: 34}}>
            Today • A launch brief, together
          </div>
          {sent && (
            <Message name={C.human} color="#6856a5">
              <div style={text}>{C.request}</div>
              <div
                style={{
                  marginTop: 16,
                  padding: 18,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  fontSize: 25,
                }}
              >
                ▤ release-notes.md{' '}
                <span style={{color: colors.muted, fontSize: 19}}>
                  · Markdown
                </span>
              </div>
              {sent && (
                <div style={{color: '#1264a3', fontSize: 23, marginTop: 14}}>
                  {f >= B.thread
                    ? f >= B.reply
                      ? '3 replies'
                      : '1 reply'
                    : 'Open'}{' '}
                  · View thread
                </div>
              )}
            </Message>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 32,
            right: 32,
            top: 816,
            height: 144,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: '20px 24px',
            boxSizing: 'border-box',
            ...text,
          }}
        >
          {sent ? (
            <span style={{color: colors.muted}}>Message #launch-studio</span>
          ) : (
            C.request.slice(
              0,
              Math.floor(C.request.length * progress(f, B.type, 66)),
            )
          )}
          <div
            style={{
              position: 'absolute',
              left: G.send.x - G.sidebar - 32 - 26,
              top: G.send.y - G.header - 816 - 26,
              width: 52,
              height: 52,
              borderRadius: 9,
              background: sent ? '#e4e7eb' : colors.green,
              color: sent ? colors.muted : '#fff',
              display: 'grid',
              placeItems: 'center',
              transform:
                f >= B.send && f < B.send + 5 ? 'scale(.94)' : undefined,
            }}
          >
            ➤
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: G.threadX,
          right: 0,
          top: G.header,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 88,
            padding: '25px 32px',
            boxSizing: 'border-box',
            borderBottom: `1px solid ${colors.border}`,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Thread{' '}
          <span style={{fontSize: 23, color: colors.muted, fontWeight: 400}}>
            · #{C.channel}
          </span>
        </div>
        {f >= B.thread && (
          <div style={{padding: '28px 32px'}}>
            <Message name={C.human} color="#6856a5">
              <div style={text}>Please draft a brief from these notes.</div>
            </Message>
            {f >= B.progress && f < B.draft && (
              <Message name={C.agent} color={colors.green}>
                <div style={text}>
                  Read release-notes.md ✓<br />
                  Preparing a brief…
                </div>
              </Message>
            )}
            {f >= B.draft && (
              <Message name={C.agent} color={colors.green}>
                <div style={{...text, fontWeight: 600}}>
                  {saved ? 'Launch brief saved' : 'Review your launch brief'}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop: `1px solid ${colors.border}`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 24,
                    ...text,
                  }}
                >
                  <div>
                    <strong>Audience</strong>
                    <br />
                    App developers
                  </div>
                  <div>
                    <strong>Deliverable</strong>
                    <br />
                    Launch Page
                  </div>
                </div>
                <div style={{...text, marginTop: 22}}>
                  Goal → scope → next steps.
                  <br />
                  {saved
                    ? 'Approval received. The Page is ready.'
                    : approved
                      ? 'Approval received. Saving the Page.'
                      : 'Review before anything is saved.'}
                </div>
              </Message>
            )}
            {f >= B.saved && (
              <div
                style={{
                  position: 'absolute',
                  left: 98,
                  top: 620,
                  right: 34,
                  padding: 20,
                  background: '#f0faf5',
                  border: '1px solid #b4dcc8',
                  borderRadius: 10,
                  ...text,
                }}
              >
                <strong>✓ Saved to Launch studio</strong>
                <br />
                Launch brief · Page available
              </div>
            )}
            {f >= B.reply && (
              <div
                style={{position: 'absolute', left: 32, right: 32, top: 765}}
              >
                <Message name={C.colleague} color="#a56a42">
                  <div style={text}>The brief is ready for review.</div>
                </Message>
              </div>
            )}
            {f >= B.reaction && (
              <div
                style={{
                  position: 'absolute',
                  top: 900,
                  left: 98,
                  padding: '6px 18px',
                  borderRadius: 20,
                  border: '1px solid #c4d7eb',
                  background: '#edf5ff',
                  fontSize: 23,
                }}
              >
                ✓ 2 &nbsp; ★ 1
              </div>
            )}
          </div>
        )}
        {f >= B.draft && (
          <div
            style={{
              position: 'absolute',
              left: G.approve.x - G.threadX - 118,
              top: G.approve.y - G.header - 28,
              width: 236,
              height: 56,
              borderRadius: 9,
              border: `1px solid ${saved ? colors.green : colors.border}`,
              background: approved ? '#f0faf5' : colors.green,
              color: approved ? colors.green : 'white',
              display: 'grid',
              placeItems: 'center',
              fontSize: 24,
              fontWeight: 600,
              transform:
                approved && f < B.approve + 5 ? 'scale(.97)' : undefined,
            }}
          >
            {saved ? 'Saved ✓' : approved ? 'Saving…' : 'Approve & save'}
          </div>
        )}
      </div>
      <Cursor x={x} y={y} pulse={pulse} />
    </AbsoluteFill>
  );
  if (clean) return ui;
  return (
    <Field>
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 30,
          fontSize: 40,
          fontWeight: 600,
        }}
      >
        A conversation becomes a useful Page.
      </div>
      <div
        style={{
          position: 'absolute',
          left: 192,
          top: 120,
          width: 1536,
          height: 864,
          overflow: 'hidden',
          borderRadius: 18,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 1920,
            height: 1080,
            transform: 'scale(.8)',
            transformOrigin: 'top left',
          }}
        >
          {ui}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 96,
          bottom: 40,
          fontSize: 24,
          color: theme.muted,
        }}
      >
        {C.note}
      </div>
    </Field>
  );
}

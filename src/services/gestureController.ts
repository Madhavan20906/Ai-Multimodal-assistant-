/**
 * GestureController — Modular gesture recognition engine.
 *
 * Responsibility: Converts raw MediaPipe hand landmark arrays into
 * named gesture events. Completely decoupled from rendering.
 *
 * Landmark indices (MediaPipe Hands):
 *   0=WRIST, 4=THUMB_TIP, 5=INDEX_MCP, 6=INDEX_PIP, 8=INDEX_TIP,
 *   12=MIDDLE_TIP, 16=RING_TIP, 20=PINKY_TIP
 */

export type GestureName =
  | 'OPEN_PALM'
  | 'PINCH'
  | 'GRAB'
  | 'POINT'
  | 'THUMBS_UP'
  | 'NONE';

export interface GestureResult {
  name: GestureName;
  /** Normalised [0-1] screen coordinates of the hand centroid */
  x: number;
  y: number;
  /** Normalised pinch distance (0 = fully pinched, 1 = fully open) */
  pinchDistance: number;
  /** Raw 21-landmark array for consumers that want raw data */
  landmarks: { x: number; y: number; z: number }[];
}

/** Euclidean distance between two 2-D normalised landmarks */
function dist(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** Returns true if a fingertip is extended (tip clearly above the pip joint in image Y, which is inverted) */
function isFingerExtended(
  tip: { x: number; y: number },
  pip: { x: number; y: number }
): boolean {
  // In normalised image space Y increases downward, so a lower Y = higher on screen
  return tip.y < pip.y - 0.04;
}

/**
 * Classify a single hand from 21 MediaPipe landmarks.
 * Returns a GestureResult with name, position, and pinch distance.
 */
export function classifyGesture(
  landmarks: { x: number; y: number; z: number }[]
): GestureResult {
  if (!landmarks || landmarks.length < 21) {
    return { name: 'NONE', x: 0.5, y: 0.5, pinchDistance: 1, landmarks: [] };
  }

  const thumbTip  = landmarks[4];
  const indexMcp  = landmarks[5];
  const indexPip  = landmarks[6];
  const indexTip  = landmarks[8];
  const middlePip = landmarks[10];
  const middleTip = landmarks[12];
  const ringPip   = landmarks[14];
  const ringTip   = landmarks[16];
  const pinkyPip  = landmarks[18];
  const pinkyTip  = landmarks[20];
  const wrist     = landmarks[0];

  // --- Centroid (average of all landmarks) ---
  const cx = landmarks.reduce((s, l) => s + l.x, 0) / landmarks.length;
  const cy = landmarks.reduce((s, l) => s + l.y, 0) / landmarks.length;

  // --- Pinch distance (thumb-tip to index-tip, normalised by wrist–index-mcp span) ---
  const handScale = dist(wrist, indexMcp) || 0.1;
  const rawPinch  = dist(thumbTip, indexTip);
  const pinchDistance = Math.min(1, rawPinch / (handScale * 2.5));

  // --- Finger extension booleans ---
  const indexExt  = isFingerExtended(indexTip,  indexPip);
  const middleExt = isFingerExtended(middleTip, middlePip);
  const ringExt   = isFingerExtended(ringTip,   ringPip);
  const pinkyExt  = isFingerExtended(pinkyTip,  pinkyPip);

  // --- Classify ---
  let name: GestureName = 'NONE';

  if (pinchDistance < 0.25) {
    name = 'PINCH';
  } else if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
    name = 'GRAB';
  } else if (indexExt && middleExt && ringExt && pinkyExt) {
    name = 'OPEN_PALM';
  } else if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    name = 'POINT';
  } else if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
    // Thumb up: thumb clearly above index MCP while fingers curled
    if (thumbTip.y < indexMcp.y - 0.06) {
      name = 'THUMBS_UP';
    }
  }

  return { name, x: cx, y: cy, pinchDistance, landmarks };
}

/** Human-readable label shown in the HUD badge */
export function gestureLabelFor(name: GestureName): string {
  switch (name) {
    case 'PINCH':      return '🤏 Pinch';
    case 'GRAB':       return '✊ Grab';
    case 'OPEN_PALM':  return '🖐 Open Palm';
    case 'POINT':      return '☝️ Point';
    case 'THUMBS_UP':  return '👍 Thumbs Up';
    default:           return '✋ Tracking';
  }
}

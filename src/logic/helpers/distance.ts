import { Node } from '@xyflow/react';

export function distance(a: Node | undefined, b: Node | undefined) {
  if (!a || !b) {
    throw new Error(`a or b not defined. a: ${a}, b:${b}`);
  }
  const ax = a.position.x;
  const ay = a.position.y;
  const bx = b.position.x;
  const by = b.position.y;

  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

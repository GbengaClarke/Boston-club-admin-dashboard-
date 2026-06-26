export function Bomb() {
  throw new Error(
    "💥 Dev Test: The Error Boundary successfully intercepted this crash!"
  );
  return null;
}

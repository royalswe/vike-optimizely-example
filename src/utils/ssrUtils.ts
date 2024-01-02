export function runOnClient(callback: () => void) {
  if (isClientSide()) {
    callback();
  }
}

export function runOnServer(callback: () => void) {
  if (!isClientSide()) {
    callback();
  }
}

export function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

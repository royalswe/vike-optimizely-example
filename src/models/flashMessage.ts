export interface FlashMessage {
  show: boolean;
  duration?: number;
  modifiers: string[];
  title?: string;
  text?: string;
  icon: string;
}

export function initFlashMessage(
  options?: Partial<FlashMessage>
): FlashMessage {
  const defaults = {
    show: false,
    duration: 5000,
    modifiers: ['error'],
    icon: 'info',
  };

  return {
    ...defaults,
    ...options,
  };
}

type NotifyType = 'info' | 'success' | 'error';

interface NotifyState {
  visible: boolean;
  text: string;
  type: NotifyType;
}

export const useNotify = () => {
  const toast = useState<NotifyState>('ui_notify_toast', () => ({
    visible: false,
    text: '',
    type: 'info',
  }));

  const hide = (): void => {
    toast.value.visible = false;
  };

  const show = (text: string, type: NotifyType = 'info', durationMs = 2800): void => {
    toast.value = {
      visible: true,
      text,
      type,
    };

    if (durationMs > 0) {
      setTimeout(() => {
        if (toast.value.text === text) {
          hide();
        }
      }, durationMs);
    }
  };

  return {
    toast,
    show,
    hide,
  };
};

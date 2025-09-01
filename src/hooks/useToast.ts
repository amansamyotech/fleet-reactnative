import Toast from 'react-native-toast-message';
import { useCallback } from 'react';
import { TextStyle } from 'react-native';
import { color } from '../constants/colors';

type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    console.log("showToast");

    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 20,

      text1Style: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.primary,
      } as TextStyle,
      text2Style: {
        fontSize: 14,

      } as TextStyle,
    });
  }, []);

  return { showToast };
};

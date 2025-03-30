import { ref } from 'vue';
import message from '@/utils/message';

interface UseAsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useAsyncOperation<T>(
  operation: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const isLoading = ref(false);

  const execute = async (...args: any[]): Promise<T | null> => {
    try {
      isLoading.value = true;
      const result = await operation(...args);
      if (options.successMessage) {
        message.success(options.successMessage);
      }
      return result;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || options.errorMessage || '操作失败';
      message.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    execute
  };
}
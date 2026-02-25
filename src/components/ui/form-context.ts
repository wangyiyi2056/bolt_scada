import { inject } from "vue";

export type FormItemContextValue = {
  id: string;
};

export const formItemContext = Symbol("form-item");

export function useFormItem() {
  const item = inject<FormItemContextValue>(formItemContext);
  if (!item) {
    throw new Error("Form components must be used within <FormItem>");
  }
  return item;
}

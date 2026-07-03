import PaystackPop from "@paystack/inline-js";

export function payWithPaystack(
  email: string,
  amount: number,
  onSuccess: () => void,
  onClose: () => void
) {
  const popup = new PaystackPop();

  popup.newTransaction({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // Kobo

    onSuccess() {
      onSuccess();
    },

    onCancel() {
      onClose();
    },
  });
}
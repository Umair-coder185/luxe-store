import CartClientShell from "@/components/storefront/cart/CartClientShell";

export const metadata = {
  title: "Your Cart | LUXE",
  description: "Review items in your cart.",
};

export default function CartPage() {
  return (
    <div className="bg-white min-h-[70vh]">
      <CartClientShell />
    </div>
  );
}

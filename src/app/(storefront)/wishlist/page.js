import WishlistClientShell from "@/components/storefront/wishlist/WishlistClientShell";

export const metadata = {
  title: "Your Wishlist | LUXE",
  description: "A considered collection of pieces you've saved.",
};

export default function WishlistPage() {
  return (
    <div className="bg-white min-h-[70vh]">
      <WishlistClientShell />
    </div>
  );
}

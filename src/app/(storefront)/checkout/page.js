import { redirect } from 'next/navigation';
import { requireAuthSC } from '@/lib/auth/guards';
import CheckoutClientShell from '@/components/storefront/checkout/CheckoutClientShell';

export const metadata = {
  title: 'Checkout | LUXE',
  description: 'Secure checkout',
};

export default async function CheckoutPage() {
  const { user, error } = await requireAuthSC();

  if (error || !user) {
    redirect('/sign-in?callbackUrl=/checkout');
  }

  // Extract safe customer data for future prefill (Prompt 3)
  const safeUser = {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    addresses: (user.addresses || []).map(addr => ({
      ...addr,
      _id: addr._id ? addr._id.toString() : undefined,
    })),
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-10">Checkout</h1>
        <CheckoutClientShell user={safeUser} />
      </div>
    </div>
  );
}

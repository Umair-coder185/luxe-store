// app/(auth)/layout.js

export const metadata = {
  title: 'Sign In',
};

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
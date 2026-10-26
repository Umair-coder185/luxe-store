import { redirect } from "next/navigation";

export default async function ProductSingularRedirectPage({ params }) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}

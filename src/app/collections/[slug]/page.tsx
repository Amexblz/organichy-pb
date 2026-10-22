import { redirect } from "next/navigation";

export default function CollectionSlugPage({ params }: { params: { slug: string } }) {
  redirect(`/shop?category=${params.slug}`);
}

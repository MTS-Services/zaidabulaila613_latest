import Product from "@/interfaces/product/product";
import { redirect } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // await if needed (not required here, error message can be misleading)
  const { id } = await params;
  if(!id){
    redirect('/not-found')
  }

  return (
    <>
      <Product id={id} />
    </>
  );
}
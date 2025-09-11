import UpdateProduct from "@/interfaces/dress/updateDress";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // await if needed (not required here, error message can be misleading)
  const { id } = await params;

  return (
    <>
      <UpdateProduct id={id} />
    </>
  );
}
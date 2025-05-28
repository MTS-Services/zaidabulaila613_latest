import Image from "next/image"
import ImageGallery from "@/components/image-gallery"

export default function GalleryPage() {
  const galleryImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ckONfWHelwFqzqvo9Yq2M3Fx3A24s2.png", // This is a placeholder, we'll use the actual images
      alt: "Wedding couple by the lake",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ckONfWHelwFqzqvo9Yq2M3Fx3A24s2.png", // This is a placeholder, we'll use the actual images
      alt: "Resort with swimming pool and palm trees",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ckONfWHelwFqzqvo9Yq2M3Fx3A24s2.png", // This is a placeholder, we'll use the actual images
      alt: "Woman in purple dress against purple background",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-playfair">Our Gallery</h1>
            <p className="max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore our collection of beautiful images
            </p>
          </div>
        </div>

        <ImageGallery
          images={[
            {
              src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
              alt: "Wedding couple by the lake",
            },
            {
              src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
              alt: "Resort with swimming pool and palm trees",
            },
            {
              src: "https://images.unsplash.com/photo-1572251328695-09a587e459c1?q=80&w=1000&auto=format&fit=crop",
              alt: "Woman in purple dress against purple background",
            },
          ]}
          className="mb-12"
        />

        {/* Alternative layout with different aspect ratios */}
        <h2 className="text-2xl font-bold mb-6 mt-12">Alternative Layouts</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="md:col-span-4 relative rounded-lg overflow-hidden shadow-md">
            <div className="aspect-[3/4] relative">
              <Image
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop"
                alt="Wedding couple by the lake"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-4 relative rounded-lg overflow-hidden shadow-md">
            <div className="aspect-[3/4] relative">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
                alt="Resort with swimming pool and palm trees"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-4 relative rounded-lg overflow-hidden shadow-md">
            <div className="aspect-[3/4] relative">
              <Image
                src="https://images.unsplash.com/photo-1572251328695-09a587e459c1?q=80&w=1000&auto=format&fit=crop"
                alt="Woman in purple dress against purple background"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Masonry-style layout */}
        <h2 className="text-2xl font-bold mb-6 mt-12">Masonry Layout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="grid gap-4">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[4/3] relative">
                <Image
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop"
                  alt="Wedding couple by the lake"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[1/1] relative">
                <Image
                  src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop"
                  alt="Bride in white dress"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[1/1] relative">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
                  alt="Resort with swimming pool and palm trees"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[4/3] relative">
                <Image
                  src="https://images.unsplash.com/photo-1623609163859-ca93c959b5b8?q=80&w=1000&auto=format&fit=crop"
                  alt="Elegant dress"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[3/4] relative">
                <Image
                  src="https://images.unsplash.com/photo-1572251328695-09a587e459c1?q=80&w=1000&auto=format&fit=crop"
                  alt="Woman in purple dress against purple background"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <div className="aspect-[1/1] relative">
                <Image
                  src="https://images.unsplash.com/photo-1562137369-1a1a0bc66744?q=80&w=1000&auto=format&fit=crop"
                  alt="Woman in blue dress"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

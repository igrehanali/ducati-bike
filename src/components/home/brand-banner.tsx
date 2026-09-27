import Image from "next/image"

export function BrandBanner() {
  return (
    <section className="pt-20">
      <div className="relative isolate flex h-[520px] flex-col justify-end overflow-hidden p-5 text-white md:h-[750px] md:p-8">
        <Image
          src="/media/banner-track.webp"
          alt="Rider leaning a motorcycle into a bend"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
        <div className="flex flex-col gap-3">
          <h2 className="font-inter text-[34px] leading-[42px] font-medium tracking-[-1px] md:text-5xl md:leading-[58px]">
            For those who live Vellora.
          </h2>
          <p className="max-w-[401px] text-sm leading-[17px] tracking-[-0.1px]">
            Vellora is more than a motorcycle. It’s performance, design and emotion in motion. Since 2001, Vellora Moto
            UK has helped riders experience that passion on the road, on the track and beyond.
          </p>
        </div>
      </div>
    </section>
  )
}

import Image from "next/image";

export default function RankingPage() {
  return (
    <div className="w-full">
      <section
        className="
          mx-auto w-full
          rounded-2xl bg-[#1C1C1C] text-white
          shadow-[0_6px_28px_rgba(0,0,0,0.28)]
          p-6 sm:p-8
          h-[calc(100vh-160px)]
          flex items-center justify-center
        "
      >
        <Image
          src="/ranking/coming-soon.svg"
          alt="Coming soon illustration with the text 'COMING SOON...'"
          width={501}
          height={440}
          sizes="(min-width:1024px) 500px, 80vw"
          className="w-[min(80vw,500px)] h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          priority
        />
      </section>
    </div>
  );
}

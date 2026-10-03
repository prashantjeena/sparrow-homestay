import Hero from "@/components/Hero";
import Host from "@/components/Host";
import Booking from "@/components/Booking";
import Navbar from "@/components/Navbar";
import Rooms from "@/components/Rooms";
import SmoothScroll from "@/components/SmoothScroll";
import Faq from "@/components/Faq";
import { site } from "@/data/site";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />

        {/* Quick facts. More sections (rooms, booking, gallery...) come next. */}
        <section className="container-x pb-24 pt-4">
          <dl className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-[0.2em] text-ink2">
                  {s.label}
                </dt>
                <dd className="font-display mt-2 text-4xl font-semibold text-forest">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Rooms />
        <Gallery />
        <Host />
        <Booking />
        <Faq />
      </main>
    </>
  );
}

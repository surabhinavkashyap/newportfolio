import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Work } from "@/components/site/Work";
import { About } from "@/components/site/About";
import { Foundation } from "@/components/site/Foundation";
import { Approach } from "@/components/site/Approach";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-full bg-fog px-4 py-2 text-sm text-ink focus:translate-y-0"
      >
        Skip to work
      </a>
      <Nav />
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[140vh]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto hidden h-full max-w-[1240px] border-x border-line xl:block" />
      <main className="relative">
        <Hero />
        <Work />
        <About />
        <Foundation />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

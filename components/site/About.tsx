import { MaskLine, Reveal } from "@/components/site/Reveal";

const FACTS = [
  ["Studying", "B.Tech Information Technology, Jabalpur Engineering College — JEC ’28"],
  ["Based in", "Jabalpur, Madhya Pradesh, India"],
  ["Off-screen", "Competitive badminton at the state level"],
  ["Learning now", "Advanced Next.js, MongoDB, system design basics"],
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="grid gap-6 border-t border-line pt-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-3" y={12}>
          <p className="label">
            <span className="text-ice">(03)</span> About
          </p>
        </Reveal>

        <div className="lg:col-span-9">
          <h2 className="text-[clamp(44px,7vw,108px)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <MaskLine inView>Same discipline.</MaskLine>
            <MaskLine inView delay={0.08} className="font-serif font-normal italic tracking-[-0.02em] text-ice">
              Different arena.
            </MaskLine>
          </h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-9">
            <div className="space-y-5 text-[17px] leading-relaxed text-mist lg:col-span-5">
              <Reveal>
                <p>
                  <span className="text-fog">
                    I’m a B.Tech Information Technology student at Jabalpur Engineering College.
                  </span>{" "}
                  My foundation is data structures and algorithms — arrays, trees, graphs, dynamic programming — and I care
                  about the thinking behind a system, not just its syntax.
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <p>
                  I enjoy turning complex problems into clean, working software: useful tools and well-structured
                  backends where correctness, performance, and maintainability are decided up front, not patched in later.
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <p>
                  Outside of tech, I compete in badminton at the state level. The same discipline carries over when I’m
                  grinding LeetCode or debugging at 3am.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="lg:col-span-4">
              <dl className="divide-y divide-line border-y border-line">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-4">
                    <dt className="label pt-0.5">{k}</dt>
                    <dd className="text-sm leading-relaxed text-fog">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MaskLine, Reveal } from "@/components/site/Reveal";
import { Magnetic } from "@/components/site/Magnetic";

const EMAIL = "abhinavkashyap070707@gmail.com";

const LINKS = [
  { label: "GitHub", href: "https://github.com/surabhinavkashyap", meta: "surabhinavkashyap", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abhinav-kashyap-58b033327", meta: "Abhinav Kashyap", external: true },
  { label: "Resume", href: "/resume", meta: "View or save as PDF", external: false },
  { label: "Email", href: `mailto:${EMAIL}`, meta: EMAIL, external: false },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn’t copy — the address is " + EMAIL);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…");
    e.currentTarget.reset();
  };

  const field =
    "peer w-full border-b border-line-strong bg-transparent pb-3 pt-6 text-[17px] text-fog outline-none transition-colors placeholder:text-transparent focus:border-ice";
  const floatLabel =
    "pointer-events-none absolute left-0 top-6 text-[15px] text-mute transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-ice peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px]";

  return (
    <section id="contact" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-3" y={12}>
          <p className="label">
            <span className="text-ice">(06)</span> Contact
          </p>
        </Reveal>
        <div className="lg:col-span-9">
          <h2 className="text-[clamp(48px,8.5vw,132px)] font-semibold leading-[0.88] tracking-[-0.055em]">
            <MaskLine inView>Have a project</MaskLine>
            <MaskLine inView delay={0.08} className="font-serif font-normal italic tracking-[-0.02em] text-ice">
              or an opportunity?
            </MaskLine>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg text-mist">
              I’m currently open to internships, collaborations, and interesting problems.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.18}>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-fog px-7 text-[15px] font-medium text-ink transition hover:bg-white sm:text-base"
                >
                  <Mail size={17} aria-hidden />
                  <span className="break-all">{EMAIL}</span>
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={copy}
                className="inline-flex h-14 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fog transition hover:bg-white/[0.04]"
              >
                {copied ? <Check size={15} className="text-signal" aria-hidden /> : <Copy size={15} aria-hidden />}
                {copied ? "Copied" : "Copy email"}
              </button>
            </div>
          </Reveal>

          <div className="mt-20 grid gap-14 lg:grid-cols-9">
            <Reveal className="lg:col-span-5">
              <form onSubmit={onSubmit} className="space-y-8" aria-label="Contact form">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="relative">
                    <input id="c-name" name="name" required placeholder="Your name" autoComplete="name" className={field} />
                    <label htmlFor="c-name" className={floatLabel}>
                      Your name
                    </label>
                  </div>
                  <div className="relative">
                    <input id="c-email" name="email" type="email" required placeholder="Email" autoComplete="email" className={field} />
                    <label htmlFor="c-email" className={floatLabel}>
                      Email address
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <textarea id="c-message" name="message" required rows={4} placeholder="Message" className={`${field} resize-y`} />
                  <label htmlFor="c-message" className={floatLabel}>
                    What are you working on?
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium text-fog transition hover:border-fog hover:bg-fog hover:text-ink"
                  >
                    Send message
                    <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </button>
                  <p className="text-xs text-mute">Opens your email app with the message filled in.</p>
                </div>
              </form>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-4">
              <ul className="border-t border-line">
                {LINKS.map((l) => {
                  const inner = (
                    <>
                      <span className="text-[19px] tracking-[-0.02em] text-fog">{l.label}</span>
                      <span className="ml-auto truncate pl-4 font-mono text-[11px] text-mute transition-colors group-hover:text-mist">
                        {l.meta}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-mist transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ice"
                        aria-hidden
                      />
                    </>
                  );
                  const cls = "group flex items-center gap-3 border-b border-line py-4 transition-[padding] duration-500 hover:pl-2";
                  return (
                    <li key={l.label}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noreferrer" className={cls}>
                          {inner}
                        </a>
                      ) : l.href.startsWith("/") ? (
                        <Link href={l.href} className={cls}>
                          {inner}
                        </Link>
                      ) : (
                        <a href={l.href} className={cls}>
                          {inner}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

import { MaskLine, Reveal } from "@/components/site/Reveal";

export function SectionHead({
  index,
  label,
  title,
  accent,
  aside,
}: {
  index: string;
  label: string;
  title: string;
  accent?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 border-t border-line pt-6 lg:grid-cols-12">
      <Reveal className="lg:col-span-3" y={12}>
        <p className="label">
          <span className="text-ice">({index})</span> {label}
        </p>
      </Reveal>
      <h2 className="text-[clamp(40px,6vw,88px)] font-semibold leading-[0.92] tracking-[-0.045em] lg:col-span-7">
        <MaskLine inView>{title}</MaskLine>
        {accent && (
          <MaskLine inView delay={0.08} className="font-serif text-[1.04em] font-normal italic tracking-[-0.02em] text-mist">
            {accent}
          </MaskLine>
        )}
      </h2>
      {aside && (
        <Reveal className="self-end lg:col-span-2 lg:text-right" delay={0.15} y={12}>
          {aside}
        </Reveal>
      )}
    </div>
  );
}

import { ArrowUp } from "lucide-react";
import { LocalTime } from "@/components/site/LocalTime";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <div
          aria-hidden
          className="select-none overflow-hidden pt-10 text-center text-[19vw] font-semibold leading-[0.8] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.09)] lg:text-[232px]"
        >
          Kashyap
        </div>
        <div className="flex flex-col gap-4 border-t border-line py-7 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Abhinav Kashyap</span>
          <span className="font-mono text-xs">
            Built in Jabalpur · <LocalTime />
          </span>
          <a href="#top" className="link-draw inline-flex items-center gap-1.5 self-start text-fog sm:self-auto">
            Back to top <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}

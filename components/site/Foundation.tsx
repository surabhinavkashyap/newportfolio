import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/site/Reveal";

type Skill = { name: string; learning?: boolean; note?: string };

const GROUPS: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [{ name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }, { name: "React" }],
  },
  {
    title: "Backend Engineering",
    skills: [
      { name: "Node.js & Express.js" },
      { name: "Python" },
      { name: "REST API Design" },
      { name: "Authentication & Authorization" },
      { name: "Database Design" },
      { name: "Asynchronous Processing" },
      { name: "API Integrations & Webhooks" },
      { name: "Error Handling & System Architecture" },
    ],
  },
  {
    title: "AI Engineering",
    skills: [
      { name: "LLM Application Development" },
      { name: "Prompt Engineering & Structured Outputs" },
      { name: "Retrieval-Augmented Generation (RAG)" },
      { name: "Embeddings & Vector Databases" },
      { name: "Semantic Search & Knowledge Systems" },
      { name: "AI Agents & Tool Calling" },
      { name: "Agentic Workflow Orchestration" },
      { name: "Multi-Agent Systems" },
      { name: "AI Evaluation & Guardrails" },
      { name: "AI Automation with n8n" },
    ],
  },
  {
    title: "Production & DevOps",
    skills: [
      { name: "Git & GitHub" },
      { name: "Docker" },
      { name: "CI/CD" },
      { name: "Cloud Deployment" },
      { name: "Logging & Monitoring" },
      { name: "Testing & Reliability Engineering" },
      { name: "LLM Cost & Latency Optimization" },
    ],
  },
];

const DSA = [
  "Arrays & strings",
  "Linked lists & trees",
  "Graphs & BFS / DFS",
  "Dynamic programming",
  "Binary search & heaps",
  "Sliding window & two pointers",
  "Recursion & backtracking",
];

export function Foundation() {
  return (
    <section id="stack" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <SectionHead
        index="04"
        label="Technical foundation"
        title="What I work with,"
        accent="and what I’m learning."
      />

      <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line lg:grid-cols-2">
        {GROUPS.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 0.06} y={16} className="bg-ink">
            <div className="h-full p-6 sm:p-7">
              <h3 className="label mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.skills.map((s) => (
                  <li key={s.name} className="flex items-baseline gap-3">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full ${s.learning ? "border border-ice" : "bg-fog"}`}
                      aria-hidden
                    />
                    <span className={`text-[17px] tracking-[-0.01em] ${s.learning ? "text-mist" : "text-fog"}`}>
                      {s.name}
                      {s.learning && <span className="sr-only"> (learning now)</span>}
                    </span>
                    {s.note && <span className="ml-auto font-mono text-[10px] text-mute">{s.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 grid gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4" y={16}>
          <p className="label">Data structures &amp; algorithms</p>
          <p className="mt-4 max-w-sm font-serif text-[26px] italic leading-snug text-fog">
            Comfortable with medium–hard problems on trees, graphs, and dynamic programming.
          </p>
        </Reveal>
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {DSA.map((topic, i) => (
            <Reveal key={topic} delay={i * 0.04} y={12}>
              <li className="group flex items-baseline gap-4 border-b border-line py-4">
                <span className="tnum font-mono text-xs text-mute transition-colors group-hover:text-ice">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(18px,1.6vw,22px)] tracking-[-0.02em] text-fog transition-transform duration-500 group-hover:translate-x-1">
                  {topic}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

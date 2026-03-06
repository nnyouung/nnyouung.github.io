import AiChatPanel from "../../components/AiChatPanel";
import NavPill from "../../components/NavPill";
import Section from "../../components/Section";

export default function AIPage() {
  return (
    <div className="relative h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.45),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.55),transparent_70%)]" />

      <main className="relative mx-auto flex h-full w-full max-w-[960px] flex-col px-6 pb-4 pt-10 sm:px-6 sm:pb-6">
        <NavPill />

        <Section className="min-h-0 flex-1" viewportOnce>
          <AiChatPanel />
        </Section>
      </main>
    </div>
  );
}

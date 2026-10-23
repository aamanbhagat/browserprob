import ToolPage, { toolMetadata } from "@/components/tool/ToolPage";
import Results from "./Results";

const slug = "audio-fingerprint";

export const metadata = toolMetadata(slug);

export default function Page() {
  return (
    <ToolPage slug={slug}>
      <Results />
    </ToolPage>
  );
}

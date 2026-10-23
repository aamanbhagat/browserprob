import ToolPage, { toolMetadata } from "@/components/tool/ToolPage";
import Results from "./Results";

const slug = "javascript-info";

export const metadata = toolMetadata(slug);

export default function Page() {
  return (
    <ToolPage slug={slug} noscriptMessage="No — JavaScript is turned off or blocked in this browser. Nothing on this page can run until it is enabled; the sections below explain how to turn it back on.">
      <Results />
    </ToolPage>
  );
}

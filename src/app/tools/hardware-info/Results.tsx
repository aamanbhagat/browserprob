"use client";

import DataRow from "@/components/DataRow";
import ResultsPanel, { PanelGroup, PanelNote } from "@/components/tool/ResultsPanel";
import { useProbe } from "@/components/tool/useProbe";
import { detectHardware, NOT_SUPPORTED } from "@/lib/detect/hardware";

export default function Results() {
  const { value, rerun } = useProbe(detectHardware);

  return (
    <ResultsPanel ready={value !== null} rows={8} onRerun={rerun}>
      {value && (
        <>
          <PanelGroup title="Processor, memory and graphics">
            <DataRow label="Logical CPU cores" value={value.cpuCores > 0 ? value.cpuCores : NOT_SUPPORTED} />
            <DataRow label="Device memory" value={value.deviceMemory} />
            <DataRow label="GPU (from WebGL)" value={value.gpu} />
            <DataRow label="navigator.platform" value={value.platform} />
            <DataRow label="Touch points" value={value.maxTouchPoints} />
          </PanelGroup>
          <PanelGroup title="Battery">
            <DataRow label="Battery Status API" value={value.batteryStatus} mono={false} />
            <DataRow label="Level" value={value.batteryLevel} />
            <DataRow label="Charging" value={value.batteryCharging} mono={false} />
          </PanelGroup>
          <PanelNote>
            Browsers round or cap several of these values on purpose: device memory is rounded to a power of two, and Safari
            reports either 4 or 8 cores. A desktop with no battery usually shows 100% and charging.
          </PanelNote>
        </>
      )}
    </ResultsPanel>
  );
}

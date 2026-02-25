<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"

type CommLog = {
  id: string
  time: string
  channel: string
  protocol: string
  device: string
  direction: string
  dataFrame: string
  bytes: number
  result: string
  latency: string
  [key: string]: unknown
}

const commLogs: CommLog[] = [
  { id: "CL-001", time: "14:32:10.123", channel: "CH-001", protocol: "Modbus TCP", device: "PLC-Station-01", direction: "请求", dataFrame: "01 03 00 00 00 0A C5 CD", bytes: 8, result: "成功", latency: "12ms" },
  { id: "CL-002", time: "14:32:10.135", channel: "CH-001", protocol: "Modbus TCP", device: "PLC-Station-01", direction: "响应", dataFrame: "01 03 14 00 64 00 C8 ...", bytes: 25, result: "成功", latency: "12ms" },
  { id: "CL-003", time: "14:32:10.200", channel: "CH-003", protocol: "S7", device: "PLC-Station-02", direction: "请求", dataFrame: "03 00 00 1F 02 F0 80 ...", bytes: 31, result: "成功", latency: "8ms" },
  { id: "CL-004", time: "14:32:10.208", channel: "CH-003", protocol: "S7", device: "PLC-Station-02", direction: "响应", dataFrame: "03 00 00 25 02 F0 80 ...", bytes: 37, result: "成功", latency: "8ms" },
  { id: "CL-005", time: "14:32:10.500", channel: "CH-005", protocol: "MQTT", device: "Meter-Power-01", direction: "订阅", dataFrame: "topic: devices/power-01/data", bytes: 156, result: "成功", latency: "45ms" },
  { id: "CL-006", time: "14:32:11.000", channel: "CH-001", protocol: "Modbus TCP", device: "RTU-Node-07", direction: "请求", dataFrame: "07 03 00 00 00 05 ...", bytes: 8, result: "超时", latency: "3000ms" },
  { id: "CL-007", time: "14:32:11.100", channel: "CH-006", protocol: "Modbus RTU", device: "VFD-Pump-01", direction: "请求", dataFrame: "01 03 00 00 00 06 C5 C8", bytes: 8, result: "成功", latency: "25ms" },
  { id: "CL-008", time: "14:32:11.125", channel: "CH-006", protocol: "Modbus RTU", device: "VFD-Pump-01", direction: "响应", dataFrame: "01 03 0C 00 32 17 70 ...", bytes: 17, result: "成功", latency: "25ms" },
  { id: "CL-009", time: "14:32:11.500", channel: "CH-005", protocol: "MQTT", device: "Sensor-Temp-01", direction: "订阅", dataFrame: "topic: devices/temp-01/data", bytes: 0, result: "超时", latency: "10000ms" },
  { id: "CL-010", time: "14:32:12.000", channel: "CH-004", protocol: "OPC UA", device: "IO-Module-01", direction: "读取", dataFrame: "ReadRequest: ns=2;i=1001..1010", bytes: 120, result: "成功", latency: "15ms" },
]

const resultColors: Record<string, string> = {
  "成功": "bg-success/10 text-success border-success/20",
  "超时": "bg-destructive/10 text-destructive border-destructive/20",
  "错误": "bg-destructive/10 text-destructive border-destructive/20",
}

const columns: Column<CommLog>[] = [
  { key: "time", title: "时间", className: "font-mono text-xs w-[120px]" },
  { key: "channel", title: "通道", className: "font-mono text-xs" },
  { key: "protocol", title: "协议", render: (l) => <Badge variant="outline" class="text-[10px] font-mono">{l.protocol}</Badge> },
  { key: "device", title: "设备", className: "text-xs" },
  { key: "direction", title: "方向", render: (l) => <Badge variant="outline" class="text-[10px]">{l.direction}</Badge> },
  { key: "dataFrame", title: "数据帧", render: (l) => <code class="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-card-foreground truncate max-w-[200px] block">{l.dataFrame}</code> },
  { key: "bytes", title: "字节" },
  { key: "result", title: "结果", render: (l) => <Badge variant="outline" class={`text-[10px] ${resultColors[l.result] || ""}`}>{l.result}</Badge> },
  { key: "latency", title: "延迟", className: "font-mono text-xs" },
]

export default defineComponent({
  name: "communicationPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="通信日志" description="查看底层通信协议收发记录">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={commLogs} searchPlaceholder="搜索设备、通道、协议..." pageSize={10} />
        </div>
      )
  }
})
</script>

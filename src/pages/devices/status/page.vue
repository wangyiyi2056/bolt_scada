<script lang="tsx">
import { defineComponent } from "vue"
import { RefreshCw } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Cpu, Wifi, WifiOff, AlertTriangle } from "lucide-vue-next"

const summary = { total: 164, online: 148, offline: 8, warning: 6, error: 2 }

const deviceStatus = [
  { name: "PLC-Station-01", type: "PLC", status: "online" as const, protocol: "Modbus TCP", lastComm: "14:32:01", commRate: "100%", variables: 256, errors: 0 },
  { name: "PLC-Station-02", type: "PLC", status: "online" as const, protocol: "S7", lastComm: "14:32:01", commRate: "100%", variables: 512, errors: 0 },
  { name: "PLC-Station-03", type: "PLC", status: "warning" as const, protocol: "Modbus TCP", lastComm: "14:31:50", commRate: "95.2%", variables: 128, errors: 12 },
  { name: "RTU-Node-01", type: "RTU", status: "online" as const, protocol: "Modbus RTU", lastComm: "14:30:55", commRate: "99.8%", variables: 64, errors: 1 },
  { name: "RTU-Node-07", type: "RTU", status: "offline" as const, protocol: "Modbus TCP", lastComm: "10:15:10", commRate: "0%", variables: 48, errors: 128 },
  { name: "IO-Module-01", type: "IO", status: "online" as const, protocol: "OPC UA", lastComm: "14:32:00", commRate: "100%", variables: 32, errors: 0 },
  { name: "IO-Module-11", type: "IO", status: "warning" as const, protocol: "OPC UA", lastComm: "14:28:00", commRate: "88.5%", variables: 32, errors: 25 },
  { name: "HMI-Panel-01", type: "HMI", status: "online" as const, protocol: "Modbus TCP", lastComm: "14:32:01", commRate: "100%", variables: 128, errors: 0 },
  { name: "Sensor-Temp-01", type: "传感器", status: "error" as const, protocol: "MQTT", lastComm: "12:05:30", commRate: "0%", variables: 8, errors: 256 },
  { name: "VFD-Pump-01", type: "变频器", status: "online" as const, protocol: "Modbus RTU", lastComm: "14:32:01", commRate: "100%", variables: 24, errors: 0 },
]

export default defineComponent({
  name: "statusPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="设备状态" description="实时查看所有设备的运行和通信状态">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <RefreshCw class="h-3.5 w-3.5" />
              <span>{"刷新"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard title="总设备数" value={String(summary.total)} icon={Cpu} />
            <StatCard title="在线" value={String(summary.online)} icon={Wifi} description={`${((summary.online / summary.total) * 100).toFixed(1)}%`} />
            <StatCard title="离线" value={String(summary.offline)} icon={WifiOff} />
            <StatCard title="告警" value={String(summary.warning)} icon={AlertTriangle} />
            <StatCard title="故障" value={String(summary.error)} icon={AlertTriangle} />
          </div>
    
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-card-foreground">{"设备通信状态明细"}</CardTitle>
            </CardHeader>
            <CardContent class="pb-4">
              <div class="flex flex-col gap-2">
                {deviceStatus.map((d) => (
                  <div key={d.name} class="flex items-center justify-between rounded-lg border border-border p-3">
                    <div class="flex items-center gap-3">
                      <StatusBadge status={d.status} />
                      <div>
                        <span class="text-xs font-medium text-card-foreground">{d.name}</span>
                        <span class="ml-2 text-[11px] text-muted-foreground">{d.type}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span>{d.protocol}</span>
                      <span>{`通信率 ${d.commRate}`}</span>
                      <span>{`${d.variables} 变量`}</span>
                      <span class={d.errors > 0 ? "text-destructive" : ""}>{`${d.errors} 错误`}</span>
                      <span>{d.lastComm}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
  }
})
</script>

<script lang="tsx">
import { defineComponent } from "vue"
import { RefreshCw, Activity, ArrowUpDown } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { Wifi, WifiOff } from "lucide-vue-next"

const stats = { totalChannels: 8, online: 6, warning: 2, offline: 0, totalTx: "12.5 MB", totalRx: "8.3 MB", avgLatency: "6ms" }

const channelStatus = [
  { name: "Modbus TCP 通道 1", status: "online" as const, tx: "2.1 MB", rx: "1.4 MB", latency: "2ms", uptime: "45 天", lastError: "-", errorRate: "0%" },
  { name: "Modbus TCP 通道 2", status: "online" as const, tx: "1.8 MB", rx: "1.2 MB", latency: "3ms", uptime: "45 天", lastError: "-", errorRate: "0%" },
  { name: "S7 通道", status: "online" as const, tx: "1.5 MB", rx: "0.9 MB", latency: "5ms", uptime: "45 天", lastError: "-", errorRate: "0.1%" },
  { name: "OPC UA Server 1", status: "online" as const, tx: "2.8 MB", rx: "2.0 MB", latency: "8ms", uptime: "30 天", lastError: "2026-02-05", errorRate: "0.3%" },
  { name: "MQTT Broker", status: "warning" as const, tx: "1.5 MB", rx: "1.2 MB", latency: "45ms", uptime: "12 天", lastError: "2026-02-09", errorRate: "2.1%" },
  { name: "串口通道 COM1", status: "online" as const, tx: "0.8 MB", rx: "0.6 MB", latency: "15ms", uptime: "45 天", lastError: "-", errorRate: "0.05%" },
  { name: "串口通道 COM2", status: "online" as const, tx: "0.5 MB", rx: "0.3 MB", latency: "12ms", uptime: "45 天", lastError: "-", errorRate: "0%" },
  { name: "BACnet/IP 通道", status: "warning" as const, tx: "0.5 MB", rx: "0.7 MB", latency: "35ms", uptime: "8 天", lastError: "2026-02-08", errorRate: "1.5%" },
]

export default defineComponent({
  name: "statusPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="通信状态" description="实时查看所有通信通道的状态和流量">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <RefreshCw class="h-3.5 w-3.5" />
              <span>{"刷新"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="通道总数" value={String(stats.totalChannels)} icon={Activity} />
            <StatCard title="在线通道" value={String(stats.online)} icon={Wifi} description={`${stats.warning} 告警`} />
            <StatCard title="总发送量" value={stats.totalTx} icon={ArrowUpDown} />
            <StatCard title="平均延迟" value={stats.avgLatency} icon={Activity} />
          </div>
    
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-card-foreground">{"通道状态明细"}</CardTitle>
            </CardHeader>
            <CardContent class="pb-4">
              <div class="flex flex-col gap-2">
                {channelStatus.map((ch) => (
                  <div key={ch.name} class="flex items-center justify-between rounded-lg border border-border p-3">
                    <div class="flex items-center gap-3">
                      <StatusBadge status={ch.status} />
                      <span class="text-xs font-medium text-card-foreground">{ch.name}</span>
                    </div>
                    <div class="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span>{`TX: ${ch.tx}`}</span>
                      <span>{`RX: ${ch.rx}`}</span>
                      <span>{`延迟: ${ch.latency}`}</span>
                      <span class={ch.errorRate !== "0%" ? "text-warning" : ""}>{`错误率: ${ch.errorRate}`}</span>
                      <span>{`运行: ${ch.uptime}`}</span>
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

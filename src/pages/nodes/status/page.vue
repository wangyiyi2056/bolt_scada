<script lang="tsx">
import { defineComponent } from "vue"
import { RefreshCw, Activity } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { StatCard } from "@/components/stat-card"

const nodeMetrics = [
  {
    name: "主控节点-01", status: "online" as const, ip: "10.0.1.10",
    cpu: [32, 35, 28, 40, 38, 32, 36, 33, 31, 29],
    mem: [58, 58, 59, 60, 59, 58, 57, 58, 59, 58],
    net: { rx: "12.5 MB/s", tx: "8.3 MB/s" },
    load: "0.85 / 1.20 / 0.95",
  },
  {
    name: "采集节点-02", status: "online" as const, ip: "10.0.1.20",
    cpu: [28, 30, 25, 32, 29, 27, 31, 28, 26, 28],
    mem: [42, 42, 43, 42, 41, 42, 43, 44, 42, 42],
    net: { rx: "8.1 MB/s", tx: "5.2 MB/s" },
    load: "0.62 / 0.78 / 0.70",
  },
  {
    name: "边缘网关-03", status: "warning" as const, ip: "10.0.2.10",
    cpu: [78, 82, 75, 85, 80, 78, 83, 79, 76, 78],
    mem: [85, 86, 85, 87, 86, 85, 88, 87, 85, 85],
    net: { rx: "3.2 MB/s", tx: "1.8 MB/s" },
    load: "2.10 / 2.35 / 2.20",
  },
  {
    name: "备用节点-04", status: "offline" as const, ip: "10.0.1.30",
    cpu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mem: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    net: { rx: "0 B/s", tx: "0 B/s" },
    load: "0 / 0 / 0",
  },
]

function MiniBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1)
  return (
    <div class="flex items-end gap-px h-8">
      {values.map((v, i) => (
        <div
          key={i}
          class={`w-2 rounded-t-sm ${color}`}
          style={{ height: `${(v / max) * 100}%`, opacity: v === 0 ? 0.1 : 1 }}
        />
      ))}
    </div>
  )
}

export default defineComponent({
  name: "statusPage",
  setup() {
    const onlineCount = nodeMetrics.filter(n => n.status === "online").length
      const warningCount = nodeMetrics.filter(n => n.status === "warning").length
      const offlineCount = nodeMetrics.filter(n => n.status === "offline").length
    
      return () => (
        <div class="page-shell">
          <PageHeader title="节点状态" description="实时监控所有节点运行状况">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <RefreshCw class="h-3.5 w-3.5" />
              <span>{"刷新"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid grid-cols-3 gap-4">
            <StatCard title="在线节点" value={String(onlineCount)} icon={Activity} />
            <StatCard title="告警节点" value={String(warningCount)} icon={Activity} />
            <StatCard title="离线节点" value={String(offlineCount)} icon={Activity} />
          </div>
    
          <div class="grid gap-4 lg:grid-cols-2">
            {nodeMetrics.map((node) => (
              <Card key={node.name} class="transition-colors hover:border-primary/30">
                <CardHeader class="pb-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <CardTitle class="text-sm text-card-foreground">{node.name}</CardTitle>
                      <span class="font-mono text-[11px] text-muted-foreground">{node.ip}</span>
                    </div>
                    <StatusBadge status={node.status} />
                  </div>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] text-muted-foreground">{"CPU"}</span>
                        <span class="font-mono text-[11px] text-card-foreground">{`${node.cpu[node.cpu.length - 1]}%`}</span>
                      </div>
                      <MiniBar values={node.cpu} color="bg-primary" />
                    </div>
                    <div>
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] text-muted-foreground">{"内存"}</span>
                        <span class="font-mono text-[11px] text-card-foreground">{`${node.mem[node.mem.length - 1]}%`}</span>
                      </div>
                      <MiniBar values={node.mem} color="bg-success" />
                    </div>
                  </div>
                  <div class="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px]">
                    <div>
                      <span class="text-muted-foreground">{"网络 RX"}</span>
                      <div class="font-mono text-card-foreground">{node.net.rx}</div>
                    </div>
                    <div>
                      <span class="text-muted-foreground">{"网络 TX"}</span>
                      <div class="font-mono text-card-foreground">{node.net.tx}</div>
                    </div>
                    <div>
                      <span class="text-muted-foreground">{"负载"}</span>
                      <div class="font-mono text-card-foreground">{node.load}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
  }
})
</script>

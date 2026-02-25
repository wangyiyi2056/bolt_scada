<script lang="tsx">
import { defineComponent } from "vue"
import { Activity, Cpu, HardDrive, Wifi, WifiOff, RefreshCw } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import {
  ChartContainer,
  ChartTooltip,
  VisAxis,
  VisLine,
  VisXYContainer,
  type ChartConfig,
} from "@/components/ui/chart"

const cpuHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  node1: Math.floor(25 + Math.random() * 30),
  node2: Math.floor(20 + Math.random() * 25),
  node3: Math.floor(50 + Math.random() * 35),
}))

const services = [
  { name: "数据采集引擎", status: "online" as const, cpu: "12%", mem: "320 MB", uptime: "45 天", pid: 1234 },
  { name: "通信网关服务", status: "online" as const, cpu: "8%", mem: "256 MB", uptime: "45 天", pid: 1235 },
  { name: "报警处理服务", status: "online" as const, cpu: "3%", mem: "128 MB", uptime: "45 天", pid: 1236 },
  { name: "脚本执行引擎", status: "online" as const, cpu: "15%", mem: "512 MB", uptime: "45 天", pid: 1237 },
  { name: "历史数据归档", status: "online" as const, cpu: "5%", mem: "192 MB", uptime: "45 天", pid: 1238 },
  { name: "Web API 服务", status: "online" as const, cpu: "6%", mem: "384 MB", uptime: "45 天", pid: 1239 },
  { name: "MQTT Broker", status: "warning" as const, cpu: "45%", mem: "768 MB", uptime: "12 天", pid: 1240 },
  { name: "OPC UA Server", status: "offline" as const, cpu: "-", mem: "-", uptime: "-", pid: 0 },
]

const connections = [
  { name: "Modbus TCP - 通道 1", target: "192.168.1.10:502", status: "online" as const, latency: "2ms", errors: 0, lastActive: "14:32:01" },
  { name: "Modbus TCP - 通道 2", target: "192.168.1.11:502", status: "online" as const, latency: "3ms", errors: 0, lastActive: "14:32:01" },
  { name: "OPC UA - Server 1", target: "opc.tcp://10.0.1.100:4840", status: "online" as const, latency: "8ms", errors: 2, lastActive: "14:32:00" },
  { name: "MQTT - Broker 1", target: "10.0.1.102:1883", status: "warning" as const, latency: "45ms", errors: 15, lastActive: "14:31:50" },
  { name: "S7 - PLC Station 3", target: "192.168.2.30:102", status: "offline" as const, latency: "-", errors: 128, lastActive: "10:15:10" },
  { name: "Modbus RTU - COM1", target: "/dev/ttyS0 @ 9600", status: "online" as const, latency: "15ms", errors: 1, lastActive: "14:32:01" },
]

const chartConfig = {
  node1: { label: "主控节点-01", color: "hsl(199 89% 48%)" },
  node2: { label: "采集节点-02", color: "hsl(162 63% 41%)" },
  node3: { label: "边缘网关-03", color: "hsl(43 74% 49%)" },
} satisfies ChartConfig

export default defineComponent({
  name: "monitorPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="运行监控" description="实时监控平台各服务和通信连接状态">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <RefreshCw class="h-3.5 w-3.5" />
              <span>刷新</span>
            </Button>
          </PageHeader>
    
          <Card>
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-medium text-card-foreground">节点 CPU 趋势</CardTitle>
                <Badge variant="outline" class="text-xs font-normal">最近 20 分钟</Badge>
              </div>
            </CardHeader>
            <CardContent class="pb-4">
              <ChartContainer class="h-[200px]" config={chartConfig}>
                <VisXYContainer data={cpuHistory} height={200}>
                  <VisLine x={(_, i) => i} y={(d) => d.node1} color={() => "var(--color-node1)"} />
                  <VisLine x={(_, i) => i} y={(d) => d.node2} color={() => "var(--color-node2)"} />
                  <VisLine x={(_, i) => i} y={(d) => d.node3} color={() => "var(--color-node3)"} />
                  <VisAxis type="x" tickFormat={(v) => cpuHistory[Math.round(Number(v))]?.time ?? ""} />
                  <VisAxis type="y" />
                  <ChartTooltip />
                </VisXYContainer>
              </ChartContainer>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-card-foreground">平台服务状态</CardTitle>
            </CardHeader>
            <CardContent class="pb-4">
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((svc) => (
                  <div key={svc.name} class="flex flex-col gap-2 rounded-lg border border-border p-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-medium text-card-foreground">{svc.name}</span>
                      <StatusBadge status={svc.status} />
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                      <div class="flex items-center gap-1"><Cpu class="h-3 w-3" /><span>{svc.cpu}</span></div>
                      <div class="flex items-center gap-1"><HardDrive class="h-3 w-3" /><span>{svc.mem}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-medium text-card-foreground">通信连接状态</CardTitle>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <Wifi class="h-3.5 w-3.5 text-success" />
                  <span>{`${connections.filter((c) => c.status === "online").length} 在线`}</span>
                  <WifiOff class="h-3.5 w-3.5 text-destructive" />
                  <span>{`${connections.filter((c) => c.status === "offline").length} 断开`}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent class="pb-4">
              <div class="flex flex-col gap-2">
                {connections.map((conn) => (
                  <div key={conn.name} class="flex items-center justify-between rounded-lg border border-border p-3">
                    <div class="flex items-center gap-3">
                      <StatusBadge status={conn.status} />
                      <div>
                        <div class="text-xs font-medium text-card-foreground">{conn.name}</div>
                        <div class="font-mono text-[11px] text-muted-foreground">{conn.target}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <div class="flex items-center gap-1"><Activity class="h-3 w-3" /><span>{conn.latency}</span></div>
                      <span>{`${conn.errors} 错误`}</span>
                      <span>{conn.lastActive}</span>
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

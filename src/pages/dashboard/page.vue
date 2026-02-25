<script lang="tsx">
import { defineComponent } from "vue"
import { Cpu, Network, Variable, Bell, Server, AlertTriangle } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  VisArea,
  VisAxis,
  VisDonut,
  VisLine,
  VisSingleContainer,
  VisXYContainer,
  type ChartConfig,
} from "@/components/ui/chart"

const areaData = [
  { time: "00:00", value: 4200, cpu: 32 },
  { time: "02:00", value: 3800, cpu: 28 },
  { time: "04:00", value: 3500, cpu: 25 },
  { time: "06:00", value: 4800, cpu: 38 },
  { time: "08:00", value: 6200, cpu: 55 },
  { time: "10:00", value: 7800, cpu: 62 },
  { time: "12:00", value: 7200, cpu: 58 },
  { time: "14:00", value: 8100, cpu: 65 },
  { time: "16:00", value: 7500, cpu: 60 },
  { time: "18:00", value: 6800, cpu: 52 },
  { time: "20:00", value: 5200, cpu: 42 },
  { time: "22:00", value: 4500, cpu: 35 },
]

const alarmBarData = [
  { day: "周一", critical: 2, major: 5, minor: 12 },
  { day: "周二", critical: 1, major: 8, minor: 9 },
  { day: "周三", critical: 3, major: 4, minor: 15 },
  { day: "周四", critical: 0, major: 6, minor: 11 },
  { day: "周五", critical: 2, major: 3, minor: 8 },
  { day: "周六", critical: 1, major: 2, minor: 6 },
  { day: "周日", critical: 0, major: 1, minor: 4 },
]

const protocolPieData = [
  { name: "Modbus TCP", value: 35, color: "var(--color-protocol-1)" },
  { name: "OPC UA", value: 25, color: "var(--color-protocol-2)" },
  { name: "MQTT", value: 20, color: "var(--color-protocol-3)" },
  { name: "S7", value: 12, color: "var(--color-protocol-4)" },
  { name: "BACnet", value: 8, color: "var(--color-protocol-5)" },
]

const chartConfig = {
  value: { label: "采集量", color: "hsl(199 89% 48%)" },
  critical: { label: "紧急", color: "hsl(0 72% 51%)" },
  major: { label: "重要", color: "hsl(43 74% 49%)" },
  minor: { label: "次要", color: "hsl(var(--muted-foreground))" },
  "protocol-1": { color: "hsl(199 89% 48%)" },
  "protocol-2": { color: "hsl(162 63% 41%)" },
  "protocol-3": { color: "hsl(43 74% 49%)" },
  "protocol-4": { color: "hsl(262 52% 47%)" },
  "protocol-5": { color: "hsl(0 72% 51%)" },
} satisfies ChartConfig

const recentAlarms = [
  { id: "ALM-001", device: "PLC-Station-03", message: "温度传感器超上限", level: "critical", time: "2 分钟前" },
  { id: "ALM-002", device: "RTU-Node-07", message: "通信中断", level: "major", time: "15 分钟前" },
  { id: "ALM-003", device: "HMI-Panel-02", message: "内存使用率 > 85%", level: "minor", time: "32 分钟前" },
  { id: "ALM-004", device: "IO-Module-11", message: "DI 信号抖动", level: "minor", time: "1 小时前" },
  { id: "ALM-005", device: "PLC-Station-01", message: "电源电压偏低", level: "major", time: "2 小时前" },
]

const nodeStatus = [
  { name: "主控节点-01", status: "online" as const, cpu: "32%", mem: "58%", uptime: "45天" },
  { name: "采集节点-02", status: "online" as const, cpu: "28%", mem: "42%", uptime: "30天" },
  { name: "边缘网关-03", status: "warning" as const, cpu: "78%", mem: "85%", uptime: "12天" },
  { name: "备用节点-04", status: "offline" as const, cpu: "-", mem: "-", uptime: "-" },
]

const alarmLevelConfig: Record<string, { label: string; className: string }> = {
  critical: { label: "紧急", className: "bg-destructive/10 text-destructive border-destructive/20" },
  major: { label: "重要", className: "bg-warning/10 text-warning border-warning/20" },
  minor: { label: "次要", className: "bg-muted text-muted-foreground border-border" },
}

export default defineComponent({
  name: "dashboardPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="系统概览" description="SCADA 平台运行状态总览" />
    
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="设备总数" value="1,284" icon={Cpu} trend={{ value: "12", positive: true }} />
            <StatCard title="在线节点" value="18 / 20" icon={Network} description="90% 在线率" />
            <StatCard title="采集变量" value="52,480" icon={Variable} trend={{ value: "2.4%", positive: true }} />
            <StatCard title="活跃报警" value="3" icon={Bell} trend={{ value: "2", positive: false }} />
          </div>
    
          <div class="grid gap-4 lg:grid-cols-7">
            <Card class="lg:col-span-4">
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm font-medium text-card-foreground">数据采集趋势</CardTitle>
                  <Badge variant="outline" class="text-xs font-normal">今日</Badge>
                </div>
              </CardHeader>
              <CardContent class="pb-4">
                <ChartContainer class="h-[240px]" config={chartConfig}>
                  <VisXYContainer data={areaData} height={240}>
                    <VisArea x={(_, i) => i} y={(d) => d.value} color={() => "var(--color-value)"} />
                    <VisLine x={(_, i) => i} y={(d) => d.value} color={() => "var(--color-value)"} />
                    <VisAxis type="x" tickFormat={(v) => areaData[Math.round(Number(v))]?.time ?? ""} />
                    <VisAxis type="y" />
                    <ChartTooltip />
                  </VisXYContainer>
                </ChartContainer>
              </CardContent>
            </Card>
    
            <Card class="lg:col-span-3">
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-card-foreground">通信协议分布</CardTitle>
              </CardHeader>
              <CardContent class="pb-4">
                <ChartContainer class="h-[240px]" config={chartConfig}>
                  <VisSingleContainer data={protocolPieData} height={240}>
                    <VisDonut value={(d) => d.value} color={(d) => d.color} arcWidth={28} />
                    <ChartTooltip />
                  </VisSingleContainer>
                </ChartContainer>
                <div class="pt-2">
                  <ChartLegend items={protocolPieData.map((item) => ({ name: item.name, color: item.color }))} />
                </div>
              </CardContent>
            </Card>
          </div>
    
          <div class="grid gap-4 lg:grid-cols-7">
            <Card class="lg:col-span-4">
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm font-medium text-card-foreground">本周报警趋势</CardTitle>
                  <Badge variant="outline" class="text-xs font-normal">最近 7 天</Badge>
                </div>
              </CardHeader>
              <CardContent class="pb-4">
                <ChartContainer class="h-[220px]" config={chartConfig}>
                  <VisXYContainer data={alarmBarData} height={220}>
                    <VisLine x={(_, i) => i} y={(d) => d.critical} color={() => "var(--color-critical)"} />
                    <VisLine x={(_, i) => i} y={(d) => d.major} color={() => "var(--color-major)"} />
                    <VisLine x={(_, i) => i} y={(d) => d.minor} color={() => "var(--color-minor)"} />
                    <VisAxis type="x" tickFormat={(v) => alarmBarData[Math.round(Number(v))]?.day ?? ""} />
                    <VisAxis type="y" />
                    <ChartTooltip />
                  </VisXYContainer>
                </ChartContainer>
              </CardContent>
            </Card>
    
            <Card class="lg:col-span-3">
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm font-medium text-card-foreground">最近报警</CardTitle>
                  <AlertTriangle class="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent class="pb-4">
                <div class="flex flex-col gap-3">
                  {recentAlarms.map((alarm) => {
                    const cfg = alarmLevelConfig[alarm.level]
                    return (
                      <div key={alarm.id} class="flex items-start gap-3 text-sm">
                        <Badge variant="outline" class={`shrink-0 text-[10px] ${cfg.className}`}>
                          {cfg.label}
                        </Badge>
                        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span class="truncate text-xs font-medium text-card-foreground">{alarm.message}</span>
                          <span class="text-[11px] text-muted-foreground">{alarm.device} / {alarm.time}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
    
          <Card>
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-medium text-card-foreground">节点状态</CardTitle>
                <Server class="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent class="pb-4">
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {nodeStatus.map((node) => (
                  <div key={node.name} class="flex flex-col gap-2 rounded-lg border border-border p-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-medium text-card-foreground">{node.name}</span>
                      <StatusBadge status={node.status} />
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div class="text-[10px] text-muted-foreground">CPU</div>
                        <div class="text-xs font-medium text-card-foreground">{node.cpu}</div>
                      </div>
                      <div>
                        <div class="text-[10px] text-muted-foreground">内存</div>
                        <div class="text-xs font-medium text-card-foreground">{node.mem}</div>
                      </div>
                      <div>
                        <div class="text-[10px] text-muted-foreground">运行</div>
                        <div class="text-xs font-medium text-card-foreground">{node.uptime}</div>
                      </div>
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

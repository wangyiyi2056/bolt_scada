<script lang="tsx">
import { defineComponent } from "vue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from "lucide-vue-next"
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

const monthlyData = [
  { month: "9月", alarms: 180, collections: 42000, uptime: 98.2 },
  { month: "10月", alarms: 156, collections: 45000, uptime: 99.1 },
  { month: "11月", alarms: 210, collections: 48000, uptime: 97.5 },
  { month: "12月", alarms: 195, collections: 50000, uptime: 98.8 },
  { month: "1月", alarms: 142, collections: 51000, uptime: 99.3 },
  { month: "2月", alarms: 98, collections: 52480, uptime: 99.5 },
]

const deviceTypeDistribution = [
  { name: "PLC", value: 42, count: 540, color: "var(--color-device-1)" },
  { name: "RTU", value: 18, count: 231, color: "var(--color-device-2)" },
  { name: "IO 模块", value: 15, count: 193, color: "var(--color-device-3)" },
  { name: "HMI", value: 8, count: 103, color: "var(--color-device-4)" },
  { name: "仪表", value: 10, count: 128, color: "var(--color-device-5)" },
  { name: "传感器", value: 7, count: 89, color: "var(--color-device-6)" },
]

const alarmTypeStats = [
  { type: "温度超限", count: 45, percentage: 28 },
  { type: "通信中断", count: 32, percentage: 20 },
  { type: "压力异常", count: 28, percentage: 17 },
  { type: "设备故障", count: 22, percentage: 14 },
  { type: "电源异常", count: 18, percentage: 11 },
  { type: "其他", count: 16, percentage: 10 },
]

const chartConfig = {
  collections: { label: "采集量", color: "hsl(199 89% 48%)" },
  alarms: { label: "报警数", color: "hsl(0 72% 51%)" },
  "device-1": { color: "hsl(199 89% 48%)" },
  "device-2": { color: "hsl(162 63% 41%)" },
  "device-3": { color: "hsl(43 74% 49%)" },
  "device-4": { color: "hsl(0 72% 51%)" },
  "device-5": { color: "hsl(262 52% 47%)" },
  "device-6": { color: "hsl(var(--muted-foreground))" },
} satisfies ChartConfig

export default defineComponent({
  name: "analyticsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="统计分析" description="平台运行数据统计与趋势分析" />
    
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="月均采集量" value="48.1K" icon={BarChart3} trend={{ value: "8.2%", positive: true }} />
            <StatCard title="平均在线率" value="98.7%" icon={TrendingUp} description="近 6 个月" />
            <StatCard title="月均报警数" value="163" icon={TrendingDown} trend={{ value: "12%", positive: true }} />
            <StatCard title="设备增长率" value="+5.6%" icon={PieChartIcon} description="环比上月" />
          </div>
    
          <div class="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm font-medium text-card-foreground">采集量月度趋势</CardTitle>
                  <Badge variant="outline" class="text-xs font-normal">近 6 个月</Badge>
                </div>
              </CardHeader>
              <CardContent class="pb-4">
                <ChartContainer class="h-[240px]" config={chartConfig}>
                  <VisXYContainer data={monthlyData} height={240}>
                    <VisArea x={(_, i) => i} y={(d) => d.collections} color={() => "var(--color-collections)"} />
                    <VisLine x={(_, i) => i} y={(d) => d.collections} color={() => "var(--color-collections)"} />
                    <VisAxis type="x" tickFormat={(v) => monthlyData[Math.round(Number(v))]?.month ?? ""} />
                    <VisAxis type="y" />
                    <ChartTooltip />
                  </VisXYContainer>
                </ChartContainer>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-sm font-medium text-card-foreground">报警数月度趋势</CardTitle>
                  <Badge variant="outline" class="text-xs font-normal">近 6 个月</Badge>
                </div>
              </CardHeader>
              <CardContent class="pb-4">
                <ChartContainer class="h-[240px]" config={chartConfig}>
                  <VisXYContainer data={monthlyData} height={240}>
                    <VisLine x={(_, i) => i} y={(d) => d.alarms} color={() => "var(--color-alarms)"} />
                    <VisAxis type="x" tickFormat={(v) => monthlyData[Math.round(Number(v))]?.month ?? ""} />
                    <VisAxis type="y" />
                    <ChartTooltip />
                  </VisXYContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
    
          <div class="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-card-foreground">设备类型分布</CardTitle>
              </CardHeader>
              <CardContent class="pb-4">
                <div class="flex items-center gap-6">
                  <ChartContainer class="h-[200px] w-[200px] shrink-0" config={chartConfig}>
                    <VisSingleContainer data={deviceTypeDistribution} height={200}>
                      <VisDonut value={(d) => d.value} color={(d) => d.color} arcWidth={26} />
                      <ChartTooltip />
                    </VisSingleContainer>
                  </ChartContainer>
                  <div class="flex flex-1 flex-col gap-2">
                    {deviceTypeDistribution.map((item) => (
                      <div key={item.name} class="flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2">
                          <div class="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                          <span class="text-card-foreground">{item.name}</span>
                        </div>
                        <span class="text-muted-foreground">{`${item.count} 台 (${item.value}%)`}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div class="pt-2">
                  <ChartLegend items={deviceTypeDistribution.map((item) => ({ name: item.name, color: item.color }))} />
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-sm font-medium text-card-foreground">报警类型统计</CardTitle>
              </CardHeader>
              <CardContent class="pb-4">
                <div class="flex flex-col gap-3">
                  {alarmTypeStats.map((item) => (
                    <div key={item.type} class="flex flex-col gap-1.5">
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-card-foreground">{item.type}</span>
                        <span class="text-muted-foreground">{`${item.count} 次 (${item.percentage}%)`}</span>
                      </div>
                      <div class="relative h-1.5 rounded-full bg-secondary">
                        <div class="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
  }
})
</script>

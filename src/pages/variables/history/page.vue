<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Search } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/ui/page-header"
import { ChartContainer, ChartTooltip, VisAxis, VisLine, VisXYContainer, type ChartConfig } from "@/components/ui/chart"
import { DataTable, type Column } from "@/components/ui/data-table"

const historyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  temperature: +(260 + Math.random() * 40).toFixed(1),
  pressure: +(1.5 + Math.random() * 0.8).toFixed(2),
  flow: +(100 + Math.random() * 40).toFixed(1),
}))

type HistoryRow = { time: string; temperature: number; pressure: number; flow: number; [key: string]: unknown }

const columns: Column<HistoryRow>[] = [
  { key: "time", title: "时间", className: "font-mono" },
  { key: "temperature", title: "锅炉出口温度 (°C)", className: "font-mono", render: (r) => <span class="text-card-foreground">{r.temperature}</span> },
  { key: "pressure", title: "锅炉出口压力 (MPa)", className: "font-mono", render: (r) => <span class="text-card-foreground">{r.pressure}</span> },
  { key: "flow", title: "给水流量 (t/h)", className: "font-mono", render: (r) => <span class="text-card-foreground">{r.flow}</span> },
]

const chartConfig = {
  temperature: { label: "温度", color: "hsl(199 89% 48%)" },
  pressure: { label: "压力", color: "hsl(162 63% 41%)" },
  flow: { label: "流量", color: "hsl(43 74% 49%)" },
} satisfies ChartConfig

export default defineComponent({
  name: "historyPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="历史查询" description="查询和导出变量历史数据">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>导出 CSV</span>
            </Button>
          </PageHeader>
    
          <Card>
            <CardContent class="flex flex-wrap items-end gap-4 p-4">
              <div class="flex flex-col gap-1.5">
                <Label class="text-xs">变量</Label>
                <Select defaultValue="temperature">
                  <SelectTrigger class="h-8 w-[180px] text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">锅炉出口温度</SelectItem>
                    <SelectItem value="pressure">锅炉出口压力</SelectItem>
                    <SelectItem value="flow">给水流量</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-xs">时间范围</Label>
                <Select defaultValue="24h">
                  <SelectTrigger class="h-8 w-[140px] text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">最近 1 小时</SelectItem>
                    <SelectItem value="6h">最近 6 小时</SelectItem>
                    <SelectItem value="24h">最近 24 小时</SelectItem>
                    <SelectItem value="7d">最近 7 天</SelectItem>
                    <SelectItem value="30d">最近 30 天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-1.5">
                <Label class="text-xs">采样间隔</Label>
                <Select defaultValue="1h">
                  <SelectTrigger class="h-8 w-[120px] text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1s">1 秒</SelectItem>
                    <SelectItem value="1m">1 分钟</SelectItem>
                    <SelectItem value="1h">1 小时</SelectItem>
                    <SelectItem value="1d">1 天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                <Search class="h-3.5 w-3.5" />
                <span>查询</span>
              </Button>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm font-medium text-card-foreground">历史趋势</CardTitle>
            </CardHeader>
            <CardContent class="pb-4">
              <ChartContainer class="h-[280px]" config={chartConfig}>
                <VisXYContainer data={historyData} height={280}>
                  <VisLine x={(_, i) => i} y={(d) => d.temperature} color={() => "var(--color-temperature)"} />
                  <VisLine x={(_, i) => i} y={(d) => d.pressure} color={() => "var(--color-pressure)"} />
                  <VisLine x={(_, i) => i} y={(d) => d.flow} color={() => "var(--color-flow)"} />
                  <VisAxis type="x" tickFormat={(v) => historyData[Math.round(Number(v))]?.time ?? ""} />
                  <VisAxis type="y" />
                  <ChartTooltip />
                </VisXYContainer>
              </ChartContainer>
            </CardContent>
          </Card>
    
          <DataTable columns={columns as Column<Record<string, unknown>>[]} data={historyData as HistoryRow[]} searchable={false} pageSize={12} />
        </div>
      )
  }
})
</script>

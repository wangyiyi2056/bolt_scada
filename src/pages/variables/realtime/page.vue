<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { RefreshCw, Pause, Play } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"

const realtimeVars = [
  { name: "锅炉出口温度", value: 285.6, unit: "°C", min: 200, max: 350, quality: "Good", trend: "up" },
  { name: "锅炉出口压力", value: 1.82, unit: "MPa", min: 0, max: 2.5, quality: "Good", trend: "stable" },
  { name: "给水流量", value: 120.5, unit: "t/h", min: 0, max: 200, quality: "Good", trend: "down" },
  { name: "引风机频率", value: 42, unit: "Hz", min: 0, max: 50, quality: "Good", trend: "stable" },
  { name: "烟气含氧量", value: 0, unit: "%", min: 0, max: 21, quality: "Bad", trend: "stable" },
  { name: "给水阀开度", value: 65.2, unit: "%", min: 0, max: 100, quality: "Good", trend: "up" },
  { name: "环境温度", value: 22.8, unit: "°C", min: -20, max: 50, quality: "Good", trend: "stable" },
  { name: "电网频率", value: 50.01, unit: "Hz", min: 49.5, max: 50.5, quality: "Good", trend: "stable" },
  { name: "有功功率", value: 1250.8, unit: "kW", min: 0, max: 3000, quality: "Good", trend: "up" },
  { name: "液位高度", value: 3.45, unit: "m", min: 0, max: 5, quality: "Good", trend: "down" },
  { name: "进水泵状态", value: 1, unit: "", min: 0, max: 1, quality: "Good", trend: "stable" },
  { name: "排放阀位", value: 0.0, unit: "%", min: 0, max: 100, quality: "Good", trend: "stable" },
]

function getBarPercentage(value: number, min: number, max: number) {
  if (max === min) return 0
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
}

function getBarColor(pct: number) {
  if (pct > 90) return "bg-destructive"
  if (pct > 70) return "bg-warning"
  return "bg-primary"
}

const trendSymbols: Record<string, string> = { up: "↑", down: "↓", stable: "→" }

export default defineComponent({
  name: "realtimePage",
  setup() {
    const running = ref(true)
    
      return () => (
        <div class="page-shell">
          <PageHeader title="实时监控" description="实时查看所有变量当前值和状态">
            <Button variant="outline" size="sm" onClick={() => (running.value = !running.value)} class="h-8 gap-1.5 bg-transparent">
              {running.value ? <Pause class="h-3.5 w-3.5" /> : <Play class="h-3.5 w-3.5" />}
              <span>{running.value ? "暂停" : "恢复"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <RefreshCw class="h-3.5 w-3.5" />
              <span>刷新</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {realtimeVars.map((v) => {
              const pct = getBarPercentage(v.value, v.min, v.max)
              return (
                <Card key={v.name} class="transition-colors hover:border-primary/30">
                  <CardContent class="p-4">
                    <div class="flex items-start justify-between">
                      <span class="text-xs font-medium text-card-foreground">{v.name}</span>
                      <div class="flex items-center gap-1">
                        <div class={`h-1.5 w-1.5 rounded-full ${v.quality === "Good" ? "bg-success" : "bg-destructive"}`} />
                        <span class="text-[10px] text-muted-foreground">{v.quality}</span>
                      </div>
                    </div>
                    <div class="mt-2 flex items-baseline gap-1">
                      <span class={`font-mono text-2xl font-bold ${v.quality === "Bad" ? "text-destructive" : "text-card-foreground"}`}>
                        {v.quality === "Bad" ? "--" : v.value}
                      </span>
                      <span class="text-xs text-muted-foreground">{v.unit}</span>
                      <span class="ml-1 text-xs text-muted-foreground">{trendSymbols[v.trend]}</span>
                    </div>
                    <div class="mt-2">
                      <div class="relative h-1.5 rounded-full bg-secondary">
                        <div class={`absolute inset-y-0 left-0 rounded-full transition-all ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div class="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{`${v.min} ${v.unit}`}</span>
                        <span>{`${v.max} ${v.unit}`}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )
  }
})
</script>

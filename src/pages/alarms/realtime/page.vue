<script lang="tsx">
import { defineComponent } from "vue"
import { Bell, Volume2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"

const activeAlarms = [
  { id: "ALM-001", time: "2026-02-09 14:30:15", device: "PLC-Station-03", variable: "锅炉出口温度", value: "352.1°C", threshold: "> 350°C", level: "紧急", message: "温度传感器超上限", duration: "2 分钟" },
  { id: "ALM-002", time: "2026-02-09 14:15:22", device: "RTU-Node-07", variable: "-", value: "-", threshold: "Timeout 30s", level: "紧急", message: "通信中断", duration: "17 分钟" },
  { id: "ALM-003", time: "2026-02-09 13:58:10", device: "HMI-Panel-02", variable: "内存使用率", value: "87%", threshold: "> 85%", level: "次要", message: "内存使用率超阈值", duration: "34 分钟" },
  { id: "ALM-004", time: "2026-02-09 13:45:30", device: "IO-Module-11", variable: "DI-01", value: "抖动", threshold: "稳定", level: "次要", message: "DI 信号抖动", duration: "47 分钟" },
  { id: "ALM-005", time: "2026-02-09 12:05:00", device: "Sensor-Temp-01", variable: "-", value: "-", threshold: "Timeout 30s", level: "重要", message: "通信中断超过 2 小时", duration: "2 小时 27 分" },
]

const levelStyles: Record<string, { className: string; dotClass: string }> = {
  "紧急": { className: "bg-destructive/10 text-destructive border-destructive/20", dotClass: "bg-destructive" },
  "重要": { className: "bg-warning/10 text-warning border-warning/20", dotClass: "bg-warning" },
  "次要": { className: "bg-muted text-muted-foreground border-border", dotClass: "bg-muted-foreground" },
}

export default defineComponent({
  name: "realtimePage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="实时报警" description="查看当前所有活跃报警">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Volume2 class="h-3.5 w-3.5" />
              <span>{"消音"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid grid-cols-3 gap-4">
            <StatCard title="紧急报警" value={String(activeAlarms.filter((a) => a.level === "紧急").length)} icon={Bell} />
            <StatCard title="重要报警" value={String(activeAlarms.filter((a) => a.level === "重要").length)} icon={Bell} />
            <StatCard title="次要报警" value={String(activeAlarms.filter((a) => a.level === "次要").length)} icon={Bell} />
          </div>
    
          <div class="flex flex-col gap-3">
            {activeAlarms.map((alarm) => {
              const cfg = levelStyles[alarm.level]
              return (
                <Card key={alarm.id} class={`border-l-4 ${alarm.level === "紧急" ? "border-l-destructive" : alarm.level === "重要" ? "border-l-warning" : "border-l-muted-foreground"}`}>
                  <CardContent class="p-4">
                    <div class="flex items-start justify-between">
                      <div class="flex items-start gap-3">
                        <div class={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dotClass} ${alarm.level === "紧急" ? "animate-pulse" : ""}`} />
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-card-foreground">{alarm.message}</span>
                            <Badge variant="outline" class={`text-[10px] ${cfg.className}`}>{alarm.level}</Badge>
                          </div>
                          <div class="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span>{alarm.device}</span>
                            {alarm.variable !== "-" && <span>{alarm.variable}</span>}
                            {alarm.value !== "-" && <span class="font-mono">{`当前值: ${alarm.value}`}</span>}
                            <span class="font-mono">{alarm.threshold}</span>
                          </div>
                          <div class="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span>{alarm.time}</span>
                            <span>{`持续 ${alarm.duration}`}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" class="h-7 bg-transparent text-xs">{"确认"}</Button>
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

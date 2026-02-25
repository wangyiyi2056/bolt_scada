<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"

type SystemLog = {
  id: string
  time: string
  level: string
  source: string
  node: string
  message: string
  [key: string]: unknown
}

const systemLogs: SystemLog[] = [
  { id: "SYS-001", time: "2026-02-09 14:32:05", level: "INFO", source: "Scheduler", node: "主控-01", message: "定时任务 [数据质量检测] 执行完成, 耗时 1.2s" },
  { id: "SYS-002", time: "2026-02-09 14:30:00", level: "INFO", source: "DataEngine", node: "采集-02", message: "采集周期完成, 512 变量已更新" },
  { id: "SYS-003", time: "2026-02-09 14:28:15", level: "WARN", source: "ResourceMonitor", node: "网关-03", message: "内存使用率 85% 超过阈值 (80%)" },
  { id: "SYS-004", time: "2026-02-09 14:25:00", level: "INFO", source: "AlarmEngine", node: "主控-01", message: "报警引擎运行正常, 活跃规则 98 条" },
  { id: "SYS-005", time: "2026-02-09 14:15:22", level: "ERROR", source: "CommManager", node: "采集-02", message: "RTU-Node-07 通信超时, 已触发报警 ALM-002" },
  { id: "SYS-006", time: "2026-02-09 14:00:00", level: "INFO", source: "Scheduler", node: "主控-01", message: "定时任务 [设备健康评估] 执行完成, 耗时 8.5s" },
  { id: "SYS-007", time: "2026-02-09 13:55:30", level: "WARN", source: "ResourceMonitor", node: "网关-03", message: "CPU 使用率 78% 接近阈值" },
  { id: "SYS-008", time: "2026-02-09 12:05:00", level: "ERROR", source: "CommManager", node: "网关-03", message: "Sensor-Temp-01 通信中断, MQTT 连接丢失" },
  { id: "SYS-009", time: "2026-02-09 11:30:00", level: "INFO", source: "BackupService", node: "主控-01", message: "每日增量备份完成 (TDengine: 2.3GB, PG: 45MB)" },
  { id: "SYS-010", time: "2026-02-09 08:00:01", level: "INFO", source: "AuthService", node: "主控-01", message: "用户 [孙丽] 登录成功, IP: 10.0.1.54" },
]

const levelColors: Record<string, string> = {
  INFO: "bg-muted text-muted-foreground border-border",
  WARN: "bg-warning/10 text-warning border-warning/20",
  ERROR: "bg-destructive/10 text-destructive border-destructive/20",
  DEBUG: "bg-muted text-muted-foreground border-border",
}

const columns: Column<SystemLog>[] = [
  { key: "time", title: "时间", className: "font-mono text-xs w-[160px]" },
  { key: "level", title: "级别", render: (l) => <Badge variant="outline" class={`text-[10px] font-mono ${levelColors[l.level] || ""}`}>{l.level}</Badge> },
  { key: "source", title: "来源", render: (l) => <code class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-card-foreground">{l.source}</code> },
  { key: "node", title: "节点" },
  { key: "message", title: "日志信息", render: (l) => <span class="text-xs text-card-foreground">{l.message}</span> },
]

export default defineComponent({
  name: "systemPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="系统日志" description="查看系统运行日志和异常记录">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={systemLogs} searchPlaceholder="搜索日志信息、来源..." pageSize={10} />
        </div>
      )
  }
})
</script>

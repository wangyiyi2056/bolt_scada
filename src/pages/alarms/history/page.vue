<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"

type HistoryAlarm = {
  id: string
  startTime: string
  endTime: string
  device: string
  message: string
  level: string
  duration: string
  acknowledgedBy: string
  [key: string]: unknown
}

const history: HistoryAlarm[] = [
  { id: "HA-001", startTime: "2026-02-09 09:15", endTime: "2026-02-09 09:28", device: "PLC-Station-03", message: "温度传感器超上限", level: "紧急", duration: "13 分钟", acknowledgedBy: "李华" },
  { id: "HA-002", startTime: "2026-02-08 16:42", endTime: "2026-02-08 16:55", device: "PLC-Station-01", message: "锅炉超压", level: "紧急", duration: "13 分钟", acknowledgedBy: "张明" },
  { id: "HA-003", startTime: "2026-02-08 14:20", endTime: "2026-02-08 14:35", device: "VFD-Fan-02", message: "引风机频率异常", level: "次要", duration: "15 分钟", acknowledgedBy: "系统自动" },
  { id: "HA-004", startTime: "2026-02-07 22:10", endTime: "2026-02-07 22:45", device: "RTU-Node-01", message: "液位高报", level: "重要", duration: "35 分钟", acknowledgedBy: "孙丽" },
  { id: "HA-005", startTime: "2026-02-07 10:00", endTime: "2026-02-07 10:30", device: "Meter-Power-01", message: "功率越限", level: "次要", duration: "30 分钟", acknowledgedBy: "系统自动" },
  { id: "HA-006", startTime: "2026-02-06 08:30", endTime: "2026-02-06 08:32", device: "PLC-Station-01", message: "电源电压偏低", level: "重要", duration: "2 分钟", acknowledgedBy: "张明" },
  { id: "HA-007", startTime: "2026-02-05 15:00", endTime: "2026-02-05 16:20", device: "IO-Module-11", message: "通信中断", level: "紧急", duration: "1 小时 20 分", acknowledgedBy: "王芳" },
  { id: "HA-008", startTime: "2026-02-04 09:45", endTime: "2026-02-04 10:00", device: "VFD-Pump-01", message: "变频器过流", level: "重要", duration: "15 分钟", acknowledgedBy: "赵强" },
]

const levelStyles: Record<string, string> = {
  "紧急": "bg-destructive/10 text-destructive border-destructive/20",
  "重要": "bg-warning/10 text-warning border-warning/20",
  "次要": "bg-muted text-muted-foreground border-border",
}

const columns: Column<HistoryAlarm>[] = [
  { key: "id", title: "报警 ID", className: "w-[80px] font-mono" },
  { key: "startTime", title: "开始时间", className: "font-mono" },
  { key: "endTime", title: "结束时间", className: "font-mono" },
  { key: "device", title: "设备", className: "text-xs" },
  { key: "message", title: "报警信息", render: (a) => <span class="font-medium text-card-foreground">{a.message}</span> },
  { key: "level", title: "级别", render: (a) => <Badge variant="outline" class={`text-[10px] ${levelStyles[a.level] || ""}`}>{a.level}</Badge> },
  { key: "duration", title: "持续时间", className: "text-xs" },
  { key: "acknowledgedBy", title: "确认人", className: "text-xs" },
]

export default defineComponent({
  name: "historyPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="历史报警" description="查看已恢复的历史报警记录">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
          </PageHeader>
          <DataTable columns={columns} data={history} searchPlaceholder="搜索设备、报警信息..." />
        </div>
      )
  }
})
</script>

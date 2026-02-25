<script lang="tsx">
import { defineComponent } from "vue"
import { CheckCircle2, Download } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"

type AckRecord = {
  id: string
  alarmId: string
  message: string
  level: string
  triggerTime: string
  ackTime: string
  ackUser: string
  ackNote: string
  status: string
  [key: string]: unknown
}

const ackRecords: AckRecord[] = [
  { id: "ACK-001", alarmId: "ALM-012", message: "管道压力超上限", level: "紧急", triggerTime: "2026-02-09 10:15:30", ackTime: "2026-02-09 10:18:12", ackUser: "张明", ackNote: "已通知现场巡检", status: "已确认" },
  { id: "ACK-002", alarmId: "ALM-011", message: "冷却水温度偏高", level: "重要", triggerTime: "2026-02-09 09:30:00", ackTime: "2026-02-09 09:35:20", ackUser: "李华", ackNote: "冷却塔风机已启动", status: "已确认" },
  { id: "ACK-003", alarmId: "ALM-010", message: "PLC-02 通信超时", level: "重要", triggerTime: "2026-02-09 08:45:10", ackTime: "2026-02-09 08:50:05", ackUser: "王芳", ackNote: "网络抖动已恢复", status: "已确认" },
  { id: "ACK-004", alarmId: "ALM-009", message: "变频器过载", level: "紧急", triggerTime: "2026-02-08 16:20:00", ackTime: "2026-02-08 16:22:30", ackUser: "张明", ackNote: "已降低运行频率", status: "已确认" },
  { id: "ACK-005", alarmId: "ALM-008", message: "UPS 电池电压低", level: "重要", triggerTime: "2026-02-08 14:10:00", ackTime: "2026-02-08 14:25:00", ackUser: "赵强", ackNote: "已安排更换电池", status: "已确认" },
  { id: "ACK-006", alarmId: "ALM-001", message: "锅炉出口温度超限", level: "紧急", triggerTime: "2026-02-09 14:30:15", ackTime: "-", ackUser: "-", ackNote: "-", status: "待确认" },
  { id: "ACK-007", alarmId: "ALM-002", message: "RTU-Node-07 通信中断", level: "紧急", triggerTime: "2026-02-09 14:15:22", ackTime: "-", ackUser: "-", ackNote: "-", status: "待确认" },
  { id: "ACK-008", alarmId: "ALM-005", message: "Sensor-Temp-01 通信中断", level: "重要", triggerTime: "2026-02-09 12:05:00", ackTime: "-", ackUser: "-", ackNote: "-", status: "待确认" },
]

const levelColors: Record<string, string> = {
  "紧急": "bg-destructive/10 text-destructive border-destructive/20",
  "重要": "bg-warning/10 text-warning border-warning/20",
  "次要": "bg-muted text-muted-foreground border-border",
}
const statusColors: Record<string, string> = {
  "已确认": "bg-success/10 text-success border-success/20",
  "待确认": "bg-warning/10 text-warning border-warning/20",
}

const columns: Column<AckRecord>[] = [
  { key: "alarmId", title: "报警 ID", className: "font-mono text-xs w-[90px]" },
  { key: "message", title: "报警信息", render: (r) => <span class="font-medium text-card-foreground">{r.message}</span> },
  { key: "level", title: "级别", render: (r) => <Badge variant="outline" class={`text-[10px] ${levelColors[r.level] || ""}`}>{r.level}</Badge> },
  { key: "triggerTime", title: "触发时间", className: "font-mono text-xs" },
  { key: "ackTime", title: "确认时间", className: "font-mono text-xs" },
  { key: "ackUser", title: "确认人" },
  { key: "ackNote", title: "处理备注", className: "text-xs max-w-[200px] truncate" },
  {
    key: "status",
    title: "状态",
    render: (r) => (
      <Badge variant="outline" class={`text-[10px] ${statusColors[r.status] || ""}`}>{r.status}</Badge>
    ),
  },
]

export default defineComponent({
  name: "acknowledgePage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="报警确认" description="查看和管理报警确认记录">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出记录"}</span>
            </Button>
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <CheckCircle2 class="h-3.5 w-3.5" />
              <span>{"批量确认"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={ackRecords} searchPlaceholder="搜索报警信息、确认人..." />
        </div>
      )
  }
})
</script>

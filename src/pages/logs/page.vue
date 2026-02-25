<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"

type LogEntry = {
  id: string
  time: string
  user: string
  action: string
  module: string
  target: string
  ip: string
  result: string
  [key: string]: unknown
}

const logs: LogEntry[] = [
  { id: "L001", time: "2026-02-09 14:32:01", user: "张明", action: "修改变量", module: "变量管理", target: "给水阀开度", ip: "10.0.1.50", result: "成功" },
  { id: "L002", time: "2026-02-09 14:30:15", user: "李华", action: "确认报警", module: "报警管理", target: "ALM-001 温度超限", ip: "10.0.1.51", result: "成功" },
  { id: "L003", time: "2026-02-09 14:28:42", user: "王芳", action: "启动脚本", module: "脚本管理", target: "SCR-008 通信重连", ip: "10.0.1.52", result: "成功" },
  { id: "L004", time: "2026-02-09 14:15:30", user: "张明", action: "添加设备", module: "设备管理", target: "Sensor-Temp-02", ip: "10.0.1.50", result: "成功" },
  { id: "L005", time: "2026-02-09 13:50:18", user: "赵强", action: "修改配置", module: "通信管理", target: "Modbus TCP 通道 3", ip: "10.0.1.53", result: "成功" },
  { id: "L006", time: "2026-02-09 13:45:00", user: "李华", action: "用户登录", module: "系统", target: "-", ip: "10.0.1.51", result: "成功" },
  { id: "L007", time: "2026-02-09 13:30:22", user: "孙丽", action: "导出数据", module: "变量管理", target: "历史数据 CSV", ip: "10.0.1.54", result: "成功" },
  { id: "L008", time: "2026-02-09 12:05:33", user: "系统", action: "通信断开", module: "通信管理", target: "Sensor-Temp-01", ip: "-", result: "异常" },
  { id: "L009", time: "2026-02-09 11:30:00", user: "系统", action: "自动备份", module: "数据库", target: "每日增量备份", ip: "-", result: "成功" },
  { id: "L010", time: "2026-02-09 10:15:10", user: "系统", action: "通信断开", module: "通信管理", target: "RTU-Node-07", ip: "-", result: "异常" },
  { id: "L011", time: "2026-02-09 09:15:45", user: "系统", action: "报警触发", module: "报警管理", target: "锅炉出口超温", ip: "-", result: "触发" },
  { id: "L012", time: "2026-02-09 08:00:00", user: "孙丽", action: "用户登录", module: "系统", target: "-", ip: "10.0.1.54", result: "成功" },
]

const resultStyles: Record<string, string> = {
  "成功": "bg-success/10 text-success border-success/20",
  "异常": "bg-destructive/10 text-destructive border-destructive/20",
  "触发": "bg-warning/10 text-warning border-warning/20",
}

const columns: Column<LogEntry>[] = [
  { key: "time", title: "时间", className: "font-mono w-[160px]" },
  { key: "user", title: "操作人", render: (l) => <span class="font-medium text-card-foreground">{l.user}</span> },
  { key: "action", title: "操作" },
  {
    key: "module",
    title: "模块",
    render: (l) => <Badge variant="outline" class="text-[10px] font-normal">{l.module}</Badge>,
  },
  { key: "target", title: "操作对象", className: "text-xs" },
  { key: "ip", title: "IP", className: "font-mono" },
  {
    key: "result",
    title: "结果",
    render: (l) => (
      <Badge variant="outline" class={`text-[10px] ${resultStyles[l.result] || ""}`}>
        {l.result}
      </Badge>
    ),
  },
]

export default defineComponent({
  name: "logsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="操作日志" description="查看系统操作记录和审计日志">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={logs} searchPlaceholder="搜索操作人、操作、模块..." pageSize={10} />
        </div>
      )
  }
})
</script>

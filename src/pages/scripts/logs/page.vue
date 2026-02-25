<script lang="tsx">
import { defineComponent } from "vue"
import { Download, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { DataTable, type Column } from "@/components/ui/data-table"

type ScriptLog = {
  id: string
  time: string
  script: string
  trigger: string
  duration: string
  result: string
  output: string
  [key: string]: unknown
}

const scriptLogs: ScriptLog[] = [
  { id: "SL-001", time: "2026-02-09 14:30:03", script: "数据质量检测", trigger: "定时", duration: "1.2s", result: "成功", output: "检测 1024 变量, 1 异常" },
  { id: "SL-002", time: "2026-02-09 14:32:01", script: "报警聚合处理", trigger: "事件", duration: "0.3s", result: "成功", output: "处理 3 条报警, 合并 1 组" },
  { id: "SL-003", time: "2026-02-09 14:32:10", script: "联锁逻辑检查", trigger: "定时", duration: "0.05s", result: "成功", output: "12 路联锁正常" },
  { id: "SL-004", time: "2026-02-09 14:30:00", script: "能耗统计计算", trigger: "定时", duration: "2.1s", result: "成功", output: "A区 125.3kWh, B区 98.7kWh" },
  { id: "SL-005", time: "2026-02-09 14:00:08", script: "设备健康评估", trigger: "定时", duration: "8.5s", result: "成功", output: "26 设备评估完成, 2 预警" },
  { id: "SL-006", time: "2026-02-09 14:31:30", script: "通信断线重连", trigger: "定时", duration: "0.8s", result: "部分成功", output: "RTU-07 重连失败, 其余正常" },
  { id: "SL-007", time: "2026-02-09 00:05:16", script: "日报表生成", trigger: "定时", duration: "15.8s", result: "成功", output: "生成 2026-02-08 日报" },
  { id: "SL-008", time: "2026-02-08 22:15:00", script: "数据质量检测", trigger: "定时", duration: "1.1s", result: "成功", output: "检测 1024 变量, 0 异常" },
  { id: "SL-009", time: "2026-02-08 18:00:05", script: "设备健康评估", trigger: "定时", duration: "9.2s", result: "超时", output: "执行超时，已终止" },
  { id: "SL-010", time: "2026-02-08 14:30:00", script: "能耗统计计算", trigger: "定时", duration: "2.3s", result: "成功", output: "A区 130.1kWh, B区 102.4kWh" },
]

const resultColors: Record<string, string> = {
  "成功": "bg-success/10 text-success border-success/20",
  "失败": "bg-destructive/10 text-destructive border-destructive/20",
  "超时": "bg-warning/10 text-warning border-warning/20",
  "部分成功": "bg-warning/10 text-warning border-warning/20",
}

const columns: Column<ScriptLog>[] = [
  { key: "time", title: "执行时间", className: "font-mono w-[160px]" },
  { key: "script", title: "脚本名称", render: (l) => <span class="font-medium text-card-foreground">{l.script}</span> },
  { key: "trigger", title: "触发方式", render: (l) => <Badge variant="outline" class="text-[10px]">{l.trigger}</Badge> },
  { key: "duration", title: "耗时", className: "font-mono" },
  { key: "result", title: "结果", render: (l) => <Badge variant="outline" class={`text-[10px] ${resultColors[l.result] || ""}`}>{l.result}</Badge> },
  { key: "output", title: "输出摘要", className: "text-xs text-muted-foreground max-w-[280px] truncate" },
]

export default defineComponent({
  name: "logsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="执行日志" description="查看脚本运行历史和执行结果">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={scriptLogs} searchPlaceholder="搜索脚本名称..." pageSize={10} />
        </div>
      )
  }
})
</script>

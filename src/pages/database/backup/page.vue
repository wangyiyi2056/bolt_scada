<script lang="tsx">
import { defineComponent } from "vue"
import { Play, Download, HardDrive } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"

type BackupRecord = {
  id: string
  name: string
  type: string
  source: string
  size: string
  duration: string
  time: string
  status: string
  [key: string]: unknown
}

const backups: BackupRecord[] = [
  { id: "BK-001", name: "每日增量备份", type: "增量", source: "TDengine (主)", size: "2.3 GB", duration: "3 分 12 秒", time: "2026-02-09 02:00", status: "成功" },
  { id: "BK-002", name: "每日增量备份", type: "增量", source: "PostgreSQL", size: "45 MB", duration: "15 秒", time: "2026-02-09 02:05", status: "成功" },
  { id: "BK-003", name: "每周全量备份", type: "全量", source: "TDengine (主)", size: "128.5 GB", duration: "1 小时 23 分", time: "2026-02-08 03:00", status: "成功" },
  { id: "BK-004", name: "每周全量备份", type: "全量", source: "PostgreSQL", size: "12.3 GB", duration: "18 分 45 秒", time: "2026-02-08 03:00", status: "成功" },
  { id: "BK-005", name: "每日增量备份", type: "增量", source: "TDengine (主)", size: "2.1 GB", duration: "2 分 58 秒", time: "2026-02-08 02:00", status: "成功" },
  { id: "BK-006", name: "每日增量备份", type: "增量", source: "Elasticsearch", size: "1.5 GB", duration: "5 分 20 秒", time: "2026-02-08 02:10", status: "成功" },
  { id: "BK-007", name: "手动备份", type: "全量", source: "PostgreSQL", size: "12.1 GB", duration: "17 分 30 秒", time: "2026-02-07 15:30", status: "成功" },
  { id: "BK-008", name: "每日增量备份", type: "增量", source: "TDengine (主)", size: "-", duration: "-", time: "2026-02-06 02:00", status: "失败" },
]

const statusColors: Record<string, string> = {
  "成功": "bg-success/10 text-success border-success/20",
  "失败": "bg-destructive/10 text-destructive border-destructive/20",
  "进行中": "bg-primary/10 text-primary border-primary/20",
}
const typeColors: Record<string, string> = {
  "全量": "bg-primary/10 text-primary border-primary/20",
  "增量": "bg-muted text-muted-foreground border-border",
}

const columns: Column<BackupRecord>[] = [
  { key: "name", title: "备份名称", render: (b) => <span class="font-medium text-card-foreground">{b.name}</span> },
  { key: "type", title: "类型", render: (b) => <Badge variant="outline" class={`text-[10px] ${typeColors[b.type] || ""}`}>{b.type}</Badge> },
  { key: "source", title: "数据源" },
  { key: "size", title: "大小", className: "font-mono text-xs" },
  { key: "duration", title: "耗时", className: "text-xs" },
  { key: "time", title: "备份时间", className: "font-mono text-xs" },
  { key: "status", title: "状态", render: (b) => <Badge variant="outline" class={`text-[10px] ${statusColors[b.status] || ""}`}>{b.status}</Badge> },
  {
    key: "actions", title: "", className: "w-[40px]",
    render: (b) => b.status === "成功" ? (
      <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
        <Download class="h-3.5 w-3.5" />
      </Button>
    ) : null,
  },
]

export default defineComponent({
  name: "backupPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="数据备份" description="管理数据库备份任务和备份文件">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Play class="h-3.5 w-3.5" />
              <span>{"立即备份"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={backups} searchPlaceholder="搜索备份名称、数据源..." />
        </div>
      )
  }
})
</script>

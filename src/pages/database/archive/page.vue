<script lang="tsx">
import { defineComponent } from "vue"
import { Archive, Download, Trash2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"

type ArchiveRecord = {
  id: string
  name: string
  source: string
  dateRange: string
  originalSize: string
  compressedSize: string
  ratio: string
  archivedAt: string
  storage: string
  [key: string]: unknown
}

const archives: ArchiveRecord[] = [
  { id: "AR-001", name: "实时数据 2025Q3", source: "TDengine", dateRange: "2025-07 ~ 2025-09", originalSize: "85.2 GB", compressedSize: "28.4 GB", ratio: "66.7%", archivedAt: "2025-10-01", storage: "MinIO" },
  { id: "AR-002", name: "实时数据 2025Q2", source: "TDengine", dateRange: "2025-04 ~ 2025-06", originalSize: "78.5 GB", compressedSize: "25.1 GB", ratio: "68.0%", archivedAt: "2025-07-01", storage: "MinIO" },
  { id: "AR-003", name: "实时数据 2025Q1", source: "TDengine", dateRange: "2025-01 ~ 2025-03", originalSize: "72.3 GB", compressedSize: "23.8 GB", ratio: "67.1%", archivedAt: "2025-04-01", storage: "MinIO" },
  { id: "AR-004", name: "报警记录 2025H1", source: "TDengine", dateRange: "2025-01 ~ 2025-06", originalSize: "5.2 GB", compressedSize: "1.3 GB", ratio: "75.0%", archivedAt: "2025-07-01", storage: "MinIO" },
  { id: "AR-005", name: "操作日志 2025Q3", source: "Elasticsearch", dateRange: "2025-07 ~ 2025-09", originalSize: "15.6 GB", compressedSize: "4.2 GB", ratio: "73.1%", archivedAt: "2025-10-01", storage: "MinIO" },
  { id: "AR-006", name: "操作日志 2025Q2", source: "Elasticsearch", dateRange: "2025-04 ~ 2025-06", originalSize: "14.8 GB", compressedSize: "3.9 GB", ratio: "73.6%", archivedAt: "2025-07-01", storage: "MinIO" },
]

const columns: Column<ArchiveRecord>[] = [
  { key: "name", title: "归档名称", render: (a) => <span class="font-medium text-card-foreground">{a.name}</span> },
  { key: "source", title: "数据源", render: (a) => <Badge variant="outline" class="text-[10px] font-mono">{a.source}</Badge> },
  { key: "dateRange", title: "数据范围", className: "text-xs" },
  { key: "originalSize", title: "原始大小", className: "font-mono text-xs" },
  { key: "compressedSize", title: "压缩后", className: "font-mono text-xs" },
  { key: "ratio", title: "压缩率", className: "font-mono text-xs" },
  { key: "archivedAt", title: "归档时间", className: "font-mono text-xs text-muted-foreground" },
  { key: "storage", title: "存储位置" },
  {
    key: "actions", title: "", className: "w-[80px]",
    render: () => (
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
          <Download class="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground hover:text-destructive">
          <Trash2 class="h-3.5 w-3.5" />
        </Button>
      </div>
    ),
  },
]

export default defineComponent({
  name: "archivePage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="数据归档" description="管理归档数据和压缩存储">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Archive class="h-3.5 w-3.5" />
              <span>{"手动归档"}</span>
            </Button>
          </PageHeader>
    
          <DataTable columns={columns} data={archives} searchPlaceholder="搜索归档名称、数据源..." />
        </div>
      )
  }
})
</script>

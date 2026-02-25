<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DbTable = {
  id: string
  name: string
  source: string
  type: string
  rows: string
  size: string
  columns: number
  indexes: number
  lastUpdated: string
  [key: string]: unknown
}

const initialTables: DbTable[] = [
  { id: "T-001", name: "realtime_data", source: "TDengine (主)", type: "超级表", rows: "12,580,000", size: "45.2 GB", columns: 8, indexes: 3, lastUpdated: "2026-02-09 14:32" },
  { id: "T-002", name: "alarm_records", source: "TDengine (主)", type: "超级表", rows: "856,000", size: "3.8 GB", columns: 12, indexes: 4, lastUpdated: "2026-02-09 14:30" },
  { id: "T-003", name: "device_config", source: "PostgreSQL", type: "普通表", rows: "26", size: "128 KB", columns: 15, indexes: 2, lastUpdated: "2026-02-09 14:15" },
  { id: "T-004", name: "variable_config", source: "PostgreSQL", type: "普通表", rows: "2,688", size: "1.2 MB", columns: 18, indexes: 5, lastUpdated: "2026-02-09 14:32" },
  { id: "T-005", name: "user_accounts", source: "PostgreSQL", type: "普通表", rows: "8", size: "32 KB", columns: 10, indexes: 2, lastUpdated: "2026-02-09 08:00" },
  { id: "T-006", name: "operation_logs", source: "Elasticsearch", type: "索引", rows: "1,250,000", size: "12.5 GB", columns: 9, indexes: 6, lastUpdated: "2026-02-09 14:32" },
  { id: "T-007", name: "script_config", source: "PostgreSQL", type: "普通表", rows: "8", size: "16 KB", columns: 12, indexes: 2, lastUpdated: "2026-02-08 16:00" },
  { id: "T-008", name: "alarm_rules", source: "PostgreSQL", type: "普通表", rows: "98", size: "64 KB", columns: 14, indexes: 3, lastUpdated: "2026-02-09 10:30" },
  { id: "T-009", name: "energy_stats", source: "TDengine (主)", type: "超级表", rows: "3,200,000", size: "8.5 GB", columns: 6, indexes: 2, lastUpdated: "2026-02-09 14:30" },
  { id: "T-010", name: "node_heartbeat", source: "Redis", type: "Hash", rows: "6", size: "4 KB", columns: 5, indexes: 0, lastUpdated: "2026-02-09 14:32" },
]

const tables = ref<DbTable[]>(initialTables)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", source: "PostgreSQL", type: "普通表", rows: "0", size: "0 KB", columns: "1", indexes: "0" })
const editForm = ref({ id: "", name: "", source: "PostgreSQL", type: "普通表", rows: "0", size: "0 KB", columns: "1", indexes: "0" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextTableId() {
  const maxId = tables.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("T-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `T-${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toISOString().slice(0, 16).replace("T", " ")
}

function createTable() {
  const name = createForm.value.name.trim()
  if (!name) return
  tables.value.unshift({
    id: nextTableId(),
    name,
    source: createForm.value.source.trim() || "PostgreSQL",
    type: createForm.value.type.trim() || "普通表",
    rows: createForm.value.rows.trim() || "0",
    size: createForm.value.size.trim() || "0 KB",
    columns: Number.parseInt(createForm.value.columns, 10) || 1,
    indexes: Number.parseInt(createForm.value.indexes, 10) || 0,
    lastUpdated: now(),
  })
  createForm.value = { name: "", source: "PostgreSQL", type: "普通表", rows: "0", size: "0 KB", columns: "1", indexes: "0" }
  createOpen.value = false
}

function startEdit(table: DbTable) {
  editForm.value = {
    id: table.id,
    name: table.name,
    source: table.source,
    type: table.type,
    rows: table.rows,
    size: table.size,
    columns: String(table.columns),
    indexes: String(table.indexes),
  }
  editOpen.value = true
}

function saveEdit() {
  const index = tables.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  tables.value[index] = {
    ...tables.value[index],
    name: editForm.value.name.trim() || tables.value[index].name,
    source: editForm.value.source.trim() || "PostgreSQL",
    type: editForm.value.type.trim() || "普通表",
    rows: editForm.value.rows.trim() || "0",
    size: editForm.value.size.trim() || "0 KB",
    columns: Number.parseInt(editForm.value.columns, 10) || 1,
    indexes: Number.parseInt(editForm.value.indexes, 10) || 0,
    lastUpdated: now(),
  }
  editOpen.value = false
}

function duplicateTable(table: DbTable) {
  tables.value.unshift({
    ...table,
    id: nextTableId(),
    name: `${table.name}_copy`,
    lastUpdated: now(),
  })
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeTable(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeTable(id: string) {
  tables.value = tables.value.filter((item) => item.id !== id)
}

const sourceColors: Record<string, string> = {
  "TDengine (主)": "bg-primary/10 text-primary border-primary/20",
  "PostgreSQL": "bg-primary/10 text-primary border-primary/20",
  "Elasticsearch": "bg-warning/10 text-warning border-warning/20",
  "Redis": "bg-destructive/10 text-destructive border-destructive/20",
}

const columns: Column<DbTable>[] = [
  { key: "name", title: "表名", render: (t) => <code class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-card-foreground">{t.name}</code> },
  { key: "source", title: "数据源", render: (t) => <Badge variant="outline" class={`text-[10px] ${sourceColors[t.source] || ""}`}>{t.source}</Badge> },
  { key: "type", title: "类型" },
  { key: "rows", title: "行数", className: "font-mono text-xs text-right" },
  { key: "size", title: "大小", className: "font-mono text-xs" },
  { key: "columns", title: "字段数" },
  { key: "indexes", title: "索引数" },
  { key: "lastUpdated", title: "最后更新", className: "font-mono text-xs text-muted-foreground" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (t) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(t)}>编辑</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => duplicateTable(t)}>复制</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(t.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "tablesPage",
  setup() {
    return () => (
        <div class="page-shell">
          <ConfirmDialog
            open={deleteOpen.value}
            onOpenChange={(open: boolean) => {
              deleteOpen.value = open
              if (!open) pendingDeleteId.value = null
            }}
            title="确认删除"
            description="删除后不可恢复，是否继续？"
            onConfirm={confirmDelete}
          />
    
          <PageHeader title="数据表管理" description="查看和管理所有数据源中的数据表">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"创建表"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建数据表</DialogTitle>
                  <DialogDescription>补全数据表创建弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>表名</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-source">
                      <FormItem>
                        <FormLabel>数据源</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.source} onInput={(e: Event) => (createForm.value.source = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-type">
                      <FormItem>
                        <FormLabel>类型</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.type} onInput={(e: Event) => (createForm.value.type = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-rows">
                      <FormItem>
                        <FormLabel>行数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.rows} onInput={(e: Event) => (createForm.value.rows = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-size">
                      <FormItem>
                        <FormLabel>大小</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.size} onInput={(e: Event) => (createForm.value.size = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-columns">
                      <FormItem>
                        <FormLabel>字段数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.columns} onInput={(e: Event) => (createForm.value.columns = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-indexes">
                      <FormItem>
                        <FormLabel>索引数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.indexes} onInput={(e: Event) => (createForm.value.indexes = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createTable}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑数据表</DialogTitle>
                <DialogDescription>{`表编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>表名</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-source">
                    <FormItem>
                      <FormLabel>数据源</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.source} onInput={(e: Event) => (editForm.value.source = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-type">
                    <FormItem>
                      <FormLabel>类型</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.type} onInput={(e: Event) => (editForm.value.type = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-rows">
                    <FormItem>
                      <FormLabel>行数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.rows} onInput={(e: Event) => (editForm.value.rows = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-size">
                    <FormItem>
                      <FormLabel>大小</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.size} onInput={(e: Event) => (editForm.value.size = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-columns">
                    <FormItem>
                      <FormLabel>字段数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.columns} onInput={(e: Event) => (editForm.value.columns = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-indexes">
                    <FormItem>
                      <FormLabel>索引数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.indexes} onInput={(e: Event) => (editForm.value.indexes = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
              </Form>
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <DataTable columns={columns} data={tables.value} searchPlaceholder="搜索表名、数据源..." />
        </div>
      )
  }
})
</script>

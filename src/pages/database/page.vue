<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Database, HardDrive, Clock, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
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

type DataSource = {
  id: string
  name: string
  type: string
  host: string
  status: "online" | "warning"
  size: string
  tables: number
  retention: string
  desc: string
}

const initialDataSources: DataSource[] = [
  { id: "DS-001", name: "时序数据库 (主)", type: "TDengine", host: "10.0.1.100:6030", status: "online" as const, size: "128.5 GB", tables: 1284, retention: "365 天", desc: "存储实时采集数据和历史趋势" },
  { id: "DS-002", name: "关系数据库 (主)", type: "PostgreSQL", host: "10.0.1.101:5432", status: "online" as const, size: "12.3 GB", tables: 86, retention: "永久", desc: "存储配置信息、用户数据和元数据" },
  { id: "DS-003", name: "缓存数据库", type: "Redis", host: "10.0.1.102:6379", status: "online" as const, size: "2.1 GB", tables: 0, retention: "内存", desc: "实时数据缓存和会话管理" },
  { id: "DS-004", name: "时序数据库 (备)", type: "TDengine", host: "10.0.1.200:6030", status: "online" as const, size: "128.5 GB", tables: 1284, retention: "365 天", desc: "主库热备，自动故障转移" },
  { id: "DS-005", name: "日志数据库", type: "Elasticsearch", host: "10.0.1.103:9200", status: "warning" as const, size: "45.8 GB", tables: 12, retention: "90 天", desc: "存储系统日志和审计记录" },
  { id: "DS-006", name: "对象存储", type: "MinIO", host: "10.0.1.104:9000", status: "online" as const, size: "256 GB", tables: 0, retention: "永久", desc: "存储组态画面、报表文件" },
]

const dataSources = ref<DataSource[]>(initialDataSources)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", type: "TDengine", host: "", status: "online", size: "0 GB", tables: "0", retention: "", desc: "" })
const editForm = ref({ id: "", name: "", type: "TDengine", host: "", status: "online", size: "0 GB", tables: "0", retention: "", desc: "" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextDataSourceId() {
  const maxId = dataSources.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("DS-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `DS-${String(maxId + 1).padStart(3, "0")}`
}

function createDataSource() {
  const name = createForm.value.name.trim()
  if (!name) return
  dataSources.value.unshift({
    id: nextDataSourceId(),
    name,
    type: createForm.value.type,
    host: createForm.value.host.trim() || "-",
    status: createForm.value.status as DataSource["status"],
    size: createForm.value.size.trim() || "0 GB",
    tables: Number.parseInt(createForm.value.tables, 10) || 0,
    retention: createForm.value.retention.trim() || "未设置",
    desc: createForm.value.desc.trim() || "未填写描述",
  })
  createForm.value = { name: "", type: "TDengine", host: "", status: "online", size: "0 GB", tables: "0", retention: "", desc: "" }
  createOpen.value = false
}

function startEdit(ds: DataSource) {
  editForm.value = {
    id: ds.id,
    name: ds.name,
    type: ds.type,
    host: ds.host,
    status: ds.status,
    size: ds.size,
    tables: String(ds.tables),
    retention: ds.retention,
    desc: ds.desc,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = dataSources.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  dataSources.value[index] = {
    ...dataSources.value[index],
    name: editForm.value.name.trim() || dataSources.value[index].name,
    type: editForm.value.type,
    host: editForm.value.host.trim() || "-",
    status: editForm.value.status as DataSource["status"],
    size: editForm.value.size.trim() || "0 GB",
    tables: Number.parseInt(editForm.value.tables, 10) || 0,
    retention: editForm.value.retention.trim() || "未设置",
    desc: editForm.value.desc.trim() || "未填写描述",
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeDataSource(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeDataSource(id: string) {
  dataSources.value = dataSources.value.filter((item) => item.id !== id)
}

const typeColors: Record<string, string> = {
  TDengine: "bg-primary/10 text-primary border-primary/20",
  PostgreSQL: "bg-primary/10 text-primary border-primary/20",
  Redis: "bg-destructive/10 text-destructive border-destructive/20",
  Elasticsearch: "bg-warning/10 text-warning border-warning/20",
  MinIO: "bg-success/10 text-success border-success/20",
}

export default defineComponent({
  name: "databasePage",
  setup() {
    return () => (
        <div class="page-shell">
          <ConfirmDialog
            open={deleteOpen.value}
            onUpdate:open={(open: boolean) => {
              deleteOpen.value = open
              if (!open) pendingDeleteId.value = null
            }}
            title="确认删除"
            description="删除后不可恢复，是否继续？"
            onConfirm={confirmDelete}
          />
    
          <PageHeader title="数据源配置" description="管理平台所有数据库连接和存储配置">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加数据源"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增数据源</DialogTitle>
                  <DialogDescription>配置数据源基础连接信息。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-type">
                      <FormItem>
                        <FormLabel>类型</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.type} onInput={(e: Event) => (createForm.value.type = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-host">
                      <FormItem>
                        <FormLabel>地址</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.host} onInput={(e: Event) => (createForm.value.host = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-size">
                      <FormItem>
                        <FormLabel>存储量</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.size} onInput={(e: Event) => (createForm.value.size = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-tables">
                      <FormItem>
                        <FormLabel>表数量</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.tables} onInput={(e: Event) => (createForm.value.tables = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-retention">
                      <FormItem>
                        <FormLabel>保留策略</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.retention} onInput={(e: Event) => (createForm.value.retention = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField name="create-status">
                    <FormItem>
                      <FormLabel>状态</FormLabel>
                      <FormControl>
                        <Select modelValue={createForm.value.status} onChange={(v: string) => (createForm.value.status = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">在线</SelectItem>
                            <SelectItem value="warning">告警</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-desc">
                    <FormItem>
                      <FormLabel>描述</FormLabel>
                      <FormControl>
                        <Textarea value={createForm.value.desc} onInput={(e: Event) => (createForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createDataSource}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑数据源</DialogTitle>
                <DialogDescription>{`数据源编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-type">
                    <FormItem>
                      <FormLabel>类型</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.type} onInput={(e: Event) => (editForm.value.type = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-host">
                    <FormItem>
                      <FormLabel>地址</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.host} onInput={(e: Event) => (editForm.value.host = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-size">
                    <FormItem>
                      <FormLabel>存储量</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.size} onInput={(e: Event) => (editForm.value.size = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-tables">
                    <FormItem>
                      <FormLabel>表数量</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.tables} onInput={(e: Event) => (editForm.value.tables = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-retention">
                    <FormItem>
                      <FormLabel>保留策略</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.retention} onInput={(e: Event) => (editForm.value.retention = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <FormField name="edit-status">
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <FormControl>
                      <Select modelValue={editForm.value.status} onChange={(v: string) => (editForm.value.status = v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">在线</SelectItem>
                          <SelectItem value="warning">告警</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea value={editForm.value.desc} onInput={(e: Event) => (editForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
              </Form>
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {dataSources.value.map((ds) => (
              <Card key={ds.id} class="transition-colors hover:border-primary/30">
                <CardHeader class="pb-2">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Database class="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle class="text-sm font-medium text-card-foreground">{ds.name}</CardTitle>
                        <Badge variant="outline" class={`mt-0.5 text-[10px] font-mono ${typeColors[ds.type] || ""}`}>
                          {ds.type}
                        </Badge>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <StatusBadge status={ds.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(ds)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(ds.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="pt-0">
                  <p class="mb-3 text-xs text-muted-foreground leading-relaxed">{ds.desc}</p>
                  <div class="flex flex-col gap-1.5 border-t border-border pt-3">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-muted-foreground">{"地址"}</span>
                      <span class="font-mono text-card-foreground">{ds.host}</span>
                    </div>
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-muted-foreground">{"存储用量"}</span>
                      <span class="text-card-foreground">{ds.size}</span>
                    </div>
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-muted-foreground">{"保留策略"}</span>
                      <span class="text-card-foreground">{ds.retention}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
  }
})
</script>

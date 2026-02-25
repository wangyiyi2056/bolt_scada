<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, MoreHorizontal, Settings2, Layers } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
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

type Engineering = {
  id: string
  name: string
  project: string
  type: string
  devices: number
  variables: number
  screens: number
  status: "running" | "stopped" | "pending"
  updated: string
  [key: string]: unknown
}

const initialEngineerings: Engineering[] = [
  { id: "E001", name: "锅炉主控工程", project: "工业锅炉 DCS 系统", type: "DCS", devices: 32, variables: 1024, screens: 8, status: "running", updated: "2026-02-09 14:00" },
  { id: "E002", name: "供水管网 SCADA", project: "智慧水务监控系统", type: "SCADA", devices: 64, variables: 2048, screens: 12, status: "running", updated: "2026-02-09 13:45" },
  { id: "E003", name: "变电站综合监控", project: "电力变电站综合自动化", type: "SCADA", devices: 128, variables: 4096, screens: 20, status: "running", updated: "2026-02-08 16:30" },
  { id: "E004", name: "光伏监控子系统", project: "园区能源管理平台", type: "监控", devices: 48, variables: 512, screens: 5, status: "running", updated: "2026-02-09 10:00" },
  { id: "E005", name: "储能管理子系统", project: "园区能源管理平台", type: "EMS", devices: 24, variables: 384, screens: 4, status: "pending", updated: "2026-02-07 15:20" },
  { id: "E006", name: "充电桩管理子系统", project: "园区能源管理平台", type: "监控", devices: 96, variables: 768, screens: 6, status: "stopped", updated: "2026-01-28 09:15" },
  { id: "E007", name: "AAO 工艺控制", project: "污水处理自控系统", type: "PLC", devices: 48, variables: 640, screens: 7, status: "pending", updated: "2026-02-05 11:00" },
  { id: "E008", name: "洁净室环境监测", project: "制药车间环境监测", type: "监控", devices: 24, variables: 256, screens: 3, status: "running", updated: "2026-02-06 08:30" },
]

const typeColors: Record<string, string> = {
  DCS: "bg-primary/10 text-primary border-primary/20",
  SCADA: "bg-success/10 text-success border-success/20",
  EMS: "bg-warning/10 text-warning border-warning/20",
  PLC: "bg-destructive/10 text-destructive border-destructive/20",
  监控: "bg-muted text-muted-foreground border-border",
}

const engineerings = ref<Engineering[]>(initialEngineerings)
const createOpen = ref(false)
const createForm = ref({ name: "", project: "", type: "SCADA", status: "pending" })
const editOpen = ref(false)
const editForm = ref({ id: "", name: "", project: "", type: "SCADA", status: "running" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextEngineeringId() {
  const maxId = engineerings.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("E", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `E${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toISOString().slice(0, 16).replace("T", " ")
}

function startEdit(e: Engineering) {
  editForm.value = { id: e.id, name: e.name, project: e.project, type: e.type, status: e.status }
  editOpen.value = true
}

function createEngineering() {
  const name = createForm.value.name.trim()
  if (!name) return

  engineerings.value.unshift({
    id: nextEngineeringId(),
    name,
    project: createForm.value.project.trim() || "未分配项目",
    type: createForm.value.type,
    devices: 0,
    variables: 0,
    screens: 0,
    status: createForm.value.status as Engineering["status"],
    updated: now(),
  })
  createForm.value = { name: "", project: "", type: "SCADA", status: "pending" }
  createOpen.value = false
}

function saveEdit() {
  const index = engineerings.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  engineerings.value[index] = {
    ...engineerings.value[index],
    name: editForm.value.name.trim() || engineerings.value[index].name,
    project: editForm.value.project.trim() || "未分配项目",
    type: editForm.value.type,
    status: editForm.value.status as Engineering["status"],
    updated: now(),
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeEngineering(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeEngineering(id: string) {
  engineerings.value = engineerings.value.filter((item) => item.id !== id)
}

function openEngineering(id: string) {
  engineerings.value = engineerings.value.map((item) =>
    item.id === id
      ? { ...item, status: "running", updated: now() }
      : item,
  )
}

function duplicateEngineering(engineering: Engineering) {
  engineerings.value.unshift({
    ...engineering,
    id: nextEngineeringId(),
    name: `${engineering.name} 副本`,
    status: "pending",
    updated: now(),
  })
}

const columns: Column<Engineering>[] = [
  { key: "id", title: "工程 ID", className: "w-[80px] font-mono text-xs" },
  {
    key: "name",
    title: "工程名称",
    render: (e) => (
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-secondary text-muted-foreground">
          <Settings2 class="h-3.5 w-3.5" />
        </div>
        <span class="font-medium text-card-foreground">{e.name}</span>
      </div>
    ),
  },
  { key: "project", title: "所属项目", className: "text-xs" },
  {
    key: "type",
    title: "类型",
    render: (e) => <Badge variant="outline" class={`text-[10px] ${typeColors[e.type] || ""}`}>{e.type}</Badge>,
  },
  { key: "devices", title: "设备数" },
  { key: "variables", title: "变量数" },
  {
    key: "screens",
    title: "画面数",
    render: (e) => (
      <div class="flex items-center gap-1 text-xs">
        <Layers class="h-3 w-3 text-muted-foreground" />
        <span>{e.screens}</span>
      </div>
    ),
  },
  { key: "status", title: "状态", render: (e) => <StatusBadge status={e.status} /> },
  { key: "updated", title: "更新时间", className: "text-xs text-muted-foreground" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (e) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => openEngineering(e.id)}>打开</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => startEdit(e)}>编辑</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => duplicateEngineering(e)}>复制</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(e.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "engineeringPage",
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
    
          <PageHeader title="工程管理" description="管理各项目下的工程配置">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>新建工程</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建工程</DialogTitle>
                  <DialogDescription>补全原来缺失的新增工程弹框内容。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="name">
                    <FormItem>
                      <FormLabel>工程名称</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.name}
                          onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)}
                          placeholder="请输入工程名称"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="project">
                    <FormItem>
                      <FormLabel>所属项目</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.project}
                          onInput={(e: Event) => (createForm.value.project = (e.target as HTMLInputElement).value)}
                          placeholder="请输入所属项目"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="type">
                    <FormItem>
                      <FormLabel>类型</FormLabel>
                      <FormControl>
                        <Select modelValue={createForm.value.type} onChange={(v: string) => (createForm.value.type = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SCADA">SCADA</SelectItem>
                            <SelectItem value="DCS">DCS</SelectItem>
                            <SelectItem value="EMS">EMS</SelectItem>
                            <SelectItem value="PLC">PLC</SelectItem>
                            <SelectItem value="监控">监控</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="status">
                    <FormItem>
                      <FormLabel>初始状态</FormLabel>
                      <FormControl>
                        <Select modelValue={createForm.value.status} onChange={(v: string) => (createForm.value.status = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="running">运行中</SelectItem>
                            <SelectItem value="pending">等待中</SelectItem>
                            <SelectItem value="stopped">已停止</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createEngineering}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑工程</DialogTitle>
                <DialogDescription>{`工程编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>工程名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-project">
                  <FormItem>
                    <FormLabel>所属项目</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.project} onInput={(e: Event) => (editForm.value.project = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-type">
                  <FormItem>
                    <FormLabel>类型</FormLabel>
                    <FormControl>
                      <Select modelValue={editForm.value.type} onChange={(v: string) => (editForm.value.type = v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCADA">SCADA</SelectItem>
                          <SelectItem value="DCS">DCS</SelectItem>
                          <SelectItem value="EMS">EMS</SelectItem>
                          <SelectItem value="PLC">PLC</SelectItem>
                          <SelectItem value="监控">监控</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-status">
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <FormControl>
                      <Select modelValue={editForm.value.status} onChange={(v: string) => (editForm.value.status = v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="running">运行中</SelectItem>
                          <SelectItem value="pending">等待中</SelectItem>
                          <SelectItem value="stopped">已停止</SelectItem>
                        </SelectContent>
                      </Select>
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
    
          <DataTable columns={columns} data={engineerings.value} searchPlaceholder="搜索工程名称、项目..." />
        </div>
      )
  }
})
</script>

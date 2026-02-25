<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, RefreshCw, Server, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
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

type NodeItem = {
  id: string
  name: string
  type: string
  ip: string
  os: string
  cpu: number
  mem: number
  disk: number
  devices: number
  variables: number
  uptime: string
  status: "online" | "warning" | "offline"
}

const initialNodes: NodeItem[] = [
  { id: "N-001", name: "主控节点-01", type: "主控", ip: "10.0.1.10", os: "Linux 5.15", cpu: 32, mem: 58, disk: 45, devices: 12, variables: 1024, uptime: "45 天 8 小时", status: "online" as const },
  { id: "N-002", name: "采集节点-02", type: "采集", ip: "10.0.1.20", os: "Linux 5.15", cpu: 28, mem: 42, disk: 38, devices: 8, variables: 512, uptime: "30 天 12 小时", status: "online" as const },
  { id: "N-003", name: "边缘网关-03", type: "网关", ip: "10.0.2.10", os: "OpenWrt 23", cpu: 78, mem: 85, disk: 72, devices: 6, variables: 256, uptime: "12 天 3 小时", status: "warning" as const },
  { id: "N-004", name: "备用节点-04", type: "备用", ip: "10.0.1.30", os: "Linux 5.15", cpu: 0, mem: 0, disk: 22, devices: 0, variables: 0, uptime: "-", status: "offline" as const },
  { id: "N-005", name: "采集节点-05", type: "采集", ip: "10.0.1.40", os: "Linux 5.15", cpu: 45, mem: 63, disk: 51, devices: 10, variables: 768, uptime: "22 天 6 小时", status: "online" as const },
  { id: "N-006", name: "边缘网关-06", type: "网关", ip: "10.0.2.20", os: "OpenWrt 23", cpu: 55, mem: 60, disk: 48, devices: 4, variables: 128, uptime: "8 天 15 小时", status: "online" as const },
]

const nodes = ref<NodeItem[]>(initialNodes)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({
  name: "",
  type: "采集",
  ip: "",
  os: "Linux 5.15",
  cpu: "0",
  mem: "0",
  disk: "0",
  devices: "0",
  variables: "0",
  uptime: "0 天",
  status: "online",
})
const editForm = ref({
  id: "",
  name: "",
  type: "采集",
  ip: "",
  os: "Linux 5.15",
  cpu: "0",
  mem: "0",
  disk: "0",
  devices: "0",
  variables: "0",
  uptime: "0 天",
  status: "online",
})
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextNodeId() {
  const maxId = nodes.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("N-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `N-${String(maxId + 1).padStart(3, "0")}`
}

function createNode() {
  const name = createForm.value.name.trim()
  if (!name) return
  nodes.value.unshift({
    id: nextNodeId(),
    name,
    type: createForm.value.type,
    ip: createForm.value.ip.trim() || "-",
    os: createForm.value.os.trim() || "-",
    cpu: Number.parseInt(createForm.value.cpu, 10) || 0,
    mem: Number.parseInt(createForm.value.mem, 10) || 0,
    disk: Number.parseInt(createForm.value.disk, 10) || 0,
    devices: Number.parseInt(createForm.value.devices, 10) || 0,
    variables: Number.parseInt(createForm.value.variables, 10) || 0,
    uptime: createForm.value.uptime.trim() || "-",
    status: createForm.value.status as NodeItem["status"],
  })
  createForm.value = {
    name: "",
    type: "采集",
    ip: "",
    os: "Linux 5.15",
    cpu: "0",
    mem: "0",
    disk: "0",
    devices: "0",
    variables: "0",
    uptime: "0 天",
    status: "online",
  }
  createOpen.value = false
}

function startEdit(node: NodeItem) {
  editForm.value = {
    id: node.id,
    name: node.name,
    type: node.type,
    ip: node.ip,
    os: node.os,
    cpu: String(node.cpu),
    mem: String(node.mem),
    disk: String(node.disk),
    devices: String(node.devices),
    variables: String(node.variables),
    uptime: node.uptime,
    status: node.status,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = nodes.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  nodes.value[index] = {
    ...nodes.value[index],
    name: editForm.value.name.trim() || nodes.value[index].name,
    type: editForm.value.type,
    ip: editForm.value.ip.trim() || "-",
    os: editForm.value.os.trim() || "-",
    cpu: Number.parseInt(editForm.value.cpu, 10) || 0,
    mem: Number.parseInt(editForm.value.mem, 10) || 0,
    disk: Number.parseInt(editForm.value.disk, 10) || 0,
    devices: Number.parseInt(editForm.value.devices, 10) || 0,
    variables: Number.parseInt(editForm.value.variables, 10) || 0,
    uptime: editForm.value.uptime.trim() || "-",
    status: editForm.value.status as NodeItem["status"],
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeNode(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeNode(id: string) {
  nodes.value = nodes.value.filter((item) => item.id !== id)
}

function getProgressColor(value: number) {
  if (value >= 80) return "bg-destructive"
  if (value >= 60) return "bg-warning"
  return "bg-primary"
}

export default defineComponent({
  name: "nodesPage",
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
    
          <PageHeader title="节点列表" description="管理和监控所有计算节点与边缘网关">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <RefreshCw class="h-3.5 w-3.5" />
              <span>{"刷新状态"}</span>
            </Button>
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加节点"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增节点</DialogTitle>
                  <DialogDescription>补全节点新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-name">
                      <FormItem>
                        <FormLabel>节点名称</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
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
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-ip">
                      <FormItem>
                        <FormLabel>IP</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.ip} onInput={(e: Event) => (createForm.value.ip = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-os">
                      <FormItem>
                        <FormLabel>操作系统</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.os} onInput={(e: Event) => (createForm.value.os = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-cpu">
                      <FormItem>
                        <FormLabel>CPU%</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.cpu} onInput={(e: Event) => (createForm.value.cpu = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-mem">
                      <FormItem>
                        <FormLabel>内存%</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.mem} onInput={(e: Event) => (createForm.value.mem = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-disk">
                      <FormItem>
                        <FormLabel>磁盘%</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.disk} onInput={(e: Event) => (createForm.value.disk = (e.target as HTMLInputElement).value)} />
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
                            <SelectItem value="offline">离线</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createNode}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑节点</DialogTitle>
                <DialogDescription>{`节点编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-name">
                    <FormItem>
                      <FormLabel>节点名称</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
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
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-ip">
                    <FormItem>
                      <FormLabel>IP</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.ip} onInput={(e: Event) => (editForm.value.ip = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-os">
                    <FormItem>
                      <FormLabel>操作系统</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.os} onInput={(e: Event) => (editForm.value.os = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-cpu">
                    <FormItem>
                      <FormLabel>CPU%</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.cpu} onInput={(e: Event) => (editForm.value.cpu = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-mem">
                    <FormItem>
                      <FormLabel>内存%</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.mem} onInput={(e: Event) => (editForm.value.mem = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-disk">
                    <FormItem>
                      <FormLabel>磁盘%</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.disk} onInput={(e: Event) => (editForm.value.disk = (e.target as HTMLInputElement).value)} />
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
                          <SelectItem value="offline">离线</SelectItem>
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
    
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {nodes.value.map((node) => (
              <Card key={node.id} class="transition-colors hover:border-primary/30">
                <CardHeader class="pb-3">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Server class="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle class="text-sm font-medium text-card-foreground">{node.name}</CardTitle>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span class="font-mono text-[11px] text-muted-foreground">{node.ip}</span>
                          <Badge variant="outline" class="text-[10px]">{node.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <StatusBadge status={node.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(node)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(node.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="flex flex-col gap-2.5">
                    {/* Resource bars */}
                    <div class="flex flex-col gap-2">
                      {[
                        { label: "CPU", value: node.cpu },
                        { label: "内存", value: node.mem },
                        { label: "磁盘", value: node.disk },
                      ].map((r) => (
                        <div key={r.label} class="flex items-center gap-2">
                          <span class="w-8 text-[11px] text-muted-foreground">{r.label}</span>
                          <div class="relative h-1.5 flex-1 rounded-full bg-secondary">
                            <div class={`absolute inset-y-0 left-0 rounded-full ${getProgressColor(r.value)}`} style={{ width: `${r.value}%` }} />
                          </div>
                          <span class="w-8 text-right font-mono text-[11px] text-muted-foreground">{`${r.value}%`}</span>
                        </div>
                      ))}
                    </div>
    
                    {/* Footer info */}
                    <div class="flex items-center justify-between border-t border-border pt-2.5 text-[11px] text-muted-foreground">
                      <span>{`${node.devices} 设备 / ${node.variables} 变量`}</span>
                      <span>{`运行 ${node.uptime}`}</span>
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

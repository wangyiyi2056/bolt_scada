<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Download, Upload, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
import { DataTable, type Column } from "@/components/ui/data-table"
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

type Device = {
  id: string
  name: string
  type: string
  protocol: string
  ip: string
  node: string
  status: "online" | "offline" | "warning" | "error"
  variables: number
  updated: string
  [key: string]: unknown
}

const initialDevices: Device[] = [
  { id: "DEV-001", name: "PLC-Station-01", type: "PLC", protocol: "Modbus TCP", ip: "192.168.1.10", node: "主控节点-01", status: "online", variables: 256, updated: "2026-02-09 14:32" },
  { id: "DEV-002", name: "PLC-Station-02", type: "PLC", protocol: "S7", ip: "192.168.1.11", node: "主控节点-01", status: "online", variables: 512, updated: "2026-02-09 14:32" },
  { id: "DEV-003", name: "RTU-Node-01", type: "RTU", protocol: "Modbus RTU", ip: "192.168.2.20", node: "采集节点-02", status: "online", variables: 64, updated: "2026-02-09 14:30" },
  { id: "DEV-004", name: "RTU-Node-07", type: "RTU", protocol: "Modbus TCP", ip: "192.168.2.27", node: "采集节点-02", status: "offline", variables: 48, updated: "2026-02-09 10:15" },
  { id: "DEV-005", name: "IO-Module-01", type: "IO模块", protocol: "OPC UA", ip: "192.168.3.10", node: "边缘网关-03", status: "online", variables: 32, updated: "2026-02-09 14:32" },
  { id: "DEV-006", name: "IO-Module-11", type: "IO模块", protocol: "OPC UA", ip: "192.168.3.21", node: "边缘网关-03", status: "warning", variables: 32, updated: "2026-02-09 14:28" },
  { id: "DEV-007", name: "HMI-Panel-01", type: "HMI", protocol: "Modbus TCP", ip: "192.168.1.100", node: "主控节点-01", status: "online", variables: 128, updated: "2026-02-09 14:32" },
  { id: "DEV-008", name: "HMI-Panel-02", type: "HMI", protocol: "Modbus TCP", ip: "192.168.1.101", node: "主控节点-01", status: "warning", variables: 128, updated: "2026-02-09 14:31" },
  { id: "DEV-009", name: "Meter-Power-01", type: "仪表", protocol: "MQTT", ip: "192.168.4.10", node: "边缘网关-03", status: "online", variables: 16, updated: "2026-02-09 14:32" },
  { id: "DEV-010", name: "Sensor-Temp-01", type: "传感器", protocol: "MQTT", ip: "192.168.4.20", node: "边缘网关-03", status: "error", variables: 8, updated: "2026-02-09 12:05" },
  { id: "DEV-011", name: "VFD-Pump-01", type: "变频器", protocol: "Modbus RTU", ip: "192.168.2.30", node: "采集节点-02", status: "online", variables: 24, updated: "2026-02-09 14:32" },
  { id: "DEV-012", name: "VFD-Fan-02", type: "变频器", protocol: "Modbus RTU", ip: "192.168.2.31", node: "采集节点-02", status: "online", variables: 24, updated: "2026-02-09 14:32" },
]

const devices = ref<Device[]>(initialDevices)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", type: "PLC", protocol: "Modbus TCP", ip: "", node: "", status: "online", variables: "0" })
const editForm = ref({ id: "", name: "", type: "PLC", protocol: "Modbus TCP", ip: "", node: "", status: "online", variables: "0" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextDeviceId() {
  const maxId = devices.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("DEV-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `DEV-${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toISOString().slice(0, 16).replace("T", " ")
}

function createDevice() {
  const name = createForm.value.name.trim()
  if (!name) return

  devices.value.unshift({
    id: nextDeviceId(),
    name,
    type: createForm.value.type,
    protocol: createForm.value.protocol,
    ip: createForm.value.ip.trim() || "-",
    node: createForm.value.node.trim() || "未分配节点",
    status: createForm.value.status as Device["status"],
    variables: Number.parseInt(createForm.value.variables, 10) || 0,
    updated: now(),
  })
  createForm.value = { name: "", type: "PLC", protocol: "Modbus TCP", ip: "", node: "", status: "online", variables: "0" }
  createOpen.value = false
}

function startEdit(device: Device) {
  editForm.value = {
    id: device.id,
    name: device.name,
    type: device.type,
    protocol: device.protocol,
    ip: device.ip,
    node: device.node,
    status: device.status,
    variables: String(device.variables),
  }
  editOpen.value = true
}

function saveEdit() {
  const index = devices.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  devices.value[index] = {
    ...devices.value[index],
    name: editForm.value.name.trim() || devices.value[index].name,
    type: editForm.value.type,
    protocol: editForm.value.protocol,
    ip: editForm.value.ip.trim() || "-",
    node: editForm.value.node.trim() || "未分配节点",
    status: editForm.value.status as Device["status"],
    variables: Number.parseInt(editForm.value.variables, 10) || 0,
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
  removeDevice(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeDevice(id: string) {
  devices.value = devices.value.filter((item) => item.id !== id)
}

const columns: Column<Device>[] = [
  { key: "id", title: "设备 ID", className: "w-[100px] font-mono" },
  { key: "name", title: "设备名称", render: (d) => <span class="font-medium text-card-foreground">{d.name}</span> },
  {
    key: "type", title: "类型",
    render: (d) => <Badge variant="outline" class="text-xs font-normal">{d.type}</Badge>,
  },
  { key: "protocol", title: "协议" },
  { key: "ip", title: "IP 地址", className: "font-mono" },
  { key: "node", title: "所属节点" },
  {
    key: "status", title: "状态",
    render: (d) => <StatusBadge status={d.status} />,
  },
  { key: "variables", title: "变量数" },
  { key: "updated", title: "更新时间", className: "text-xs text-muted-foreground" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (d) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(d)}>编辑</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(d.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "devicesPage",
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
    
          <PageHeader title="设备列表" description="管理所有已接入的设备及其通信配置">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Upload class="h-3.5 w-3.5" />
              <span>{"导入"}</span>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加设备"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增设备</DialogTitle>
                  <DialogDescription>填写设备基础信息并加入设备列表。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>设备名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-type">
                      <FormItem>
                        <FormLabel>设备类型</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.type} onChange={(v: string) => (createForm.value.type = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PLC">PLC</SelectItem>
                              <SelectItem value="RTU">RTU</SelectItem>
                              <SelectItem value="IO模块">IO模块</SelectItem>
                              <SelectItem value="HMI">HMI</SelectItem>
                              <SelectItem value="仪表">仪表</SelectItem>
                              <SelectItem value="传感器">传感器</SelectItem>
                              <SelectItem value="变频器">变频器</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-protocol">
                      <FormItem>
                        <FormLabel>通信协议</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.protocol} onChange={(v: string) => (createForm.value.protocol = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Modbus TCP">Modbus TCP</SelectItem>
                              <SelectItem value="Modbus RTU">Modbus RTU</SelectItem>
                              <SelectItem value="S7">S7</SelectItem>
                              <SelectItem value="OPC UA">OPC UA</SelectItem>
                              <SelectItem value="MQTT">MQTT</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <FormField name="create-ip">
                    <FormItem>
                      <FormLabel>IP 地址</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.ip} onInput={(e: Event) => (createForm.value.ip = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-node">
                    <FormItem>
                      <FormLabel>所属节点</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.node} onInput={(e: Event) => (createForm.value.node = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-status">
                      <FormItem>
                        <FormLabel>状态</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.status} onChange={(v: string) => (createForm.value.status = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">在线</SelectItem>
                              <SelectItem value="offline">离线</SelectItem>
                              <SelectItem value="warning">告警</SelectItem>
                              <SelectItem value="error">错误</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-variables">
                      <FormItem>
                        <FormLabel>变量数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.variables} onInput={(e: Event) => (createForm.value.variables = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createDevice}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑设备</DialogTitle>
                <DialogDescription>{`设备编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>设备名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-type">
                    <FormItem>
                      <FormLabel>设备类型</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.type} onChange={(v: string) => (editForm.value.type = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PLC">PLC</SelectItem>
                            <SelectItem value="RTU">RTU</SelectItem>
                            <SelectItem value="IO模块">IO模块</SelectItem>
                            <SelectItem value="HMI">HMI</SelectItem>
                            <SelectItem value="仪表">仪表</SelectItem>
                            <SelectItem value="传感器">传感器</SelectItem>
                            <SelectItem value="变频器">变频器</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-protocol">
                    <FormItem>
                      <FormLabel>通信协议</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.protocol} onChange={(v: string) => (editForm.value.protocol = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Modbus TCP">Modbus TCP</SelectItem>
                            <SelectItem value="Modbus RTU">Modbus RTU</SelectItem>
                            <SelectItem value="S7">S7</SelectItem>
                            <SelectItem value="OPC UA">OPC UA</SelectItem>
                            <SelectItem value="MQTT">MQTT</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <FormField name="edit-ip">
                  <FormItem>
                    <FormLabel>IP 地址</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.ip} onInput={(e: Event) => (editForm.value.ip = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-node">
                  <FormItem>
                    <FormLabel>所属节点</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.node} onInput={(e: Event) => (editForm.value.node = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-status">
                    <FormItem>
                      <FormLabel>状态</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.status} onChange={(v: string) => (editForm.value.status = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">在线</SelectItem>
                            <SelectItem value="offline">离线</SelectItem>
                            <SelectItem value="warning">告警</SelectItem>
                            <SelectItem value="error">错误</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-variables">
                    <FormItem>
                      <FormLabel>变量数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.variables} onInput={(e: Event) => (editForm.value.variables = (e.target as HTMLInputElement).value)} />
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
    
          <DataTable columns={columns} data={devices.value} searchPlaceholder="搜索设备名称、IP、协议..." />
        </div>
      )
  }
})
</script>

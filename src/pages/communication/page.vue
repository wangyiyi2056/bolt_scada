<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

type ProtocolItem = {
  id: string
  name: string
  version: string
  devices: number
  channels: number
  status: "online" | "warning" | "stopped"
  desc: string
}

const initialProtocols: ProtocolItem[] = [
  { id: "PT-001", name: "Modbus TCP", version: "1.1b3", devices: 45, channels: 8, status: "online" as const, desc: "工业标准串行通信协议" },
  { id: "PT-002", name: "Modbus RTU", version: "1.1b3", devices: 18, channels: 4, status: "online" as const, desc: "基于 RS485 的串行通信" },
  { id: "PT-003", name: "OPC UA", version: "1.05", devices: 12, channels: 3, status: "online" as const, desc: "开放平台通信统一架构" },
  { id: "PT-004", name: "MQTT", version: "3.1.1", devices: 24, channels: 2, status: "online" as const, desc: "轻量级消息传输协议" },
  { id: "PT-005", name: "Siemens S7", version: "S7-300/400", devices: 8, channels: 2, status: "online" as const, desc: "西门子 S7 系列专有协议" },
  { id: "PT-006", name: "BACnet/IP", version: "Rev.14", devices: 6, channels: 1, status: "warning" as const, desc: "楼宇自动化与控制网络" },
  { id: "PT-007", name: "IEC 61850", version: "Ed.2", devices: 0, channels: 0, status: "stopped" as const, desc: "电力系统通信标准" },
  { id: "PT-008", name: "DNP3", version: "3.0", devices: 0, channels: 0, status: "stopped" as const, desc: "分布式网络协议" },
]

const protocols = ref<ProtocolItem[]>(initialProtocols)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", version: "", devices: "0", channels: "0", status: "online", desc: "" })
const editForm = ref({ id: "", name: "", version: "", devices: "0", channels: "0", status: "online", desc: "" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextProtocolId() {
  const maxId = protocols.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("PT-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `PT-${String(maxId + 1).padStart(3, "0")}`
}

function createProtocol() {
  const name = createForm.value.name.trim()
  if (!name) return
  protocols.value.unshift({
    id: nextProtocolId(),
    name,
    version: createForm.value.version.trim() || "-",
    devices: Number.parseInt(createForm.value.devices, 10) || 0,
    channels: Number.parseInt(createForm.value.channels, 10) || 0,
    status: createForm.value.status as ProtocolItem["status"],
    desc: createForm.value.desc.trim() || "未填写描述",
  })
  createForm.value = { name: "", version: "", devices: "0", channels: "0", status: "online", desc: "" }
  createOpen.value = false
}

function startEdit(protocol: ProtocolItem) {
  editForm.value = {
    id: protocol.id,
    name: protocol.name,
    version: protocol.version,
    devices: String(protocol.devices),
    channels: String(protocol.channels),
    status: protocol.status,
    desc: protocol.desc,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = protocols.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  protocols.value[index] = {
    ...protocols.value[index],
    version: editForm.value.version.trim() || "-",
    devices: Number.parseInt(editForm.value.devices, 10) || 0,
    channels: Number.parseInt(editForm.value.channels, 10) || 0,
    status: editForm.value.status as ProtocolItem["status"],
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
  removeProtocol(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeProtocol(name: string) {
  protocols.value = protocols.value.filter((item) => item.id !== name)
}

export default defineComponent({
  name: "communicationPage",
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
    
          <PageHeader title="协议管理" description="配置和管理通信协议及驱动">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加协议"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增协议</DialogTitle>
                  <DialogDescription>补全协议新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-name">
                      <FormItem>
                        <FormLabel>协议名称</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-version">
                      <FormItem>
                        <FormLabel>版本</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.version} onInput={(e: Event) => (createForm.value.version = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-devices">
                      <FormItem>
                        <FormLabel>设备数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.devices} onInput={(e: Event) => (createForm.value.devices = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-channels">
                      <FormItem>
                        <FormLabel>通道数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.channels} onInput={(e: Event) => (createForm.value.channels = (e.target as HTMLInputElement).value)} />
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
                            <SelectItem value="stopped">停止</SelectItem>
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
                  <Button onClick={createProtocol}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑协议</DialogTitle>
                <DialogDescription>{`协议编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-version">
                    <FormItem>
                      <FormLabel>版本</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.version} onInput={(e: Event) => (editForm.value.version = (e.target as HTMLInputElement).value)} />
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
                            <SelectItem value="online">在线</SelectItem>
                            <SelectItem value="warning">告警</SelectItem>
                            <SelectItem value="stopped">停止</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-devices">
                    <FormItem>
                      <FormLabel>设备数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.devices} onInput={(e: Event) => (editForm.value.devices = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-channels">
                    <FormItem>
                      <FormLabel>通道数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.channels} onInput={(e: Event) => (editForm.value.channels = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
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
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {protocols.value.map((p) => (
              <Card key={p.id} class="group transition-colors hover:border-primary/30">
                <CardHeader class="pb-2">
                  <div class="flex items-start justify-between">
                    <CardTitle class="text-sm font-medium text-card-foreground">{p.name}</CardTitle>
                    <div class="flex items-center gap-1">
                      <StatusBadge status={p.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(p)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(p.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p class="text-xs text-muted-foreground">{p.desc}</p>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="flex items-center gap-2 border-t border-border pt-3">
                    <Badge variant="outline" class="text-[10px] font-mono">{p.version}</Badge>
                    <span class="text-xs text-muted-foreground">{`${p.devices} 设备`}</span>
                    <span class="text-xs text-muted-foreground">{`${p.channels} 通道`}</span>
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

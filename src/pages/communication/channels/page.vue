<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Settings2, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
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

type Channel = {
  id: string
  name: string
  protocol: string
  type: string
  address: string
  port: number | string
  devices: number
  pollRate: string
  timeout: string
  retries: number
  status: "online" | "offline" | "warning"
  [key: string]: unknown
}

const initialChannels: Channel[] = [
  { id: "CH-001", name: "Modbus TCP 通道 1", protocol: "Modbus TCP", type: "TCP/IP", address: "192.168.1.0/24", port: 502, devices: 6, pollRate: "1000ms", timeout: "3000ms", retries: 3, status: "online" },
  { id: "CH-002", name: "Modbus TCP 通道 2", protocol: "Modbus TCP", type: "TCP/IP", address: "192.168.2.0/24", port: 502, devices: 4, pollRate: "1000ms", timeout: "3000ms", retries: 3, status: "online" },
  { id: "CH-003", name: "S7 通道", protocol: "Siemens S7", type: "TCP/IP", address: "192.168.1.11", port: 102, devices: 2, pollRate: "500ms", timeout: "5000ms", retries: 2, status: "online" },
  { id: "CH-004", name: "OPC UA Server 1", protocol: "OPC UA", type: "TCP/IP", address: "10.0.1.100", port: 4840, devices: 3, pollRate: "1000ms", timeout: "5000ms", retries: 3, status: "online" },
  { id: "CH-005", name: "MQTT Broker", protocol: "MQTT", type: "TCP/IP", address: "10.0.1.102", port: 1883, devices: 8, pollRate: "发布订阅", timeout: "10000ms", retries: 5, status: "warning" },
  { id: "CH-006", name: "串口通道 COM1", protocol: "Modbus RTU", type: "Serial", address: "/dev/ttyS0", port: "9600,N,8,1", devices: 4, pollRate: "2000ms", timeout: "3000ms", retries: 3, status: "online" },
  { id: "CH-007", name: "串口通道 COM2", protocol: "Modbus RTU", type: "Serial", address: "/dev/ttyS1", port: "19200,N,8,1", devices: 2, pollRate: "1000ms", timeout: "3000ms", retries: 3, status: "online" },
  { id: "CH-008", name: "BACnet/IP 通道", protocol: "BACnet/IP", type: "UDP", address: "192.168.3.0/24", port: 47808, devices: 3, pollRate: "5000ms", timeout: "5000ms", retries: 2, status: "warning" },
]

const channels = ref<Channel[]>(initialChannels)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({
  name: "",
  protocol: "Modbus TCP",
  type: "TCP/IP",
  address: "",
  port: "502",
  devices: "0",
  pollRate: "1000ms",
  timeout: "3000ms",
  retries: "3",
  status: "online",
})
const editForm = ref({
  id: "",
  name: "",
  protocol: "Modbus TCP",
  type: "TCP/IP",
  address: "",
  port: "502",
  devices: "0",
  pollRate: "1000ms",
  timeout: "3000ms",
  retries: "3",
  status: "online",
})
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextChannelId() {
  const maxId = channels.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("CH-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `CH-${String(maxId + 1).padStart(3, "0")}`
}

function createChannel() {
  const name = createForm.value.name.trim()
  if (!name) return

  channels.value.unshift({
    id: nextChannelId(),
    name,
    protocol: createForm.value.protocol,
    type: createForm.value.type,
    address: createForm.value.address.trim() || "-",
    port: createForm.value.port.trim() || "-",
    devices: Number.parseInt(createForm.value.devices, 10) || 0,
    pollRate: createForm.value.pollRate.trim() || "-",
    timeout: createForm.value.timeout.trim() || "-",
    retries: Number.parseInt(createForm.value.retries, 10) || 0,
    status: createForm.value.status as Channel["status"],
  })
  createForm.value = {
    name: "",
    protocol: "Modbus TCP",
    type: "TCP/IP",
    address: "",
    port: "502",
    devices: "0",
    pollRate: "1000ms",
    timeout: "3000ms",
    retries: "3",
    status: "online",
  }
  createOpen.value = false
}

function startEdit(channel: Channel) {
  editForm.value = {
    id: channel.id,
    name: channel.name,
    protocol: channel.protocol,
    type: channel.type,
    address: channel.address,
    port: String(channel.port),
    devices: String(channel.devices),
    pollRate: channel.pollRate,
    timeout: channel.timeout,
    retries: String(channel.retries),
    status: channel.status,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = channels.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  channels.value[index] = {
    ...channels.value[index],
    name: editForm.value.name.trim() || channels.value[index].name,
    protocol: editForm.value.protocol,
    type: editForm.value.type,
    address: editForm.value.address.trim() || "-",
    port: editForm.value.port.trim() || "-",
    devices: Number.parseInt(editForm.value.devices, 10) || 0,
    pollRate: editForm.value.pollRate.trim() || "-",
    timeout: editForm.value.timeout.trim() || "-",
    retries: Number.parseInt(editForm.value.retries, 10) || 0,
    status: editForm.value.status as Channel["status"],
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeChannel(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeChannel(id: string) {
  channels.value = channels.value.filter((item) => item.id !== id)
}

const columns: Column<Channel>[] = [
  { key: "id", title: "通道 ID", className: "w-[80px] font-mono text-xs" },
  { key: "name", title: "通道名称", render: (c) => <span class="font-medium text-card-foreground">{c.name}</span> },
  { key: "protocol", title: "协议", render: (c) => <Badge variant="outline" class="font-mono text-[10px]">{c.protocol}</Badge> },
  { key: "type", title: "类型" },
  { key: "address", title: "地址", className: "font-mono text-xs" },
  { key: "port", title: "端口/参数", className: "font-mono text-xs" },
  { key: "devices", title: "设备数" },
  { key: "pollRate", title: "采集周期", className: "text-xs" },
  { key: "status", title: "状态", render: (c) => <StatusBadge status={c.status} /> },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (c) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(c)}>编辑</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(c.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "channelsPage",
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
    
          <PageHeader title="通道配置" description="管理通信通道和连接参数">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加通道"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增通道</DialogTitle>
                  <DialogDescription>填写通信通道参数并保存。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>通道名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-protocol">
                      <FormItem>
                        <FormLabel>协议</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.protocol} onInput={(e: Event) => (createForm.value.protocol = (e.target as HTMLInputElement).value)} />
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
                    <FormField name="create-address">
                      <FormItem>
                        <FormLabel>地址</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.address} onInput={(e: Event) => (createForm.value.address = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-port">
                      <FormItem>
                        <FormLabel>端口/参数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.port} onInput={(e: Event) => (createForm.value.port = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-4 gap-3">
                    <FormField name="create-devices">
                      <FormItem>
                        <FormLabel>设备数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.devices} onInput={(e: Event) => (createForm.value.devices = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-poll">
                      <FormItem>
                        <FormLabel>采集周期</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.pollRate} onInput={(e: Event) => (createForm.value.pollRate = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-timeout">
                      <FormItem>
                        <FormLabel>超时</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.timeout} onInput={(e: Event) => (createForm.value.timeout = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-retries">
                      <FormItem>
                        <FormLabel>重试</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.retries} onInput={(e: Event) => (createForm.value.retries = (e.target as HTMLInputElement).value)} />
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
                            <SelectItem value="offline">离线</SelectItem>
                            <SelectItem value="warning">告警</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createChannel}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑通道</DialogTitle>
                <DialogDescription>{`通道编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>通道名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-protocol">
                    <FormItem>
                      <FormLabel>协议</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.protocol} onInput={(e: Event) => (editForm.value.protocol = (e.target as HTMLInputElement).value)} />
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
                  <FormField name="edit-address">
                    <FormItem>
                      <FormLabel>地址</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.address} onInput={(e: Event) => (editForm.value.address = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-port">
                    <FormItem>
                      <FormLabel>端口/参数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.port} onInput={(e: Event) => (editForm.value.port = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-4 gap-3">
                  <FormField name="edit-devices">
                    <FormItem>
                      <FormLabel>设备数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.devices} onInput={(e: Event) => (editForm.value.devices = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-poll">
                    <FormItem>
                      <FormLabel>采集周期</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.pollRate} onInput={(e: Event) => (editForm.value.pollRate = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-timeout">
                    <FormItem>
                      <FormLabel>超时</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.timeout} onInput={(e: Event) => (editForm.value.timeout = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-retries">
                    <FormItem>
                      <FormLabel>重试</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.retries} onInput={(e: Event) => (editForm.value.retries = (e.target as HTMLInputElement).value)} />
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
                          <SelectItem value="offline">离线</SelectItem>
                          <SelectItem value="warning">告警</SelectItem>
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
    
          <DataTable columns={columns} data={channels.value} searchPlaceholder="搜索通道名称、协议..." />
        </div>
      )
  }
})
</script>

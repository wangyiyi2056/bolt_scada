<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Radio, Wifi, ArrowUpDown, MoreHorizontal } from "lucide-vue-next"
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

type Gateway = {
  id: string
  name: string
  model: string
  firmware: string
  ip: string
  uplink: string
  status: "online" | "warning" | "offline"
  devices: number
  protocols: string[]
  uptime: string
  traffic: { up: string; down: string }
  signals: { rssi: number; snr: number } | null
}

const initialGateways: Gateway[] = [
  {
    id: "GW-001", name: "边缘网关-03", model: "EG-3000", firmware: "v2.4.1",
    ip: "10.0.2.10", uplink: "4G/LTE", status: "warning" as const,
    devices: 4, protocols: ["OPC UA", "MQTT"], uptime: "12 天 3 小时",
    traffic: { up: "1.8 MB/s", down: "3.2 MB/s" },
    signals: { rssi: -67, snr: 12.5 },
  },
  {
    id: "GW-002", name: "边缘网关-06", model: "EG-3000", firmware: "v2.4.1",
    ip: "10.0.2.20", uplink: "以太网", status: "online" as const,
    devices: 4, protocols: ["Modbus TCP", "BACnet/IP"], uptime: "8 天 15 小时",
    traffic: { up: "0.9 MB/s", down: "2.1 MB/s" },
    signals: null,
  },
  {
    id: "GW-003", name: "远程网关-07", model: "EG-2000", firmware: "v2.3.8",
    ip: "10.0.3.10", uplink: "4G/LTE", status: "online" as const,
    devices: 3, protocols: ["Modbus RTU", "MQTT"], uptime: "5 天 22 小时",
    traffic: { up: "0.5 MB/s", down: "1.2 MB/s" },
    signals: { rssi: -72, snr: 10.2 },
  },
  {
    id: "GW-004", name: "远程网关-08", model: "EG-1000", firmware: "v2.2.5",
    ip: "10.0.3.20", uplink: "WiFi", status: "offline" as const,
    devices: 2, protocols: ["Modbus RTU"], uptime: "-",
    traffic: { up: "0 B/s", down: "0 B/s" },
    signals: null,
  },
]

const gateways = ref<Gateway[]>(initialGateways)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({
  name: "",
  model: "",
  firmware: "",
  ip: "",
  uplink: "以太网",
  status: "online",
  devices: "0",
  protocols: "",
  uptime: "0 天",
  upTraffic: "0 B/s",
  downTraffic: "0 B/s",
})
const editForm = ref({
  id: "",
  name: "",
  model: "",
  firmware: "",
  ip: "",
  uplink: "以太网",
  status: "online",
  devices: "0",
  protocols: "",
  uptime: "0 天",
  upTraffic: "0 B/s",
  downTraffic: "0 B/s",
})
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextGatewayId() {
  const maxId = gateways.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("GW-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `GW-${String(maxId + 1).padStart(3, "0")}`
}

function parseProtocols(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function createGateway() {
  const name = createForm.value.name.trim()
  if (!name) return
  gateways.value.unshift({
    id: nextGatewayId(),
    name,
    model: createForm.value.model.trim() || "-",
    firmware: createForm.value.firmware.trim() || "-",
    ip: createForm.value.ip.trim() || "-",
    uplink: createForm.value.uplink,
    status: createForm.value.status as Gateway["status"],
    devices: Number.parseInt(createForm.value.devices, 10) || 0,
    protocols: parseProtocols(createForm.value.protocols),
    uptime: createForm.value.uptime.trim() || "-",
    traffic: { up: createForm.value.upTraffic.trim() || "0 B/s", down: createForm.value.downTraffic.trim() || "0 B/s" },
    signals: null,
  })
  createForm.value = {
    name: "",
    model: "",
    firmware: "",
    ip: "",
    uplink: "以太网",
    status: "online",
    devices: "0",
    protocols: "",
    uptime: "0 天",
    upTraffic: "0 B/s",
    downTraffic: "0 B/s",
  }
  createOpen.value = false
}

function startEdit(gateway: Gateway) {
  editForm.value = {
    id: gateway.id,
    name: gateway.name,
    model: gateway.model,
    firmware: gateway.firmware,
    ip: gateway.ip,
    uplink: gateway.uplink,
    status: gateway.status,
    devices: String(gateway.devices),
    protocols: gateway.protocols.join(", "),
    uptime: gateway.uptime,
    upTraffic: gateway.traffic.up,
    downTraffic: gateway.traffic.down,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = gateways.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  gateways.value[index] = {
    ...gateways.value[index],
    name: editForm.value.name.trim() || gateways.value[index].name,
    model: editForm.value.model.trim() || "-",
    firmware: editForm.value.firmware.trim() || "-",
    ip: editForm.value.ip.trim() || "-",
    uplink: editForm.value.uplink,
    status: editForm.value.status as Gateway["status"],
    devices: Number.parseInt(editForm.value.devices, 10) || 0,
    protocols: parseProtocols(editForm.value.protocols),
    uptime: editForm.value.uptime.trim() || "-",
    traffic: { up: editForm.value.upTraffic.trim() || "0 B/s", down: editForm.value.downTraffic.trim() || "0 B/s" },
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeGateway(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeGateway(id: string) {
  gateways.value = gateways.value.filter((item) => item.id !== id)
}

export default defineComponent({
  name: "gatewayPage",
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
    
          <PageHeader title="边缘网关" description="管理边缘计算网关设备">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加网关"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增网关</DialogTitle>
                  <DialogDescription>补全网关新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-name">
                      <FormItem>
                        <FormLabel>网关名称</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-model">
                      <FormItem>
                        <FormLabel>型号</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.model} onInput={(e: Event) => (createForm.value.model = (e.target as HTMLInputElement).value)} />
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
                    <FormField name="create-firmware">
                      <FormItem>
                        <FormLabel>固件</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.firmware} onInput={(e: Event) => (createForm.value.firmware = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-uplink">
                      <FormItem>
                        <FormLabel>上行链路</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.uplink} onInput={(e: Event) => (createForm.value.uplink = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-devices">
                      <FormItem>
                        <FormLabel>设备数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.devices} onInput={(e: Event) => (createForm.value.devices = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
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
                  </div>
                  <FormField name="create-protocols">
                    <FormItem>
                      <FormLabel>协议（逗号分隔）</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.protocols} onInput={(e: Event) => (createForm.value.protocols = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createGateway}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑网关</DialogTitle>
                <DialogDescription>{`网关编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-name">
                    <FormItem>
                      <FormLabel>网关名称</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-model">
                    <FormItem>
                      <FormLabel>型号</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.model} onInput={(e: Event) => (editForm.value.model = (e.target as HTMLInputElement).value)} />
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
                  <FormField name="edit-firmware">
                    <FormItem>
                      <FormLabel>固件</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.firmware} onInput={(e: Event) => (editForm.value.firmware = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-uplink">
                    <FormItem>
                      <FormLabel>上行链路</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.uplink} onInput={(e: Event) => (editForm.value.uplink = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-devices">
                    <FormItem>
                      <FormLabel>设备数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.devices} onInput={(e: Event) => (editForm.value.devices = (e.target as HTMLInputElement).value)} />
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
                            <SelectItem value="offline">离线</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <FormField name="edit-protocols">
                  <FormItem>
                    <FormLabel>协议（逗号分隔）</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.protocols} onInput={(e: Event) => (editForm.value.protocols = (e.target as HTMLInputElement).value)} />
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
    
          <div class="grid gap-4 lg:grid-cols-2">
            {gateways.value.map((gw) => (
              <Card key={gw.id} class="transition-colors hover:border-primary/30">
                <CardHeader class="pb-3">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Radio class="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle class="text-sm font-medium text-card-foreground">{gw.name}</CardTitle>
                        <div class="mt-0.5 flex items-center gap-2">
                          <span class="font-mono text-[11px] text-muted-foreground">{gw.ip}</span>
                          <Badge variant="outline" class="text-[10px]">{gw.model}</Badge>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <StatusBadge status={gw.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(gw)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(gw.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="flex flex-col gap-2 text-[11px]">
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"上行链路"}</span>
                      <div class="flex items-center gap-1.5">
                        <Wifi class="h-3 w-3 text-muted-foreground" />
                        <span class="text-card-foreground">{gw.uplink}</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"固件版本"}</span>
                      <span class="font-mono text-card-foreground">{gw.firmware}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"支持协议"}</span>
                      <div class="flex items-center gap-1">
                        {gw.protocols.map((p) => (
                          <Badge key={p} variant="outline" class="text-[9px] font-mono">{p}</Badge>
                        ))}
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"接入设备"}</span>
                      <span class="text-card-foreground">{`${gw.devices} 台`}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"流量"}</span>
                      <div class="flex items-center gap-1.5">
                        <ArrowUpDown class="h-3 w-3 text-muted-foreground" />
                        <span class="font-mono text-card-foreground">{`${gw.traffic.up} / ${gw.traffic.down}`}</span>
                      </div>
                    </div>
                    {gw.signals && (
                      <div class="flex items-center justify-between">
                        <span class="text-muted-foreground">{"信号"}</span>
                        <span class="font-mono text-card-foreground">{`RSSI ${gw.signals.rssi}dBm / SNR ${gw.signals.snr}dB`}</span>
                      </div>
                    )}
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"运行时间"}</span>
                      <span class="text-card-foreground">{gw.uptime}</span>
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

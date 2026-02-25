<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Download, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

type Var = {
  id: string
  name: string
  device: string
  address: string
  dataType: string
  rw: string
  value: string
  quality: string
  group: string
  updated: string
  [key: string]: unknown
}

const initialVariables: Var[] = [
  { id: "V001", name: "锅炉出口温度", device: "PLC-Station-01", address: "40001", dataType: "Float32", rw: "RO", value: "285.6", quality: "Good", group: "温度", updated: "14:32:01" },
  { id: "V002", name: "锅炉出口压力", device: "PLC-Station-01", address: "40003", dataType: "Float32", rw: "RO", value: "1.82", quality: "Good", group: "压力", updated: "14:32:01" },
  { id: "V003", name: "给水流量", device: "PLC-Station-01", address: "40005", dataType: "Float32", rw: "RO", value: "120.5", quality: "Good", group: "流量", updated: "14:32:01" },
  { id: "V004", name: "引风机频率", device: "VFD-Fan-02", address: "40010", dataType: "UInt16", rw: "RW", value: "42", quality: "Good", group: "控制", updated: "14:32:00" },
  { id: "V005", name: "烟气含氧量", device: "Sensor-Temp-01", address: "30001", dataType: "Float32", rw: "RO", value: "-", quality: "Bad", group: "分析", updated: "12:05:30" },
  { id: "V006", name: "给水阀开度", device: "PLC-Station-02", address: "40020", dataType: "Float32", rw: "RW", value: "65.2", quality: "Good", group: "控制", updated: "14:32:01" },
  { id: "V007", name: "环境温度", device: "IO-Module-01", address: "30010", dataType: "Float32", rw: "RO", value: "22.8", quality: "Good", group: "温度", updated: "14:32:00" },
  { id: "V008", name: "电网频率", device: "Meter-Power-01", address: "30100", dataType: "Float32", rw: "RO", value: "50.01", quality: "Good", group: "电力", updated: "14:32:01" },
  { id: "V009", name: "有功功率", device: "Meter-Power-01", address: "30102", dataType: "Float32", rw: "RO", value: "1250.8", quality: "Good", group: "电力", updated: "14:32:01" },
  { id: "V010", name: "液位高度", device: "RTU-Node-01", address: "40050", dataType: "Float32", rw: "RO", value: "3.45", quality: "Good", group: "液位", updated: "14:30:55" },
  { id: "V011", name: "进水泵运行状态", device: "VFD-Pump-01", address: "10001", dataType: "Bool", rw: "RO", value: "1", quality: "Good", group: "状态", updated: "14:32:01" },
  { id: "V012", name: "排放阀位", device: "PLC-Station-02", address: "40025", dataType: "Float32", rw: "RW", value: "0.0", quality: "Good", group: "控制", updated: "14:32:01" },
]

const variables = ref<Var[]>(initialVariables)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", device: "", address: "", dataType: "Float32", rw: "RO", value: "0", quality: "Good", group: "温度" })
const editForm = ref({ id: "", name: "", device: "", address: "", dataType: "Float32", rw: "RO", value: "0", quality: "Good", group: "温度" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextVariableId() {
  const maxId = variables.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("V", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `V${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toTimeString().slice(0, 8)
}

function createVariable() {
  const name = createForm.value.name.trim()
  if (!name) return

  variables.value.unshift({
    id: nextVariableId(),
    name,
    device: createForm.value.device.trim() || "未绑定设备",
    address: createForm.value.address.trim() || "-",
    dataType: createForm.value.dataType,
    rw: createForm.value.rw,
    value: createForm.value.value.trim() || "0",
    quality: createForm.value.quality,
    group: createForm.value.group.trim() || "默认",
    updated: now(),
  })
  createForm.value = { name: "", device: "", address: "", dataType: "Float32", rw: "RO", value: "0", quality: "Good", group: "温度" }
  createOpen.value = false
}

function startEdit(variable: Var) {
  editForm.value = {
    id: variable.id,
    name: variable.name,
    device: variable.device,
    address: variable.address,
    dataType: variable.dataType,
    rw: variable.rw,
    value: variable.value,
    quality: variable.quality,
    group: variable.group,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = variables.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  variables.value[index] = {
    ...variables.value[index],
    name: editForm.value.name.trim() || variables.value[index].name,
    device: editForm.value.device.trim() || "未绑定设备",
    address: editForm.value.address.trim() || "-",
    dataType: editForm.value.dataType,
    rw: editForm.value.rw,
    value: editForm.value.value.trim() || "0",
    quality: editForm.value.quality,
    group: editForm.value.group.trim() || "默认",
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
  removeVariable(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeVariable(id: string) {
  variables.value = variables.value.filter((item) => item.id !== id)
}

const columns: Column<Var>[] = [
  { key: "id", title: "变量 ID", className: "w-[80px] font-mono text-xs" },
  { key: "name", title: "变量名称", render: (v) => <span class="font-medium text-card-foreground">{v.name}</span> },
  { key: "device", title: "所属设备", className: "text-xs" },
  { key: "address", title: "地址", className: "font-mono text-xs" },
  {
    key: "dataType", title: "数据类型",
    render: (v) => <Badge variant="outline" class="text-xs font-normal font-mono">{v.dataType}</Badge>,
  },
  {
    key: "rw", title: "读写",
    render: (v) => (
      <Badge variant={v.rw === "RW" ? "default" : "secondary"} class="text-[10px]">
        {v.rw}
      </Badge>
    ),
  },
  {
    key: "value", title: "当前值",
    render: (v) => (
      <span class={`font-mono text-xs font-medium ${v.quality === "Bad" ? "text-destructive" : "text-card-foreground"}`}>
        {v.value}
      </span>
    ),
  },
  {
    key: "quality", title: "质量",
    render: (v) => (
      <div class="flex items-center gap-1.5">
        <div class={`h-1.5 w-1.5 rounded-full ${v.quality === "Good" ? "bg-success" : "bg-destructive"}`} />
        <span class="text-xs">{v.quality}</span>
      </div>
    ),
  },
  {
    key: "group", title: "分组",
    render: (v) => <Badge variant="outline" class="text-xs font-normal">{v.group}</Badge>,
  },
  { key: "updated", title: "更新时间", className: "font-mono text-xs text-muted-foreground" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (v) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(v)}>编辑</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(v.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "variablesPage",
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
    
          <PageHeader title="变量列表" description="查看和管理所有数据采集变量">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导出"}</span>
            </Button>
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"添加变量"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增变量</DialogTitle>
                  <DialogDescription>创建新的采集变量并加入变量列表。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>变量名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-device">
                      <FormItem>
                        <FormLabel>所属设备</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.device} onInput={(e: Event) => (createForm.value.device = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-address">
                      <FormItem>
                        <FormLabel>变量地址</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.address} onInput={(e: Event) => (createForm.value.address = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-type">
                      <FormItem>
                        <FormLabel>数据类型</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.dataType} onChange={(v: string) => (createForm.value.dataType = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Float32">Float32</SelectItem>
                              <SelectItem value="UInt16">UInt16</SelectItem>
                              <SelectItem value="Int32">Int32</SelectItem>
                              <SelectItem value="Bool">Bool</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-rw">
                      <FormItem>
                        <FormLabel>读写属性</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.rw} onChange={(v: string) => (createForm.value.rw = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="RO">RO</SelectItem>
                              <SelectItem value="RW">RW</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-quality">
                      <FormItem>
                        <FormLabel>质量</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.quality} onChange={(v: string) => (createForm.value.quality = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Bad">Bad</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-value">
                      <FormItem>
                        <FormLabel>初始值</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.value} onInput={(e: Event) => (createForm.value.value = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-group">
                      <FormItem>
                        <FormLabel>变量分组</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.group} onInput={(e: Event) => (createForm.value.group = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createVariable}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑变量</DialogTitle>
                <DialogDescription>{`变量编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>变量名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-device">
                    <FormItem>
                      <FormLabel>所属设备</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.device} onInput={(e: Event) => (editForm.value.device = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-address">
                    <FormItem>
                      <FormLabel>变量地址</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.address} onInput={(e: Event) => (editForm.value.address = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-type">
                    <FormItem>
                      <FormLabel>数据类型</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.dataType} onChange={(v: string) => (editForm.value.dataType = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Float32">Float32</SelectItem>
                            <SelectItem value="UInt16">UInt16</SelectItem>
                            <SelectItem value="Int32">Int32</SelectItem>
                            <SelectItem value="Bool">Bool</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-rw">
                    <FormItem>
                      <FormLabel>读写属性</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.rw} onChange={(v: string) => (editForm.value.rw = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RO">RO</SelectItem>
                            <SelectItem value="RW">RW</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-quality">
                    <FormItem>
                      <FormLabel>质量</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.quality} onChange={(v: string) => (editForm.value.quality = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Bad">Bad</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-value">
                    <FormItem>
                      <FormLabel>当前值</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.value} onInput={(e: Event) => (editForm.value.value = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-group">
                    <FormItem>
                      <FormLabel>变量分组</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.group} onInput={(e: Event) => (editForm.value.group = (e.target as HTMLInputElement).value)} />
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
    
          <DataTable columns={columns} data={variables.value} searchPlaceholder="搜索变量名称、设备、地址..." />
        </div>
      )
  }
})
</script>

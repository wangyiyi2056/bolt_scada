<script lang="tsx">
import { defineComponent } from "vue"
import { computed, ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Filter, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
import { DataTable, type Column } from "@/components/data-table"
import { Card, CardContent } from "@/components/ui/card"
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

type AlarmRule = {
  id: string
  name: string
  variable: string
  condition: string
  threshold: string
  level: string
  enabled: boolean
  triggerCount: number
  lastTriggered: string
  [key: string]: unknown
}

const initialAlarmRules: AlarmRule[] = [
  { id: "AR-001", name: "锅炉出口超温", variable: "锅炉出口温度", condition: ">", threshold: "350 C", level: "紧急", enabled: true, triggerCount: 3, lastTriggered: "2026-02-09 09:15" },
  { id: "AR-002", name: "锅炉超压", variable: "锅炉出口压力", condition: ">", threshold: "2.5 MPa", level: "紧急", enabled: true, triggerCount: 1, lastTriggered: "2026-02-08 16:42" },
  { id: "AR-003", name: "给水流量偏低", variable: "给水流量", condition: "<", threshold: "80 t/h", level: "重要", enabled: true, triggerCount: 5, lastTriggered: "2026-02-09 11:30" },
  { id: "AR-004", name: "引风机频率异常", variable: "引风机频率", condition: ">", threshold: "48 Hz", level: "次要", enabled: true, triggerCount: 12, lastTriggered: "2026-02-09 14:05" },
  { id: "AR-005", name: "含氧量超标", variable: "烟气含氧量", condition: ">", threshold: "8 %", level: "重要", enabled: true, triggerCount: 0, lastTriggered: "-" },
  { id: "AR-006", name: "通信中断检测", variable: "-", condition: "Timeout", threshold: "30s", level: "紧急", enabled: true, triggerCount: 8, lastTriggered: "2026-02-09 10:15" },
  { id: "AR-007", name: "液位高报", variable: "液位高度", condition: ">", threshold: "4.5 m", level: "重要", enabled: true, triggerCount: 2, lastTriggered: "2026-02-07 22:10" },
  { id: "AR-008", name: "液位低报", variable: "液位高度", condition: "<", threshold: "0.5 m", level: "重要", enabled: false, triggerCount: 0, lastTriggered: "-" },
  { id: "AR-009", name: "功率越限", variable: "有功功率", condition: ">", threshold: "2000 kW", level: "次要", enabled: true, triggerCount: 4, lastTriggered: "2026-02-06 08:30" },
  { id: "AR-010", name: "环境温度高", variable: "环境温度", condition: ">", threshold: "40 C", level: "次要", enabled: false, triggerCount: 0, lastTriggered: "-" },
]

const alarmRules = ref<AlarmRule[]>(initialAlarmRules)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", variable: "", condition: ">", threshold: "", level: "重要", enabled: true })
const editForm = ref({ id: "", name: "", variable: "", condition: ">", threshold: "", level: "重要", enabled: true })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextRuleId() {
  const maxId = alarmRules.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("AR-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `AR-${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toISOString().slice(0, 16).replace("T", " ")
}

function createRule() {
  const name = createForm.value.name.trim()
  if (!name) return
  alarmRules.value.unshift({
    id: nextRuleId(),
    name,
    variable: createForm.value.variable.trim() || "-",
    condition: createForm.value.condition,
    threshold: createForm.value.threshold.trim() || "-",
    level: createForm.value.level,
    enabled: createForm.value.enabled,
    triggerCount: 0,
    lastTriggered: "-",
  })
  createForm.value = { name: "", variable: "", condition: ">", threshold: "", level: "重要", enabled: true }
  createOpen.value = false
}

function startEdit(rule: AlarmRule) {
  editForm.value = {
    id: rule.id,
    name: rule.name,
    variable: rule.variable,
    condition: rule.condition,
    threshold: rule.threshold,
    level: rule.level,
    enabled: rule.enabled,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = alarmRules.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  alarmRules.value[index] = {
    ...alarmRules.value[index],
    name: editForm.value.name.trim() || alarmRules.value[index].name,
    variable: editForm.value.variable.trim() || "-",
    condition: editForm.value.condition,
    threshold: editForm.value.threshold.trim() || "-",
    level: editForm.value.level,
    enabled: editForm.value.enabled,
    lastTriggered: alarmRules.value[index].triggerCount > 0 ? now() : alarmRules.value[index].lastTriggered,
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeRule(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeRule(id: string) {
  alarmRules.value = alarmRules.value.filter((item) => item.id !== id)
}

function toggleRule(id: string) {
  alarmRules.value = alarmRules.value.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
}

const levelStyles: Record<string, string> = {
  "紧急": "bg-destructive/10 text-destructive border-destructive/20",
  "重要": "bg-warning/10 text-warning border-warning/20",
  "次要": "bg-muted text-muted-foreground border-border",
}

const columns: Column<AlarmRule>[] = [
  { key: "id", title: "规则 ID", className: "w-[80px] font-mono text-xs" },
  { key: "name", title: "规则名称", render: (a) => <span class="font-medium text-card-foreground">{a.name}</span> },
  { key: "variable", title: "关联变量", className: "text-xs" },
  {
    key: "condition", title: "条件",
    render: (a) => (
      <span class="font-mono text-xs">{`${a.condition} ${a.threshold}`}</span>
    ),
  },
  {
    key: "level", title: "级别",
    render: (a) => (
      <Badge variant="outline" class={`text-[10px] ${levelStyles[a.level] || ""}`}>
        {a.level}
      </Badge>
    ),
  },
  {
    key: "enabled", title: "状态",
    render: (a) => (
      <div class="flex items-center gap-1.5">
        <div class={`h-2 w-2 rounded-full ${a.enabled ? "bg-success" : "bg-muted-foreground"}`} />
        <span class="text-xs">{a.enabled ? "启用" : "禁用"}</span>
      </div>
    ),
  },
  { key: "triggerCount", title: "触发次数", className: "text-center" },
  { key: "lastTriggered", title: "最近触发", className: "text-xs text-muted-foreground" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (a) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(a)}>编辑</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleRule(a.id)}>{a.enabled ? "禁用" : "启用"}</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(a.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "alarmsPage",
  setup() {
    const activeCount = computed(() => alarmRules.value.filter((a) => a.enabled).length)
    
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
    
          <PageHeader title="报警规则" description="配置报警触发条件和通知策略">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Filter class="h-3.5 w-3.5" />
              <span>{"筛选"}</span>
            </Button>
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建规则"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建报警规则</DialogTitle>
                  <DialogDescription>配置报警规则条件和触发级别。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>规则名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-variable">
                    <FormItem>
                      <FormLabel>关联变量</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.variable} onInput={(e: Event) => (createForm.value.variable = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-condition">
                      <FormItem>
                        <FormLabel>条件</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.condition} onChange={(v: string) => (createForm.value.condition = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">">{">"}</SelectItem>
                              <SelectItem value="<">{"<"}</SelectItem>
                              <SelectItem value=">=">{">="}</SelectItem>
                              <SelectItem value="<=">{"<="}</SelectItem>
                              <SelectItem value="Timeout">Timeout</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-threshold">
                      <FormItem>
                        <FormLabel>阈值</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.threshold} onInput={(e: Event) => (createForm.value.threshold = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-level">
                      <FormItem>
                        <FormLabel>级别</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.level} onChange={(v: string) => (createForm.value.level = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="紧急">紧急</SelectItem>
                              <SelectItem value="重要">重要</SelectItem>
                              <SelectItem value="次要">次要</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createRule}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑报警规则</DialogTitle>
                <DialogDescription>{`规则编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>规则名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-variable">
                  <FormItem>
                    <FormLabel>关联变量</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.variable} onInput={(e: Event) => (editForm.value.variable = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-condition">
                    <FormItem>
                      <FormLabel>条件</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.condition} onChange={(v: string) => (editForm.value.condition = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value=">">{">"}</SelectItem>
                            <SelectItem value="<">{"<"}</SelectItem>
                            <SelectItem value=">=">{">="}</SelectItem>
                            <SelectItem value="<=">{"<="}</SelectItem>
                            <SelectItem value="Timeout">Timeout</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-threshold">
                    <FormItem>
                      <FormLabel>阈值</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.threshold} onInput={(e: Event) => (editForm.value.threshold = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-level">
                    <FormItem>
                      <FormLabel>级别</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.level} onChange={(v: string) => (editForm.value.level = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="紧急">紧急</SelectItem>
                            <SelectItem value="重要">重要</SelectItem>
                            <SelectItem value="次要">次要</SelectItem>
                          </SelectContent>
                        </Select>
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
    
          <div class="grid grid-cols-3 gap-4">
            <Card>
              <CardContent class="flex items-center justify-between p-4">
                <div>
                  <p class="text-xs text-muted-foreground">{"总规则数"}</p>
                  <p class="text-xl font-bold text-card-foreground">{alarmRules.value.length}</p>
                </div>
                <Badge variant="outline" class="text-xs">{"全部"}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="flex items-center justify-between p-4">
                <div>
                  <p class="text-xs text-muted-foreground">{"启用中"}</p>
                  <p class="text-xl font-bold text-success">{activeCount.value}</p>
                </div>
                <div class="h-2 w-2 rounded-full bg-success" />
              </CardContent>
            </Card>
            <Card>
              <CardContent class="flex items-center justify-between p-4">
                <div>
                  <p class="text-xs text-muted-foreground">{"已禁用"}</p>
                  <p class="text-xl font-bold text-muted-foreground">{alarmRules.value.length - activeCount.value}</p>
                </div>
                <div class="h-2 w-2 rounded-full bg-muted-foreground" />
              </CardContent>
            </Card>
          </div>
    
          <DataTable columns={columns} data={alarmRules.value} searchPlaceholder="搜索规则名称、变量..." />
        </div>
      )
  }
})
</script>

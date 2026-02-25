<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Calendar, Clock, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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

type ScheduledTask = {
  id: string
  name: string
  script: string
  cron: string
  cronDesc: string
  nextRun: string
  lastRun: string
  lastResult: string
  lastDuration: string
  enabled: boolean
  status: "running" | "stopped" | "pending"
  [key: string]: unknown
}

const initialTasks: ScheduledTask[] = [
  { id: "ST-001", name: "数据质量检测", script: "SCR-001", cron: "*/5 * * * *", cronDesc: "每 5 分钟", nextRun: "14:35:00", lastRun: "14:30:00", lastResult: "成功", lastDuration: "1.2s", enabled: true, status: "running" },
  { id: "ST-002", name: "日报表生成", script: "SCR-003", cron: "5 0 * * *", cronDesc: "每日 00:05", nextRun: "明日 00:05", lastRun: "00:05:00", lastResult: "成功", lastDuration: "15.8s", enabled: true, status: "running" },
  { id: "ST-003", name: "设备健康评估", script: "SCR-004", cron: "0 * * * *", cronDesc: "每小时", nextRun: "15:00:00", lastRun: "14:00:00", lastResult: "成功", lastDuration: "8.5s", enabled: true, status: "running" },
  { id: "ST-004", name: "能耗统计计算", script: "SCR-006", cron: "*/15 * * * *", cronDesc: "每 15 分钟", nextRun: "14:45:00", lastRun: "14:30:00", lastResult: "成功", lastDuration: "2.1s", enabled: true, status: "running" },
  { id: "ST-005", name: "联锁逻辑检查", script: "SCR-007", cron: "*/10 * * * * *", cronDesc: "每 10 秒", nextRun: "14:32:20", lastRun: "14:32:10", lastResult: "成功", lastDuration: "0.05s", enabled: true, status: "running" },
  { id: "ST-006", name: "数据备份清理", script: "SCR-005", cron: "0 2 * * 0", cronDesc: "每周日 02:00", nextRun: "02-15 02:00", lastRun: "02-02 02:00", lastResult: "成功", lastDuration: "45.2s", enabled: false, status: "stopped" },
  { id: "ST-007", name: "通信断线重连", script: "SCR-008", cron: "*/30 * * * * *", cronDesc: "每 30 秒", nextRun: "14:33:00", lastRun: "14:32:30", lastResult: "成功", lastDuration: "0.8s", enabled: true, status: "pending" },
  { id: "ST-008", name: "月度报表归档", script: "SCR-009", cron: "0 3 1 * *", cronDesc: "每月 1 日 03:00", nextRun: "03-01 03:00", lastRun: "02-01 03:00", lastResult: "成功", lastDuration: "120s", enabled: true, status: "running" },
]

const tasks = ref<ScheduledTask[]>(initialTasks)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({
  name: "",
  script: "",
  cron: "",
  cronDesc: "",
  nextRun: "",
  lastRun: "-",
  lastResult: "成功",
  lastDuration: "-",
  enabled: true,
  status: "running",
})
const editForm = ref({
  id: "",
  name: "",
  script: "",
  cron: "",
  cronDesc: "",
  nextRun: "",
  lastRun: "-",
  lastResult: "成功",
  lastDuration: "-",
  enabled: true,
  status: "running",
})
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextTaskId() {
  const maxId = tasks.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("ST-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `ST-${String(maxId + 1).padStart(3, "0")}`
}

function createTask() {
  const name = createForm.value.name.trim()
  if (!name) return
  tasks.value.unshift({
    id: nextTaskId(),
    name,
    script: createForm.value.script.trim() || "-",
    cron: createForm.value.cron.trim() || "* * * * *",
    cronDesc: createForm.value.cronDesc.trim() || "未设置",
    nextRun: createForm.value.nextRun.trim() || "-",
    lastRun: createForm.value.lastRun.trim() || "-",
    lastResult: createForm.value.lastResult,
    lastDuration: createForm.value.lastDuration.trim() || "-",
    enabled: createForm.value.enabled,
    status: createForm.value.status as ScheduledTask["status"],
  })
  createForm.value = {
    name: "",
    script: "",
    cron: "",
    cronDesc: "",
    nextRun: "",
    lastRun: "-",
    lastResult: "成功",
    lastDuration: "-",
    enabled: true,
    status: "running",
  }
  createOpen.value = false
}

function startEdit(task: ScheduledTask) {
  editForm.value = {
    id: task.id,
    name: task.name,
    script: task.script,
    cron: task.cron,
    cronDesc: task.cronDesc,
    nextRun: task.nextRun,
    lastRun: task.lastRun,
    lastResult: task.lastResult,
    lastDuration: task.lastDuration,
    enabled: task.enabled,
    status: task.status,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = tasks.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  tasks.value[index] = {
    ...tasks.value[index],
    name: editForm.value.name.trim() || tasks.value[index].name,
    script: editForm.value.script.trim() || "-",
    cron: editForm.value.cron.trim() || "* * * * *",
    cronDesc: editForm.value.cronDesc.trim() || "未设置",
    nextRun: editForm.value.nextRun.trim() || "-",
    lastRun: editForm.value.lastRun.trim() || "-",
    lastResult: editForm.value.lastResult,
    lastDuration: editForm.value.lastDuration.trim() || "-",
    enabled: editForm.value.enabled,
    status: editForm.value.status as ScheduledTask["status"],
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeTask(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeTask(id: string) {
  tasks.value = tasks.value.filter((item) => item.id !== id)
}

function updateEnabled(id: string, enabled: boolean) {
  tasks.value = tasks.value.map((item) => {
    if (item.id !== id) return item
    return { ...item, enabled, status: enabled ? (item.status === "stopped" ? "running" : item.status) : "stopped" }
  })
}

const resultColors: Record<string, string> = {
  "成功": "bg-success/10 text-success border-success/20",
  "失败": "bg-destructive/10 text-destructive border-destructive/20",
  "超时": "bg-warning/10 text-warning border-warning/20",
}

const columns: Column<ScheduledTask>[] = [
  { key: "name", title: "任务名称", render: (t) => <span class="font-medium text-card-foreground">{t.name}</span> },
  { key: "cron", title: "Cron 表达式", render: (t) => <code class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-card-foreground">{t.cron}</code> },
  { key: "cronDesc", title: "执行频率" },
  { key: "nextRun", title: "下次执行", className: "font-mono text-xs" },
  { key: "lastRun", title: "上次执行", className: "font-mono text-xs" },
  { key: "lastResult", title: "执行结果", render: (t) => <Badge variant="outline" class={`text-[10px] ${resultColors[t.lastResult] || ""}`}>{t.lastResult}</Badge> },
  { key: "lastDuration", title: "耗时", className: "font-mono text-xs" },
  { key: "status", title: "状态", render: (t) => <StatusBadge status={t.status} /> },
  {
    key: "enabled",
    title: "启用",
    render: (t) => <Switch modelValue={t.enabled} onChange={(value: boolean) => updateEnabled(t.id, value)} />,
  },
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
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(t.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default defineComponent({
  name: "schedulerPage",
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
    
          <PageHeader title="定时任务" description="管理脚本的定时执行计划">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建任务"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建任务</DialogTitle>
                  <DialogDescription>配置脚本调度任务并保存。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>任务名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-script">
                      <FormItem>
                        <FormLabel>脚本 ID</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.script} onInput={(e: Event) => (createForm.value.script = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-cron">
                      <FormItem>
                        <FormLabel>Cron 表达式</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.cron} onInput={(e: Event) => (createForm.value.cron = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-desc">
                      <FormItem>
                        <FormLabel>执行频率描述</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.cronDesc} onInput={(e: Event) => (createForm.value.cronDesc = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-next">
                      <FormItem>
                        <FormLabel>下次执行</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.nextRun} onInput={(e: Event) => (createForm.value.nextRun = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-result">
                      <FormItem>
                        <FormLabel>默认结果</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.lastResult} onChange={(v: string) => (createForm.value.lastResult = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="成功">成功</SelectItem>
                              <SelectItem value="失败">失败</SelectItem>
                              <SelectItem value="超时">超时</SelectItem>
                            </SelectContent>
                          </Select>
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
                              <SelectItem value="running">运行中</SelectItem>
                              <SelectItem value="pending">等待中</SelectItem>
                              <SelectItem value="stopped">已停止</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createTask}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑任务</DialogTitle>
                <DialogDescription>{`任务编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>任务名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-script">
                    <FormItem>
                      <FormLabel>脚本 ID</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.script} onInput={(e: Event) => (editForm.value.script = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-cron">
                    <FormItem>
                      <FormLabel>Cron 表达式</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.cron} onInput={(e: Event) => (editForm.value.cron = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-desc">
                    <FormItem>
                      <FormLabel>执行频率描述</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.cronDesc} onInput={(e: Event) => (editForm.value.cronDesc = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-next">
                    <FormItem>
                      <FormLabel>下次执行</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.nextRun} onInput={(e: Event) => (editForm.value.nextRun = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-result">
                    <FormItem>
                      <FormLabel>默认结果</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.lastResult} onChange={(v: string) => (editForm.value.lastResult = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="成功">成功</SelectItem>
                            <SelectItem value="失败">失败</SelectItem>
                            <SelectItem value="超时">超时</SelectItem>
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
                </div>
              </Form>
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <DataTable columns={columns} data={tasks.value} searchPlaceholder="搜索任务名称..." />
        </div>
      )
  }
})
</script>

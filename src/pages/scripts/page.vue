<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Play, Pause, FileCode2, Clock, MoreHorizontal } from "lucide-vue-next"
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

type ScriptItem = {
  id: string
  name: string
  desc: string
  lang: string
  trigger: string
  status: "running" | "stopped" | "pending"
  lastRun: string
  duration: string
}

const initialScripts: ScriptItem[] = [
  { id: "SCR-001", name: "数据质量检测", desc: "检查变量采集质量，标记异常数据点", lang: "JavaScript", trigger: "每 5 分钟", status: "running" as const, lastRun: "14:30:00", duration: "1.2s" },
  { id: "SCR-002", name: "报警聚合处理", desc: "对重复报警进行合并和抑制", lang: "JavaScript", trigger: "事件触发", status: "running" as const, lastRun: "14:32:01", duration: "0.3s" },
  { id: "SCR-003", name: "日报表生成", desc: "自动汇总每日运行数据生成报表", lang: "Python", trigger: "每日 00:05", status: "running" as const, lastRun: "00:05:00", duration: "15.8s" },
  { id: "SCR-004", name: "设备健康评估", desc: "基于历史数据评估设备健康指数", lang: "Python", trigger: "每小时", status: "running" as const, lastRun: "14:00:00", duration: "8.5s" },
  { id: "SCR-005", name: "数据备份清理", desc: "清理超过 90 天的归档数据", lang: "SQL", trigger: "每周日 02:00", status: "stopped" as const, lastRun: "2026-02-02 02:00", duration: "45.2s" },
  { id: "SCR-006", name: "能耗统计计算", desc: "根据电表数据计算分区能耗", lang: "JavaScript", trigger: "每 15 分钟", status: "running" as const, lastRun: "14:30:00", duration: "2.1s" },
  { id: "SCR-007", name: "联锁逻辑检查", desc: "验证安全联锁逻辑是否正常", lang: "JavaScript", trigger: "每 10 秒", status: "running" as const, lastRun: "14:32:10", duration: "0.05s" },
  { id: "SCR-008", name: "通信断线重连", desc: "自动检测并重建断开的通信连接", lang: "JavaScript", trigger: "每 30 秒", status: "pending" as const, lastRun: "14:31:30", duration: "0.8s" },
]

const scripts = ref<ScriptItem[]>(initialScripts)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", desc: "", lang: "JavaScript", trigger: "", status: "running" })
const editForm = ref({ id: "", name: "", desc: "", lang: "JavaScript", trigger: "", status: "running" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextScriptId() {
  const maxId = scripts.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("SCR-", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `SCR-${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toTimeString().slice(0, 8)
}

function createScript() {
  const name = createForm.value.name.trim()
  if (!name) return
  scripts.value.unshift({
    id: nextScriptId(),
    name,
    desc: createForm.value.desc.trim() || "未填写描述",
    lang: createForm.value.lang,
    trigger: createForm.value.trigger.trim() || "手动触发",
    status: createForm.value.status as ScriptItem["status"],
    lastRun: "-",
    duration: "-",
  })
  createForm.value = { name: "", desc: "", lang: "JavaScript", trigger: "", status: "running" }
  createOpen.value = false
}

function startEdit(script: ScriptItem) {
  editForm.value = {
    id: script.id,
    name: script.name,
    desc: script.desc,
    lang: script.lang,
    trigger: script.trigger,
    status: script.status,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = scripts.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  scripts.value[index] = {
    ...scripts.value[index],
    name: editForm.value.name.trim() || scripts.value[index].name,
    desc: editForm.value.desc.trim() || "未填写描述",
    lang: editForm.value.lang,
    trigger: editForm.value.trigger.trim() || "手动触发",
    status: editForm.value.status as ScriptItem["status"],
  }
  editOpen.value = false
}

function toggleScript(id: string) {
  scripts.value = scripts.value.map((item) => {
    if (item.id !== id) return item
    return {
      ...item,
      status: item.status === "running" ? "stopped" : "running",
      lastRun: now(),
    }
  })
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeScript(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeScript(id: string) {
  scripts.value = scripts.value.filter((item) => item.id !== id)
}

const langColors: Record<string, string> = {
  JavaScript: "bg-warning/10 text-warning border-warning/20",
  Python: "bg-primary/10 text-primary border-primary/20",
  SQL: "bg-success/10 text-success border-success/20",
}

export default defineComponent({
  name: "scriptsPage",
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
    
          <PageHeader title="脚本列表" description="管理自动化脚本和定时任务">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建脚本"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建脚本</DialogTitle>
                  <DialogDescription>补全脚本新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>脚本名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
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
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-lang">
                      <FormItem>
                        <FormLabel>语言</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.lang} onChange={(v: string) => (createForm.value.lang = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JavaScript">JavaScript</SelectItem>
                              <SelectItem value="Python">Python</SelectItem>
                              <SelectItem value="SQL">SQL</SelectItem>
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
                  <FormField name="create-trigger">
                    <FormItem>
                      <FormLabel>触发方式</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.trigger} onInput={(e: Event) => (createForm.value.trigger = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createScript}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑脚本</DialogTitle>
                <DialogDescription>{`脚本编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>脚本名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
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
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-lang">
                    <FormItem>
                      <FormLabel>语言</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.lang} onChange={(v: string) => (editForm.value.lang = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JavaScript">JavaScript</SelectItem>
                            <SelectItem value="Python">Python</SelectItem>
                            <SelectItem value="SQL">SQL</SelectItem>
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
                <FormField name="edit-trigger">
                  <FormItem>
                    <FormLabel>触发方式</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.trigger} onInput={(e: Event) => (editForm.value.trigger = (e.target as HTMLInputElement).value)} />
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
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {scripts.value.map((script) => (
              <Card key={script.id} class="group flex flex-col transition-colors hover:border-primary/30">
                <CardHeader class="pb-2">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2">
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <FileCode2 class="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle class="text-sm font-medium text-card-foreground">{script.name}</CardTitle>
                        <Badge variant="outline" class={`mt-1 text-[10px] ${langColors[script.lang] || ""}`}>
                          {script.lang}
                        </Badge>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <StatusBadge status={script.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(script)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(script.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="flex flex-1 flex-col justify-between pt-0">
                  <p class="text-xs text-muted-foreground leading-relaxed">{script.desc}</p>
                  <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div class="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock class="h-3 w-3" />
                      <span>{script.trigger}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Button variant="ghost" size="icon" class="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => toggleScript(script.id)}>
                        {script.status === "running" ? <Pause class="h-3 w-3" /> : <Play class="h-3 w-3" />}
                      </Button>
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

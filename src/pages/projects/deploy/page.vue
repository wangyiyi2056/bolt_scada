<script lang="tsx">
import { defineComponent } from "vue"
import { computed, ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Rocket, CheckCircle2, Clock, XCircle, RotateCcw, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
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

type Deployment = {
  id: string
  project: string
  version: string
  env: string
  node: string
  status: "success" | "failed" | "deploying"
  time: string
  duration: string
  operator: string
}

const initialDeployments: Deployment[] = [
  { id: "D001", project: "智慧水务监控系统", version: "v2.3.1", env: "生产", node: "主控节点-01", status: "success", time: "2026-02-09 14:05", duration: "32s", operator: "张明" },
  { id: "D002", project: "园区能源管理平台", version: "v3.0.0", env: "生产", node: "采集节点-05", status: "success", time: "2026-02-05 09:45", duration: "1m 15s", operator: "张明" },
  { id: "D003", project: "电力变电站综合自动化", version: "v1.8.2", env: "测试", node: "备用节点-04", status: "success", time: "2026-02-06 10:30", duration: "28s", operator: "李华" },
  { id: "D004", project: "污水处理自控系统", version: "v1.0.0-rc1", env: "测试", node: "备用节点-04", status: "failed", time: "2026-02-04 16:20", duration: "45s", operator: "王芳" },
  { id: "D005", project: "工业锅炉 DCS 系统", version: "v1.2.0", env: "生产", node: "主控节点-01", status: "success", time: "2026-01-28 10:15", duration: "52s", operator: "赵强" },
  { id: "D006", project: "制药车间环境监测", version: "v1.1.0", env: "生产", node: "边缘网关-06", status: "deploying", time: "2026-02-09 14:30", duration: "-", operator: "郑雪" },
]

const deployments = ref<Deployment[]>(initialDeployments)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ project: "", version: "", env: "生产", node: "", status: "deploying", time: "", duration: "-", operator: "" })
const editForm = ref({ id: "", project: "", version: "", env: "生产", node: "", status: "deploying", time: "", duration: "-", operator: "" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextDeploymentId() {
  const maxId = deployments.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("D", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `D${String(maxId + 1).padStart(3, "0")}`
}

function now() {
  return new Date().toISOString().slice(0, 16).replace("T", " ")
}

function createDeployment() {
  const project = createForm.value.project.trim()
  if (!project) return
  deployments.value.unshift({
    id: nextDeploymentId(),
    project,
    version: createForm.value.version.trim() || "v1.0.0",
    env: createForm.value.env,
    node: createForm.value.node.trim() || "未分配节点",
    status: createForm.value.status as Deployment["status"],
    time: createForm.value.time.trim() || now(),
    duration: createForm.value.duration.trim() || "-",
    operator: createForm.value.operator.trim() || "系统",
  })
  createForm.value = { project: "", version: "", env: "生产", node: "", status: "deploying", time: "", duration: "-", operator: "" }
  createOpen.value = false
}

function startEdit(dep: Deployment) {
  editForm.value = {
    id: dep.id,
    project: dep.project,
    version: dep.version,
    env: dep.env,
    node: dep.node,
    status: dep.status,
    time: dep.time,
    duration: dep.duration,
    operator: dep.operator,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = deployments.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  deployments.value[index] = {
    ...deployments.value[index],
    project: editForm.value.project.trim() || deployments.value[index].project,
    version: editForm.value.version.trim() || "v1.0.0",
    env: editForm.value.env,
    node: editForm.value.node.trim() || "未分配节点",
    status: editForm.value.status as Deployment["status"],
    time: editForm.value.time.trim() || now(),
    duration: editForm.value.duration.trim() || "-",
    operator: editForm.value.operator.trim() || "系统",
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeDeployment(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeDeployment(id: string) {
  deployments.value = deployments.value.filter((item) => item.id !== id)
}

function retryDeployment(id: string) {
  deployments.value = deployments.value.map((item) =>
    item.id === id
      ? { ...item, status: "deploying", time: now(), duration: "-" }
      : item,
  )
}

const successRate = computed(() => {
  if (!deployments.value.length) return "0.0%"
  const success = deployments.value.filter((item) => item.status === "success").length
  return `${((success / deployments.value.length) * 100).toFixed(1)}%`
})

const statusConfig = {
  success: { label: "成功", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "失败", className: "bg-destructive/10 text-destructive border-destructive/20" },
  deploying: { label: "部署中", className: "bg-warning/10 text-warning border-warning/20" },
} as const

export default defineComponent({
  name: "deployPage",
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
    
          <PageHeader title="发布部署" description="管理工程发布和节点部署">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Rocket class="h-3.5 w-3.5" />
                  <span>新建部署</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建部署</DialogTitle>
                  <DialogDescription>补全发布部署新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-project">
                      <FormItem>
                        <FormLabel>项目</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.project} onInput={(e: Event) => (createForm.value.project = (e.target as HTMLInputElement).value)} />
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
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-env">
                      <FormItem>
                        <FormLabel>环境</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.env} onChange={(v: string) => (createForm.value.env = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="生产">生产</SelectItem>
                              <SelectItem value="测试">测试</SelectItem>
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
                              <SelectItem value="deploying">部署中</SelectItem>
                              <SelectItem value="success">成功</SelectItem>
                              <SelectItem value="failed">失败</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-duration">
                      <FormItem>
                        <FormLabel>耗时</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.duration} onInput={(e: Event) => (createForm.value.duration = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-node">
                      <FormItem>
                        <FormLabel>节点</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.node} onInput={(e: Event) => (createForm.value.node = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-operator">
                      <FormItem>
                        <FormLabel>操作人</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.operator} onInput={(e: Event) => (createForm.value.operator = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createDeployment}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑部署</DialogTitle>
                <DialogDescription>{`部署编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-project">
                    <FormItem>
                      <FormLabel>项目</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.project} onInput={(e: Event) => (editForm.value.project = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-version">
                    <FormItem>
                      <FormLabel>版本</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.version} onInput={(e: Event) => (editForm.value.version = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-env">
                    <FormItem>
                      <FormLabel>环境</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.env} onChange={(v: string) => (editForm.value.env = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="生产">生产</SelectItem>
                            <SelectItem value="测试">测试</SelectItem>
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
                            <SelectItem value="deploying">部署中</SelectItem>
                            <SelectItem value="success">成功</SelectItem>
                            <SelectItem value="failed">失败</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-duration">
                    <FormItem>
                      <FormLabel>耗时</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.duration} onInput={(e: Event) => (editForm.value.duration = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-node">
                    <FormItem>
                      <FormLabel>节点</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.node} onInput={(e: Event) => (editForm.value.node = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-operator">
                    <FormItem>
                      <FormLabel>操作人</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.operator} onInput={(e: Event) => (editForm.value.operator = (e.target as HTMLInputElement).value)} />
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
    
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="总部署次数" value={String(deployments.value.length)} icon={Rocket} />
            <StatCard title="成功率" value={successRate.value} icon={CheckCircle2} description="近 30 天" />
            <StatCard title="平均耗时" value="42s" icon={Clock} />
            <StatCard title="今日部署" value={String(deployments.value.filter((item) => item.time.startsWith(new Date().toISOString().slice(0, 10))).length)} icon={RotateCcw} />
          </div>
    
          <div class="flex flex-col gap-3">
            {deployments.value.map((dep) => {
              const cfg = statusConfig[dep.status as keyof typeof statusConfig]
              return (
                <Card key={dep.id} class="transition-colors hover:border-primary/30">
                  <CardContent class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-4">
                      {dep.status === "success" && <CheckCircle2 class="h-4 w-4 text-success" />}
                      {dep.status === "failed" && <XCircle class="h-4 w-4 text-destructive" />}
                      {dep.status === "deploying" && <Clock class="h-4 w-4 text-warning" />}
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-card-foreground">{dep.project}</span>
                          <Badge variant="outline" class="font-mono text-[10px]">{dep.version}</Badge>
                          <Badge variant="outline" class={`text-[10px] ${cfg.className}`}>{cfg.label}</Badge>
                        </div>
                        <div class="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>{`${dep.env} 环境`}</span>
                          <span>{dep.node}</span>
                          <span>{dep.operator}</span>
                          <span>{dep.time}</span>
                          {dep.duration !== "-" && <span>{`耗时 ${dep.duration}`}</span>}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      {dep.status === "failed" && (
                        <Button variant="outline" size="sm" class="h-7 gap-1.5 bg-transparent text-xs" onClick={() => retryDeployment(dep.id)}>
                          <RotateCcw class="h-3 w-3" />
                          <span>重试</span>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(dep)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(dep.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )
  }
})
</script>

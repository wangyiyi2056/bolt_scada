<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, MoreHorizontal, FolderKanban } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/ui/page-header"
import { StatusBadge } from "@/components/ui/status-badge"
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

type ProjectStatus = "running" | "pending" | "stopped"

type Project = {
  id: string
  name: string
  desc: string
  status: ProjectStatus
  engineers: number
  devices: number
  updated: string
}

const initialProjects: Project[] = [
  { id: "P001", name: "智慧水务监控系统", desc: "城市供水管网 SCADA 监控", status: "running" as const, engineers: 3, devices: 128, updated: "2026-02-08" },
  { id: "P002", name: "电力变电站综合自动化", desc: "110kV 变电站综合监控", status: "running" as const, engineers: 5, devices: 256, updated: "2026-02-07" },
  { id: "P003", name: "工业锅炉 DCS 系统", desc: "锅炉温控与安全联锁", status: "stopped" as const, engineers: 2, devices: 64, updated: "2026-01-28" },
  { id: "P004", name: "园区能源管理平台", desc: "光伏+储能+充电桩", status: "running" as const, engineers: 4, devices: 312, updated: "2026-02-09" },
  { id: "P005", name: "污水处理自控系统", desc: "AAO 工艺流程自动控制", status: "pending" as const, engineers: 2, devices: 96, updated: "2026-02-05" },
  { id: "P006", name: "制药车间环境监测", desc: "洁净室温湿度与压差", status: "running" as const, engineers: 1, devices: 48, updated: "2026-02-06" },
]

const projects = ref<Project[]>(initialProjects)
const createOpen = ref(false)
const createForm = ref({ name: "", desc: "", status: "pending" })
const editOpen = ref(false)
const editForm = ref({ id: "", name: "", desc: "", status: "running" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextProjectId() {
  const maxId = projects.value.reduce((max, project) => {
    const num = Number.parseInt(project.id.replace("P", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `P${String(maxId + 1).padStart(3, "0")}`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function startEdit(project: Project) {
  editForm.value = {
    id: project.id,
    name: project.name,
    desc: project.desc,
    status: project.status,
  }
  editOpen.value = true
}

function createProject() {
  const name = createForm.value.name.trim()
  if (!name) return

  projects.value.unshift({
    id: nextProjectId(),
    name,
    desc: createForm.value.desc.trim() || "未填写项目描述",
    status: createForm.value.status as ProjectStatus,
    engineers: 0,
    devices: 0,
    updated: today(),
  })
  createForm.value = { name: "", desc: "", status: "pending" }
  createOpen.value = false
}

function saveEdit() {
  const index = projects.value.findIndex((project) => project.id === editForm.value.id)
  if (index < 0) return

  projects.value[index] = {
    ...projects.value[index],
    name: editForm.value.name.trim() || projects.value[index].name,
    desc: editForm.value.desc.trim() || "未填写项目描述",
    status: editForm.value.status as ProjectStatus,
    updated: today(),
  }
  editOpen.value = false
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeProject(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeProject(id: string) {
  projects.value = projects.value.filter((project) => project.id !== id)
}

function openProject(id: string) {
  projects.value = projects.value.map((project) =>
    project.id === id
      ? { ...project, status: "running", updated: today() }
      : project,
  )
}

function duplicateProject(project: Project) {
  projects.value.unshift({
    ...project,
    id: nextProjectId(),
    name: `${project.name} 副本`,
    status: "pending",
    updated: today(),
  })
}

export default defineComponent({
  name: "projectsPage",
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
    
          <PageHeader title="项目列表" description="管理所有 SCADA 项目工程">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>新建项目</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                  <DialogDescription>填写项目基础信息。页面内容不变，仅补全交互弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="name">
                    <FormItem>
                      <FormLabel>项目名称</FormLabel>
                      <FormControl>
                        <Input
                          value={createForm.value.name}
                          onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)}
                          placeholder="请输入项目名称"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="desc">
                    <FormItem>
                      <FormLabel>项目描述</FormLabel>
                      <FormControl>
                        <Textarea
                          value={createForm.value.desc}
                          onInput={(e: Event) => (createForm.value.desc = (e.target as HTMLTextAreaElement).value)}
                          placeholder="请输入项目描述"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="status">
                    <FormItem>
                      <FormLabel>初始状态</FormLabel>
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
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createProject}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑项目</DialogTitle>
                <DialogDescription>{`正在编辑 ${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>项目名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>项目描述</FormLabel>
                    <FormControl>
                      <Textarea value={editForm.value.desc} onInput={(e: Event) => (editForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-status">
                  <FormItem>
                    <FormLabel>运行状态</FormLabel>
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
              </Form>
              <DialogFooter>
                <Button variant="outline" onClick={() => (editOpen.value = false)}>取消</Button>
                <Button onClick={saveEdit}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.value.map((project) => (
              <Card key={project.id} class="group relative transition-colors hover:border-primary/30">
                <CardContent class="p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-2.5">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderKanban class="h-4 w-4" />
                      </div>
                      <div>
                        <h3 class="text-sm font-medium text-card-foreground">{project.name}</h3>
                        <p class="text-xs text-muted-foreground">{project.desc}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => openProject(project.id)}>打开项目</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => startEdit(project)}>编辑</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => duplicateProject(project)}>复制</DropdownMenuItem>
                        <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(project.id)}>删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
    
                  <div class="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div class="flex items-center gap-3 text-muted-foreground">
                      <span>{`${project.engineers} 工程`}</span>
                      <span>{`${project.devices} 设备`}</span>
                    </div>
                    <StatusBadge status={project.status} />
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

<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, ExternalLink, Monitor, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/ui/page-header"
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

type ScreenItem = {
  id: string
  name: string
  project: string
  resolution: string
  widgets: number
  type: string
  updated: string
}

const initialScreens: ScreenItem[] = [
  { id: "S001", name: "锅炉主画面", project: "工业锅炉 DCS", resolution: "1920x1080", widgets: 42, type: "流程图", updated: "2026-02-09" },
  { id: "S002", name: "供水管网总览", project: "智慧水务", resolution: "3840x1080", widgets: 68, type: "地图", updated: "2026-02-08" },
  { id: "S003", name: "变电站一次接线图", project: "电力变电站", resolution: "1920x1080", widgets: 56, type: "电气图", updated: "2026-02-07" },
  { id: "S004", name: "能源看板", project: "园区能源管理", resolution: "3840x2160", widgets: 35, type: "大屏", updated: "2026-02-09" },
  { id: "S005", name: "AAO 工艺流程", project: "污水处理", resolution: "1920x1080", widgets: 48, type: "流程图", updated: "2026-02-05" },
  { id: "S006", name: "洁净室环境看板", project: "制药车间", resolution: "1920x1080", widgets: 24, type: "看板", updated: "2026-02-06" },
  { id: "S007", name: "报警总览画面", project: "通用", resolution: "1920x1080", widgets: 18, type: "列表", updated: "2026-02-09" },
  { id: "S008", name: "历史趋势画面", project: "通用", resolution: "1920x1080", widgets: 12, type: "趋势", updated: "2026-02-04" },
]

const screens = ref<ScreenItem[]>(initialScreens)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", project: "", resolution: "1920x1080", widgets: "0", type: "流程图" })
const editForm = ref({ id: "", name: "", project: "", resolution: "1920x1080", widgets: "0", type: "流程图" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextScreenId() {
  const maxId = screens.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("S", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `S${String(maxId + 1).padStart(3, "0")}`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function createScreen() {
  const name = createForm.value.name.trim()
  if (!name) return
  screens.value.unshift({
    id: nextScreenId(),
    name,
    project: createForm.value.project.trim() || "未分配项目",
    resolution: createForm.value.resolution.trim() || "1920x1080",
    widgets: Number.parseInt(createForm.value.widgets, 10) || 0,
    type: createForm.value.type,
    updated: today(),
  })
  createForm.value = { name: "", project: "", resolution: "1920x1080", widgets: "0", type: "流程图" }
  createOpen.value = false
}

function startEdit(screen: ScreenItem) {
  editForm.value = {
    id: screen.id,
    name: screen.name,
    project: screen.project,
    resolution: screen.resolution,
    widgets: String(screen.widgets),
    type: screen.type,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = screens.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  screens.value[index] = {
    ...screens.value[index],
    name: editForm.value.name.trim() || screens.value[index].name,
    project: editForm.value.project.trim() || "未分配项目",
    resolution: editForm.value.resolution.trim() || "1920x1080",
    widgets: Number.parseInt(editForm.value.widgets, 10) || 0,
    type: editForm.value.type,
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
  removeScreen(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeScreen(id: string) {
  screens.value = screens.value.filter((item) => item.id !== id)
}

const typeColors: Record<string, string> = {
  "流程图": "bg-primary/10 text-primary border-primary/20",
  "地图": "bg-success/10 text-success border-success/20",
  "电气图": "bg-warning/10 text-warning border-warning/20",
  "大屏": "bg-destructive/10 text-destructive border-destructive/20",
  "看板": "bg-primary/10 text-primary border-primary/20",
  "列表": "bg-muted text-muted-foreground border-border",
  "趋势": "bg-success/10 text-success border-success/20",
}

export default defineComponent({
  name: "screensPage",
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
    
          <PageHeader title="画面管理" description="管理组态画面和大屏展示">
            <Dialog open={createOpen.value} onUpdate:open={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"新建画面"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建画面</DialogTitle>
                  <DialogDescription>补全画面新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>画面名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-project">
                      <FormItem>
                        <FormLabel>所属项目</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.project} onInput={(e: Event) => (createForm.value.project = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-resolution">
                      <FormItem>
                        <FormLabel>分辨率</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.resolution} onInput={(e: Event) => (createForm.value.resolution = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <FormField name="create-type">
                      <FormItem>
                        <FormLabel>画面类型</FormLabel>
                        <FormControl>
                          <Select modelValue={createForm.value.type} onChange={(v: string) => (createForm.value.type = v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="流程图">流程图</SelectItem>
                              <SelectItem value="地图">地图</SelectItem>
                              <SelectItem value="电气图">电气图</SelectItem>
                              <SelectItem value="大屏">大屏</SelectItem>
                              <SelectItem value="看板">看板</SelectItem>
                              <SelectItem value="列表">列表</SelectItem>
                              <SelectItem value="趋势">趋势</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-widgets">
                      <FormItem>
                        <FormLabel>组件数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.widgets} onInput={(e: Event) => (createForm.value.widgets = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createScreen}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onUpdate:open={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑画面</DialogTitle>
                <DialogDescription>{`画面编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>画面名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-project">
                    <FormItem>
                      <FormLabel>所属项目</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.project} onInput={(e: Event) => (editForm.value.project = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-resolution">
                    <FormItem>
                      <FormLabel>分辨率</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.resolution} onInput={(e: Event) => (editForm.value.resolution = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <FormField name="edit-type">
                    <FormItem>
                      <FormLabel>画面类型</FormLabel>
                      <FormControl>
                        <Select modelValue={editForm.value.type} onChange={(v: string) => (editForm.value.type = v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="流程图">流程图</SelectItem>
                            <SelectItem value="地图">地图</SelectItem>
                            <SelectItem value="电气图">电气图</SelectItem>
                            <SelectItem value="大屏">大屏</SelectItem>
                            <SelectItem value="看板">看板</SelectItem>
                            <SelectItem value="列表">列表</SelectItem>
                            <SelectItem value="趋势">趋势</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-widgets">
                    <FormItem>
                      <FormLabel>组件数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.widgets} onInput={(e: Event) => (editForm.value.widgets = (e.target as HTMLInputElement).value)} />
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
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {screens.value.map((screen) => (
              <Card key={screen.id} class="group overflow-hidden transition-colors hover:border-primary/30">
                <div class="flex h-32 items-center justify-center bg-secondary/50">
                  <Monitor class="h-10 w-10 text-muted-foreground/40" />
                </div>
                <CardContent class="p-4">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-card-foreground">{screen.name}</h3>
                      <p class="text-[11px] text-muted-foreground">{screen.project}</p>
                    </div>
                    <div class="flex items-center gap-1">
                      <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                        <ExternalLink class="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <MoreHorizontal class="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(screen)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(screen.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <Badge variant="outline" class={`text-[10px] ${typeColors[screen.type] || ""}`}>{screen.type}</Badge>
                    <span class="text-[11px] text-muted-foreground">{screen.resolution}</span>
                    <span class="text-[11px] text-muted-foreground">{`${screen.widgets} 组件`}</span>
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

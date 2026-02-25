<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Download, LayoutTemplate, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { PageHeader } from "@/components/page-header"
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

type ProjectTemplate = {
  id: string
  name: string
  desc: string
  category: string
  screens: number
  variables: number
  uses: number
}

const initialTemplates: ProjectTemplate[] = [
  { id: "T001", name: "水处理 SCADA 模板", desc: "包含进水、处理、出水全流程画面和变量", category: "水务", screens: 6, variables: 320, uses: 12 },
  { id: "T002", name: "变电站标准模板", desc: "110kV/220kV 变电站标准监控模板", category: "电力", screens: 8, variables: 512, uses: 8 },
  { id: "T003", name: "锅炉控制模板", desc: "工业锅炉温度、压力、流量控制模板", category: "热力", screens: 4, variables: 256, uses: 15 },
  { id: "T004", name: "楼宇自控模板", desc: "暖通空调和照明控制标准模板", category: "楼宇", screens: 5, variables: 192, uses: 6 },
  { id: "T005", name: "光伏电站模板", desc: "光伏逆变器、汇流箱监控模板", category: "新能源", screens: 4, variables: 384, uses: 10 },
  { id: "T006", name: "空白工程模板", desc: "最小化空白模板，仅包含基础框架", category: "通用", screens: 1, variables: 0, uses: 45 },
]

const templates = ref<ProjectTemplate[]>(initialTemplates)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", desc: "", category: "通用", screens: "1", variables: "0" })
const editForm = ref({ id: "", name: "", desc: "", category: "通用", screens: "1", variables: "0" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextTemplateId() {
  const maxId = templates.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("T", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `T${String(maxId + 1).padStart(3, "0")}`
}

function createTemplate() {
  const name = createForm.value.name.trim()
  if (!name) return
  templates.value.unshift({
    id: nextTemplateId(),
    name,
    desc: createForm.value.desc.trim() || "未填写描述",
    category: createForm.value.category.trim() || "通用",
    screens: Number.parseInt(createForm.value.screens, 10) || 1,
    variables: Number.parseInt(createForm.value.variables, 10) || 0,
    uses: 0,
  })
  createForm.value = { name: "", desc: "", category: "通用", screens: "1", variables: "0" }
  createOpen.value = false
}

function startEdit(template: ProjectTemplate) {
  editForm.value = {
    id: template.id,
    name: template.name,
    desc: template.desc,
    category: template.category,
    screens: String(template.screens),
    variables: String(template.variables),
  }
  editOpen.value = true
}

function saveEdit() {
  const index = templates.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  templates.value[index] = {
    ...templates.value[index],
    name: editForm.value.name.trim() || templates.value[index].name,
    desc: editForm.value.desc.trim() || "未填写描述",
    category: editForm.value.category.trim() || "通用",
    screens: Number.parseInt(editForm.value.screens, 10) || 1,
    variables: Number.parseInt(editForm.value.variables, 10) || 0,
  }
  editOpen.value = false
}

function duplicateTemplate(template: ProjectTemplate) {
  templates.value.unshift({
    ...template,
    id: nextTemplateId(),
    name: `${template.name} 副本`,
    uses: 0,
  })
}

function requestDelete(id: string) {
  pendingDeleteId.value = id
  deleteOpen.value = true
}

function confirmDelete() {
  if (!pendingDeleteId.value) return
  removeTemplate(pendingDeleteId.value)
  pendingDeleteId.value = null
  deleteOpen.value = false
}

function removeTemplate(id: string) {
  templates.value = templates.value.filter((item) => item.id !== id)
}

const categoryColors: Record<string, string> = {
  "水务": "bg-primary/10 text-primary border-primary/20",
  "电力": "bg-warning/10 text-warning border-warning/20",
  "热力": "bg-destructive/10 text-destructive border-destructive/20",
  "楼宇": "bg-success/10 text-success border-success/20",
  "新能源": "bg-primary/10 text-primary border-primary/20",
  "通用": "bg-muted text-muted-foreground border-border",
}

export default defineComponent({
  name: "templatesPage",
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
    
          <PageHeader title="模板库" description="工程模板管理，快速创建标准化项目">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 bg-transparent">
              <Download class="h-3.5 w-3.5" />
              <span>{"导入模板"}</span>
            </Button>
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"创建模板"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建项目模板</DialogTitle>
                  <DialogDescription>补全项目模板新增弹框。</DialogDescription>
                </DialogHeader>
                <Form class="grid gap-3">
                  <FormField name="create-name">
                    <FormItem>
                      <FormLabel>模板名称</FormLabel>
                      <FormControl>
                        <Input value={createForm.value.name} onInput={(e: Event) => (createForm.value.name = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="create-desc">
                    <FormItem>
                      <FormLabel>模板描述</FormLabel>
                      <FormControl>
                        <Textarea value={createForm.value.desc} onInput={(e: Event) => (createForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-3 gap-3">
                    <FormField name="create-category">
                      <FormItem>
                        <FormLabel>分类</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.category} onInput={(e: Event) => (createForm.value.category = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-screens">
                      <FormItem>
                        <FormLabel>画面数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.screens} onInput={(e: Event) => (createForm.value.screens = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-variables">
                      <FormItem>
                        <FormLabel>变量数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.variables} onInput={(e: Event) => (createForm.value.variables = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </Form>
                <DialogFooter>
                  <Button variant="outline" onClick={() => (createOpen.value = false)}>取消</Button>
                  <Button onClick={createTemplate}>保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </PageHeader>
    
          <Dialog open={editOpen.value} onOpenChange={(open: boolean) => (editOpen.value = open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑项目模板</DialogTitle>
                <DialogDescription>{`模板编号：${editForm.value.id}`}</DialogDescription>
              </DialogHeader>
              <Form class="grid gap-3">
                <FormField name="edit-name">
                  <FormItem>
                    <FormLabel>模板名称</FormLabel>
                    <FormControl>
                      <Input value={editForm.value.name} onInput={(e: Event) => (editForm.value.name = (e.target as HTMLInputElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <FormField name="edit-desc">
                  <FormItem>
                    <FormLabel>模板描述</FormLabel>
                    <FormControl>
                      <Textarea value={editForm.value.desc} onInput={(e: Event) => (editForm.value.desc = (e.target as HTMLTextAreaElement).value)} />
                    </FormControl>
                  </FormItem>
                </FormField>
                <div class="grid grid-cols-3 gap-3">
                  <FormField name="edit-category">
                    <FormItem>
                      <FormLabel>分类</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.category} onInput={(e: Event) => (editForm.value.category = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-screens">
                    <FormItem>
                      <FormLabel>画面数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.screens} onInput={(e: Event) => (editForm.value.screens = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-variables">
                    <FormItem>
                      <FormLabel>变量数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.variables} onInput={(e: Event) => (editForm.value.variables = (e.target as HTMLInputElement).value)} />
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
    
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.value.map((tpl) => (
              <Card key={tpl.id} class="group transition-colors hover:border-primary/30">
                <CardContent class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <LayoutTemplate class="h-5 w-5" />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-card-foreground">{tpl.name}</h3>
                      <p class="mt-0.5 text-xs text-muted-foreground leading-relaxed">{tpl.desc}</p>
                    </div>
                  </div>
                  <div class="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div class="flex items-center gap-2">
                      <Badge variant="outline" class={`text-[10px] ${categoryColors[tpl.category] || ""}`}>{tpl.category}</Badge>
                      <span class="text-[11px] text-muted-foreground">{`${tpl.screens} 画面 / ${tpl.variables} 变量`}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                            <MoreHorizontal class="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => startEdit(tpl)}>编辑</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => duplicateTemplate(tpl)}>复制</DropdownMenuItem>
                          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(tpl.id)}>删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span class="text-[10px] text-muted-foreground">{`${tpl.uses} 次使用`}</span>
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

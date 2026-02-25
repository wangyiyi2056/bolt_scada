<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Variable, MoreHorizontal } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

type VarTemplate = {
  id: string
  name: string
  desc: string
  variables: number
  dataTypes: string
  category: string
  uses: number
  [key: string]: unknown
}

const initialTemplates: VarTemplate[] = [
  { id: "VT01", name: "三相电力参数集", desc: "Ua/Ub/Uc、Ia/Ib/Ic、P/Q/S/PF/F", variables: 32, dataTypes: "Float32", category: "电力", uses: 18 },
  { id: "VT02", name: "温度采集标准集", desc: "温度值、上上限、上限、下限、下下限、状态", variables: 6, dataTypes: "Float32/Bool", category: "温度", uses: 45 },
  { id: "VT03", name: "阀门控制集", desc: "开度反馈、开度设定、开阀、关阀、故障、限位", variables: 8, dataTypes: "Float32/Bool", category: "控制", uses: 32 },
  { id: "VT04", name: "泵站运行参数集", desc: "运行状态、频率、电流、故障码、运行时间", variables: 12, dataTypes: "Mixed", category: "动力", uses: 20 },
  { id: "VT05", name: "流量计参数集", desc: "瞬时流量、累积流量、流速、管径", variables: 4, dataTypes: "Float32", category: "流量", uses: 28 },
  { id: "VT06", name: "PID 控制回路集", desc: "PV/SV/MV/P/I/D/Auto/Manual", variables: 8, dataTypes: "Float32/Bool", category: "控制", uses: 15 },
]

const templates = ref<VarTemplate[]>(initialTemplates)
const createOpen = ref(false)
const editOpen = ref(false)
const createForm = ref({ name: "", desc: "", variables: "0", dataTypes: "Float32", category: "通用" })
const editForm = ref({ id: "", name: "", desc: "", variables: "0", dataTypes: "Float32", category: "通用" })
const deleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function nextTemplateId() {
  const maxId = templates.value.reduce((max, item) => {
    const num = Number.parseInt(item.id.replace("VT", ""), 10)
    return Number.isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `VT${String(maxId + 1).padStart(2, "0")}`
}

function createTemplate() {
  const name = createForm.value.name.trim()
  if (!name) return
  templates.value.unshift({
    id: nextTemplateId(),
    name,
    desc: createForm.value.desc.trim() || "未填写模板描述",
    variables: Number.parseInt(createForm.value.variables, 10) || 0,
    dataTypes: createForm.value.dataTypes.trim() || "Mixed",
    category: createForm.value.category.trim() || "通用",
    uses: 0,
  })
  createForm.value = { name: "", desc: "", variables: "0", dataTypes: "Float32", category: "通用" }
  createOpen.value = false
}

function startEdit(template: VarTemplate) {
  editForm.value = {
    id: template.id,
    name: template.name,
    desc: template.desc,
    variables: String(template.variables),
    dataTypes: template.dataTypes,
    category: template.category,
  }
  editOpen.value = true
}

function saveEdit() {
  const index = templates.value.findIndex((item) => item.id === editForm.value.id)
  if (index < 0) return
  templates.value[index] = {
    ...templates.value[index],
    name: editForm.value.name.trim() || templates.value[index].name,
    desc: editForm.value.desc.trim() || "未填写模板描述",
    variables: Number.parseInt(editForm.value.variables, 10) || 0,
    dataTypes: editForm.value.dataTypes.trim() || "Mixed",
    category: editForm.value.category.trim() || "通用",
  }
  editOpen.value = false
}

function duplicateTemplate(template: VarTemplate) {
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

const columns: Column<VarTemplate>[] = [
  { key: "id", title: "ID", className: "w-[60px] font-mono text-xs" },
  {
    key: "name",
    title: "模板名称",
    render: (t) => (
      <div class="flex items-center gap-2">
        <Variable class="h-3.5 w-3.5 text-muted-foreground" />
        <span class="font-medium text-card-foreground">{t.name}</span>
      </div>
    ),
  },
  { key: "desc", title: "包含变量", className: "text-xs text-muted-foreground max-w-[240px] truncate" },
  { key: "variables", title: "变量数" },
  { key: "dataTypes", title: "数据类型", render: (t) => <Badge variant="outline" class="font-mono text-[10px]">{t.dataTypes}</Badge> },
  { key: "category", title: "分类", render: (t) => <Badge variant="outline" class="text-[10px]">{t.category}</Badge> },
  { key: "uses", title: "使用次数" },
  {
    key: "actions",
    title: "",
    className: "w-[40px]",
    render: (t) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground">
            <MoreHorizontal class="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startEdit(t)}>编辑</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => duplicateTemplate(t)}>复制</DropdownMenuItem>
          <DropdownMenuItem class="text-destructive" onSelect={() => requestDelete(t.id)}>删除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

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
    
          <PageHeader title="变量模板" description="预定义变量集合模板，快速批量添加变量">
            <Dialog open={createOpen.value} onOpenChange={(open: boolean) => (createOpen.value = open)}>
              <DialogTrigger asChild>
                <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus class="h-3.5 w-3.5" />
                  <span>{"创建模板"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建变量模板</DialogTitle>
                  <DialogDescription>补全变量模板新增弹框。</DialogDescription>
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
                    <FormField name="create-variables">
                      <FormItem>
                        <FormLabel>变量数</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.variables} onInput={(e: Event) => (createForm.value.variables = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-datatypes">
                      <FormItem>
                        <FormLabel>数据类型</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.dataTypes} onInput={(e: Event) => (createForm.value.dataTypes = (e.target as HTMLInputElement).value)} />
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="create-category">
                      <FormItem>
                        <FormLabel>分类</FormLabel>
                        <FormControl>
                          <Input value={createForm.value.category} onInput={(e: Event) => (createForm.value.category = (e.target as HTMLInputElement).value)} />
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
                <DialogTitle>编辑变量模板</DialogTitle>
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
                  <FormField name="edit-variables">
                    <FormItem>
                      <FormLabel>变量数</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.variables} onInput={(e: Event) => (editForm.value.variables = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-datatypes">
                    <FormItem>
                      <FormLabel>数据类型</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.dataTypes} onInput={(e: Event) => (editForm.value.dataTypes = (e.target as HTMLInputElement).value)} />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField name="edit-category">
                    <FormItem>
                      <FormLabel>分类</FormLabel>
                      <FormControl>
                        <Input value={editForm.value.category} onInput={(e: Event) => (editForm.value.category = (e.target as HTMLInputElement).value)} />
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
    
          <DataTable columns={columns} data={templates.value} searchPlaceholder="搜索模板名称..." />
        </div>
      )
  }
})
</script>

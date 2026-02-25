<script lang="tsx">
import { defineComponent } from "vue"
import { ChevronRight, Check, X } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const menuPermissions = [
  {
    module: "仪表盘", children: [
      { name: "系统概览", admin: true, engineer: true, operator: true, viewer: true },
      { name: "运行监控", admin: true, engineer: true, operator: true, viewer: true },
      { name: "统计分析", admin: true, engineer: true, operator: false, viewer: false },
    ],
  },
  {
    module: "项目工程", children: [
      { name: "项目列表", admin: true, engineer: true, operator: false, viewer: false },
      { name: "工程管理", admin: true, engineer: true, operator: false, viewer: false },
      { name: "画面管理", admin: true, engineer: true, operator: false, viewer: false },
      { name: "模板库", admin: true, engineer: true, operator: false, viewer: false },
      { name: "版本管理", admin: true, engineer: true, operator: false, viewer: false },
      { name: "发布部署", admin: true, engineer: false, operator: false, viewer: false },
    ],
  },
  {
    module: "设备管理", children: [
      { name: "设备列表", admin: true, engineer: true, operator: true, viewer: false },
      { name: "设备分组", admin: true, engineer: true, operator: false, viewer: false },
      { name: "设备模板", admin: true, engineer: true, operator: false, viewer: false },
      { name: "设备状态", admin: true, engineer: true, operator: true, viewer: true },
      { name: "设备拓扑", admin: true, engineer: true, operator: true, viewer: true },
    ],
  },
  {
    module: "报警管理", children: [
      { name: "报警规则", admin: true, engineer: true, operator: false, viewer: false },
      { name: "实时报警", admin: true, engineer: true, operator: true, viewer: true },
      { name: "历史报警", admin: true, engineer: true, operator: true, viewer: false },
      { name: "报警确认", admin: true, engineer: true, operator: true, viewer: false },
    ],
  },
  {
    module: "权限管理", children: [
      { name: "用户管理", admin: true, engineer: false, operator: false, viewer: false },
      { name: "角色管理", admin: true, engineer: false, operator: false, viewer: false },
      { name: "菜单权限", admin: true, engineer: false, operator: false, viewer: false },
      { name: "数据权限", admin: true, engineer: false, operator: false, viewer: false },
    ],
  },
]

const roles = ["admin", "engineer", "operator", "viewer"] as const
const roleLabels: Record<string, string> = {
  admin: "管理员",
  engineer: "工程师",
  operator: "操作员",
  viewer: "观察者",
}

function PermIcon({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Check class="h-4 w-4 text-success" />
  ) : (
    <X class="h-4 w-4 text-muted-foreground/40" />
  )
}

export default defineComponent({
  name: "menusPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="菜单权限" description="配置各角色对菜单功能的访问权限">
            <Select defaultValue="all">
              <SelectTrigger class="h-8 w-[140px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"全部角色"}</SelectItem>
                <SelectItem value="admin">{"管理员"}</SelectItem>
                <SelectItem value="engineer">{"工程师"}</SelectItem>
                <SelectItem value="operator">{"操作员"}</SelectItem>
                <SelectItem value="viewer">{"观察者"}</SelectItem>
              </SelectContent>
            </Select>
          </PageHeader>
    
          <Card>
            <CardContent class="p-0">
              <div class="overflow-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-border">
                      <th class="px-4 py-3 text-left font-medium text-muted-foreground w-[200px]">{"模块 / 菜单"}</th>
                      {roles.map((r) => (
                        <th key={r} class="px-4 py-3 text-center font-medium text-muted-foreground w-[100px]">
                          {roleLabels[r]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {menuPermissions.map((group) => (
                      <>
                        <tr key={group.module} class="bg-muted/30">
                          <td class="px-4 py-2 font-medium text-card-foreground" colSpan={5}>
                            <div class="flex items-center gap-1.5">
                              <ChevronRight class="h-3.5 w-3.5 text-muted-foreground" />
                              {group.module}
                            </div>
                          </td>
                        </tr>
                        {group.children.map((item) => (
                          <tr key={item.name} class="border-b border-border last:border-b-0 hover:bg-muted/20">
                            <td class="px-4 py-2 pl-9 text-xs text-card-foreground">{item.name}</td>
                            <td class="px-4 py-2 text-center"><PermIcon allowed={item.admin} /></td>
                            <td class="px-4 py-2 text-center"><PermIcon allowed={item.engineer} /></td>
                            <td class="px-4 py-2 text-center"><PermIcon allowed={item.operator} /></td>
                            <td class="px-4 py-2 text-center"><PermIcon allowed={item.viewer} /></td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
  }
})
</script>

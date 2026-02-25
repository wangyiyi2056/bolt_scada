<script lang="tsx">
import { defineComponent } from "vue"
import { Upload, Shield, CheckCircle2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/ui/page-header"

const licenseInfo = {
  type: "企业版",
  company: "示例科技有限公司",
  key: "SCADA-ENT-XXXX-XXXX-XXXX-XXXX",
  issueDate: "2025-01-01",
  expireDate: "2026-12-31",
  maxNodes: 10,
  maxDevices: 200,
  maxVariables: 10000,
  maxUsers: 50,
  currentNodes: 6,
  currentDevices: 26,
  currentVariables: 2688,
  currentUsers: 8,
}

const features = [
  { name: "组态编辑器", included: true },
  { name: "实时数据采集", included: true },
  { name: "报警管理", included: true },
  { name: "脚本引擎", included: true },
  { name: "历史数据查询", included: true },
  { name: "多节点管理", included: true },
  { name: "边缘计算", included: true },
  { name: "高可用集群", included: true },
  { name: "API 开放平台", included: true },
  { name: "AI 智能诊断", included: false },
]

function UsageBar({ current, max, label }: { current: number; max: number; label: string }) {
  const pct = (current / max) * 100
  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-muted-foreground">{label}</span>
        <span class="font-mono text-card-foreground">{`${current} / ${max}`}</span>
      </div>
      <div class="relative h-1.5 rounded-full bg-secondary">
        <div
          class={`absolute inset-y-0 left-0 rounded-full ${pct >= 80 ? "bg-destructive" : pct >= 60 ? "bg-warning" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default defineComponent({
  name: "licensePage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="许可证" description="查看和管理平台授权许可">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload class="h-3.5 w-3.5" />
              <span>{"更新许可证"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div class="flex items-center justify-between">
                  <div>
                    <CardTitle class="text-sm text-card-foreground">{"许可证信息"}</CardTitle>
                    <CardDescription>{"当前授权状态和有效期"}</CardDescription>
                  </div>
                  <Badge class="bg-success text-success-foreground">{"有效"}</Badge>
                </div>
              </CardHeader>
              <CardContent class="flex flex-col gap-3">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground">{"许可类型"}</span>
                  <Badge variant="outline" class="text-[10px] bg-primary/10 text-primary border-primary/20">{licenseInfo.type}</Badge>
                </div>
                <Separator />
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground">{"授权单位"}</span>
                  <span class="text-card-foreground">{licenseInfo.company}</span>
                </div>
                <Separator />
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground">{"许可密钥"}</span>
                  <code class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-card-foreground">{licenseInfo.key}</code>
                </div>
                <Separator />
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground">{"颁发日期"}</span>
                  <span class="font-mono text-card-foreground">{licenseInfo.issueDate}</span>
                </div>
                <Separator />
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-muted-foreground">{"到期日期"}</span>
                  <span class="font-mono text-card-foreground">{licenseInfo.expireDate}</span>
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"资源用量"}</CardTitle>
                <CardDescription>{"当前使用量与授权上限"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <UsageBar current={licenseInfo.currentNodes} max={licenseInfo.maxNodes} label="节点数" />
                <UsageBar current={licenseInfo.currentDevices} max={licenseInfo.maxDevices} label="设备数" />
                <UsageBar current={licenseInfo.currentVariables} max={licenseInfo.maxVariables} label="变量数" />
                <UsageBar current={licenseInfo.currentUsers} max={licenseInfo.maxUsers} label="用户数" />
              </CardContent>
            </Card>
    
            <Card class="lg:col-span-2">
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"功能模块"}</CardTitle>
                <CardDescription>{"当前许可证包含的功能列表"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {features.map((f) => (
                    <div key={f.name} class={`flex items-center gap-2 rounded-lg border p-2.5 ${f.included ? "border-border" : "border-border opacity-50"}`}>
                      <CheckCircle2 class={`h-4 w-4 shrink-0 ${f.included ? "text-success" : "text-muted-foreground"}`} />
                      <span class="text-xs text-card-foreground">{f.name}</span>
                      {!f.included && <Badge variant="outline" class="ml-auto text-[9px]">{"未授权"}</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
  }
})
</script>

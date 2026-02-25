<script lang="tsx">
import { defineComponent } from "vue"
import { GitBranch, GitCommit, Tag, RotateCcw } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

const versions = [
  { version: "v2.3.1", project: "智慧水务监控系统", date: "2026-02-09 14:00", author: "张明", type: "patch", changes: 3, desc: "修复管网压力显示异常", current: true },
  { version: "v2.3.0", project: "智慧水务监控系统", date: "2026-02-07 16:30", author: "王芳", type: "minor", changes: 12, desc: "新增水质监测画面", current: false },
  { version: "v1.8.2", project: "电力变电站综合自动化", date: "2026-02-06 11:00", author: "李华", type: "patch", changes: 5, desc: "更新保护装置通信参数", current: true },
  { version: "v3.0.0", project: "园区能源管理平台", date: "2026-02-05 09:30", author: "张明", type: "major", changes: 45, desc: "大版本升级，新增储能管理模块", current: true },
  { version: "v2.2.0", project: "智慧水务监控系统", date: "2026-02-03 15:20", author: "王芳", type: "minor", changes: 8, desc: "优化报警阈值配置", current: false },
  { version: "v1.8.1", project: "电力变电站综合自动化", date: "2026-02-01 14:00", author: "李华", type: "patch", changes: 2, desc: "修复遥测数据精度问题", current: false },
  { version: "v1.2.0", project: "工业锅炉 DCS 系统", date: "2026-01-28 10:00", author: "赵强", type: "minor", changes: 15, desc: "新增安全联锁逻辑", current: true },
  { version: "v2.9.0", project: "园区能源管理平台", date: "2026-01-25 16:45", author: "张明", type: "minor", changes: 20, desc: "充电桩管理功能上线", current: false },
]

const typeConfig: Record<string, { label: string; className: string }> = {
  major: { label: "主版本", className: "bg-destructive/10 text-destructive border-destructive/20" },
  minor: { label: "功能版本", className: "bg-primary/10 text-primary border-primary/20" },
  patch: { label: "修复版本", className: "bg-success/10 text-success border-success/20" },
}

export default defineComponent({
  name: "versionsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="版本管理" description="项目工程版本记录与回滚管理" />
    
          <div class="flex flex-col gap-4">
            {versions.map((v) => {
              const cfg = typeConfig[v.type]
              return (
                <Card key={`${v.project}-${v.version}`} class="transition-colors hover:border-primary/30">
                  <CardContent class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-4">
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <GitCommit class="h-5 w-5" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-mono text-sm font-semibold text-card-foreground">{v.version}</span>
                          <Badge variant="outline" class={`text-[10px] ${cfg.className}`}>{cfg.label}</Badge>
                          {v.current && <Badge variant="outline" class="text-[10px] bg-success/10 text-success border-success/20">{"当前版本"}</Badge>}
                        </div>
                        <p class="mt-0.5 text-xs text-muted-foreground">{v.desc}</p>
                        <div class="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>{v.project}</span>
                          <span>{v.author}</span>
                          <span>{v.date}</span>
                          <span>{`${v.changes} 项变更`}</span>
                        </div>
                      </div>
                    </div>
                    {!v.current && (
                      <Button variant="outline" size="sm" class="h-7 gap-1.5 bg-transparent text-xs">
                        <RotateCcw class="h-3 w-3" />
                        <span>{"回滚"}</span>
                      </Button>
                    )}
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

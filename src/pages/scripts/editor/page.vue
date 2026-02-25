<script lang="tsx">
import { defineComponent } from "vue"
import { Play, Save, RotateCcw, FileCode2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"
import { Separator } from "@/components/ui/separator"

const sampleCode = `// 数据质量检测脚本
// 触发方式：每 5 分钟执行一次

const QUALITY_THRESHOLD = 0.95;

async function checkDataQuality(variables) {
  const results = [];

  for (const v of variables) {
    const samples = await getRecentSamples(v.id, 300);
    const validCount = samples.filter(s => s.quality === 'good').length;
    const ratio = validCount / samples.length;

    if (ratio < QUALITY_THRESHOLD) {
      results.push({
        variableId: v.id,
        name: v.name,
        quality: ratio,
        status: 'abnormal',
        message: \`数据质量 \${(ratio * 100).toFixed(1)}% 低于阈值\`
      });
    }
  }

  if (results.length > 0) {
    await createAlarm({
      level: 'warning',
      source: 'data-quality-check',
      count: results.length,
      details: results
    });
  }

  return { checked: variables.length, issues: results.length };
}`

const outputLines = [
  { time: "14:30:00.012", level: "INFO", msg: "脚本启动: 数据质量检测" },
  { time: "14:30:00.045", level: "INFO", msg: "加载变量列表: 共 1,024 个" },
  { time: "14:30:01.123", level: "INFO", msg: "批次 1/4 检测完成 (256 变量)" },
  { time: "14:30:01.856", level: "INFO", msg: "批次 2/4 检测完成 (256 变量)" },
  { time: "14:30:02.534", level: "WARN", msg: "变量 [锅炉出口温度] 数据质量 89.2% 低于阈值" },
  { time: "14:30:02.678", level: "INFO", msg: "批次 3/4 检测完成 (256 变量)" },
  { time: "14:30:03.201", level: "INFO", msg: "批次 4/4 检测完成 (256 变量)" },
  { time: "14:30:03.205", level: "INFO", msg: "检测完成: 1,024 变量, 1 个异常, 耗时 1.2s" },
]

const levelStyles: Record<string, string> = {
  INFO: "text-muted-foreground",
  WARN: "text-warning",
  ERROR: "text-destructive",
}

export default defineComponent({
  name: "editorPage",
  setup() {
    return () => (
        <div class="flex flex-col gap-4">
          <PageHeader title="脚本编辑器" description="在线编辑和调试自动化脚本">
            <Select defaultValue="SCR-001">
              <SelectTrigger class="h-8 w-[200px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SCR-001">{"数据质量检测"}</SelectItem>
                <SelectItem value="SCR-002">{"报警聚合处理"}</SelectItem>
                <SelectItem value="SCR-003">{"日报表生成"}</SelectItem>
                <SelectItem value="SCR-004">{"设备健康评估"}</SelectItem>
              </SelectContent>
            </Select>
          </PageHeader>
    
          <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
            {/* Code editor area */}
            <Card class="flex flex-col">
              <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
                <div class="flex items-center gap-2">
                  <FileCode2 class="h-4 w-4 text-muted-foreground" />
                  <CardTitle class="text-sm text-card-foreground">{"data-quality-check.js"}</CardTitle>
                  <Badge variant="outline" class="text-[10px] bg-warning/10 text-warning border-warning/20">{"JavaScript"}</Badge>
                </div>
                <div class="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" class="h-7 gap-1 bg-transparent text-xs">
                    <RotateCcw class="h-3 w-3" />
                    <span>{"重置"}</span>
                  </Button>
                  <Button variant="outline" size="sm" class="h-7 gap-1 bg-transparent text-xs">
                    <Save class="h-3 w-3" />
                    <span>{"保存"}</span>
                  </Button>
                  <Button size="sm" class="h-7 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                    <Play class="h-3 w-3" />
                    <span>{"运行"}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent class="flex-1 pt-0">
                <div class="relative rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-6 overflow-auto max-h-[480px]">
                  <pre class="text-card-foreground whitespace-pre-wrap">{sampleCode}</pre>
                </div>
              </CardContent>
            </Card>
    
            {/* Output panel */}
            <div class="flex flex-col gap-4">
              <Card class="flex-1">
                <CardHeader class="pb-2">
                  <CardTitle class="text-sm text-card-foreground">{"运行输出"}</CardTitle>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="rounded-lg border border-border bg-muted/30 p-3 font-mono text-[11px] leading-5 max-h-[300px] overflow-auto">
                    {outputLines.map((line, i) => (
                      <div key={i} class="flex gap-2">
                        <span class="text-muted-foreground shrink-0">{line.time}</span>
                        <span class={`shrink-0 w-10 ${levelStyles[line.level] || ""}`}>{`[${line.level}]`}</span>
                        <span class="text-card-foreground">{line.msg}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
    
              <Card>
                <CardHeader class="pb-2">
                  <CardTitle class="text-sm text-card-foreground">{"脚本属性"}</CardTitle>
                </CardHeader>
                <CardContent class="pt-0">
                  <div class="flex flex-col gap-2 text-[11px]">
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"语言"}</span>
                      <span class="text-card-foreground">{"JavaScript"}</span>
                    </div>
                    <Separator />
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"触发方式"}</span>
                      <span class="text-card-foreground">{"每 5 分钟"}</span>
                    </div>
                    <Separator />
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"上次运行"}</span>
                      <span class="text-card-foreground">{"14:30:00"}</span>
                    </div>
                    <Separator />
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"平均耗时"}</span>
                      <span class="text-card-foreground">{"1.2s"}</span>
                    </div>
                    <Separator />
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">{"创建时间"}</span>
                      <span class="text-card-foreground">{"2025-11-15"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
  }
})
</script>

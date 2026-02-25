<script lang="tsx">
import { defineComponent } from "vue"
import { Monitor, Moon, Sun, Save } from "lucide-vue-next"
import { useTheme, type ThemeMode } from "@/composables/use-theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/page-header"

const themeOptions = [
  { value: "light", label: "浅色模式", icon: Sun, desc: "明亮的背景配色，适合日间使用" },
  { value: "dark", label: "深色模式", icon: Moon, desc: "暗色的背景配色，适合长时间监控" },
  { value: "system", label: "跟随系统", icon: Monitor, desc: "自动跟随操作系统主题设置" },
]

export default defineComponent({
  name: "appearancePage",
  setup() {
    const { theme, setTheme } = useTheme()
    
      return () => (
        <div class="page-shell">
          <PageHeader title="主题外观" description="自定义平台显示风格和外观设置">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save class="h-3.5 w-3.5" />
              <span>{"保存设置"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"主题模式"}</CardTitle>
                <CardDescription>{"选择界面的颜色主题"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="grid gap-3">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon
                    const isActive = theme.value === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTheme(opt.value as ThemeMode)}
                        class={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                          isActive
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div class={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          <Icon class="h-4 w-4" />
                        </div>
                        <div>
                          <div class="text-sm font-medium text-card-foreground">{opt.label}</div>
                          <div class="text-[11px] text-muted-foreground">{opt.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">{"显示设置"}</CardTitle>
                <CardDescription>{"调整界面布局和显示偏好"}</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"侧边栏默认状态"}</Label>
                  <Select defaultValue="expanded">
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expanded">{"展开"}</SelectItem>
                      <SelectItem value="collapsed">{"收起"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"默认语言"}</Label>
                  <Select defaultValue="zh-CN">
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">{"简体中文"}</SelectItem>
                      <SelectItem value="en-US">{"English"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-2">
                  <Label class="text-xs">{"日期格式"}</Label>
                  <Select defaultValue="yyyy-MM-dd">
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yyyy-MM-dd">{"YYYY-MM-DD"}</SelectItem>
                      <SelectItem value="dd/MM/yyyy">{"DD/MM/YYYY"}</SelectItem>
                      <SelectItem value="MM/dd/yyyy">{"MM/DD/YYYY"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"紧凑模式"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"减小间距和字号以显示更多内容"}</p>
                  </div>
                  <Switch />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-xs">{"动画效果"}</Label>
                    <p class="text-[11px] text-muted-foreground">{"启用界面过渡动画"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
  }
})
</script>

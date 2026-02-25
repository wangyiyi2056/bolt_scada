<script lang="tsx">
import { defineComponent } from "vue"
import { ref } from "vue"
import { Monitor, Moon, Save, Sun, UserRound } from "lucide-vue-next"
import { useTheme, type ThemeMode } from "@/composables/use-theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PageHeader } from "@/components/ui/page-header"

const themeOptions: Array<{ value: ThemeMode; label: string; icon: any }> = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
  { value: "system", label: "跟随系统", icon: Monitor },
]

export default defineComponent({
  name: "profilePage",
  setup() {
    const { theme, setTheme } = useTheme()
    
      const profile = ref({
        name: "Admin",
        email: "admin@scada.local",
        phone: "13800000000",
        department: "运维部",
        title: "系统管理员",
        timezone: "Asia/Shanghai",
      })
    
      return () => (
        <div class="page-shell">
          <PageHeader title="个人信息" description="管理账户资料、联系方式与个性化偏好">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save class="h-3.5 w-3.5" />
              <span>保存资料</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">基础资料</CardTitle>
                <CardDescription>用于展示在系统中的个人信息</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <Avatar class="h-12 w-12">
                    <AvatarFallback class="bg-primary/10 text-primary">
                      <UserRound class="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div class="text-xs text-muted-foreground">头像上传功能可在后续接入对象存储后启用</div>
                </div>
    
                <div class="grid gap-2">
                  <Label class="text-xs">姓名</Label>
                  <Input
                    value={profile.value.name}
                    class="h-8 text-sm"
                    onInput={(e: Event) => (profile.value.name = (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid gap-2">
                  <Label class="text-xs">邮箱</Label>
                  <Input
                    value={profile.value.email}
                    class="h-8 text-sm"
                    onInput={(e: Event) => (profile.value.email = (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid gap-2">
                  <Label class="text-xs">手机号</Label>
                  <Input
                    value={profile.value.phone}
                    class="h-8 text-sm"
                    onInput={(e: Event) => (profile.value.phone = (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid gap-2">
                  <Label class="text-xs">部门</Label>
                  <Input
                    value={profile.value.department}
                    class="h-8 text-sm"
                    onInput={(e: Event) => (profile.value.department = (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid gap-2">
                  <Label class="text-xs">岗位</Label>
                  <Input
                    value={profile.value.title}
                    class="h-8 text-sm"
                    onInput={(e: Event) => (profile.value.title = (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class="grid gap-2">
                  <Label class="text-xs">时区</Label>
                  <Select modelValue={profile.value.timezone} onChange={(value: string) => (profile.value.timezone = value)}>
                    <SelectTrigger class="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader>
                <CardTitle class="text-sm text-card-foreground">主题与显示</CardTitle>
                <CardDescription>主题切换已迁移到设置内管理</CardDescription>
              </CardHeader>
              <CardContent class="flex flex-col gap-3">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon
                  const active = theme.value === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTheme(opt.value)}
                      class={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div class={`flex h-8 w-8 items-center justify-center rounded-md ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        <Icon class="h-4 w-4" />
                      </div>
                      <div class="text-sm text-card-foreground">{opt.label}</div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )
  }
})
</script>

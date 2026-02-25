<script lang="tsx">
import { defineComponent } from "vue"
import { Save, Send } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"

const channels = [
  {
    name: "邮件通知", desc: "通过 SMTP 发送邮件通知", enabled: true,
    fields: [
      { label: "SMTP 服务器", value: "smtp.example.com", type: "text" },
      { label: "端口", value: "465", type: "number" },
      { label: "发件人", value: "scada@example.com", type: "email" },
    ],
  },
  {
    name: "企业微信", desc: "通过 Webhook 推送至企微群", enabled: true,
    fields: [
      { label: "Webhook URL", value: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx", type: "url" },
    ],
  },
  {
    name: "钉钉", desc: "通过 Webhook 推送至钉钉群", enabled: false,
    fields: [
      { label: "Webhook URL", value: "", type: "url" },
      { label: "签名密钥", value: "", type: "password" },
    ],
  },
  {
    name: "短信通知", desc: "通过短信网关发送紧急通知", enabled: true,
    fields: [
      { label: "API 地址", value: "https://sms-api.example.com/v1/send", type: "url" },
      { label: "API Key", value: "sk-xxxxxxxxxxxx", type: "password" },
    ],
  },
]

export default defineComponent({
  name: "notificationsPage",
  setup() {
    return () => (
        <div class="page-shell">
          <PageHeader title="通知配置" description="配置系统通知渠道和参数">
            <Button size="sm" class="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save class="h-3.5 w-3.5" />
              <span>{"保存配置"}</span>
            </Button>
          </PageHeader>
    
          <div class="grid gap-4 lg:grid-cols-2">
            {channels.map((ch) => (
              <Card key={ch.name} class={`transition-colors ${!ch.enabled ? "opacity-60" : ""}`}>
                <CardHeader class="pb-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <CardTitle class="text-sm text-card-foreground">{ch.name}</CardTitle>
                        <Badge variant="outline" class={`text-[10px] ${ch.enabled ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}>
                          {ch.enabled ? "已启用" : "未启用"}
                        </Badge>
                      </div>
                      <CardDescription class="mt-0.5">{ch.desc}</CardDescription>
                    </div>
                    <Switch defaultChecked={ch.enabled} />
                  </div>
                </CardHeader>
                <CardContent class="flex flex-col gap-3 pt-0">
                  {ch.fields.map((field) => (
                    <div key={field.label} class="flex flex-col gap-1.5">
                      <Label class="text-xs">{field.label}</Label>
                      <Input
                        type={field.type}
                        defaultValue={field.value}
                        placeholder={`请输入${field.label}`}
                        class="h-8 text-sm font-mono"
                      />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" class="mt-1 h-7 gap-1 self-start bg-transparent text-xs">
                    <Send class="h-3 w-3" />
                    <span>{"发送测试"}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
  }
})
</script>

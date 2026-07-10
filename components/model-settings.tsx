import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SettingsProfileStandard({ temp, topP, onUpdate }: { temp?: number, topP?: number, onUpdate: (key: string, value: number) => void }) {
  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
      <div className="space-y-1">
        <Label>الحرارة (Temperature): {temp ?? 0.7}</Label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temp ?? 0.7}
          onChange={(e) => onUpdate("temperature", parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <p className="text-xs text-muted-foreground">0 = دقيق ومحدد • 1 = متوازن • 2 = إبداعي</p>
      </div>
      {topP !== undefined && (
        <div className="space-y-1">
          <Label>Top P: {topP ?? 0.9}</Label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={topP ?? 0.9}
            onChange={(e) => onUpdate("top_p", parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted-foreground">يتحكم بتنوع الكلمات المختارة</p>
        </div>
      )}
    </div>
  )
}

export function SettingsProfileReasoning({ effort, verbosity, onUpdate }: { effort?: string, verbosity?: string, onUpdate: (key: string, value: string) => void }) {
  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
      <div className="space-y-1">
        <Label>مستوى التفكير (Reasoning Effort)</Label>
        <Select
          value={effort || undefined}
          onValueChange={(val) => onUpdate("reasoningEffort", val)}
        >
          <SelectTrigger className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <SelectValue placeholder="اختر مستوى التفكير..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">none</SelectItem>
            <SelectItem value="low">low</SelectItem>
            <SelectItem value="medium">medium</SelectItem>
            <SelectItem value="high">high</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">يحدد عمق تفكير النموذج قبل الإجابة</p>
      </div>
      {verbosity !== undefined && (
        <div className="space-y-1">
          <Label>الإسهاب (Verbosity)</Label>
          <Select
            value={verbosity || undefined}
            onValueChange={(val) => onUpdate("verbosity", val)}
          >
            <SelectTrigger className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="اختر الإسهاب..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">low (موجز)</SelectItem>
              <SelectItem value="medium">medium (متوازن)</SelectItem>
              <SelectItem value="high">high (مفصل)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">يحدد كمية الشرح في الإجابة النهائية</p>
        </div>
      )}
    </div>
  )
}

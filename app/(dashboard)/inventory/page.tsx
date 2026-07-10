"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FloppyDisk, Plus, Trash, SpinnerGap } from "@phosphor-icons/react"
import { WORKER_BASE_URL } from "@/lib/agent-flow"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { isReasoningModel } from "@/lib/utils"

function SettingsProfileStandard({ temp, onUpdate }: { temp?: number, onUpdate: (val: number) => void }) {
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
          onChange={(e) => onUpdate(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <p className="text-xs text-muted-foreground">0 = دقيق ومحدد • 1 = متوازن • 2 = إبداعي</p>
      </div>
    </div>
  )
}

function SettingsProfileReasoning({ effort, verbosity, onUpdateEffort, onUpdateVerbosity }: { effort?: string, verbosity?: string, onUpdateEffort: (val: string) => void, onUpdateVerbosity: (val: string) => void }) {
  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-border/50">
      <div className="space-y-1">
        <Label>مستوى التفكير (Reasoning Effort)</Label>
        <Select value={effort || "medium"} onValueChange={onUpdateEffort}>
          <SelectTrigger className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm text-foreground">
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
      <div className="space-y-1">
        <Label>مستوى التفصيل (Verbosity)</Label>
        <Select value={verbosity || "low"} onValueChange={onUpdateVerbosity}>
          <SelectTrigger className="w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm text-foreground">
            <SelectValue placeholder="اختر مستوى التفصيل..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">low (قصير ومباشر)</SelectItem>
            <SelectItem value="medium">medium (متوازن)</SelectItem>
            <SelectItem value="high">high (طويل ومفصل)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">يحدد طول وكثافة إجابة النموذج</p>
      </div>
    </div>
  )
}

interface InventoryModule {
  description: string;
  tools: string[];
  prompt: string;
  is_final_responder_tool?: boolean;
}

type Inventory = Record<string, InventoryModule>;

const DEFAULT_INVENTORY: Inventory = {
  "data_agent": {
    description: "يجلب أسعار الجامعات وتفاصيلها (مثل لغة الدراسة، الخصومات).",
    tools: ["searchAlgolia"],
    prompt: "أنت مسؤول البيانات. استخدم بحث ألجوليا لجلب أسعار وتفاصيل الجامعات. اذكر السعر بشكل دقيق، ولا تذكر أي جامعات حكومية."
  },
  "knowledge_agent": {
    description: "يجلب قوانين القبول، متطلبات الفيزا، وامتحان اليوس.",
    tools: ["searchPinecone"],
    prompt: "أنت مسؤول القوانين والمعرفة. ابحث في باينكون عن شروط القبول والفيزا وأجب بدقة تامة وبدون هلوسة بناءً على الداتا المسترجعة فقط."
  }
};

export default function InventoryPage() {
  // Main Bot States
  const [basePrompt, setBasePrompt] = useState<string>("");
  const [routerModel, setRouterModel] = useState<string>("gpt-4o-mini");
  const [routerTemp, setRouterTemp] = useState<number>(0.7);
  const [routerReasoning, setRouterReasoning] = useState<string>("low");
  const [answeringModel, setAnsweringModel] = useState<string>("gpt-4o");
  const [answeringTemp, setAnsweringTemp] = useState<number>(0.7);
  const [answeringReasoning, setAnsweringReasoning] = useState<string>("low");
  const [routerVerbosity, setRouterVerbosity] = useState<string>("low");
  const [answeringVerbosity, setAnsweringVerbosity] = useState<string>("low");
  const [inventory, setInventory] = useState<Inventory>({});

  // Staff Assistant States
  const [staffBasePrompt, setStaffBasePrompt] = useState<string>("");
  const [staffRouterModel, setStaffRouterModel] = useState<string>("gpt-4o-mini");
  const [staffRouterTemp, setStaffRouterTemp] = useState<number>(0.7);
  const [staffRouterReasoning, setStaffRouterReasoning] = useState<string>("low");
  const [staffAnsweringModel, setStaffAnsweringModel] = useState<string>("gpt-4o");
  const [staffAnsweringTemp, setStaffAnsweringTemp] = useState<number>(0.7);
  const [staffAnsweringReasoning, setStaffAnsweringReasoning] = useState<string>("low");
  const [staffRouterVerbosity, setStaffRouterVerbosity] = useState<string>("low");
  const [staffAnsweringVerbosity, setStaffAnsweringVerbosity] = useState<string>("low");
  const [staffInventory, setStaffInventory] = useState<Inventory>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`/api/worker/admin/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const json = await res.json();
        const data = json.settings || {};
        
        // Load Main Bot
        if (data.base_prompt) setBasePrompt(data.base_prompt);
        else setBasePrompt("أنت مستشار تعليمي خبير..."); 
        if (data.router_model) setRouterModel(data.router_model);
        if (data.router_temperature !== undefined) setRouterTemp(data.router_temperature);
        if (data.router_reasoning) setRouterReasoning(data.router_reasoning);
        if (data.answering_model) setAnsweringModel(data.answering_model);
        if (data.answering_temperature !== undefined) setAnsweringTemp(data.answering_temperature);
        if (data.answering_reasoning) setAnsweringReasoning(data.answering_reasoning);
        if (data.router_verbosity) setRouterVerbosity(data.router_verbosity);
        if (data.answering_verbosity) setAnsweringVerbosity(data.answering_verbosity);

        if (data.prompts_inventory && Object.keys(data.prompts_inventory).length > 0) {
          try { setInventory(typeof data.prompts_inventory === 'string' ? JSON.parse(data.prompts_inventory) : data.prompts_inventory); } 
          catch (e) { setInventory(DEFAULT_INVENTORY); }
        } else {
          setInventory(DEFAULT_INVENTORY);
        }

        // Load Staff Assistant
        if (data.staff_base_prompt) setStaffBasePrompt(data.staff_base_prompt);
        if (data.staff_router_model) setStaffRouterModel(data.staff_router_model);
        if (data.staff_router_temperature !== undefined) setStaffRouterTemp(data.staff_router_temperature);
        if (data.staff_router_reasoning) setStaffRouterReasoning(data.staff_router_reasoning);
        if (data.staff_answering_model) setStaffAnsweringModel(data.staff_answering_model);
        if (data.staff_answering_temperature !== undefined) setStaffAnsweringTemp(data.staff_answering_temperature);
        if (data.staff_answering_reasoning) setStaffAnsweringReasoning(data.staff_answering_reasoning);
        if (data.staff_router_verbosity) setStaffRouterVerbosity(data.staff_router_verbosity);
        if (data.staff_answering_verbosity) setStaffAnsweringVerbosity(data.staff_answering_verbosity);

        if (data.staff_prompts_inventory && Object.keys(data.staff_prompts_inventory).length > 0) {
          try { setStaffInventory(typeof data.staff_prompts_inventory === 'string' ? JSON.parse(data.staff_prompts_inventory) : data.staff_prompts_inventory); } 
          catch (e) { setStaffInventory(DEFAULT_INVENTORY); }
        } else {
          setStaffInventory(DEFAULT_INVENTORY);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const getRes = await fetch(`/api/worker/admin/settings`);
      const getJson = getRes.ok ? await getRes.json() : {};
      const existingSettings = getJson.settings || {};

      const payload = {
        ...existingSettings,
        base_prompt: basePrompt,
        router_model: routerModel,
        router_temperature: routerTemp,
        router_reasoning: routerReasoning,
        answering_model: answeringModel,
        answering_temperature: answeringTemp,
        answering_reasoning: answeringReasoning,
        router_verbosity: routerVerbosity,
        answering_verbosity: answeringVerbosity,
        prompts_inventory: JSON.stringify(inventory),
        
        staff_base_prompt: staffBasePrompt,
        staff_router_model: staffRouterModel,
        staff_router_temperature: staffRouterTemp,
        staff_router_reasoning: staffRouterReasoning,
        staff_answering_model: staffAnsweringModel,
        staff_answering_temperature: staffAnsweringTemp,
        staff_answering_reasoning: staffAnsweringReasoning,
        staff_router_verbosity: staffRouterVerbosity,
        staff_answering_verbosity: staffAnsweringVerbosity,
        staff_prompts_inventory: JSON.stringify(staffInventory)
      };

      const res = await fetch(`/api/worker/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ text: "تم حفظ الإعدادات لجميع الوكلاء بنجاح!", type: 'success' });
    } catch (err) {
      setMessage({ text: "حدث خطأ أثناء الحفظ.", type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateModule = (key: string, field: keyof InventoryModule, value: any, isStaff: boolean) => {
    const setter = isStaff ? setStaffInventory : setInventory;
    setter(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const updateKey = (oldKey: string, newKey: string, isStaff: boolean) => {
    if (oldKey === newKey || !newKey) return;
    const setter = isStaff ? setStaffInventory : setInventory;
    setter(prev => {
      const copy = { ...prev };
      copy[newKey] = copy[oldKey];
      delete copy[oldKey];
      return copy;
    });
  };

  const addModule = (isStaff: boolean) => {
    const newKey = `new_agent_${Date.now()}`;
    const setter = isStaff ? setStaffInventory : setInventory;
    setter(prev => ({
      ...prev,
      [newKey]: {
        description: "وصف الوكيل للموجه الذكي...",
        tools: [],
        prompt: "تعليمات الوكيل..."
      }
    }));
  };

  const removeModule = (key: string, isStaff: boolean) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      const setter = isStaff ? setStaffInventory : setInventory;
      setter(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const toggleStaffTool = (key: string, toolId: string, enabled: boolean) => {
    setStaffInventory(prev => {
      const module = prev[key];
      const tools = new Set(module.tools || []);
      if (enabled) tools.add(toolId);
      else tools.delete(toolId);
      return { ...prev, [key]: { ...module, tools: Array.from(tools) } };
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[50vh]">
        <SpinnerGap className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const modelOptions = (
    <>
      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
      <SelectItem value="gpt-5">GPT-5</SelectItem>
      <SelectItem value="gpt-5.5-2026-04-23">gpt-5.5-2026-04-23</SelectItem>
      <SelectItem value="gpt-5.4">gpt-5.4</SelectItem>
      <SelectItem value="gpt-5.3-chat-latest">gpt-5.3-chat-latest</SelectItem>
      <SelectItem value="gpt-5.4-mini">gpt-5.4-mini</SelectItem>
      <SelectItem value="gpt-5.4-nano">gpt-5.4-nano</SelectItem>
      <SelectItem value="google/gemini-3.5-flash">Gemini 3.5 Flash</SelectItem>
      <SelectItem value="google/gemini-3.1-pro-preview">Gemini 3.1 Pro</SelectItem>
      <SelectItem value="anthropic/claude-opus-4.8">Claude Opus 4.8</SelectItem>
      <SelectItem value="anthropic/claude-sonnet-4.6">Claude Sonnet 4.6</SelectItem>
      <SelectItem value="anthropic/claude-haiku-4.5">Claude Haiku 4.5</SelectItem>
      <SelectItem value="google/gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</SelectItem>
      <SelectItem value="perplexity/sonar">Perplexity Sonar</SelectItem>
      <SelectItem value="perplexity/sonar-pro">Perplexity Sonar Pro</SelectItem>
    </>
  );

  return (
    <main className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">إدارة المعمارية والموجهات الذكية</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground mt-2">
            قم بتخصيص الموجه الديناميكي ونماذج الذكاء لكل من البوت العام وبوت الموظفين.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="cta-orange" onClick={handleSave} disabled={saving}>
            {saving ? <SpinnerGap className="w-4 h-4 animate-spin ml-2" /> : <FloppyDisk className="w-4 h-4 ml-2" />}
            {saving ? "جاري الحفظ..." : "حفظ الكل"}
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* ======================= WEBSITE BOT SECTION ======================= */}
      <div className="glass border-white/60 bg-slate-50/40 rounded-3xl p-6 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm shadow-inner">1</span> 
          إعدادات بوت الطلاب والموقع العام
        </h2>

        <div className="glass rounded-[24px] p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">النماذج (Models)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-border/40">
              <Label>النموذج الموجه (Router Model)</Label>
              <Select value={routerModel} onValueChange={setRouterModel}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{modelOptions}</SelectContent>
              </Select>
              {isReasoningModel(routerModel) ? <SettingsProfileReasoning effort={routerReasoning} onUpdateEffort={setRouterReasoning} verbosity={routerVerbosity} onUpdateVerbosity={setRouterVerbosity} /> : <SettingsProfileStandard temp={routerTemp} onUpdate={setRouterTemp} />}
            </div>
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-border/40">
              <Label>النموذج المجيب (Answering Model)</Label>
              <Select value={answeringModel} onValueChange={setAnsweringModel}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{modelOptions}</SelectContent>
              </Select>
              {isReasoningModel(answeringModel) ? <SettingsProfileReasoning effort={answeringReasoning} onUpdateEffort={setAnsweringReasoning} verbosity={answeringVerbosity} onUpdateVerbosity={setAnsweringVerbosity} /> : <SettingsProfileStandard temp={answeringTemp} onUpdate={setAnsweringTemp} />}
            </div>
          </div>
        </div>

        <div className="glass rounded-[24px] p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">التعليمات الأساسية الدائمة (Base Prompt)</h3>
          <Textarea 
            value={basePrompt} onChange={(e) => setBasePrompt(e.target.value)} rows={8}
            className="bg-white resize-y font-mono text-[13px] leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">المقاطع الديناميكية للطلاب</h3>
          <Button variant="outline" onClick={() => addModule(false)} className="bg-white"><Plus className="w-4 h-4 ml-2" />إضافة قسم</Button>
        </div>
        <div className="grid gap-6">
          {Object.entries(inventory).map(([key, module]) => (
            <div key={key} className="bg-white rounded-2xl p-6 space-y-4 border border-border/40 shadow-sm">
              <div className="flex items-center justify-between">
                <Input defaultValue={key} onBlur={(e) => updateKey(key, e.target.value, false)} className="font-mono w-1/3 bg-slate-50" dir="ltr" />
                <div className="flex items-center gap-3">
                  <TooltipProvider><Tooltip><TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-full cursor-help">
                      <Switch checked={module.is_final_responder_tool || false} onCheckedChange={(c) => updateModule(key, "is_final_responder_tool", c, false)} />
                      <span className="text-[12px] font-bold text-slate-600">طوارئ النهائي</span>
                    </div>
                  </TooltipTrigger><TooltipContent side="bottom"><p>تُخفى عن الموجه لأنها تُحقن بالبوت النهائي بشكل ديفولت.</p></TooltipContent></Tooltip></TooltipProvider>
                  <Button variant="ghost" size="icon" onClick={() => removeModule(key, false)} className="text-red-500"><Trash className="w-5 h-5" /></Button>
                </div>
              </div>
              <div><Label>وصف الـ Router</Label><Input value={module.description} onChange={(e) => updateModule(key, "description", e.target.value, false)} className="bg-slate-50 mt-1" /></div>
              <div><Label>الأدوات المسموحة</Label><Input value={(module.tools || []).join(", ")} onChange={(e) => updateModule(key, "tools", e.target.value.split(",").map(s=>s.trim()).filter(Boolean), false)} className="bg-slate-50 font-mono mt-1" dir="ltr" /></div>
              <div><Label>تعليمات القسم (System Prompt)</Label><Textarea value={module.prompt} onChange={(e) => updateModule(key, "prompt", e.target.value, false)} rows={4} className="bg-slate-50 mt-1" /></div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================= STAFF BOT SECTION ======================= */}
      <div className="glass border-white/60 bg-slate-50/40 rounded-3xl p-6 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm shadow-inner">2</span> 
          إعدادات مساعد الموظفين (Staff Assistant)
        </h2>
        <p className="text-sm text-muted-foreground max-w-3xl">هذا القسم يتيح لك التحكم الكامل بسرعة وتكلفة الموظفين عبر تعيين نماذج أسرع وصلاحيات أدوات مفصلة لكل وكيل.</p>

        <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-6 space-y-4 border border-slate-200/60 shadow-sm">
          <div><h3 className="text-lg font-bold text-foreground">نماذج الموظفين (Models)</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-border/40">
              <Label>موجه الموظف (Staff Router Model)</Label>
              <Select value={staffRouterModel} onValueChange={setStaffRouterModel}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{modelOptions}</SelectContent>
              </Select>
              {isReasoningModel(staffRouterModel) ? <SettingsProfileReasoning effort={staffRouterReasoning} onUpdateEffort={setStaffRouterReasoning} verbosity={staffRouterVerbosity} onUpdateVerbosity={setStaffRouterVerbosity} /> : <SettingsProfileStandard temp={staffRouterTemp} onUpdate={setStaffRouterTemp} />}
            </div>
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-border/40">
              <Label>مجيب الموظف (Staff Answering Model)</Label>
              <Select value={staffAnsweringModel} onValueChange={setStaffAnsweringModel}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{modelOptions}</SelectContent>
              </Select>
              {isReasoningModel(staffAnsweringModel) ? <SettingsProfileReasoning effort={staffAnsweringReasoning} onUpdateEffort={setStaffAnsweringReasoning} verbosity={staffAnsweringVerbosity} onUpdateVerbosity={setStaffAnsweringVerbosity} /> : <SettingsProfileStandard temp={staffAnsweringTemp} onUpdate={setStaffAnsweringTemp} />}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-6 space-y-4 border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold text-foreground">التعليمات الأساسية للموظفين (Staff Base Prompt)</h3>
          <Textarea 
            value={staffBasePrompt} onChange={(e) => setStaffBasePrompt(e.target.value)} rows={6}
            className="bg-slate-50 resize-y font-mono text-[13px] leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">مقاطع وأدوات الموظفين</h3>
          <Button variant="outline" onClick={() => addModule(true)} className="bg-white text-primary border-slate-200 hover:bg-primary/5 hover:border-primary/30"><Plus className="w-4 h-4 ml-2" />إضافة قسم</Button>
        </div>
        <div className="grid gap-6">
          {Object.entries(staffInventory).map(([key, module]) => (
            <div key={key} className="bg-white rounded-2xl p-6 space-y-4 border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <Input defaultValue={key} onBlur={(e) => updateKey(key, e.target.value, true)} className="font-mono w-1/3 bg-slate-50" dir="ltr" />
                <Button variant="ghost" size="icon" onClick={() => removeModule(key, true)} className="text-red-500"><Trash className="w-5 h-5" /></Button>
              </div>
              <div><Label>وصف الـ Router</Label><Input value={module.description} onChange={(e) => updateModule(key, "description", e.target.value, true)} className="bg-slate-50 mt-1" /></div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <Label className="text-slate-600 font-bold block mb-1">حالة القسم (تفعيل/إيقاف)</Label>
                  <span className="text-xs text-muted-foreground">عند إيقاف القسم، لن يتمكن الموظف من استخدامه أو الوصول إلى أدواته.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${module.enabled !== false ? 'text-primary' : 'text-slate-400'}`}>
                    {module.enabled !== false ? 'مفعل' : 'معطل'}
                  </span>
                  <Switch 
                    checked={module.enabled !== false}
                    onCheckedChange={(c) => updateModule(key, "enabled", c, true)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              <div><Label>تعليمات القسم (System Prompt)</Label><Textarea value={module.prompt} onChange={(e) => updateModule(key, "prompt", e.target.value, true)} rows={4} className="bg-slate-50 mt-1" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-20"></div>
    </main>
  );
}


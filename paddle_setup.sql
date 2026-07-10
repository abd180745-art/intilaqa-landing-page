-- أضف هذه الأعمدة إلى جدول clients_balances الخاص بك في Supabase
-- لتتمكن من تخزين بيانات اشتراكات Paddle

ALTER TABLE public.clients_balances
ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT,
ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS paddle_price_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- إضافة صلاحية التعديل للمطور/النظام على الأعمدة الجديدة (اختياري حسب الـ RLS)

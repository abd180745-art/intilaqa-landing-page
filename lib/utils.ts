import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isReasoningModel(model?: string): boolean {
  if (!model) return false;
  const lower = model.toLowerCase();
  // ONLY GPT-5 series use Reasoning/Verbosity in our architecture
  return lower.includes("gpt-5");
}

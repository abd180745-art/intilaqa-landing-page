export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full relative" dir="ltr">
      {children}
    </div>
  )
}

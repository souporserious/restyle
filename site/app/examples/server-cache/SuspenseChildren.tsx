export async function SuspenseChildren({
  children,
}: {
  children: React.ReactNode
}) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return children
}

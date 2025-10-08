export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      <p className="ml-4 text-muted-foreground">Loading History...</p>
    </div>
  )
}
interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={`max-w-7xl mx-auto w-full px-6 py-10 ${className ?? ''}`}>
      {children}
    </main>
  )
}

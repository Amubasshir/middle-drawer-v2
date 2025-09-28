"use client"

export function StatusBar() {
  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Status: Active</span>
            </div>
            <div className="text-muted-foreground">Last wellness check: 2 days ago</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-muted-foreground">12 accounts monitored</div>
            <div className="text-muted-foreground">3 delegates configured</div>
          </div>
        </div>
      </div>
    </div>
  )
}

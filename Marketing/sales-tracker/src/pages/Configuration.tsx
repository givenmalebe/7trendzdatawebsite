import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { Settings, Plus, Trash2 } from "lucide-react"

export function Configuration() {
  const [config, setConfig] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getConfig().then(data => {
      setConfig(data)
      setLoading(false)
    })
  }, [])

  async function addItem(category: string) {
    const value = prompt(`Add new item to ${category}:`)
    if (!value) return
    await api.addConfigItem(category, value)
    api.getConfig().then(setConfig)
  }

  async function deleteItem(category: string, value: string) {
    if (!confirm(`Delete "${value}" from ${category}?`)) return
    await api.deleteConfigItem(category, value)
    api.getConfig().then(setConfig)
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading configuration...</div>

  const categories = Object.keys(config).sort()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuration</h1>
        <p className="text-muted-foreground text-sm">Manage dropdown lists and system settings</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Dropdown Lists
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs
            tabs={categories.map(category => ({
              id: category.toLowerCase().replace(/\s+/g, '-'),
              label: `${category} (${config[category].length})`,
              content: (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{config[category].length} items</Badge>
                    <Button size="sm" variant="outline" onClick={() => addItem(category)}>
                      <Plus className="h-3 w-3" /> Add Item
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {config[category].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-accent/50 group">
                        <span className="text-sm">{item}</span>
                        <button className="p-1 rounded hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => deleteItem(category, item)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  )
}

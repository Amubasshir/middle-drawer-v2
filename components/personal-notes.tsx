"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, CheckCircle, Circle, AlertTriangle } from "lucide-react"

interface PersonalNote {
  id: number
  title: string
  content: string
  category: string
  priority: "low" | "medium" | "high"
  is_task: boolean
  is_completed: boolean
  is_emergency_info: boolean
  due_date?: string
  created_at: string
}

// Mock data - in real app this would come from database
const mockNotes: PersonalNote[] = [
  {
    id: 1,
    title: "House Key Location",
    content: "Spare key is hidden under the blue flower pot by the front door",
    category: "home",
    priority: "high",
    is_task: false,
    is_completed: false,
    is_emergency_info: true,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    title: "Weekly Trash Day",
    content: "Trash pickup is every Tuesday morning - put bins out Monday night",
    category: "home",
    priority: "medium",
    is_task: true,
    is_completed: false,
    is_emergency_info: false,
    created_at: "2024-01-15",
  },
  {
    id: 3,
    title: "WiFi Password",
    content: "Network: HomeWiFi, Password: SecurePass123!",
    category: "home",
    priority: "medium",
    is_task: false,
    is_completed: false,
    is_emergency_info: true,
    created_at: "2024-01-15",
  },
]

export function PersonalNotes() {
  const [notes, setNotes] = useState<PersonalNote[]>(mockNotes)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<PersonalNote | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "medium" as const,
    is_task: false,
    is_emergency_info: false,
    due_date: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingNote) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id ? { ...note, ...formData, updated_at: new Date().toISOString() } : note,
        ),
      )
      setEditingNote(null)
    } else {
      const newNote: PersonalNote = {
        id: Date.now(),
        ...formData,
        is_completed: false,
        created_at: new Date().toISOString(),
      }
      setNotes([newNote, ...notes])
    }

    setFormData({
      title: "",
      content: "",
      category: "general",
      priority: "medium",
      is_task: false,
      is_emergency_info: false,
      due_date: "",
    })
    setShowForm(false)
  }

  const handleEdit = (note: PersonalNote) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      is_task: note.is_task,
      is_emergency_info: note.is_emergency_info,
      due_date: note.due_date || "",
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const toggleTask = (id: number) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, is_completed: !note.is_completed } : note)))
  }

  const filteredNotes = notes.filter((note) => {
    if (filter === "all") return true
    if (filter === "tasks") return note.is_task
    if (filter === "emergency") return note.is_emergency_info
    return note.category === filter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Notes</h2>
          <p className="text-gray-600">House responsibilities and important information</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All Notes" },
          { key: "tasks", label: "Tasks" },
          { key: "emergency", label: "Emergency Info" },
          { key: "home", label: "Home" },
          { key: "general", label: "General" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
            className={filter === key ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingNote ? "Edit Note" : "Add New Note"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter note title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter note content"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_task"
                    checked={formData.is_task}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_task: checked as boolean })}
                  />
                  <Label htmlFor="is_task">This is a task</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_emergency_info"
                    checked={formData.is_emergency_info}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_emergency_info: checked as boolean })}
                  />
                  <Label htmlFor="is_emergency_info">Emergency information</Label>
                </div>
              </div>

              {formData.is_task && (
                <div>
                  <Label htmlFor="due_date">Due Date (optional)</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editingNote ? "Update Note" : "Add Note"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingNote(null)
                    setFormData({
                      title: "",
                      content: "",
                      category: "general",
                      priority: "medium",
                      is_task: false,
                      is_emergency_info: false,
                      due_date: "",
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className={note.is_completed ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {note.is_task && (
                      <button onClick={() => toggleTask(note.id)} className="text-emerald-600 hover:text-emerald-700">
                        {note.is_completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                    )}
                    <h3 className={`font-semibold ${note.is_completed ? "line-through" : ""}`}>{note.title}</h3>
                    {note.is_emergency_info && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>

                  {note.content && <p className="text-gray-600 mb-3">{note.content}</p>}

                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className={getPriorityColor(note.priority)}>
                      {note.priority}
                    </Badge>
                    <Badge variant="outline">{note.category}</Badge>
                    {note.is_task && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        Task
                      </Badge>
                    )}
                    {note.is_emergency_info && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        Emergency Info
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(note)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(note.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No notes found for the selected filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

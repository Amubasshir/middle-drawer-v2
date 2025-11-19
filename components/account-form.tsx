


"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Home, Car, PiggyBank, Shield, TrendingUp, Zap, Phone, Heart, DollarSign, X } from "lucide-react"

interface AccountFormProps {
  onSubmit: (account: any) => void
  onCancel: () => void
  initialData?: any
}

// interface AdditionalField {
//   id: string
//   type: string
//   value: string
// }

type AdditionalField = {
  id: string
  type: string
  value: string
  subValue?: string
}

const accountTypes = [
  { id: "checking", name: "Checking Account", category: "banking", icon: CreditCard, critical: true },
  { id: "savings", name: "Savings Account", category: "banking", icon: PiggyBank, critical: false },
  { id: "credit", name: "Credit Card", category: "credit", icon: CreditCard, critical: true },
  { id: "mortgage", name: "Mortgage", category: "credit", icon: Home, critical: true },
  { id: "auto-loan", name: "Auto Loan", category: "credit", icon: Car, critical: true },
  { id: "personal-loan", name: "Personal Loan", category: "credit", icon: DollarSign, critical: false },
  { id: "health-insurance", name: "Health Insurance", category: "insurance", icon: Heart, critical: true },
  { id: "auto-insurance", name: "Auto Insurance", category: "insurance", icon: Car, critical: true },
  { id: "life-insurance", name: "Life Insurance", category: "insurance", icon: Shield, critical: false },
  { id: "investment", name: "Investment Account", category: "investment", icon: TrendingUp, critical: false },
  { id: "retirement", name: "Retirement Account", category: "investment", icon: PiggyBank, critical: false },
  { id: "utilities", name: "Utility Account", category: "utilities", icon: Zap, critical: true },
  { id: "phone", name: "Phone/Internet", category: "utilities", icon: Phone, critical: true },
]


const additionalFieldTypes = [
  { value: "accountNumber", label: "Account Number", type: "text" },
  { value: "secondaryPerson", label: "Account Holder", type: "text" },
  { 
    value: "phoneNumber", 
    label: "Phone Number", 
    type: "number",
    subtype: "select",
    options: ["Home", "Cell", "Other"]
  },
  { value: "additionalPassword", label: "Password", type: "password" },
  { 
    value: "2fa", 
    label: "2FA", 
    type: "text",
    subtype: "select",
    options: ["Cell Phone", "App"]
  },
]


const frequenciesDueDates = [
  "Weekly",
  "Bi-weekly",
  "Monthly",
  "Quarterly"
];


// Convert camelCase to snake_case for database
const toSnakeCase = (obj: any) => {
  const snakeCaseObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1")?.toLowerCase()
    snakeCaseObj[snakeKey] = value
  }
  return snakeCaseObj
}

// Convert snake_case to camelCase for form
const toCamelCase = (obj: any) => {
  const camelCaseObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    camelCaseObj[camelKey] = value
  }
  return camelCaseObj
}

export function AccountForm({ onSubmit, onCancel, initialData }: AccountFormProps) {
  // Convert initial data from snake_case to camelCase
  const camelCaseInitialData = initialData ? toCamelCase(initialData) : {}

  const [formData, setFormData] = useState({
    accountName: camelCaseInitialData?.accountName || "",
    accountType: camelCaseInitialData?.accountType || "",
    institutionName: camelCaseInitialData?.institutionName || "",
    accountNumber: camelCaseInitialData?.accountNumber || "",
    username: camelCaseInitialData?.username || "",
    email: camelCaseInitialData?.email || "",
    phone: camelCaseInitialData?.phone || "",
    address: camelCaseInitialData?.address || "",
    currentBalance: camelCaseInitialData?.currentBalance || "",
    creditLimit: camelCaseInitialData?.creditLimit || "",
    interestRate: camelCaseInitialData?.interestRate || "",
    priorityLevel: camelCaseInitialData?.priorityLevel || "3",
    isActive: camelCaseInitialData?.isActive ?? true,
    notes: camelCaseInitialData?.notes || "",
    additionalFields: camelCaseInitialData?.additionalFields || [],
    dueDate: camelCaseInitialData?.dueDate || "",
  })

  console.log({formData})

  const [selectedFieldType, setSelectedFieldType] = useState("")
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    camelCaseInitialData?.additionalFields || []
  )

  const selectedAccountType = accountTypes.find((type) => type.id === formData.accountType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert form data to snake_case for database
    const submitData = toSnakeCase({
      ...formData,
      additionalFields: additionalFields.map(field => ({
        ...field,
        field_type: field.type, // Convert type to field_type for database
        field_label: getFieldLabel(field.type),
        field_value: field.value
      }))
    })

    onSubmit(submitData)
  }

//   const addAdditionalField = () => {
//     if (!selectedFieldType) return
    
//     const fieldType = additionalFieldTypes.find(field => field.value === selectedFieldType)
//     if (!fieldType) return

//     const newField: AdditionalField = {
//       id: Date.now().toString(),
//       type: selectedFieldType,
//       value: ""
//     }
    
//     const updatedFields = [...additionalFields, newField]
//     setAdditionalFields(updatedFields)
//     setFormData(prev => ({
//       ...prev,
//       additionalFields: updatedFields
//     }))
//     setSelectedFieldType("")
//   }

// const addAdditionalField = () => {
//   if (!selectedFieldType) return
  
//   const fieldType = additionalFieldTypes.find(field => field.value === selectedFieldType)
//   if (!fieldType) return
  
//   const newField: AdditionalField = {
//     id: Date.now().toString(),
//     type: selectedFieldType,
//     value: "",
//     ...(fieldType.subtype === "select" && { subValue: fieldType.options?.[0] || "" })
//   }
  
//   const updatedFields = [...additionalFields, newField]
//   setAdditionalFields(updatedFields)
//   setFormData(prev => ({
//     ...prev,
//     additionalFields: updatedFields
//   }))
//   setSelectedFieldType("")
// }

const addAdditionalField = () => {
  if (!selectedFieldType) return
  
  const fieldType = additionalFieldTypes.find(field => field.value === selectedFieldType)
  if (!fieldType) return
  
  const newField: AdditionalField = {
    id: Date.now().toString(),
    type: selectedFieldType,
    value: "",
    subValue: fieldType.subtype === "select" ? (fieldType.options?.[0] || "") : undefined
  }
  
  const updatedFields = [...additionalFields, newField]
  setAdditionalFields(updatedFields)
  setFormData(prev => ({
    ...prev,
    additionalFields: updatedFields
  }))
  setSelectedFieldType("")
}


  const removeAdditionalField = (id: string) => {
    const updatedFields = additionalFields.filter(field => field.id !== id)
    setAdditionalFields(updatedFields)
    setFormData(prev => ({
      ...prev,
      additionalFields: updatedFields
    }))
  }

//   const handleAdditionalFieldChange = (id: string, value: string) => {
//     const updatedFields = additionalFields.map(field => 
//       field.id === id ? { ...field, value } : field
//     )
//     setAdditionalFields(updatedFields)
//     setFormData(prev => ({
//       ...prev,
//       additionalFields: updatedFields
//     }))
//   }

const handleAdditionalFieldChange = (id: string, value: string, subValue?: string) => {
  const updatedFields = additionalFields.map(field => {
    if (field.id === id) {
      if (subValue !== undefined) {
        return { ...field, value, subValue }
      }
      return { ...field, value }
    }
    return field
  })
  
  setAdditionalFields(updatedFields)
  setFormData(prev => ({
    ...prev,
    additionalFields: updatedFields
  }))
}

  const getFieldLabel = (fieldType: string) => {
    const field = additionalFieldTypes.find(f => f.value === fieldType)
    return field ? field.label : fieldType
  }

  const getFieldType = (fieldType: string) => {
    const field = additionalFieldTypes.find(f => f.value === fieldType)
    return field ? field.type : "text"
  }

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "1":
        return "bg-destructive text-destructive-foreground"
      case "2":
        return "bg-secondary text-secondary-foreground"
      case "3":
        return "bg-muted text-muted-foreground"
      case "4":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityLabel = (level: string) => {
    switch (level) {
      case "1":
        return "Critical"
      case "2":
        return "Important"
      case "3":
        return "Normal"
      case "4":
        return "Low"
      default:
        return "Normal"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedAccountType && <selectedAccountType.icon className="h-5 w-5 text-primary" />}
          {initialData ? "Edit Account" : "Add New Account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="e.g., Chase Checking"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) => setFormData({ ...formData, accountType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.name}
                        {type.critical && (
                          <Badge variant="secondary" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                placeholder="e.g., Chase Bank"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="****1234"
                maxLength={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username/Login</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Your login username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="account@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentBalance">Current Balance</Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {(formData.accountType === "credit" ||
              formData.accountType === "mortgage" ||
              formData.accountType === "auto-loan") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit / Loan Amount</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    step="0.01"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    placeholder="4.25"
                  />
                </div>
              </>
            )}

            {(formData.accountType !== 'savings') && (<div className="space-y-2">
              <Label htmlFor="dueDate">Payment Due Date *</Label>
              <Select
                value={formData.dueDate}
                onValueChange={(value) => setFormData({ ...formData, dueDate: value })}
               
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment due date" />
                </SelectTrigger>
                <SelectContent>                  
                  {frequenciesDueDates.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>)}
          </div>



          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address for this account"
              rows={2}
            />
          </div>

        

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priorityLevel">Priority Level</Label>
              <Select
                value={formData.priorityLevel}
                onValueChange={(value) => setFormData({ ...formData, priorityLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("1")}>Critical</Badge>
                      <span>Essential for daily functioning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("2")}>Important</Badge>
                      <span>Important but not critical</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("3")}>Normal</Badge>
                      <span>Regular priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("4")}>Low</Badge>
                      <span>Low priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Account is active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this account"
              rows={3}
            />
          </div>

          {/* Additional Fields Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Additional Fields</Label>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedFieldType} onValueChange={setSelectedFieldType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select field to add" />
                </SelectTrigger>
                <SelectContent>
                  {additionalFieldTypes.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={addAdditionalField}
                disabled={!selectedFieldType}
                className="bg-transparent"
              >
                Add Field
              </Button>
            </div>
            
            {/* <div className="space-y-3">
              {additionalFields.map((field) => (
                <div key={field.id} className="flex items-start gap-2 p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`field-${field.id}`}>
                      {getFieldLabel(field.type)}
                    </Label>
                    {getFieldType(field.type) === "textarea" ? (
                      <Textarea
                        id={`field-${field.id}`}
                        value={field.value}
                        onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
                        rows={2}
                      />
                    ) : (
                      <Input
                        id={`field-${field.id}`}
                        type={getFieldType(field.type)}
                        value={field.value}
                        onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
                        step={getFieldType(field.type) === "number" ? "0.01" : undefined}
                      />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalField(field.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div> */}
          
          {/* <div className="space-y-3">
            {additionalFields.map((field) => {
                const fieldConfig = additionalFieldTypes.find(f => f.value === field.type)
                
                return (
                <div key={field.id} className="flex items-start gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                    <Label htmlFor={`field-${field.id}`}>
                        {getFieldLabel(field.type)}
                    </Label>
                    
                    {fieldConfig?.subtype === "select" ? (
                        <div className="space-y-2">
                        <select
                            value={field.subValue || fieldConfig.options?.[0]}
                            onChange={(e) => handleAdditionalFieldChange(field.id, field.value, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            {fieldConfig.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                            <Input
                            id={`field-${field.id}`}
                            type={getFieldType(field.type)}
                            value={field.value}
                            onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                            placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
                            />
                        </div>
                    ) : getFieldType(field.type) === "textarea" ? (
                        <Textarea
                        id={`field-${field.id}`}
                        value={field.value}
                        onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
                        rows={2}
                        />
                    ) : (
                        <Input
                        id={`field-${field.id}`}
                        type={getFieldType(field.type)}
                        value={field.value}
                        onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
                        step={getFieldType(field.type) === "number" ? "0.01" : undefined}
                        />
                    )}
                    </div>
                    <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalField(field.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                    >
                    <X className="h-4 w-4" />
                    </Button>
                </div>
                )
            })}
            </div> */}

            <div className="space-y-3">
  {additionalFields.map((field) => {
    const fieldConfig = additionalFieldTypes.find(f => f.value === field.type)
    
    return (
      <div key={field.id} className="flex items-start gap-2 p-3 border rounded-lg">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`field-${field.id}`}>
            {getFieldLabel(field.type)}
          </Label>
          
          {fieldConfig?.subtype === "select" ? (
            <div className="space-y-2">
              <div className="flex gap-4">
                {fieldConfig.options?.map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`${field.id}-type`}
                      value={option}
                      checked={field.subValue === option}
                      onChange={(e) => handleAdditionalFieldChange(field.id, field.value, e.target.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
              <Input
                id={`field-${field.id}`}
                type={getFieldType(field.type)}
                value={field.value}
                onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value, field.subValue)}
                placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
              />
            </div>
          ) : getFieldType(field.type) === "textarea" ? (
            <Textarea
              id={`field-${field.id}`}
              value={field.value}
              onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
              placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
              rows={2}
            />
          ) : (
            <Input
              id={`field-${field.id}`}
              type={getFieldType(field.type)}
              value={field.value}
              onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
              placeholder={`Enter ${getFieldLabel(field.type)?.toLowerCase()}`}
              step={getFieldType(field.type) === "number" ? "0.01" : undefined}
            />
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeAdditionalField(field.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  })}
</div>

          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Account" : "Add Account"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
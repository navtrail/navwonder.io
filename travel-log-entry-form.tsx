"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MapPinIcon, CloudIcon, PlusIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { addLogEntry, updateLogEntry } from "@/lib/travel-log-service"
import type { TravelLogEntry, Location } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { fetchWeatherForLocation } from "@/lib/weather-service"

const formSchema = z.object({
  date: z.date({
    required_error: "Date is required.",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  mood: z.enum(["amazing", "good", "okay", "bad"]).optional(),
  locationName: z.string().optional(),
  locationAddress: z.string().optional(),
  locationLatitude: z.number().optional(),
  locationLongitude: z.number().optional(),
  activities: z.array(z.string()).default([]),
  newActivity: z.string().optional(),
})

interface TravelLogEntryFormProps {
  logId: string
  existingEntry?: TravelLogEntry
  onSuccess?: (entry: TravelLogEntry) => void
  onCancel?: () => void
}

export function TravelLogEntryForm({ logId, existingEntry, onSuccess, onCancel }: TravelLogEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activities, setActivities] = useState<string[]>(existingEntry?.activities || [])
  const [newActivity, setNewActivity] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: existingEntry?.date ? new Date(existingEntry.date) : new Date(),
      title: existingEntry?.title || "",
      content: existingEntry?.content || "",
      mood: existingEntry?.mood,
      locationName: existingEntry?.location?.name || "",
      locationAddress: existingEntry?.location?.address || "",
      locationLatitude: existingEntry?.location?.latitude,
      locationLongitude: existingEntry?.location?.longitude,
      activities: existingEntry?.activities || [],
      newActivity: "",
    },
  })

  const addActivity = () => {
    const activity = form.getValues("newActivity")
    if (activity && activity.trim() !== "") {
      const updatedActivities = [...activities, activity.trim()]
      setActivities(updatedActivities)
      form.setValue("activities", updatedActivities)
      form.setValue("newActivity", "")
      setNewActivity("")
    }
  }

  const removeActivity = (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index)
    setActivities(updatedActivities)
    form.setValue("activities", updatedActivities)
  }

  const fetchWeather = async () => {
    const lat = form.getValues("locationLatitude")
    const lng = form.getValues("locationLongitude")

    if (lat && lng) {
      try {
        const weather = await fetchWeatherForLocation(lat, lng)
        // Handle weather data (in a real app, you'd update the form or state)
        console.log("Weather data:", weather)
      } catch (error) {
        console.error("Error fetching weather:", error)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Prepare location data if provided
      let location: Location | undefined
      if (values.locationName && values.locationLatitude && values.locationLongitude) {
        location = {
          name: values.locationName,
          address: values.locationAddress,
          latitude: values.locationLatitude,
          longitude: values.locationLongitude,
        }
      }

      let entry: TravelLogEntry | null

      if (existingEntry) {
        // Update existing entry
        entry = await updateLogEntry(logId, existingEntry.id, {
          date: values.date.toISOString(),
          title: values.title,
          content: values.content,
          mood: values.mood,
          location,
          activities: values.activities,
        })
      } else {
        // Create new entry
        entry = await addLogEntry(logId, {
          date: values.date.toISOString(),
          title: values.title,
          content: values.content,
          mood: values.mood,
          location,
          activities: values.activities,
          photos: [],
        })
      }

      if (!entry) throw new Error("Failed to save entry")

      if (onSuccess) {
        onSuccess(entry)
      }
    } catch (error) {
      console.error("Error saving entry:", error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingEntry ? "Edit Entry" : "Add New Entry"}</CardTitle>
        <CardDescription>
          {existingEntry ? "Update your travel log entry" : "Document a day from your journey"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How were you feeling?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="amazing">Amazing 😄</SelectItem>
                        <SelectItem value="good">Good 🙂</SelectItem>
                        <SelectItem value="okay">Okay 😐</SelectItem>
                        <SelectItem value="bad">Bad 😞</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Day 1: Arrival in Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write about your experiences today..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border rounded-md p-4">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Location</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Taj Mahal" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Agra, Uttar Pradesh" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locationLatitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          placeholder="27.1751"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationLongitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          placeholder="78.0421"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={fetchWeather}>
                  <CloudIcon className="h-4 w-4 mr-2" />
                  Get Weather
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Activities</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {activities.map((activity, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {activity}
                    <button
                      type="button"
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => removeActivity(index)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {activities.length === 0 && <p className="text-sm text-muted-foreground">No activities added yet</p>}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add an activity (e.g., Hiking, Museum visit)"
                  value={newActivity}
                  onChange={(e) => {
                    setNewActivity(e.target.value)
                    form.setValue("newActivity", e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addActivity()
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={addActivity}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : existingEntry ? "Update Entry" : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


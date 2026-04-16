import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://zlnmosacddraebxsofel.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsbm1vc2FjZGRyYWVieHNvZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTk0NzQsImV4cCI6MjA5MTg3NTQ3NH0.SoArHOW1SqWbJy780wm3x-R_qSHjxupDXE_yWSu6Tvk'
)

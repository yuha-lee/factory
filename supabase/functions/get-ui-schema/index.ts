import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface Database {
  public: {
    Tables: {
      ui_schemas: {
        Row: {
          id: string
          tenant_id: string
          screen_name: string
          schema_content: any
          version: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(part => part)
    
    // Extract tenantId and screen from path: /api/ui/:tenantId/:screen
    if (pathParts.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Both tenant ID and screen name are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const tenantId = pathParts[pathParts.length - 2]
    const screen = pathParts[pathParts.length - 1]

    if (!tenantId || !screen) {
      return new Response(
        JSON.stringify({ error: 'Both tenant ID and screen name are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Query the ui_schemas table for active schema
    // Uses the partial unique index: (tenant_id, screen_name) where is_active = true
    const { data: schema, error } = await supabase
      .from('ui_schemas')
      .select('schema_content')
      .eq('tenant_id', tenantId)
      .eq('screen_name', screen)
      .eq('is_active', true)
      .single()

    // Return schema_content if found, otherwise return fallback
    const responseData = schema?.schema_content || { screen, components: [] }

    return new Response(
      JSON.stringify(responseData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error fetching UI schema:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
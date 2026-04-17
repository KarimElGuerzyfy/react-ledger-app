import { createClient } from "jsr:@supabase/supabase-js@2"
 
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}
 
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
 
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    })
  }
 
  // Service role client — needed to delete auth users
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )
 
  // User client — verifies the JWT and gets the calling user's id
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  )
 
  const { data: { user }, error: userError } = await userClient.auth.getUser()
 
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    })
  }
 
  const userId = user.id
 
  // Delete all user data in order (expenses first, then period tables, then profile)
  await supabase.from("expenses").delete().eq("user_id", userId)
  await supabase.from("days").delete().eq("user_id", userId)
  await supabase.from("weeks").delete().eq("user_id", userId)
  await supabase.from("months").delete().eq("user_id", userId)
  await supabase.from("years").delete().eq("user_id", userId)
  await supabase.from("profiles").delete().eq("id", userId)
 
  // Delete the auth user last
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
 
  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
 
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
 
import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const yesterdayStr = yesterday.toISOString().split("T")[0]
  const yesterdayMonth = yesterday.getMonth() + 1
  const yesterdayYear = yesterday.getFullYear()
  const yesterdayDay = yesterday.getDate()
  const yesterdayDayOfWeek = yesterday.getDay() // 0 = Sunday

  // Get all users
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id")

  if (usersError) {
    return new Response(JSON.stringify({ error: usersError.message }), { status: 500 })
  }

  for (const user of users) {
    const userId = user.id

    // 1. Fetch today's expenses for this user
    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .gte("created_at", `${yesterdayStr}T00:00:00`)
      .lte("created_at", `${yesterdayStr}T23:59:59`)

    const dayTotal = (expenses ?? []).reduce((sum: number, e: { amount: number }) => sum + e.amount, 0)

    // 2. Close yesterday's day
    await supabase
      .from("days")
      .upsert({
        user_id: userId,
        date: yesterdayStr,
        total_spent: dayTotal,
        is_closed: true,
        closed_at: now.toISOString(),
      }, { onConflict: "user_id,date" })

    // 3. Close the week if yesterday was Sunday
    if (yesterdayDayOfWeek === 0) {
      const startOfYear = new Date(yesterdayYear, 0, 1)
      const days = Math.floor((yesterday.getTime() - startOfYear.getTime()) / 86400000)
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)

      // Get all closed days in this week
      const weekStart = new Date(yesterday)
      weekStart.setDate(yesterday.getDate() - 6)
      const weekStartStr = weekStart.toISOString().split("T")[0]

      const { data: weekDays } = await supabase
        .from("days")
        .select("total_spent")
        .eq("user_id", userId)
        .eq("is_closed", true)
        .gte("date", weekStartStr)
        .lte("date", yesterdayStr)

      const weekTotal = (weekDays ?? []).reduce((sum: number, d: { total_spent: number }) => sum + d.total_spent, 0)

      await supabase
        .from("weeks")
        .upsert({
          user_id: userId,
          week_number: weekNumber,
          year: yesterdayYear,
          total_spent: weekTotal,
          is_closed: true,
          closed_at: now.toISOString(),
        }, { onConflict: "user_id,week_number,year" })
    }

    // 4. Close the month if yesterday was the last day of the month
    const lastDayOfMonth = new Date(yesterdayYear, yesterdayMonth, 0).getDate()

    if (yesterdayDay === lastDayOfMonth) {
      const { data: monthDays } = await supabase
        .from("days")
        .select("total_spent")
        .eq("user_id", userId)
        .eq("is_closed", true)
        .gte("date", `${yesterdayYear}-${String(yesterdayMonth).padStart(2, "0")}-01`)
        .lte("date", yesterdayStr)

      const monthTotal = (monthDays ?? []).reduce((sum: number, d: { total_spent: number }) => sum + d.total_spent, 0)

      await supabase
        .from("months")
        .upsert({
          user_id: userId,
          month_number: yesterdayMonth,
          year: yesterdayYear,
          total_spent: monthTotal,
          is_closed: true,
          closed_at: now.toISOString(),
        }, { onConflict: "user_id,month_number,year" })
    }

    // 5. Close the year if yesterday was December 31
    if (yesterdayMonth === 12 && yesterdayDay === 31) {
      const { data: yearDays } = await supabase
        .from("days")
        .select("total_spent")
        .eq("user_id", userId)
        .eq("is_closed", true)
        .gte("date", `${yesterdayYear}-01-01`)
        .lte("date", yesterdayStr)

      const yearTotal = (yearDays ?? []).reduce((sum: number, d: { total_spent: number }) => sum + d.total_spent, 0)

      await supabase
        .from("years")
        .upsert({
          user_id: userId,
          year: yesterdayYear,
          total_spent: yearTotal,
          is_closed: true,
          closed_at: now.toISOString(),
        }, { onConflict: "user_id,year" })
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
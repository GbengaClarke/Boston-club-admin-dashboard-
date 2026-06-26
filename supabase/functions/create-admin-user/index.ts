

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: { get: (key: string) => string | undefined };
};

// @ts-ignore: Bypasses local IDE compilation checking for remote URL imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight options check
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize high-privilege administrative database connector client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json().catch(() => ({}));
    const { action, rollbackUserId, email, fullName, phone, role } = body;

    // =========================================================================
    // EMERGENCY ACTION: ROLLBACK REMOVAL ROUTE
    // =========================================================================
    if (action === "cleanup-rollback" && rollbackUserId) {
      // Cleanly eviscerate the auth instance. This implicitly handles cascade triggers or profiles configurations.
      await supabaseAdmin.auth.admin.deleteUser(rollbackUserId);
      
      return new Response(JSON.stringify({ success: true, message: "Rollback completed successfully." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // =========================================================================
    // --- DEFAULT ACTION ROUTE: NEW USER PROVISIONING FLOW ---
    // =========================================================================
    if (!email || !fullName) {
      return new Response(JSON.stringify({ error: "Missing structural requirements: email and fullName are mandatory." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Generate a random, temporary high-entropy password to satisfy base registration constraints
    const temporaryPassword = Math.random().toString(36).slice(-10) + "A1!";

    // A. Provision credentials inside auth.users with registration bypasses active
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true, 
      phone_confirm: true, 
      phone: phone || undefined,
      user_metadata: { full_name: fullName, role: role || "admin" }
    });

    if (authError) throw authError;
    if (!authData?.user) throw new Error("Failed to initialize authentication database profile context.");

    // B. Synced profile injection using robust upsert schema rules
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: authData.user.id,
          full_name: fullName,
          email: email,
          phone: phone || null,
          role: role || "admin",
          image: null
        },
        { onConflict: "id" }
      );

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return new Response(JSON.stringify({ success: true, userId: authData.user.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    const errorMessage = error?.message || error?.details || JSON.stringify(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

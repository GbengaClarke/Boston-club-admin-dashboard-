// supabase/functions/create-admin-user/index.ts

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const body = await req.json().catch(() => ({}));
    const { email, password, fullName, phone, role } = body;

    if (!email || !fullName) {
      throw new Error("Missing structural requirements: email and fullName are mandatory.");
    }

    // 1. Create the user credentials inside auth.users with full bypasses
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Tells Supabase to bypass email validation links
      phone_confirm: true, // 👈 CRITICAL FIX: Tells Supabase to bypass phone/SMS verification checks
      phone: phone || undefined,
      user_metadata: { full_name: fullName }
    })

    if (authError) throw authError
    if (!authUser?.user) throw new Error("Failed to initialize system authentication context.");

    // 2. Insert or update parameters inside your public.profiles table
    // Using .upsert() prevents crashes if a database trigger has already run on the backend!
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: authUser.user.id,
          full_name: fullName,
          email: email,
          phone: phone || null,
          role: role || 'admin',
          image: null 
        },
        { onConflict: 'id' } // If the ID exists, overwrite the details instead of failing
      )

    // Clean up authentication credentials if the profiles layout fails completely
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw profileError;
    }

    return new Response(JSON.stringify({ success: true, userId: authUser.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    const errorMessage = error?.message || error?.details || JSON.stringify(error);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type SupabaseClientCache = {
  supabaseClient?: SupabaseClient;
  supabaseServiceClient?: SupabaseClient;
};

const globalForSupabase = globalThis as unknown as SupabaseClientCache;

function resolveSupabaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  if (!url) {
    throw new Error(
      "Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.",
    );
  }
  return url;
}

function resolveSupabaseKey(serviceRole: boolean) {
  if (serviceRole) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
      throw new Error(
        "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY.",
      );
    }
    return key;
  }

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "";
  if (!key) {
    throw new Error(
      "Missing Supabase anon key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return key;
}

function createSupabaseClient(serviceRole = false) {
  const url = resolveSupabaseUrl();
  const key = resolveSupabaseKey(serviceRole);

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "x-application-name": "doeshing-editorial",
      },
    },
  });
}

export function getSupabaseClient(options?: { serviceRole?: boolean }) {
  const useServiceRole = Boolean(options?.serviceRole);
  if (useServiceRole) {
    if (!globalForSupabase.supabaseServiceClient) {
      globalForSupabase.supabaseServiceClient = createSupabaseClient(true);
    }
    return globalForSupabase.supabaseServiceClient;
  }

  if (!globalForSupabase.supabaseClient) {
    globalForSupabase.supabaseClient = createSupabaseClient(false);
  }
  return globalForSupabase.supabaseClient;
}

export type { SupabaseClient };

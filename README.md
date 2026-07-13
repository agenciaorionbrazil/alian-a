create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.relationship_type as enum ('dating', 'engaged', 'married', 'other');
create type public.couple_status as enum ('active', 'paused', 'ended');
create type public.member_status as enum ('active', 'left', 'removed');
create type public.invite_status as enum ('pending', 'accepted', 'revoked', 'expired');
create type public.data_visibility as enum ('private', 'shared');
create type public.consent_type as enum (
  'terms',
  'privacy_policy',
  'personal_data',
  'sensitive_data',
  'communications',
  'partner_sharing'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  relationship_type public.relationship_type not null,
  started_on date,
  status public.couple_status not null default 'active',
  journey_name text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_couples_updated_at
before update on public.couples
for each row execute function public.set_updated_at();

create table public.couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.member_status not null default 'active',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (couple_id, user_id)
);

create unique index one_active_couple_per_user
on public.couple_members (user_id)
where status = 'active' and left_at is null;

create index couple_members_couple_id_idx on public.couple_members (couple_id);
create index couple_members_user_id_idx on public.couple_members (user_id);

create trigger set_couple_members_updated_at
before update on public.couple_members
for each row execute function public.set_updated_at();

create or replace function public.enforce_two_active_couple_members()
returns trigger
language plpgsql
as $$
declare
  active_count integer;
begin
  if new.status = 'active' and new.left_at is null then
    select count(*)
    into active_count
    from public.couple_members
    where couple_id = new.couple_id
      and status = 'active'
      and left_at is null
      and id <> coalesce(new.id, gen_random_uuid());

    if active_count >= 2 then
      raise exception 'A couple can have at most two active members.';
    end if;
  end if;

  return new;
end;
$$;

create trigger couple_members_max_two
before insert or update on public.couple_members
for each row execute function public.enforce_two_active_couple_members();

create table public.partner_invites (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  invited_by uuid not null references public.profiles(id),
  invited_email text,
  invited_phone text,
  public_code text not null unique default encode(gen_random_bytes(8), 'hex'),
  token_hash text not null,
  status public.invite_status not null default 'pending',
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_by uuid references public.profiles(id),
  accepted_at timestamptz,
  revoked_at timestamptz,
  attempts integer not null default 0 check (attempts >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (invited_email is not null or invited_phone is not null)
);

create index partner_invites_couple_id_idx on public.partner_invites (couple_id);
create index partner_invites_invited_by_idx on public.partner_invites (invited_by);
create index partner_invites_status_idx on public.partner_invites (status);

create trigger set_partner_invites_updated_at
before update on public.partner_invites
for each row execute function public.set_updated_at();

create table public.onboarding_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete cascade,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index onboarding_sessions_user_id_idx on public.onboarding_sessions (user_id);
create index onboarding_sessions_couple_id_idx on public.onboarding_sessions (couple_id);

create trigger set_onboarding_sessions_updated_at
before update on public.onboarding_sessions
for each row execute function public.set_updated_at();

create table public.onboarding_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.onboarding_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  visibility public.data_visibility not null default 'private',
  shared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, user_id, question_key)
);

create index onboarding_answers_user_id_idx on public.onboarding_answers (user_id);
create index onboarding_answers_couple_id_idx on public.onboarding_answers (couple_id);
create index onboarding_answers_visibility_idx on public.onboarding_answers (visibility);

create trigger set_onboarding_answers_updated_at
before update on public.onboarding_answers
for each row execute function public.set_updated_at();

create table public.diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete cascade,
  summary jsonb not null default '{}'::jsonb,
  visibility public.data_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index diagnostic_results_user_id_idx on public.diagnostic_results (user_id);
create index diagnostic_results_couple_id_idx on public.diagnostic_results (couple_id);

create trigger set_diagnostic_results_updated_at
before update on public.diagnostic_results
for each row execute function public.set_updated_at();

create table public.privacy_permissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid not null references public.couples(id) on delete cascade,
  resource_type text not null,
  resource_id uuid not null,
  granted_to uuid not null references public.profiles(id) on delete cascade,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (owner_id <> granted_to)
);

create index privacy_permissions_owner_id_idx on public.privacy_permissions (owner_id);
create index privacy_permissions_granted_to_idx on public.privacy_permissions (granted_to);
create index privacy_permissions_resource_idx on public.privacy_permissions (resource_type, resource_id);

create trigger set_privacy_permissions_updated_at
before update on public.privacy_permissions
for each row execute function public.set_updated_at();

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  devotional_time time,
  timezone text not null default 'America/Sao_Paulo',
  notifications_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consent_type public.consent_type not null,
  granted boolean not null,
  version text not null,
  granted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, consent_type, version)
);

create index consents_user_id_idx on public.consents (user_id);

create trigger set_consents_updated_at
before update on public.consents
for each row execute function public.set_updated_at();

create table public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  granted_by uuid references public.profiles(id),
  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(metadata) = 'object')
);

create index audit_logs_actor_id_idx on public.audit_logs (actor_id);
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);

create table public.sos_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete cascade,
  risk_level text not null default 'unknown',
  notes jsonb not null default '{}'::jsonb,
  visibility public.data_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create index sos_sessions_user_id_idx on public.sos_sessions (user_id);
create index sos_sessions_couple_id_idx on public.sos_sessions (couple_id);

create trigger set_sos_sessions_updated_at
before update on public.sos_sessions
for each row execute function public.set_updated_at();

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = check_user_id
  );
$$;

create or replace function public.is_couple_member(check_couple_id uuid, check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_members
    where couple_id = check_couple_id
      and user_id = check_user_id
      and status = 'active'
      and left_at is null
  );
$$;

create or replace function public.can_view_shared_resource(check_couple_id uuid, owner_id uuid, visibility public.data_visibility)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select owner_id = auth.uid()
    or (
      visibility = 'shared'
      and public.is_couple_member(check_couple_id, auth.uid())
    );
$$;

create or replace function public.prevent_public_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role <> old.role and not public.is_admin(auth.uid()) then
    raise exception 'Only administrators can change profile roles.';
  end if;

  return new;
end;
$$;

create trigger prevent_public_profile_role_change
before update on public.profiles
for each row execute function public.prevent_public_role_change();

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.partner_invites enable row level security;
alter table public.onboarding_sessions enable row level security;
alter table public.onboarding_answers enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.privacy_permissions enable row level security;
alter table public.user_preferences enable row level security;
alter table public.consents enable row level security;
alter table public.admin_users enable row level security;
alter table public.audit_logs enable row level security;
alter table public.sos_sessions enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (id = auth.uid());

create policy "profiles_update_own_non_admin" on public.profiles
for update using (id = auth.uid())
with check (id = auth.uid());

create policy "couples_select_members" on public.couples
for select using (public.is_couple_member(id, auth.uid()));

create policy "couples_insert_creator" on public.couples
for insert with check (created_by = auth.uid());

create policy "couples_update_members" on public.couples
for update using (public.is_couple_member(id, auth.uid()))
with check (public.is_couple_member(id, auth.uid()));

create policy "couple_members_select_own_couple" on public.couple_members
for select using (user_id = auth.uid() or public.is_couple_member(couple_id, auth.uid()));

create policy "couple_members_insert_self" on public.couple_members
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.couples
    where id = public.couple_members.couple_id
      and created_by = auth.uid()
      and not exists (
        select 1
        from public.couple_members existing
        where existing.couple_id = public.couple_members.couple_id
          and existing.status = 'active'
          and existing.left_at is null
      )
  )
);

create policy "couple_members_update_self" on public.couple_members
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "partner_invites_select_involved" on public.partner_invites
for select using (
  invited_by = auth.uid()
  or accepted_by = auth.uid()
  or public.is_couple_member(couple_id, auth.uid())
);

create policy "partner_invites_insert_member" on public.partner_invites
for insert with check (invited_by = auth.uid() and public.is_couple_member(couple_id, auth.uid()));

create policy "partner_invites_update_involved" on public.partner_invites
for update using (invited_by = auth.uid() or accepted_by = auth.uid())
with check (invited_by = auth.uid() or accepted_by = auth.uid());

create policy "onboarding_sessions_select_own" on public.onboarding_sessions
for select using (user_id = auth.uid());

create policy "onboarding_sessions_insert_own" on public.onboarding_sessions
for insert with check (user_id = auth.uid());

create policy "onboarding_sessions_update_own" on public.onboarding_sessions
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "onboarding_answers_select_private_or_shared" on public.onboarding_answers
for select using (
  user_id = auth.uid()
  or (
    visibility = 'shared'
    and couple_id is not null
    and public.is_couple_member(couple_id, auth.uid())
  )
);

create policy "onboarding_answers_insert_own" on public.onboarding_answers
for insert with check (user_id = auth.uid());

create policy "onboarding_answers_update_own" on public.onboarding_answers
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "diagnostic_results_select_private_or_shared" on public.diagnostic_results
for select using (
  user_id = auth.uid()
  or (
    visibility = 'shared'
    and couple_id is not null
    and public.is_couple_member(couple_id, auth.uid())
  )
);

create policy "diagnostic_results_insert_own" on public.diagnostic_results
for insert with check (user_id = auth.uid());

create policy "diagnostic_results_update_own" on public.diagnostic_results
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "privacy_permissions_select_involved" on public.privacy_permissions
for select using (owner_id = auth.uid() or granted_to = auth.uid());

create policy "privacy_permissions_insert_owner" on public.privacy_permissions
for insert with check (owner_id = auth.uid() and public.is_couple_member(couple_id, auth.uid()));

create policy "privacy_permissions_update_owner" on public.privacy_permissions
for update using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "user_preferences_select_own" on public.user_preferences
for select using (user_id = auth.uid());

create policy "user_preferences_insert_own" on public.user_preferences
for insert with check (user_id = auth.uid());

create policy "user_preferences_update_own" on public.user_preferences
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "consents_select_own" on public.consents
for select using (user_id = auth.uid());

create policy "consents_insert_own" on public.consents
for insert with check (user_id = auth.uid());

create policy "consents_update_own" on public.consents
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "admin_users_select_admins_only" on public.admin_users
for select using (public.is_admin(auth.uid()));

create policy "audit_logs_select_admins_only" on public.audit_logs
for select using (public.is_admin(auth.uid()));

create policy "sos_sessions_select_owner_only" on public.sos_sessions
for select using (user_id = auth.uid());

create policy "sos_sessions_insert_owner_only" on public.sos_sessions
for insert with check (user_id = auth.uid());

create policy "sos_sessions_update_owner_only" on public.sos_sessions
for update using (user_id = auth.uid())
with check (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('brand-assets', 'brand-assets', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('avatars', 'avatars', false, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "brand_assets_public_read" on storage.objects
for select using (bucket_id = 'brand-assets');

create policy "brand_assets_admin_write" on storage.objects
for insert with check (bucket_id = 'brand-assets' and public.is_admin(auth.uid()));

create policy "avatars_owner_read" on storage.objects
for select using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatars_owner_insert" on storage.objects
for insert with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatars_owner_update" on storage.objects
for update using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
) with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.create_couple_with_member(
  p_relationship_type public.relationship_type,
  p_started_on date default null,
  p_journey_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_couple_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  insert into public.couples (relationship_type, started_on, journey_name, created_by)
  values (p_relationship_type, p_started_on, nullif(trim(p_journey_name), ''), auth.uid())
  returning id into new_couple_id;

  insert into public.couple_members (couple_id, user_id, status)
  values (new_couple_id, auth.uid(), 'active');

  return new_couple_id;
end;
$$;

create or replace function public.create_partner_invite(
  p_couple_id uuid,
  p_invited_email text default null,
  p_invited_phone text default null,
  p_token text default null
)
returns table(public_code text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  if p_token is null or length(p_token) < 32 then
    raise exception 'Invite token is invalid.';
  end if;

  if nullif(trim(coalesce(p_invited_email, '')), '') is null
     and nullif(trim(coalesce(p_invited_phone, '')), '') is null then
    raise exception 'Email or phone is required.';
  end if;

  if not public.is_couple_member(p_couple_id, auth.uid()) then
    raise exception 'Only active couple members can invite a partner.';
  end if;

  return query
  insert into public.partner_invites (
    couple_id,
    invited_by,
    invited_email,
    invited_phone,
    token_hash
  )
  values (
    p_couple_id,
    auth.uid(),
    nullif(lower(trim(p_invited_email)), ''),
    nullif(trim(p_invited_phone), ''),
    crypt(p_token, gen_salt('bf'))
  )
  returning partner_invites.public_code, partner_invites.expires_at;
end;
$$;

create or replace function public.accept_partner_invite(
  p_public_code text,
  p_token text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record public.partner_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.';
  end if;

  select *
  into invite_record
  from public.partner_invites
  where public_code = p_public_code
  for update;

  if invite_record.id is null then
    raise exception 'Invite not found.';
  end if;

  if invite_record.status <> 'pending'
     or invite_record.revoked_at is not null
     or invite_record.expires_at <= now() then
    update public.partner_invites
    set status = case
      when expires_at <= now() then 'expired'::public.invite_status
      else status
    end
    where id = invite_record.id;

    raise exception 'Invite is not available.';
  end if;

  if invite_record.token_hash <> crypt(p_token, invite_record.token_hash) then
    update public.partner_invites
    set attempts = attempts + 1
    where id = invite_record.id;

    raise exception 'Invite token is invalid.';
  end if;

  if invite_record.invited_by = auth.uid() then
    raise exception 'Invite sender cannot accept their own invite.';
  end if;

  insert into public.couple_members (couple_id, user_id, status)
  values (invite_record.couple_id, auth.uid(), 'active')
  on conflict (couple_id, user_id)
  do update set status = 'active', left_at = null, updated_at = now();

  update public.partner_invites
  set status = 'accepted',
      accepted_by = auth.uid(),
      accepted_at = now()
  where id = invite_record.id;

  return invite_record.couple_id;
end;
$$;

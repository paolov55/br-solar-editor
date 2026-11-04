-- BR Solar Editor — mensalidade, termos de uso e configuração de cobrança.
-- Acesso somente pelo servidor (service role): RLS ligado e SEM policies,
-- o que bloqueia qualquer acesso com a anon key.

create type status_cobranca as enum ('pendente', 'pago', 'isento');

-- ───────────────────────── configuração (linha única)
create table config_cobranca (
  id boolean primary key default true check (id),
  valor numeric(10,2) not null default 150,
  dia_vencimento smallint not null default 10 check (dia_vencimento between 1 and 28),
  lembrete_dias smallint not null default 5 check (lembrete_dias between 0 and 30),
  inicio date not null default '2026-11-01',   -- mês da 1ª cobrança (sempre dia 1)
  updated_at timestamptz not null default now()
);
insert into config_cobranca default values;

create trigger config_cobranca_updated before update on config_cobranca
  for each row execute function public.set_updated_at();

-- ───────────────────────── cobranças mensais
create table cobrancas (
  id uuid primary key default gen_random_uuid(),
  referencia date not null unique,              -- dia 1 do mês de referência
  vencimento date not null,
  valor numeric(10,2) not null,
  status status_cobranca not null default 'pendente',
  pago_em timestamptz,
  metodo text,
  mp_preference_id text,
  mp_payment_id text,
  baixa_manual boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cobrancas_status_idx on cobrancas (status, vencimento);

create trigger cobrancas_updated before update on cobrancas
  for each row execute function public.set_updated_at();

-- ───────────────────────── aceite dos termos de uso
create table termos_aceites (
  id uuid primary key default gen_random_uuid(),
  login text not null,
  versao text not null,
  aceito_em timestamptz not null default now(),
  ip text,
  user_agent text,
  unique (login, versao)
);

alter table config_cobranca enable row level security;
alter table cobrancas enable row level security;
alter table termos_aceites enable row level security;

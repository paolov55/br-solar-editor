-- BR Solar Editor — esquema inicial (equipe pequena, dados compartilhados)

create extension if not exists pgcrypto;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ───────────────────────── enums
create type tipo_cobranca as enum ('consumo', 'fixa');
create type tipo_proposta as enum ('sistema', 'carregador', 'servico');
create type assinatura_por as enum ('cliente', 'representante');
create type slot_imagem as enum ('dim', 'fluxo', 'carregador_1', 'carregador_2');

-- ───────────────────────── faturas
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  doc text not null default '',
  endereco text not null default '',
  tipo tipo_cobranca not null default 'consumo',
  tarifa numeric(10,4) not null default 1.37,
  desconto numeric(5,2) not null default 0,
  dia_venc smallint not null default 10 check (dia_venc between 1 and 31),
  concessionaria text not null default 'Neoenergia',
  contratado numeric(12,2) not null default 0,
  taxa_minima numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id)
);

create table contas_pagamento (
  id uuid primary key default gen_random_uuid(),
  apelido text not null,
  padrao boolean not null default false,
  pix text not null default '',
  favorecido text not null default '',
  banco text not null default '',
  agencia text not null default '',
  conta text not null default '',
  tipo_conta text not null default 'Conta Corrente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id)
);
create unique index contas_pagamento_uma_padrao on contas_pagamento (padrao) where padrao;

create table faturas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete set null,
  conta_pagamento_id uuid references contas_pagamento(id) on delete set null,
  mes date not null,                       -- sempre dia 1 do mês de referência
  vencimento date not null,
  tipo tipo_cobranca not null default 'consumo',
  kwh numeric(12,2) not null default 0,
  tarifa numeric(10,4) not null default 1.37,
  valor_ref numeric(12,2),                 -- null = kwh × tarifa
  desconto numeric(5,2) not null default 0,
  concessionaria text not null default 'Neoenergia',
  contratado numeric(12,2) not null default 0,
  taxa_minima numeric(12,2) not null default 0,
  -- snapshots: a fatura emitida não muda se o cliente/conta forem editados depois
  nome text not null default '',
  doc text not null default '',
  endereco text not null default '',
  pix text not null default '',
  favorecido text not null default '',
  banco text not null default '',
  agencia text not null default '',
  conta text not null default '',
  tipo_conta text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id)
);
create index faturas_mes_idx on faturas (mes desc);
create index faturas_cliente_idx on faturas (cliente_id);

-- ───────────────────────── documentação
create table pacotes (
  id uuid primary key default gen_random_uuid(),
  nome text not null default '',
  doc text not null default '',
  endereco text not null default '',
  rg text not null default '',
  profissao text not null default '',
  nacionalidade text not null default '',
  estado_civil text not null default '',
  representante text not null default '',
  rep_cpf text not null default '',
  rep_cargo text not null default 'síndico',
  assinatura_por assinatura_por not null default 'cliente',
  inc_procuracao boolean not null default true,
  inc_termo boolean not null default true,
  inc_contrato boolean not null default true,
  valor_mensal text not null default '',
  explicativo text not null default '',
  simplificadora text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id)
);

-- ───────────────────────── propostas
create table gerentes (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id)
);

create table propostas (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_proposta not null default 'sistema',
  cliente text not null default '',
  gerente_id uuid references gerentes(id) on delete set null,
  potencia text not null default '',
  geracao text not null default '',
  area_util text not null default '',
  mostrar_imagem_dim boolean not null default true,
  inc_contracapa boolean not null default true,
  inc_portfolio boolean not null default true,
  inc_clientes boolean not null default true,
  inc_economia boolean not null default true,
  inc_financiamento boolean not null default true,
  fin_banco text not null default 'BANCO BV',
  payback text not null default '',
  rend_poupanca text not null default '',
  rend_renda_fixa text not null default '',
  rend_solar text not null default '',
  a_vista boolean not null default true,
  valor_vista text not null default '',
  cartao boolean not null default false,
  valor_cartao text not null default '',
  outra_ativa boolean not null default false,
  outra_rotulo text not null default '',
  valor_outra text not null default '',
  validade_dias text not null default '05',
  num_documento text not null default '',
  estado text not null default 'Pernambuco',
  descricao_atividades text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id)
);

create table proposta_itens (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  ordem int not null,
  tipo text not null,
  modelo text not null default '',
  qtd text not null default ''
);
create table proposta_garantias (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  ordem int not null,
  grupo text not null default '',
  label text not null,
  prazo text not null default ''
);
create table proposta_financiamentos (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  ordem int not null,
  carencia text not null default '',
  entrada text not null default '',
  parcelas text not null default '',
  valor text not null default ''
);
create table proposta_itens_servico (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  ordem int not null,
  descricao text not null default '',
  valor text not null default ''
);
create table proposta_imagens (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas(id) on delete cascade,
  slot slot_imagem not null,
  storage_path text not null,
  unique (proposta_id, slot)
);
create index proposta_itens_p on proposta_itens (proposta_id, ordem);
create index proposta_garantias_p on proposta_garantias (proposta_id, ordem);
create index proposta_financiamentos_p on proposta_financiamentos (proposta_id, ordem);
create index proposta_itens_servico_p on proposta_itens_servico (proposta_id, ordem);

-- padrões compartilhados ("salvar como padrão")
create table garantias_padrao (
  id uuid primary key default gen_random_uuid(),
  ordem int not null,
  grupo text not null default '',
  label text not null,
  prazo text not null default ''
);
create table config (
  id boolean primary key default true check (id),   -- linha única
  rend_poupanca text not null default '6,17%',
  rend_renda_fixa text not null default '11,75%',
  rend_solar text not null default '45,47%',
  updated_at timestamptz not null default now()
);
insert into config default values;

-- ───────────────────────── triggers updated_at
do $$
declare t text;
begin
  foreach t in array array['clientes','contas_pagamento','faturas','pacotes','gerentes','propostas','config'] loop
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ───────────────────────── RLS: equipe autenticada vê e edita tudo
do $$
declare t text;
begin
  foreach t in array array[
    'clientes','contas_pagamento','faturas','pacotes','gerentes','propostas',
    'proposta_itens','proposta_garantias','proposta_financiamentos','proposta_itens_servico','proposta_imagens',
    'garantias_padrao','config'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for all to authenticated using (true) with check (true)',
      t || '_equipe', t);
  end loop;
end $$;

-- ───────────────────────── RPC: salvar proposta + filhos numa transação
create or replace function public.salvar_proposta(p jsonb) returns uuid
language plpgsql security invoker as $$
declare
  pid uuid := coalesce(nullif(p->>'id','')::uuid, gen_random_uuid());
  r jsonb;
  i int;
begin
  insert into propostas as t (
    id, tipo, cliente, gerente_id, potencia, geracao, area_util, mostrar_imagem_dim,
    inc_contracapa, inc_portfolio, inc_clientes, inc_economia, inc_financiamento,
    fin_banco, payback, rend_poupanca, rend_renda_fixa, rend_solar,
    a_vista, valor_vista, cartao, valor_cartao, outra_ativa, outra_rotulo, valor_outra,
    validade_dias, num_documento, estado, descricao_atividades
  ) values (
    pid, (p->>'tipo')::tipo_proposta, coalesce(p->>'cliente',''), nullif(p->>'gerente_id','')::uuid,
    coalesce(p->>'potencia',''), coalesce(p->>'geracao',''), coalesce(p->>'area_util',''),
    coalesce((p->>'mostrar_imagem_dim')::bool, true),
    coalesce((p->>'inc_contracapa')::bool, true), coalesce((p->>'inc_portfolio')::bool, true),
    coalesce((p->>'inc_clientes')::bool, true), coalesce((p->>'inc_economia')::bool, true),
    coalesce((p->>'inc_financiamento')::bool, true),
    coalesce(p->>'fin_banco',''), coalesce(p->>'payback',''),
    coalesce(p->>'rend_poupanca',''), coalesce(p->>'rend_renda_fixa',''), coalesce(p->>'rend_solar',''),
    coalesce((p->>'a_vista')::bool, true), coalesce(p->>'valor_vista',''),
    coalesce((p->>'cartao')::bool, false), coalesce(p->>'valor_cartao',''),
    coalesce((p->>'outra_ativa')::bool, false), coalesce(p->>'outra_rotulo',''), coalesce(p->>'valor_outra',''),
    coalesce(p->>'validade_dias','05'), coalesce(p->>'num_documento',''),
    coalesce(p->>'estado','Pernambuco'), coalesce(p->>'descricao_atividades','')
  )
  on conflict (id) do update set
    tipo = excluded.tipo, cliente = excluded.cliente, gerente_id = excluded.gerente_id,
    potencia = excluded.potencia, geracao = excluded.geracao, area_util = excluded.area_util,
    mostrar_imagem_dim = excluded.mostrar_imagem_dim,
    inc_contracapa = excluded.inc_contracapa, inc_portfolio = excluded.inc_portfolio,
    inc_clientes = excluded.inc_clientes, inc_economia = excluded.inc_economia,
    inc_financiamento = excluded.inc_financiamento, fin_banco = excluded.fin_banco,
    payback = excluded.payback, rend_poupanca = excluded.rend_poupanca,
    rend_renda_fixa = excluded.rend_renda_fixa, rend_solar = excluded.rend_solar,
    a_vista = excluded.a_vista, valor_vista = excluded.valor_vista,
    cartao = excluded.cartao, valor_cartao = excluded.valor_cartao,
    outra_ativa = excluded.outra_ativa, outra_rotulo = excluded.outra_rotulo, valor_outra = excluded.valor_outra,
    validade_dias = excluded.validade_dias, num_documento = excluded.num_documento,
    estado = excluded.estado, descricao_atividades = excluded.descricao_atividades;

  delete from proposta_itens where proposta_id = pid;
  delete from proposta_garantias where proposta_id = pid;
  delete from proposta_financiamentos where proposta_id = pid;
  delete from proposta_itens_servico where proposta_id = pid;

  i := 0;
  for r in select * from jsonb_array_elements(coalesce(p->'itens','[]')) loop
    insert into proposta_itens (proposta_id, ordem, tipo, modelo, qtd)
    values (pid, i, r->>'tipo', coalesce(r->>'modelo',''), coalesce(r->>'qtd',''));
    i := i + 1;
  end loop;
  i := 0;
  for r in select * from jsonb_array_elements(coalesce(p->'garantias','[]')) loop
    insert into proposta_garantias (proposta_id, ordem, grupo, label, prazo)
    values (pid, i, coalesce(r->>'grupo',''), r->>'label', coalesce(r->>'prazo',''));
    i := i + 1;
  end loop;
  i := 0;
  for r in select * from jsonb_array_elements(coalesce(p->'fin_opcoes','[]')) loop
    insert into proposta_financiamentos (proposta_id, ordem, carencia, entrada, parcelas, valor)
    values (pid, i, coalesce(r->>'carencia',''), coalesce(r->>'entrada',''), coalesce(r->>'parcelas',''), coalesce(r->>'valor',''));
    i := i + 1;
  end loop;
  i := 0;
  for r in select * from jsonb_array_elements(coalesce(p->'itens_servico','[]')) loop
    insert into proposta_itens_servico (proposta_id, ordem, descricao, valor)
    values (pid, i, coalesce(r->>'descricao',''), coalesce(r->>'valor',''));
    i := i + 1;
  end loop;

  return pid;
end $$;

-- ───────────────────────── storage: imagens das propostas
insert into storage.buckets (id, name, public) values ('proposta-imagens', 'proposta-imagens', false)
on conflict (id) do nothing;

create policy "equipe lê imagens" on storage.objects for select to authenticated
  using (bucket_id = 'proposta-imagens');
create policy "equipe envia imagens" on storage.objects for insert to authenticated
  with check (bucket_id = 'proposta-imagens');
create policy "equipe altera imagens" on storage.objects for update to authenticated
  using (bucket_id = 'proposta-imagens');
create policy "equipe remove imagens" on storage.objects for delete to authenticated
  using (bucket_id = 'proposta-imagens');

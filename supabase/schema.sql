create table vendas (
  id uuid default gen_random_uuid() primary key,
  payt_order_id text unique,
  cliente_nome text,
  cliente_email text,
  valor numeric(10,2),
  status text,
  produto_nome text,
  estado char(2),
  created_at timestamptz default now()
);

create index idx_vendas_estado on vendas(estado);
create index idx_vendas_status on vendas(status);
create index idx_vendas_created_at on vendas(created_at desc);

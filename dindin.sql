create database dindin

CREATE table
 usuarios(
    id serial primary key, 
    nome text, 
    email varchar(100) unique,
    senha varchar(100)
  );
 
CREATE table
 categorias(
    id serial primary key, 
    usuario_id integer references usuarios(id), 
    descricao varchar(200) 
  );

create table
  transacoes (
    id serial primary key,
    descricao varchar(100),
    valor integer,
    data timestamp with time zone,
    categoria_id integer references categorias (id),
    usuario_id integer references usuarios (id),
    tipo text
  );


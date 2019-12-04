create schema namegator;

create table namegator.item (
    id serial not null primary key,
    type varchar(15) not null,
    description varchar(50) not null
);

insert into namegator.item (type, description) values
    ('prefix', 'Air'),
    ('prefix', 'Jet'),
    ('prefix', 'Flight'),
    ('suffix', 'Hub'),
    ('suffix', 'Station'),
    ('suffix', 'Mart')
;
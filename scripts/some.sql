-- 创建中英文名称字段表
create table field_map(
    id int(11) not null primary key auto_increment,
    db_id int(11) not null,
    table_id int(11) not null,
    table_name varchar(254) not null,
    table_title varchar(254) not null,
    fields_map text
) 
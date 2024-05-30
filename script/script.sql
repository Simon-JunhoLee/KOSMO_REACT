use reactdb;

create table users(
	uid varchar(20) not null primary key,
    upass varchar(200) not null,
    uname varchar(20) not null,
    address1 varchar(500),
    address2 varchar(500),
    phone varchar(20),
    photo varchar(200),
    regDate datetime default now()
);

insert into users(uid, upass, uname) values('jun', 'pass', '이준호');
insert into users(uid, upass, uname) values('sang', 'pass', '김상균');
insert into users(uid, upass, uname) values('hong', 'pass', '홍길동');
insert into users(uid, upass, uname) values('blue', 'pass', '김블루');

select * from users;

update users set phone='010-7405-5883', address1='서울 양천구 은행정로4길 20-1', address2='남부빌딩 501호' where uid='jun';


create table books(
	bid int auto_increment primary key,
    title varchar(500) not null,
    price int default 0,
    contents text,
    isbn varchar(100),
    publisher varchar(100),
    image varchar(200),
    author varchar(200),
    regDate datetime default now()
);
drop table books;
desc books;

select * from books;

select count(*) from books;

select *, date_format(regdate, '%Y-%m-%d') fmtDate, format(price, 0) fmtPrice 
from books
order by bid desc
limit 0, 5;

alter table books add column updateDate datetime;
alter table books add column bigImage varchar(200);

create table likes(
	uid varchar(20) not null,
    
);
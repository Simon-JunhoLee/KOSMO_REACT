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
    bid int not null,
    regDate datetime default now(),
    primary key(uid, bid),
    foreign key(uid) references users(uid),
    foreign key(bid) references books(bid)
);

select * from likes;

/*도서별 좋아요 개수*/
select *, date_format(regdate, '%Y-%m-%d') fmtDate, format(price, 0) fmtPrice, 
(select count(*) from likes where books.bid = likes.bid) lcnt,
(select count(*) from likes where books.bid = likes.bid and uid='jun') ucnt
from books
order by bid desc
limit 0, 5;

create table review(
	rid int auto_increment primary key,
    bid int not null,
    uid varchar(20) not null,
    contents text not null,
    regdate datetime default now(),
    foreign key(bid) references books(bid),
    foreign key(uid) references users(uid)
);

desc review;

select * from review;
select * from users;

drop view view_review;
create view view_review as
select r.*, u.uname, u.photo, date_format(r.regdate,'%Y-%m-%d %T') fmtdate
from review r, users u
where r.uid=u.uid;

select * from view_review
where bid=113
order by rid desc
limit 0, 3;

/*장바구니*/
create table cart(
	uid varchar(20) not null,
    bid int not null,
    qnt int default 1,
    regDate datetime default now(),
    primary key(uid, bid),
    foreign key(uid) references users(uid),
    foreign key(bid) references books(bid)
);

desc cart;

select * from cart;

create view view_cart as
select c.*, b.title, b.image, b.price, format(b.price, 0) fmtPrice
from cart c, books b
where c.bid = b.bid;

select * from view_cart;

/*주문자 정보*/
create table purchase(
	pid char(13) not null primary key,
    uid varchar(20) not null,
    uname varchar(20) not null,
    phone varchar(20) not null,
	address1 varchar(500) not null,
    address2 varchar(500) not null,
    pdate datetime default now(),
    sum int default 0,
    status int default 0,	/*0:결제대기, 1:결제확인, 2:배송준비, 3:배송완료, 4:주문완료*/
    foreign key(uid) references users(uid)
);

select * from purchase;
delete from purchase where pid>'';

/*주문상품 정보*/
create table orders(
	pid char(13) not null,
    bid int not null,
    price int default 0,
    qnt int default 0,
    primary key (pid, bid),
    foreign key(pid) references purchase(pid),
    foreign key(bid) references books(bid)
);

select * from orders;
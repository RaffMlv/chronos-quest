use chronos_notification;

create table notifications(
                              id bigint auto_increment primary key,
                              recipient_id bigint not null,
                              recipient_name varchar(80) not null,
                              notification_type varchar(50) not null,
                              message text not null,
                              status varchar(20) not null default 'PENDING',
                              created_at timestamp not null default current_timestamp,
                              sent_at timestamp null
);
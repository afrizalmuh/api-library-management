CREATE TABLE core.t_mtr_user_group (
	id_seq bigserial PRIMARY KEY,
	group_name_var varchar(50) NOT NULL UNIQUE,
	status_int int2 NULL DEFAULT 1,
	created_by_var varchar(30) NOT NULL,
	created_on_dtm timestamp(0) NULL DEFAULT now(),
	updated_by_var varchar(30) NULL,
	updated_on_dtm timestamp(0) NULL,
);

CREATE TABLE core.t_mtr_user (
	id_seq bigserial PRIMARY KEY,
	user_group_id_int int4 NOT NULL,
	fullname_var varchar(100) NOT NULL,
	username_var varchar(50) NOT NULL UNIQUE,
	password_var varchar(255) NOT NULL,
	email_var varchar(100) NOT NULL UNIQUE,
	is_login_int int2 NULL DEFAULT 0,
	created_by_var varchar(30) NOT NULL,
	created_on_dtm timestamp(0) NULL DEFAULT now(),
	updated_by_var varchar(30) NULL,
	updated_on_dtm timestamp(0) NULL
);

CREATE TABLE core.t_mtr_menu_web (
	id_seq serial4 NOT NULL,
	parent_id_int int4 NULL,
	name_var varchar(100) NOT NULL,
	icon_var varchar(100) NULL,
	slug_var varchar(100) NULL,
	order_int int2 NOT NULL,
	status_int int2 NOT NULL DEFAULT 1,
	created_by_var varchar(30) NOT NULL,
	created_on_dtm timestamp(6) NULL DEFAULT now(),
	updated_by_var varchar(30) NULL,
	updated_on_dtm timestamp(6) NULL,
	CONSTRAINT t_mtr_menu_web_pkey PRIMARY KEY (id_seq)
);
CREATE INDEX t_mtr_menu_web_order_int_idx ON core.t_mtr_menu_web USING btree (order_int);
CREATE INDEX t_mtr_menu_web_parent_id_int_idx ON core.t_mtr_menu_web USING btree (parent_id_int);
CREATE INDEX t_mtr_menu_web_status_int_idx ON core.t_mtr_menu_web USING btree (status_int);
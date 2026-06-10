-- DROP SCHEMA auth;

CREATE SCHEMA auth;

-- DROP SEQUENCE users_id_seq;

CREATE SEQUENCE auth.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- auth.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE auth.users (
	id serial4 NOT NULL,
	email text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'USER'::text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	display_name varchar(100) NULL,
	phone varchar(20) NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- DROP SCHEMA booking;

CREATE SCHEMA booking;

-- DROP SEQUENCE bookings_id_seq;

CREATE SEQUENCE booking.bookings_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE payments_id_seq;

CREATE SEQUENCE booking.payments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE reviews_id_seq;

CREATE SEQUENCE booking.reviews_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- booking.bookings definition

-- Drop table

-- DROP TABLE bookings;

CREATE TABLE booking.bookings (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	room_type_id int4 NOT NULL,
	check_in date NOT NULL,
	check_out date NOT NULL,
	status text DEFAULT 'PENDING'::text NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	payment_method varchar(20) DEFAULT 'online'::character varying NOT NULL,
	reminder_sent bool DEFAULT false NULL,
	CONSTRAINT bookings_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['online'::character varying, 'pay_at_hotel'::character varying])::text[]))),
	CONSTRAINT bookings_pkey PRIMARY KEY (id),
	CONSTRAINT bookings_status_check CHECK ((status = ANY (ARRAY['PENDING'::text, 'CONFIRMED'::text, 'PAID'::text, 'CANCELLED'::text, 'REFUNDED'::text])))
);


-- booking.payments definition

-- Drop table

-- DROP TABLE payments;

CREATE TABLE booking.payments (
	id serial4 NOT NULL,
	booking_id int4 NOT NULL,
	amount numeric NOT NULL,
	status text NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id)
);


-- booking.reviews definition

-- Drop table

-- DROP TABLE reviews;

CREATE TABLE booking.reviews (
	id serial4 NOT NULL,
	booking_id int4 NOT NULL,
	user_id int4 NOT NULL,
	hotel_id int4 NOT NULL,
	rating int4 NOT NULL,
	"comment" text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT reviews_booking_id_key UNIQUE (booking_id),
	CONSTRAINT reviews_comment_check CHECK (((char_length(comment) >= 10) AND (char_length(comment) <= 1000))),
	CONSTRAINT reviews_pkey PRIMARY KEY (id),
	CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 10)))
);
CREATE INDEX idx_reviews_booking_id ON booking.reviews USING btree (booking_id);
CREATE INDEX idx_reviews_hotel_id ON booking.reviews USING btree (hotel_id);
CREATE INDEX idx_reviews_user_id ON booking.reviews USING btree (user_id);


-- booking.reviews foreign keys

ALTER TABLE booking.reviews ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES booking.bookings(id);
ALTER TABLE booking.reviews ADD CONSTRAINT reviews_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES hotel.hotels(id);
ALTER TABLE booking.reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- DROP SCHEMA hotel;

CREATE SCHEMA hotel;

-- DROP SEQUENCE amenities_id_seq;

CREATE SEQUENCE hotel.amenities_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE cities_id_seq;

CREATE SEQUENCE hotel.cities_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE hotel_images_id_seq;

CREATE SEQUENCE hotel.hotel_images_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE hotels_id_seq;

CREATE SEQUENCE hotel.hotels_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE rooms_id_seq;

CREATE SEQUENCE hotel.rooms_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- hotel.amenities definition

-- Drop table

-- DROP TABLE amenities;

CREATE TABLE hotel.amenities (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT amenities_name_key UNIQUE (name),
	CONSTRAINT amenities_pkey PRIMARY KEY (id)
);


-- hotel.hotels definition

-- Drop table

-- DROP TABLE hotels;

CREATE TABLE hotel.hotels (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	address text NULL,
	description text NULL,
	created_at timestamp DEFAULT now() NULL,
	rating numeric(3, 1) DEFAULT 0 NULL,
	reviews int4 DEFAULT 0 NULL,
	price_from int4 NULL,
	stars int4 NULL,
	discount_percent int4 DEFAULT 0 NULL,
	CONSTRAINT hotels_pkey PRIMARY KEY (id)
);


-- hotel.room_types definition

-- Drop table

-- DROP TABLE room_types;

CREATE TABLE hotel.room_types (
	id int4 DEFAULT nextval('hotel.rooms_id_seq'::regclass) NOT NULL,
	hotel_id int4 NOT NULL,
	"name" text NOT NULL,
	price_per_night numeric NOT NULL,
	max_guests int4 NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT now() NULL,
	bed text NULL,
	"size" text NULL,
	total_quantity int4 DEFAULT 1 NOT NULL,
	CONSTRAINT room_types_total_quantity_check CHECK ((total_quantity >= 0)),
	CONSTRAINT rooms_pkey PRIMARY KEY (id),
	CONSTRAINT rooms_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES hotel.hotels(id)
);


-- hotel.room_amenities definition

-- Drop table

-- DROP TABLE room_amenities;

CREATE TABLE hotel.room_amenities (
	room_type_id int4 NOT NULL,
	amenity_id int4 NOT NULL,
	CONSTRAINT room_amenities_pkey PRIMARY KEY (room_type_id, amenity_id),
	CONSTRAINT room_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES hotel.amenities(id),
	CONSTRAINT room_amenities_room_id_fkey FOREIGN KEY (room_type_id) REFERENCES hotel.room_types(id)
);


-- hotel.cities definition

-- Drop table

-- DROP TABLE cities;

CREATE TABLE hotel.cities (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	subtitle varchar(255) NULL,
	thumbnail text NULL,
	created_at timestamp DEFAULT now() NULL,
	thumbnail_id int4 NULL,
	CONSTRAINT cities_name_key UNIQUE (name),
	CONSTRAINT cities_pkey PRIMARY KEY (id)
);


-- hotel.hotel_images definition

-- Drop table

-- DROP TABLE hotel_images;

CREATE TABLE hotel.hotel_images (
	id serial4 NOT NULL,
	hotel_id int4 NOT NULL,
	image_id int4 NOT NULL,
	sort_order int4 DEFAULT 0 NULL,
	CONSTRAINT hotel_images_hotel_id_image_id_key UNIQUE (hotel_id, image_id),
	CONSTRAINT hotel_images_pkey PRIMARY KEY (id)
);


-- hotel.cities foreign keys

ALTER TABLE hotel.cities ADD CONSTRAINT cities_thumbnail_id_fkey FOREIGN KEY (thumbnail_id) REFERENCES settings.images(id) ON DELETE SET NULL;


-- hotel.hotel_images foreign keys

ALTER TABLE hotel.hotel_images ADD CONSTRAINT hotel_images_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES hotel.hotels(id) ON DELETE CASCADE;
ALTER TABLE hotel.hotel_images ADD CONSTRAINT hotel_images_image_id_fkey FOREIGN KEY (image_id) REFERENCES settings.images(id) ON DELETE CASCADE;

-- DROP SCHEMA notification;

CREATE SCHEMA notification;

-- DROP SEQUENCE notifications_id_seq;

CREATE SEQUENCE notification.notifications_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- notification.notifications definition

-- Drop table

-- DROP TABLE notifications;

CREATE TABLE notification.notifications (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	"type" varchar(50) NOT NULL,
	title varchar(200) NOT NULL,
	message text NOT NULL,
	metadata jsonb DEFAULT '{}'::jsonb NULL,
	is_read bool DEFAULT false NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT notifications_pkey PRIMARY KEY (id),
	CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['BOOKING_CREATED'::character varying, 'BOOKING_CANCELLED'::character varying, 'PAYMENT_SUCCESS'::character varying, 'REVIEW_POSTED'::character varying, 'SYSTEM'::character varying])::text[])))
);
CREATE INDEX idx_notifications_user_id ON notification.notifications USING btree (user_id);
CREATE INDEX idx_notifications_user_unread ON notification.notifications USING btree (user_id, is_read) WHERE (is_read = false);


-- notification.notifications foreign keys

ALTER TABLE notification.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- DROP SCHEMA settings;

CREATE SCHEMA settings;

-- DROP SEQUENCE settings.images_id_seq;

CREATE SEQUENCE settings.images_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- settings.images definition

-- Drop table

-- DROP TABLE settings.images;

CREATE TABLE settings.images (
	id serial4 NOT NULL,
	url text NOT NULL,
	alt varchar(255) NULL,
	"type" varchar(50) DEFAULT 'hotel'::character varying NULL,
	created_at timestamp DEFAULT now() NULL,
	CONSTRAINT images_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS hotel.nearby_services (
  id            SERIAL PRIMARY KEY,
  hotel_id      INT NOT NULL REFERENCES hotel.hotels(id) ON DELETE CASCADE,
  category      VARCHAR(50) NOT NULL,   -- food, attraction, wellness, transport, nightlife
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  address       VARCHAR(500),
  distance      VARCHAR(50),            -- VD: '200m', '1.2km', '5 phút đi bộ'
  rating        NUMERIC(2,1),           -- 1.0 - 5.0
  price_range   VARCHAR(100),           -- VD: '50.000 - 200.000₫', 'Miễn phí'
  map_url       VARCHAR(1000),          -- Link Google Maps
  website_url   VARCHAR(1000),          -- Link website (nếu có)
  tags          TEXT[],                 -- Tags phụ: ['cafe','view đẹp','wifi']
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nearby_services_hotel_id ON hotel.nearby_services(hotel_id);
CREATE INDEX IF NOT EXISTS idx_nearby_services_category ON hotel.nearby_services(category);
CREATE INDEX IF NOT EXISTS idx_nearby_services_hotel_category ON hotel.nearby_services(hotel_id, category);

INSERT INTO auth.users (email,"password","role",created_at,display_name,phone) VALUES
	 ('test1@gmail.com','$2b$10$j6Jil2004/Q1/FO2Bu7fHupHAIlqk6rvi5e5viZ.r2JdugKCMmKjW','user','2025-12-29 15:23:15.867461',NULL,NULL),
	 ('test111@gmail.com','$2b$10$rtQw31MvyxGjNvS7I9tFIOq9kTaHAW9bho7zs/rn/x2XH76cgM./W','user','2025-12-29 15:38:37.102564',NULL,NULL),
	 ('admin@gmail.com','$2b$10$D8JCrUgv1g/WyVzxOVi0IOBL8CuZP/GKovSZLaHpH4LA/EHAjbZ9a','admin','2025-12-31 09:53:23.50216',NULL,NULL),
	 ('abc@gmail.com','$2b$10$rvY6XDY/UuDXvxhlfSrhcepca84RJ.3XbLyq0Epg5rWaNpLS37kPq','user','2026-03-03 15:03:09.310486',NULL,NULL),
	 ('quanh@gmail.com','$2b$10$.LiGQ1yzXH5/UWtvwZgH6Oh1wGhRn3yJM9wUPmpsnnztO6yVo7JNS','user','2026-03-03 15:18:25.109679',NULL,NULL),
	 ('quanhhh@gmail.com','$2b$10$gba43uObncKecrg7S/X.Je5Axi6Wj8aVGaAa7cOYDHsBgjdsC6CRe','user','2026-04-21 12:03:17.63931',NULL,NULL),
	 ('abcde@gmail.com','$2b$10$RqUAUEXpVu3jQ7Z6G7NNZOr2EJKnn8jiu4qp4bXPC4f8G5IFlJrA2','user','2026-04-21 12:04:34.343399',NULL,NULL),
	 ('tesst123123@gmail.com','$2b$10$lq7vqhA5slC8S22T41tnLelggMxFfjhPAHh/ZCauqMzbrGjSchxTG','user','2026-04-21 15:52:24.091462',NULL,NULL),
	 ('quanhtran123@gmail.com','$2b$10$QlfFu/HBXKv3Hv3OCEja2uYBU85c7d6A6SGt04.jqVOwVxDlaZ2z6','user','2026-04-21 15:53:57.907922',NULL,NULL),
	 ('tuananh@gmail.com','$2b$10$lvnHzM0LoB3E3Ez8etolqeLhqmgn8IvDOUZu2BzZE6ITqF0xQZL8y','user','2026-04-21 15:56:14.570338',NULL,NULL);
INSERT INTO auth.users (email,"password","role",created_at,display_name,phone) VALUES
	 ('anhtung@gmail.com','$2b$10$TAfjVZlWexYapegTOfbfne5Kt4iLqG8lGHmupPmfwT0YK9dv1FkOK','user','2026-04-21 15:57:07.40785',NULL,NULL),
	 ('tuantran@gmail.com','$2b$10$ZVMJAXnHrz3biGEbZGPSBeyjamWGXEIjhwnbVWHfk4JRRJrYaBJHi','user','2026-04-21 15:57:43.915035',NULL,NULL),
	 ('thaian@gmail.com','$2b$10$2v0KjcqRTknFym45mXmOAeFmlqQ56Sc3NhJC6RNNW32cyfLaNqXjG','user','2026-04-21 15:58:49.520065',NULL,NULL),
	 ('toantu@gmail.com','$2b$10$2II9r4rK4BH37UQ7Nh9Ut.1qdzaE32Xb9Hq84ccqqlAOHJ.Y3xMmW','user','2026-04-21 16:06:08.713123',NULL,NULL),
	 ('asdfsdf@gmail.com','$2b$10$PEo5O65mz4sAp7p56HxQ3ebSZsRQr0CJVxKPRGxy97OG1BQeybWWe','user','2026-04-21 16:07:57.701667',NULL,NULL),
	 ('sfd23@gmail.com','$2b$10$7vkw3QTPjC6oLH1M5AaCHu2Kj3wqTPxuabREmRdZMf4upmzQTpDb2','user','2026-04-21 16:08:15.912893',NULL,NULL),
	 ('admin123@gmail.com','$2b$10$HsUAguJ5gGGCkDSPjL7lYO3ltE1AvpfaNMYnZESTqZMWoPyJfORzO','user','2026-04-27 00:21:43.207669',NULL,NULL),
	 ('trantu01121999@gmail.com','$2b$10$MOPOsB4nyJKCvd9TTI0SReqN4586SxwjgelDHzQB2vE976zlLDBWe','user','2026-03-06 12:57:16.44251','Trần Anh Tú','0967879669');
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (1,'Premium Ocean View',2640000,2,'Phòng Premium Ocean View tại Danang Golden Bay Hotel, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',8),
	 (1,'Executive Suite',3960000,3,'Phòng Executive Suite tại Danang Golden Bay Hotel, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',14),
	 (2,'Deluxe City View',2480000,2,'Phòng Deluxe City View tại Fusion Suites Danang Beach, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',6),
	 (2,'Premium Ocean View',3720000,2,'Phòng Premium Ocean View tại Fusion Suites Danang Beach, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',6),
	 (2,'Executive Suite',5580000,3,'Phòng Executive Suite tại Fusion Suites Danang Beach, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',11),
	 (2,'Family Room',4650000,4,'Phòng Family Room tại Fusion Suites Danang Beach, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',7),
	 (3,'Deluxe City View',1440000,2,'Phòng Deluxe City View tại Novotel Danang Premier Han River, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',9),
	 (3,'Premium Ocean View',2160000,2,'Phòng Premium Ocean View tại Novotel Danang Premier Han River, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',12),
	 (3,'Executive Suite',3240000,3,'Phòng Executive Suite tại Novotel Danang Premier Han River, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',14),
	 (4,'Deluxe City View',4400000,2,'Phòng Deluxe City View tại Sofitel Legend Metropole Hanoi, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',9);
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (4,'Premium Ocean View',6600000,2,'Phòng Premium Ocean View tại Sofitel Legend Metropole Hanoi, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',7),
	 (4,'Executive Suite',9900000,3,'Phòng Executive Suite tại Sofitel Legend Metropole Hanoi, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',14),
	 (4,'Family Room',8250000,4,'Phòng Family Room tại Sofitel Legend Metropole Hanoi, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',9),
	 (5,'Deluxe City View',3040000,2,'Phòng Deluxe City View tại JW Marriott Hotel Hanoi, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',13),
	 (5,'Premium Ocean View',4560000,2,'Phòng Premium Ocean View tại JW Marriott Hotel Hanoi, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',12),
	 (5,'Executive Suite',6840000,3,'Phòng Executive Suite tại JW Marriott Hotel Hanoi, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',12),
	 (6,'Deluxe City View',1200000,2,'Phòng Deluxe City View tại Hanoi La Siesta Hotel & Spa, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',9),
	 (6,'Premium Ocean View',1800000,2,'Phòng Premium Ocean View tại Hanoi La Siesta Hotel & Spa, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',13),
	 (6,'Executive Suite',2700000,3,'Phòng Executive Suite tại Hanoi La Siesta Hotel & Spa, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',10),
	 (1,'Deluxe City View',1760000,2,'Phòng Deluxe City View tại Danang Golden Bay Hotel, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đơn lớn','32 m²',12);
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (6,'Family Room',2250000,4,'Phòng Family Room tại Hanoi La Siesta Hotel & Spa, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',14),
	 (7,'Deluxe City View',4960000,2,'Phòng Deluxe City View tại Park Hyatt Saigon, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',12),
	 (7,'Premium Ocean View',7440000,2,'Phòng Premium Ocean View tại Park Hyatt Saigon, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',8),
	 (7,'Executive Suite',11160000,3,'Phòng Executive Suite tại Park Hyatt Saigon, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',12),
	 (8,'Deluxe City View',1520000,2,'Phòng Deluxe City View tại Liberty Central Saigon Riverside, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',9),
	 (8,'Premium Ocean View',2280000,2,'Phòng Premium Ocean View tại Liberty Central Saigon Riverside, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',7),
	 (8,'Executive Suite',3420000,3,'Phòng Executive Suite tại Liberty Central Saigon Riverside, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',9),
	 (8,'Family Room',2850000,4,'Phòng Family Room tại Liberty Central Saigon Riverside, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',6),
	 (9,'Deluxe City View',2800000,2,'Phòng Deluxe City View tại Ana Mandara Villas Dalat, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',11),
	 (9,'Premium Ocean View',4200000,2,'Phòng Premium Ocean View tại Ana Mandara Villas Dalat, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',13);
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (9,'Executive Suite',6300000,3,'Phòng Executive Suite tại Ana Mandara Villas Dalat, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',8),
	 (10,'Deluxe City View',1280000,2,'Phòng Deluxe City View tại Terracotta Hotel & Resort Dalat, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',11),
	 (10,'Premium Ocean View',1920000,2,'Phòng Premium Ocean View tại Terracotta Hotel & Resort Dalat, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',6),
	 (10,'Executive Suite',2880000,3,'Phòng Executive Suite tại Terracotta Hotel & Resort Dalat, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',10),
	 (10,'Family Room',2400000,4,'Phòng Family Room tại Terracotta Hotel & Resort Dalat, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',11),
	 (11,'Deluxe City View',3360000,2,'Phòng Deluxe City View tại Vinpearl Resort Nha Trang, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',8),
	 (11,'Premium Ocean View',5040000,2,'Phòng Premium Ocean View tại Vinpearl Resort Nha Trang, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',5),
	 (11,'Executive Suite',7560000,3,'Phòng Executive Suite tại Vinpearl Resort Nha Trang, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',13),
	 (12,'Deluxe City View',2240000,2,'Phòng Deluxe City View tại Sheraton Nha Trang Hotel & Spa, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',10),
	 (12,'Premium Ocean View',3360000,2,'Phòng Premium Ocean View tại Sheraton Nha Trang Hotel & Spa, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',13);
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (12,'Executive Suite',5040000,3,'Phòng Executive Suite tại Sheraton Nha Trang Hotel & Spa, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',13),
	 (12,'Family Room',4200000,4,'Phòng Family Room tại Sheraton Nha Trang Hotel & Spa, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',5),
	 (13,'Deluxe City View',6000000,2,'Phòng Deluxe City View tại JW Marriott Phu Quoc Emerald Bay, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',10),
	 (13,'Premium Ocean View',9000000,2,'Phòng Premium Ocean View tại JW Marriott Phu Quoc Emerald Bay, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',5),
	 (13,'Executive Suite',13500000,3,'Phòng Executive Suite tại JW Marriott Phu Quoc Emerald Bay, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',8),
	 (14,'Deluxe City View',2280000,2,'Phòng Deluxe City View tại Phu Quoc Sunset Resort & Spa, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',13),
	 (14,'Premium Ocean View',3420000,2,'Phòng Premium Ocean View tại Phu Quoc Sunset Resort & Spa, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',5),
	 (14,'Executive Suite',5130000,3,'Phòng Executive Suite tại Phu Quoc Sunset Resort & Spa, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',5),
	 (14,'Family Room',4275000,4,'Phòng Family Room tại Phu Quoc Sunset Resort & Spa, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',13),
	 (15,'Deluxe City View',2560000,2,'Phòng Deluxe City View tại Anantara Hoi An Resort, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',14);
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (15,'Premium Ocean View',3840000,2,'Phòng Premium Ocean View tại Anantara Hoi An Resort, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',5),
	 (15,'Executive Suite',5760000,3,'Phòng Executive Suite tại Anantara Hoi An Resort, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',13),
	 (16,'Deluxe City View',960000,2,'Phòng Deluxe City View tại Hoi An Eco Lodge & Spa, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',13),
	 (16,'Premium Ocean View',1440000,2,'Phòng Premium Ocean View tại Hoi An Eco Lodge & Spa, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',9),
	 (16,'Executive Suite',2160000,3,'Phòng Executive Suite tại Hoi An Eco Lodge & Spa, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',9),
	 (16,'Family Room',1800000,4,'Phòng Family Room tại Hoi An Eco Lodge & Spa, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',7),
	 (17,'Deluxe City View',3200000,2,'Phòng Deluxe City View tại Hotel de la Coupole MGallery, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',11),
	 (17,'Premium Ocean View',4800000,2,'Phòng Premium Ocean View tại Hotel de la Coupole MGallery, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',9),
	 (17,'Executive Suite',7200000,3,'Phòng Executive Suite tại Hotel de la Coupole MGallery, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',5),
	 (18,'Deluxe City View',1440000,2,'Phòng Deluxe City View tại Topas Ecolodge, 1 giường đôi lớn, diện tích 32 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường đôi lớn','32 m²',14);
INSERT INTO hotel.room_types (hotel_id,"name",price_per_night,max_guests,description,created_at,bed,"size",total_quantity) VALUES
	 (18,'Premium Ocean View',2160000,2,'Phòng Premium Ocean View tại Topas Ecolodge, 1 giường king, diện tích 40 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king','40 m²',12),
	 (18,'Executive Suite',3240000,3,'Phòng Executive Suite tại Topas Ecolodge, 1 giường king + 1 sofa bed, diện tích 55 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','1 giường king + 1 sofa bed','55 m²',6),
	 (18,'Family Room',2700000,4,'Phòng Family Room tại Topas Ecolodge, 2 giường đôi, diện tích 48 m². Đầy đủ tiện nghi cao cấp.','2026-03-29 11:25:40.74561','2 giường đôi','48 m²',7);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (1,8),
	 (1,3),
	 (1,9),
	 (1,15),
	 (1,1),
	 (1,5),
	 (2,3),
	 (2,15),
	 (2,4),
	 (2,6);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (2,2),
	 (2,5),
	 (2,11),
	 (3,10),
	 (3,6),
	 (3,15),
	 (3,7),
	 (4,15),
	 (4,6),
	 (4,1);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (4,14),
	 (4,11),
	 (5,15),
	 (5,9),
	 (5,14),
	 (5,8),
	 (5,7),
	 (5,1),
	 (5,11),
	 (6,8);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (6,5),
	 (6,1),
	 (6,2),
	 (6,15),
	 (6,7),
	 (7,14),
	 (7,11),
	 (7,12),
	 (7,6),
	 (7,15);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (8,6),
	 (8,5),
	 (8,14),
	 (8,4),
	 (8,3),
	 (8,10),
	 (8,15),
	 (9,4),
	 (9,7),
	 (9,3);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (9,14),
	 (10,1),
	 (10,4),
	 (10,2),
	 (10,11),
	 (10,14),
	 (10,6),
	 (10,3),
	 (11,2),
	 (11,9);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (11,7),
	 (11,12),
	 (11,14),
	 (11,1),
	 (11,10),
	 (11,11),
	 (12,8),
	 (12,13),
	 (12,1),
	 (12,5);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (12,2),
	 (12,10),
	 (12,14),
	 (13,3),
	 (13,4),
	 (13,15),
	 (13,6),
	 (13,2),
	 (13,5),
	 (13,1);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (14,1),
	 (14,12),
	 (14,7),
	 (14,11),
	 (14,3),
	 (15,12),
	 (15,5),
	 (15,6),
	 (15,11),
	 (15,15);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (15,10),
	 (16,3),
	 (16,6),
	 (16,4),
	 (16,9),
	 (16,10),
	 (16,12),
	 (16,2),
	 (17,1),
	 (17,13);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (17,6),
	 (17,8),
	 (17,2),
	 (17,3),
	 (18,8),
	 (18,7),
	 (18,10),
	 (18,1),
	 (18,2),
	 (19,7);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (19,12),
	 (19,13),
	 (19,6),
	 (20,13),
	 (20,1),
	 (20,7),
	 (20,10),
	 (20,6),
	 (20,2),
	 (20,9);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (20,11),
	 (21,5),
	 (21,3),
	 (21,9),
	 (21,2),
	 (21,1),
	 (21,4),
	 (21,15),
	 (21,14),
	 (22,10);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (22,4),
	 (22,5),
	 (22,12),
	 (22,7),
	 (23,4),
	 (23,7),
	 (23,15),
	 (23,3),
	 (24,1),
	 (24,2);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (24,3),
	 (24,4),
	 (25,6),
	 (25,5),
	 (25,12),
	 (25,4),
	 (26,11),
	 (26,1),
	 (26,15),
	 (26,13);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (26,12),
	 (26,7),
	 (26,2),
	 (26,5),
	 (27,14),
	 (27,4),
	 (27,13),
	 (27,6),
	 (27,12),
	 (27,9);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (27,1),
	 (27,15),
	 (28,8),
	 (28,14),
	 (28,6),
	 (28,4),
	 (28,1),
	 (29,1),
	 (29,2),
	 (29,12);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (29,3),
	 (30,1),
	 (30,3),
	 (30,8),
	 (30,12),
	 (30,5),
	 (30,9),
	 (30,7),
	 (31,1),
	 (31,2);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (31,5),
	 (31,10),
	 (31,11),
	 (31,4),
	 (32,2),
	 (32,4),
	 (32,10),
	 (32,6),
	 (32,11),
	 (32,9);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (33,2),
	 (33,1),
	 (33,6),
	 (33,7),
	 (34,11),
	 (34,12),
	 (34,8),
	 (34,5),
	 (34,10),
	 (34,9);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (35,5),
	 (35,9),
	 (35,15),
	 (35,10),
	 (35,12),
	 (36,2),
	 (36,10),
	 (36,1),
	 (36,6),
	 (36,4);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (36,11),
	 (36,5),
	 (36,3),
	 (37,2),
	 (37,11),
	 (37,5),
	 (37,9),
	 (37,1),
	 (37,8),
	 (37,13);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (37,10),
	 (38,5),
	 (38,8),
	 (38,13),
	 (38,7),
	 (38,10),
	 (38,15),
	 (38,11),
	 (39,6),
	 (39,13);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (39,15),
	 (39,14),
	 (39,11),
	 (39,7),
	 (40,15),
	 (40,12),
	 (40,6),
	 (40,1),
	 (40,8),
	 (41,9);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (41,4),
	 (41,7),
	 (41,15),
	 (41,6),
	 (41,14),
	 (42,4),
	 (42,13),
	 (42,8),
	 (42,9),
	 (42,1);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (43,1),
	 (43,7),
	 (43,12),
	 (43,10),
	 (43,14),
	 (44,14),
	 (44,3),
	 (44,6),
	 (44,9),
	 (44,12);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (44,10),
	 (44,15),
	 (44,2),
	 (45,11),
	 (45,8),
	 (45,5),
	 (45,7),
	 (45,2),
	 (45,6),
	 (46,13);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (46,7),
	 (46,3),
	 (46,12),
	 (46,8),
	 (46,2),
	 (46,9),
	 (47,6),
	 (47,1),
	 (47,3),
	 (47,15);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (47,7),
	 (47,2),
	 (48,10),
	 (48,1),
	 (48,11),
	 (48,2),
	 (48,5),
	 (48,15),
	 (48,13),
	 (48,6);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (49,4),
	 (49,3),
	 (49,12),
	 (49,14),
	 (49,8),
	 (49,10),
	 (50,10),
	 (50,2),
	 (50,5),
	 (50,1);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (51,13),
	 (51,3),
	 (51,10),
	 (51,12),
	 (51,2),
	 (51,8),
	 (51,7),
	 (52,4),
	 (52,8),
	 (52,15);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (52,12),
	 (53,1),
	 (53,14),
	 (53,5),
	 (53,10),
	 (53,2),
	 (53,8),
	 (53,15),
	 (53,3),
	 (54,2);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (54,13),
	 (54,12),
	 (54,15),
	 (54,1),
	 (54,7),
	 (54,9),
	 (54,10),
	 (55,12),
	 (55,11),
	 (55,14);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (55,15),
	 (55,5),
	 (56,1),
	 (56,9),
	 (56,2),
	 (56,10),
	 (57,9),
	 (57,8),
	 (57,7),
	 (57,14);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (57,10),
	 (57,6),
	 (58,3),
	 (58,8),
	 (58,7),
	 (58,2),
	 (59,2),
	 (59,4),
	 (59,6),
	 (59,8);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (59,15),
	 (59,14),
	 (59,10),
	 (59,11),
	 (60,10),
	 (60,7),
	 (60,6),
	 (60,5),
	 (60,13),
	 (60,11);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (60,4),
	 (60,8),
	 (61,6),
	 (61,7),
	 (61,1),
	 (61,12),
	 (61,10),
	 (61,5),
	 (61,15),
	 (62,12);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (62,3),
	 (62,4),
	 (62,5),
	 (62,7),
	 (62,9),
	 (63,13),
	 (63,7),
	 (63,1),
	 (63,12),
	 (63,2);
INSERT INTO hotel.room_amenities (room_type_id,amenity_id) VALUES
	 (63,11),
	 (63,14);
INSERT INTO booking.reviews (booking_id,user_id,hotel_id,rating,"comment",created_at,updated_at) VALUES
	 (30,6,13,8,'oke ổnnnnnnnnnnnnnnnnnnn','2026-03-30 12:48:35.032913','2026-03-30 12:49:25.377602'),
	 (29,6,13,9,'ổnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn','2026-04-21 16:21:22.835024','2026-04-21 16:21:22.835024'),
	 (28,6,4,10,'oke phếttttttttttttttttttttttppppppppppppppppppp','2026-04-21 16:19:49.311463','2026-04-21 16:26:52.099504');
INSERT INTO booking.payments (booking_id,amount,status,created_at) VALUES
	 (27,5580000,'SUCCESS','2026-03-30 11:38:45.1132'),
	 (28,6600000,'SUCCESS','2026-03-30 11:50:16.142427'),
	 (29,13500000,'SUCCESS','2026-03-30 11:57:38.089122'),
	 (30,6000000,'SUCCESS','2026-03-30 12:44:58.176319'),
	 (30,6000000,'REFUNDED','2026-03-30 12:51:14.971509'),
	 (32,3200000,'SUCCESS','2026-04-01 14:53:38.879809'),
	 (32,3200000,'REFUNDED','2026-04-13 10:28:56.464668'),
	 (36,4400000,'SUCCESS','2026-04-13 13:08:43.661788'),
	 (33,8250000,'SUCCESS','2026-04-21 12:16:05.833339'),
	 (33,8250000,'REFUNDED','2026-04-21 12:23:22.477737');
INSERT INTO booking.payments (booking_id,amount,status,created_at) VALUES
	 (40,4960000,'SUCCESS','2026-04-21 16:25:06.639682'),
	 (41,2800000,'SUCCESS','2026-04-21 16:26:12.176973'),
	 (43,1200000,'SUCCESS','2026-04-27 00:23:22.774289'),
	 (42,2280000,'SUCCESS','2026-05-02 05:10:44.737506');
INSERT INTO notification.notifications (user_id,"type",title,message,metadata,is_read,created_at) VALUES
	 (1,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:37.989632'),
	 (2,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:37.989632'),
	 (4,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:37.989632'),
	 (5,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:37.989632'),
	 (1,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:45.807693'),
	 (2,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:45.807693'),
	 (4,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:45.807693'),
	 (5,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',false,'2026-03-23 10:02:45.807693'),
	 (5,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại undefined thành công.','{"check_in": "2026-04-06T17:00:00.000Z", "check_out": "2026-04-08T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 23}',false,'2026-03-29 11:34:14.972307'),
	 (3,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',true,'2026-03-23 10:02:37.989632');
INSERT INTO notification.notifications (user_id,"type",title,message,metadata,is_read,created_at) VALUES
	 (3,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',true,'2026-03-23 10:02:45.807693'),
	 (3,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe Balcony tại undefined thành công.','{"check_in": "2026-01-08T17:00:00.000Z", "check_out": "2026-01-10T17:00:00.000Z", "room_name": "Deluxe Balcony", "booking_id": 20}',true,'2026-03-23 10:04:23.43923'),
	 (3,'REVIEW_POSTED','Đánh giá mới','Có đánh giá mới 6 sao cho khách sạn.','{"rating": 6, "comment": "ưeerwqresfafdsafdsfasdfa", "review_id": 5, "hotel_name": ""}',false,'2026-03-30 12:48:35.302307'),
	 (5,'REVIEW_POSTED','Đánh giá mới','Có đánh giá mới 6 sao cho khách sạn.','{"rating": 6, "comment": "ưeerwqresfafdsafdsfasdfa", "review_id": 5, "hotel_name": ""}',false,'2026-03-30 12:48:35.359254'),
	 (3,'REVIEW_POSTED','Đánh giá mới','Có đánh giá mới 6 sao cho khách sạn.','{"rating": 6, "comment": "dsafsadf234rsd", "review_id": 6, "hotel_name": ""}',false,'2026-04-01 14:53:56.74381'),
	 (5,'REVIEW_POSTED','Đánh giá mới','Có đánh giá mới 6 sao cho khách sạn.','{"rating": 6, "comment": "dsafsadf234rsd", "review_id": 6, "hotel_name": ""}',false,'2026-04-01 14:53:56.790982'),
	 (6,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',true,'2026-03-23 10:02:37.989632'),
	 (6,'SYSTEM','Bảo trì hệ thống','Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.','{}',true,'2026-03-23 10:02:45.807693'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe Balcony tại undefined thành công.','{"check_in": "2026-01-19T17:00:00.000Z", "check_out": "2026-01-20T17:00:00.000Z", "room_name": "Deluxe Balcony", "booking_id": 21}',true,'2026-03-23 10:08:57.736182'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe Balcony tại undefined thành công.','{"check_in": "2026-01-21T17:00:00.000Z", "check_out": "2026-01-22T17:00:00.000Z", "room_name": "Deluxe Balcony", "booking_id": 22}',true,'2026-03-23 10:47:18.584798');
INSERT INTO notification.notifications (user_id,"type",title,message,metadata,is_read,created_at) VALUES
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Premium Ocean View tại [object Object] thành công.','{"check_in": "2026-04-08T17:00:00.000Z", "check_out": "2026-04-09T17:00:00.000Z", "room_name": "Premium Ocean View", "booking_id": 24, "hotel_name": {"oid": null, "rows": [{"name": "Fusion Suites Danang Beach"}], "_types": {"text": {}, "_types": {"builtins": {"BIT": 1560, "CID": 29, "OID": 26, "TID": 27, "XID": 28, "XML": 142, "BOOL": 16, "CHAR": 18, "CIDR": 650, "DATE": 1082, "INET": 869, "INT2": 21, "INT4": 23, "INT8": 20, "JSON": 114, "PATH": 602, "SMGR": 210, "TEXT": 25, "TIME": 1083, "UUID": 2950, "BYTEA": 17, "JSONB": 3802, "MONEY": 790, "BPCHAR": 1042, "CIRCLE": 718, "FLOAT4": 700, "FLOAT8": 701, "PG_LSN": 3220, "TIMETZ": 1266, "VARBIT": 1562, "ABSTIME": 702, "ACLITEM": 1033, "MACADDR": 829, "NUMERIC": 1700, "POLYGON": 604, "REGOPER": 2203, "REGPROC": 24, "REGROLE": 4096, "REGTYPE": 2206, "RELTIME": 703, "TSQUERY": 3615, "VARCHAR": 1043, "INTERVAL": 1186, "MACADDR8": 774, "REGCLASS": 2205, "TSVECTOR": 3614, "GTSVECTOR": 3642, "REFCURSOR": 1790, "REGCONFIG": 3734, "TIMESTAMP": 1114, "TINTERVAL": 704, "REGOPERATOR": 2204, "TIMESTAMPTZ": 1184, "PG_NDISTINCT": 3361, "PG_NODE_TREE": 194, "REGNAMESPACE": 4089, "REGPROCEDURE": 2202, "REGDICTIONARY": 3769, "TXID_SNAPSHOT": 2970, "PG_DEPENDENCIES": 3402}, "arrayParser": {}}, "binary": {}}, "fields": [{"name": "name", "format": "text", "tableID": 32770, "columnID": 2, "dataTypeID": 25, "dataTypeSize": -1, "dataTypeModifier": -1}], "RowCtor": null, "command": "SELECT", "_parsers": [null], "rowCount": 1, "rowAsArray": false, "_prebuiltEmptyResultObject": {"name": null}}}',true,'2026-03-29 11:47:45.095228'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Family Room tại Fusion Suites Danang Beach thành công.','{"check_in": "2026-02-28T17:00:00.000Z", "check_out": "2026-03-01T17:00:00.000Z", "room_name": "Family Room", "booking_id": 25, "hotel_name": "Fusion Suites Danang Beach"}',true,'2026-03-29 11:49:51.610615'),
	 (6,'BOOKING_CANCELLED','Hủy đặt phòng thành công','Đặt phòng #24 đã được hủy.','{"status": "CANCELLED", "booking_id": 24}',true,'2026-03-29 11:51:50.999719'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Executive Suite tại JW Marriott Phu Quoc Emerald Bay thành công.','{"check_in": "2026-03-13T17:00:00.000Z", "check_out": "2026-03-14T17:00:00.000Z", "room_name": "Executive Suite", "booking_id": 26, "hotel_name": "JW Marriott Phu Quoc Emerald Bay"}',true,'2026-03-29 11:58:06.12781'),
	 (6,'BOOKING_CANCELLED','Hủy đặt phòng thành công','Đặt phòng #26 đã được hủy.','{"status": "CANCELLED", "booking_id": 26}',true,'2026-03-29 11:58:23.151493'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Executive Suite tại Fusion Suites Danang Beach thành công.','{"check_in": "2026-05-04T17:00:00.000Z", "check_out": "2026-05-05T17:00:00.000Z", "room_name": "Executive Suite", "booking_id": 27, "hotel_name": "Fusion Suites Danang Beach"}',true,'2026-03-30 11:38:28.48946'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #9 cho đặt phòng #27 thành công.','{"amount": "5580000", "booking_id": 27, "payment_id": 9}',true,'2026-03-30 11:38:45.38302'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Premium Ocean View tại Sofitel Legend Metropole Hanoi thành công.','{"check_in": "2026-04-04T17:00:00.000Z", "check_out": "2026-04-05T17:00:00.000Z", "room_name": "Premium Ocean View", "booking_id": 28, "hotel_name": "Sofitel Legend Metropole Hanoi"}',true,'2026-03-30 11:50:10.256977'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #10 cho đặt phòng #28 thành công.','{"amount": "6600000", "booking_id": 28, "payment_id": 10}',true,'2026-03-30 11:50:16.393996'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Executive Suite tại JW Marriott Phu Quoc Emerald Bay thành công.','{"check_in": "2026-03-30T17:00:00.000Z", "check_out": "2026-03-31T17:00:00.000Z", "room_name": "Executive Suite", "booking_id": 29, "hotel_name": "JW Marriott Phu Quoc Emerald Bay"}',true,'2026-03-30 11:57:32.163048');
INSERT INTO notification.notifications (user_id,"type",title,message,metadata,is_read,created_at) VALUES
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #11 cho đặt phòng #29 thành công.','{"amount": "13500000", "booking_id": 29, "payment_id": 11}',true,'2026-03-30 11:57:38.334082'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại JW Marriott Phu Quoc Emerald Bay thành công.','{"check_in": "2026-03-28T17:00:00.000Z", "check_out": "2026-03-29T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 30, "hotel_name": "JW Marriott Phu Quoc Emerald Bay"}',true,'2026-03-30 12:44:48.322918'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #12 cho đặt phòng #30 thành công.','{"amount": "6000000", "booking_id": 30, "payment_id": 12}',true,'2026-03-30 12:44:58.464968'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #14 cho đặt phòng #32 thành công.','{"amount": "3200000", "booking_id": 32, "payment_id": 14}',true,'2026-04-01 14:53:39.16876'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Premium Ocean View tại Sofitel Legend Metropole Hanoi thành công.','{"check_in": "2024-05-04T17:00:00.000Z", "check_out": "2024-05-06T17:00:00.000Z", "room_name": "Premium Ocean View", "booking_id": 31, "hotel_name": "Sofitel Legend Metropole Hanoi"}',true,'2026-04-01 13:18:18.420655'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Hotel de la Coupole MGallery thành công.','{"check_in": "2026-03-29T17:00:00.000Z", "check_out": "2026-03-30T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 32, "hotel_name": "Hotel de la Coupole MGallery"}',true,'2026-04-01 14:52:47.301713'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Family Room tại Sofitel Legend Metropole Hanoi thành công.','{"check_in": "2023-05-09T17:00:00.000Z", "check_out": "2023-05-10T17:00:00.000Z", "room_name": "Family Room", "booking_id": 33, "hotel_name": "Sofitel Legend Metropole Hanoi"}',true,'2026-04-01 15:08:01.105982'),
	 (5,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Novotel Danang Premier Han River thành công.','{"check_in": "2026-04-13T17:00:00.000Z", "check_out": "2026-04-15T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 34, "hotel_name": "Novotel Danang Premier Han River"}',false,'2026-04-13 08:58:43.963165'),
	 (5,'BOOKING_CANCELLED','Hủy đặt phòng thành công','Đặt phòng #34 đã được hủy.','{"status": "CANCELLED", "booking_id": 34}',false,'2026-04-13 08:59:13.815465'),
	 (5,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Fusion Suites Danang Beach thành công.','{"check_in": "2026-04-13T17:00:00.000Z", "check_out": "2026-04-15T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 35, "hotel_name": "Fusion Suites Danang Beach"}',false,'2026-04-13 10:26:38.750412');
INSERT INTO notification.notifications (user_id,"type",title,message,metadata,is_read,created_at) VALUES
	 (5,'BOOKING_CANCELLED','Hủy đặt phòng thành công','Đặt phòng #35 đã được hủy.','{"status": "CANCELLED", "booking_id": 35}',false,'2026-04-13 10:27:17.286748'),
	 (5,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Sofitel Legend Metropole Hanoi thành công.','{"check_in": "2026-04-13T17:00:00.000Z", "check_out": "2026-04-14T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 36, "hotel_name": "Sofitel Legend Metropole Hanoi"}',false,'2026-04-13 13:08:36.901395'),
	 (5,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #16 cho đặt phòng #36 thành công.','{"amount": "4400000", "booking_id": 36, "payment_id": 16}',false,'2026-04-13 13:08:43.981119'),
	 (5,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Novotel Danang Premier Han River thành công.','{"check_in": "2026-04-13T17:00:00.000Z", "check_out": "2026-04-14T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 37, "hotel_name": "Novotel Danang Premier Han River"}',false,'2026-04-13 13:19:16.534648'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Family Room tại Sofitel Legend Metropole Hanoi thành công.','{"check_in": "2026-04-21T00:00:00.000Z", "check_out": "2026-04-23T00:00:00.000Z", "room_name": "Family Room", "booking_id": 38, "hotel_name": "Sofitel Legend Metropole Hanoi"}',true,'2026-04-21 12:07:38.552784'),
	 (6,'BOOKING_CANCELLED','Hủy đặt phòng thành công','Đặt phòng #38 đã được hủy.','{"status": "CANCELLED", "booking_id": 38}',true,'2026-04-21 12:15:51.218217'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #17 cho đặt phòng #33 thành công.','{"amount": "8250000", "booking_id": 33, "payment_id": 17}',true,'2026-04-21 12:16:05.859275'),
	 (3,'REVIEW_POSTED','Đánh giá mới','Có đánh giá mới 10 sao cho khách sạn.','{"rating": 10, "comment": "oke phếtttttttttttttttttttttt", "review_id": 7}',false,'2026-04-21 16:19:49.703656'),
	 (3,'REVIEW_POSTED','Đánh giá mới','Có đánh giá mới 9 sao cho khách sạn.','{"rating": 9, "comment": "ổnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", "review_id": 8}',false,'2026-04-21 16:21:23.159545'),
	 (3,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Park Hyatt Saigon thành công.','{"check_in": "2026-04-21T00:00:00.000Z", "check_out": "2026-04-22T00:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 40, "hotel_name": "Park Hyatt Saigon"}',false,'2026-04-21 16:24:55.453579');
INSERT INTO notification.notifications (user_id,"type",title,message,metadata,is_read,created_at) VALUES
	 (3,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #19 cho đặt phòng #40 thành công.','{"amount": "4960000", "booking_id": 40, "payment_id": 19}',false,'2026-04-21 16:25:06.813348'),
	 (21,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Hanoi La Siesta Hotel & Spa thành công.','{"check_in": "2024-04-26T17:00:00.000Z", "check_out": "2024-04-27T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 43, "hotel_name": "Hanoi La Siesta Hotel & Spa"}',false,'2026-04-27 00:22:55.03487'),
	 (21,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #21 cho đặt phòng #43 thành công.','{"amount": "1200000", "booking_id": 43, "payment_id": 21}',false,'2026-04-27 00:23:23.098901'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Danang Golden Bay Hotel thành công.','{"check_in": "2026-04-20T17:00:00.000Z", "check_out": "2026-04-21T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 39, "hotel_name": "Danang Golden Bay Hotel"}',true,'2026-04-21 16:10:22.466221'),
	 (6,'BOOKING_CANCELLED','Hủy đặt phòng thành công','Đặt phòng #25 đã được hủy.','{"status": "CANCELLED", "booking_id": 25}',true,'2026-04-21 16:20:49.638125'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Ana Mandara Villas Dalat thành công.','{"check_in": "2026-04-21T00:00:00.000Z", "check_out": "2026-04-22T00:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 41, "hotel_name": "Ana Mandara Villas Dalat"}',true,'2026-04-21 16:26:07.629639'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #20 cho đặt phòng #41 thành công.','{"amount": "2800000", "booking_id": 41, "payment_id": 20}',true,'2026-04-21 16:26:12.188477'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Deluxe City View tại Phu Quoc Sunset Resort & Spa thành công.','{"check_in": "2024-04-20T17:00:00.000Z", "check_out": "2024-04-21T17:00:00.000Z", "room_name": "Deluxe City View", "booking_id": 42, "hotel_name": "Phu Quoc Sunset Resort & Spa"}',true,'2026-04-21 16:41:45.183738'),
	 (6,'PAYMENT_SUCCESS','Thanh toán thành công','Thanh toán #22 cho đặt phòng #42 thành công.','{"amount": "2280000", "booking_id": 42, "payment_id": 22}',true,'2026-05-02 05:10:44.763847'),
	 (6,'BOOKING_CREATED','Đặt phòng thành công','Bạn đã đặt phòng Family Room tại Fusion Suites Danang Beach thành công.','{"check_in": "2023-05-05T00:00:00.000Z", "check_out": "2023-05-06T00:00:00.000Z", "room_name": "Family Room", "booking_id": 44, "hotel_name": "Fusion Suites Danang Beach"}',false,'2026-05-02 10:02:49.027149');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',NULL,'hotel','2026-03-30 09:29:39.148143');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',NULL,'hotel','2026-03-30 09:29:39.148143');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',NULL,'hotel','2026-03-30 09:29:39.148143');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800","https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"]["https://res.cloudinary.com/dpxl15qqg/image/upload/v1774855762/hotel-booking/qq60dxukcptdzflkiywm.png"]',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800',NULL,'hotel','2026-03-30 09:29:39.148143');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('https://images.unsplash.com/photo-1536086845232-28a5e3e4a0b1?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1528127269322-539801943592?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',NULL,'hotel','2026-03-30 09:29:39.148143');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',NULL,'hotel','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1528127269322-539801943592?w=800',NULL,'city','2026-03-30 09:29:39.148143'),
	 ('https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',NULL,'city','2026-03-30 09:29:39.148143');
INSERT INTO settings.images (url,alt,"type",created_at) VALUES
	 ('https://res.cloudinary.com/dpxl15qqg/image/upload/v1774863114/hotel-booking/t4jbd513en0ltaaqln1z.png','Screenshot 2025-10-01 162247.png','hotel','2026-03-30 09:31:55.673708'),
	 ('https://res.cloudinary.com/dpxl15qqg/image/upload/v1774863116/hotel-booking/sbo9dvqmbll32bw2rm6e.png','Screenshot 2025-10-01 163008.png','hotel','2026-03-30 09:31:57.223181'),
	 ('https://res.cloudinary.com/dpxl15qqg/image/upload/v1774863117/hotel-booking/y2yadov8iguuajt2m9mc.png','Screenshot 2025-10-01 163327.png','hotel','2026-03-30 09:31:58.306455'),
	 ('https://res.cloudinary.com/dpxl15qqg/image/upload/v1774863596/hotel-booking/dw7goffz0ympymyko0lu.png','Screenshot 2025-10-01 163327.png','city','2026-03-30 09:39:57.044097'),
	 ('https://res.cloudinary.com/dpxl15qqg/image/upload/v1775055297/hotel-booking/y7jxhpnqojqoomoxzpgl.png','Screenshot 2025-10-01 123712.png','hotel','2026-04-01 14:54:58.433522');
INSERT INTO hotel.hotels ("name",address,description,created_at,rating,reviews,price_from,stars,discount_percent) VALUES
	 ('Danang Golden Bay Hotel','01 Lê Văn Duyệt, Sơn Trà, Đà Nẵng','Khách sạn 5 sao ngay trung tâm, dịch vụ cao cấp, phù hợp đi công tác và du lịch nghỉ dưỡng.','2026-03-29 11:25:40.74561',9.1,2104,2200000,5,15),
	 ('Fusion Suites Danang Beach','2 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng','Resort ven biển Mỹ Khê, phòng rộng view biển, spa miễn phí mỗi ngày.','2026-03-29 11:25:40.74561',9.3,1876,3100000,5,10),
	 ('Novotel Danang Premier Han River','36 Bạch Đằng, Hải Châu, Đà Nẵng','Khách sạn quốc tế bên sông Hàn, view cầu Rồng tuyệt đẹp.','2026-03-29 11:25:40.74561',8.7,1543,1800000,4,0),
	 ('JW Marriott Hotel Hanoi','8 Đỗ Đức Dục, Nam Từ Liêm, Hà Nội','Khách sạn sang trọng thiết kế hình rồng, tiện ích đẳng cấp quốc tế.','2026-03-29 11:25:40.74561',9.0,2567,3800000,5,20),
	 ('Hanoi La Siesta Hotel & Spa','94 Mã Mây, Hoàn Kiếm, Hà Nội','Boutique hotel giữa phố cổ, dịch vụ chu đáo, gần Hồ Hoàn Kiếm.','2026-03-29 11:25:40.74561',8.9,1890,1500000,4,5),
	 ('Park Hyatt Saigon','2 Công Trường Lam Sơn, Quận 1, TP. Hồ Chí Minh','Khách sạn 5 sao đối diện Nhà hát Thành phố, sang trọng bậc nhất Sài Gòn.','2026-03-29 11:25:40.74561',9.4,2890,6200000,5,0),
	 ('Liberty Central Saigon Riverside','17 Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh','View sông Sài Gòn, hồ bơi rooftop, vị trí trung tâm.','2026-03-29 11:25:40.74561',8.5,1654,1900000,4,10),
	 ('Ana Mandara Villas Dalat','01 Lê Lai, Phường 5, Đà Lạt','Biệt thự Pháp cổ giữa đồi thông, không gian yên bình và lãng mạn.','2026-03-29 11:25:40.74561',9.2,1432,3500000,5,0),
	 ('Terracotta Hotel & Resort Dalat','19 Hoa Hồng, Phường 9, Đà Lạt','Resort phong cách Địa Trung Hải, view thung lũng tuyệt đẹp.','2026-03-29 11:25:40.74561',8.6,987,1600000,4,15),
	 ('Vinpearl Resort Nha Trang','Đảo Hòn Tre, Nha Trang','Resort trên đảo với công viên giải trí, bãi biển riêng và aquarium.','2026-03-29 11:25:40.74561',9.0,3456,4200000,5,10);
INSERT INTO hotel.hotels ("name",address,description,created_at,rating,reviews,price_from,stars,discount_percent) VALUES
	 ('Sheraton Nha Trang Hotel & Spa','26-28 Trần Phú, Nha Trang','Khách sạn 5 sao mặt biển Trần Phú, phòng view biển panorama.','2026-03-29 11:25:40.74561',8.8,2100,2800000,5,0),
	 ('Phu Quoc Sunset Resort & Spa','Bãi Trường, Dương Tơ, Phú Quốc','Resort ven biển hoàng hôn, bungalow gỗ, hồ bơi vô cực.','2026-03-29 11:25:40.74561',9.2,2670,2850000,4,20),
	 ('Anantara Hoi An Resort','01 Phạm Hồng Thái, Hội An','Resort bên sông Thu Bồn, kiến trúc Việt truyền thống, gần phố cổ.','2026-03-29 11:25:40.74561',9.1,1567,3200000,5,5),
	 ('Hoi An Eco Lodge & Spa','Cẩm Thanh, Hội An','Eco lodge giữa vườn dừa nước, trải nghiệm làng quê Việt Nam.','2026-03-29 11:25:40.74561',8.4,876,1200000,3,0),
	 ('Topas Ecolodge','Thanh Kim, Sa Pa','Ecolodge trên đỉnh đồi, bungalow đá granite, view ruộng bậc thang.','2026-03-29 11:25:40.74561',8.7,654,1800000,4,0),
	 ('Hotel de la Coupole MGallery','01 Hoàng Liên, Sa Pa','Khách sạn boutique phong cách Art Deco, view Fansipan, thiết kế bởi Bill Bensley.','2026-03-29 11:25:40.74561',0.0,0,4000000,5,10),
	 ('JW Marriott Phu Quoc Emerald Bay','Bãi Khem, An Thới, Phú Quốc','Resort thiết kế bởi Bill Bensley, kiến trúc độc đáo lấy cảm hứng từ đại học.','2026-03-29 11:25:40.74561',8.5,2,7500000,5,0),
	 ('Sofitel Legend Metropole Hanoi','15 Ngô Quyền, Hoàn Kiếm, Hà Nội','Khách sạn huyền thoại từ 1901, kiến trúc Pháp cổ điển ngay trung tâm phố cổ.','2026-03-29 11:25:40.74561',10.0,1,5500000,5,0);
INSERT INTO hotel.hotel_images (hotel_id,image_id,sort_order) VALUES
	 (2,1,0),
	 (2,2,1),
	 (2,3,2),
	 (3,4,0),
	 (3,5,1),
	 (3,6,2),
	 (4,7,0),
	 (4,8,1),
	 (4,9,2),
	 (5,10,0);
INSERT INTO hotel.hotel_images (hotel_id,image_id,sort_order) VALUES
	 (5,11,1),
	 (5,12,2),
	 (6,13,0),
	 (6,14,1),
	 (6,15,2),
	 (7,16,0),
	 (7,17,1),
	 (7,18,2),
	 (8,19,0),
	 (8,20,1);
INSERT INTO hotel.hotel_images (hotel_id,image_id,sort_order) VALUES
	 (8,21,2),
	 (9,22,0),
	 (9,23,1),
	 (9,24,2),
	 (10,25,0),
	 (10,26,1),
	 (10,27,2),
	 (11,28,0),
	 (11,29,1),
	 (11,30,2);
INSERT INTO hotel.hotel_images (hotel_id,image_id,sort_order) VALUES
	 (12,32,0),
	 (12,33,1),
	 (12,34,2),
	 (13,35,0),
	 (13,36,1),
	 (13,37,2),
	 (14,38,0),
	 (14,39,1),
	 (14,40,2),
	 (15,41,0);
INSERT INTO hotel.hotel_images (hotel_id,image_id,sort_order) VALUES
	 (15,42,1),
	 (15,43,2),
	 (16,44,0),
	 (16,45,1),
	 (16,46,2),
	 (17,47,0),
	 (17,48,1),
	 (17,49,2),
	 (18,50,0),
	 (18,51,1);
INSERT INTO hotel.hotel_images (hotel_id,image_id,sort_order) VALUES
	 (18,52,2),
	 (1,61,0),
	 (1,62,0),
	 (1,63,0),
	 (1,65,3);
INSERT INTO hotel.cities ("name",subtitle,thumbnail,created_at,thumbnail_id) VALUES
	 ('Đà Nẵng','Biển đẹp • Resort • Đồ ăn ngon','https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800','2026-03-29 11:25:40.74561',53),
	 ('TP. Hồ Chí Minh','Trung tâm • Mua sắm • Nightlife','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800','2026-03-29 11:25:40.74561',55),
	 ('Đà Lạt','Chill • Cà phê • View đồi núi','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800','2026-03-29 11:25:40.74561',56),
	 ('Nha Trang','Biển • Lặn ngắm san hô','https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800','2026-03-29 11:25:40.74561',57),
	 ('Phú Quốc','Resort • Biển • Hoàng hôn','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','2026-03-29 11:25:40.74561',58),
	 ('Sa Pa','Ruộng bậc thang • Trekking • Núi','https://images.unsplash.com/photo-1528127269322-539801943592?w=800','2026-03-29 11:25:40.74561',59),
	 ('Hội An','Phố cổ • Đèn lồng • Di sản','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800','2026-03-29 11:25:40.74561',60),
	 ('Hà Nội','Phố cổ • Văn hoá • Ẩm thực','https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800','2026-03-29 11:25:40.74561',64);
INSERT INTO booking.bookings (user_id,room_type_id,check_in,check_out,status,created_at,payment_method,reminder_sent) VALUES
	 (5,1,'2026-04-07','2026-04-09','CONFIRMED','2026-03-29 11:34:14.602135','pay_at_hotel',false),
	 (6,5,'2026-04-09','2026-04-10','CANCELLED','2026-03-29 11:47:44.753316','online',false),
	 (6,45,'2026-03-14','2026-03-15','CANCELLED','2026-03-29 11:58:05.774673','pay_at_hotel',false),
	 (6,6,'2026-05-05','2026-05-06','PAID','2026-03-30 11:38:28.051591','online',false),
	 (6,12,'2026-04-05','2026-04-06','PAID','2026-03-30 11:50:09.95132','online',false),
	 (6,45,'2026-03-31','2026-04-01','PAID','2026-03-30 11:57:31.853674','online',false),
	 (6,43,'2026-03-29','2026-03-30','REFUNDED','2026-03-30 12:44:47.987711','online',false),
	 (6,12,'2024-05-05','2024-05-07','PENDING','2026-04-01 13:18:18.03369','online',false),
	 (5,8,'2026-04-14','2026-04-16','CANCELLED','2026-04-13 08:58:43.630026','pay_at_hotel',false),
	 (5,4,'2026-04-14','2026-04-16','CANCELLED','2026-04-13 10:26:38.3893','pay_at_hotel',false);
INSERT INTO booking.bookings (user_id,room_type_id,check_in,check_out,status,created_at,payment_method,reminder_sent) VALUES
	 (6,57,'2026-03-30','2026-03-31','REFUNDED','2026-04-01 14:52:46.972186','online',false),
	 (5,11,'2026-04-14','2026-04-15','PAID','2026-04-13 13:08:36.496751','online',false),
	 (5,8,'2026-04-14','2026-04-15','CONFIRMED','2026-04-13 13:19:16.114458','pay_at_hotel',false),
	 (6,14,'2026-04-21','2026-04-23','CANCELLED','2026-04-21 12:07:38.524479','pay_at_hotel',false),
	 (6,14,'2023-05-10','2023-05-11','REFUNDED','2026-04-01 15:08:00.765609','online',false),
	 (6,1,'2026-04-21','2026-04-22','PENDING','2026-04-21 16:10:21.876903','online',false),
	 (6,7,'2026-03-01','2026-03-02','CANCELLED','2026-03-29 11:49:51.234297','pay_at_hotel',false),
	 (3,22,'2026-04-21','2026-04-22','PAID','2026-04-21 16:24:55.440217','online',false),
	 (6,29,'2026-04-21','2026-04-22','PAID','2026-04-21 16:26:07.615678','online',false),
	 (21,18,'2024-04-27','2024-04-28','PAID','2026-04-27 00:22:54.644708','online',false);
INSERT INTO booking.bookings (user_id,room_type_id,check_in,check_out,status,created_at,payment_method,reminder_sent) VALUES
	 (6,46,'2024-04-21','2024-04-22','PAID','2026-04-21 16:41:44.849501','online',false),
	 (6,7,'2023-05-05','2023-05-06','CONFIRMED','2026-05-02 10:02:48.99717','pay_at_hotel',false);
INSERT INTO hotel.amenities ("name") VALUES
	 ('WiFi miễn phí'),
	 ('Hồ bơi'),
	 ('Bãi đậu xe'),
	 ('Nhà hàng'),
	 ('Phòng gym'),
	 ('Spa'),
	 ('Điều hoà'),
	 ('Lễ tân 24/7'),
	 ('Bar'),
	 ('Dịch vụ phòng');
INSERT INTO hotel.amenities ("name") VALUES
	 ('Giặt ủi'),
	 ('Két sắt'),
	 ('Minibar'),
	 ('Bồn tắm'),
	 ('Ban công'),
	 ('Test');


-- ============================================================
-- SEED DATA: Khách sạn Hà Nội (idempotent — chạy lại bao nhiêu lần cũng OK)
-- Chạy: psql DATABASE_URL -f seed-hanoi.sql
-- Logic: Xoá 12 hotel mới (theo tên) → Insert lại từ đầu
-- KHÔNG ảnh hưởng hotel cũ (chỉ target theo tên cụ thể)
-- ============================================================

-- 1. Xoá sạch dữ liệu cũ của 12 hotel mới (nếu có)
DO $$
DECLARE
  v_names TEXT[] := ARRAY[
    'Sofitel Legend Metropole Hanoi',
    'JW Marriott Hotel Hanoi',
    'Hilton Hanoi Opera',
    'Melia Hanoi',
    'Hanoi La Siesta Hotel & Spa',
    'Hanoi Pearl Hotel',
    'Silk Path Grand Resort & Spa',
    'The Chi Boutique Hotel',
    'Essence Hanoi Hotel & Spa',
    'Hanoi Impressive Hotel',
    'Little Charm Hanoi Hostel',
    'Lotte Hotel Hanoi'
  ];
  v_ids INT[];
  v_room_ids INT[];
BEGIN
  SELECT ARRAY_AGG(id) INTO v_ids FROM hotel.hotels WHERE name = ANY(v_names);

  IF v_ids IS NOT NULL THEN
    SELECT ARRAY_AGG(id) INTO v_room_ids FROM hotel.room_types WHERE hotel_id = ANY(v_ids);

    IF v_room_ids IS NOT NULL THEN
      DELETE FROM hotel.room_amenities WHERE room_type_id = ANY(v_room_ids);
      DELETE FROM booking.reviews WHERE booking_id IN (SELECT id FROM booking.bookings WHERE room_type_id = ANY(v_room_ids));
      DELETE FROM booking.payments WHERE booking_id IN (SELECT id FROM booking.bookings WHERE room_type_id = ANY(v_room_ids));
      DELETE FROM booking.bookings WHERE room_type_id = ANY(v_room_ids);
    END IF;

    DELETE FROM hotel.hotel_images WHERE hotel_id = ANY(v_ids);
    DELETE FROM hotel.room_types WHERE hotel_id = ANY(v_ids);
    DELETE FROM hotel.hotels WHERE id = ANY(v_ids);
  END IF;
END $$;

-- 2. Đảm bảo city Hà Nội tồn tại
INSERT INTO hotel.cities (name, subtitle)
SELECT 'Hà Nội', 'Thủ đô ngàn năm văn hiến'
WHERE NOT EXISTS (SELECT 1 FROM hotel.cities WHERE name = 'Hà Nội');

-- 3. Thêm khách sạn
INSERT INTO hotel.hotels (name, address, description, stars, rating, reviews, price_from) VALUES
('Sofitel Legend Metropole Hanoi', '15 Ngô Quyền, Hoàn Kiếm, Hà Nội', 'Khách sạn 5 sao huyền thoại ngay trung tâm phố cổ, kiến trúc Pháp cổ điển, dịch vụ đẳng cấp quốc tế.', 5, 9.4, 0, 5500000),
('JW Marriott Hotel Hanoi', '8 Đỗ Đức Dục, Nam Từ Liêm, Hà Nội', 'Khách sạn 5 sao sang trọng với thiết kế hình rồng độc đáo, hồ bơi ngoài trời và spa cao cấp.', 5, 9.2, 0, 4200000),
('Hilton Hanoi Opera', '1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội', 'Ngay cạnh Nhà hát Lớn, phong cách kiến trúc thuộc địa Pháp, tiện nghi hiện đại.', 5, 9.0, 0, 3800000),
('Melia Hanoi', '44B Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 'Khách sạn 5 sao Tây Ban Nha với tầm nhìn toàn cảnh thành phố và công viên Thống Nhất.', 5, 8.8, 0, 3200000),
('Hanoi La Siesta Hotel & Spa', '94 Mã Mây, Hoàn Kiếm, Hà Nội', 'Boutique hotel 4 sao giữa lòng phố cổ, nổi tiếng với dịch vụ spa và ẩm thực.', 4, 9.1, 0, 2200000),
('Hanoi Pearl Hotel', '6 Bảo Khánh, Hoàn Kiếm, Hà Nội', 'Khách sạn 4 sao view hồ Hoàn Kiếm, đi bộ 1 phút tới đền Ngọc Sơn.', 4, 8.7, 0, 1800000),
('Silk Path Grand Resort & Spa', '21 Hàng Khay, Hoàn Kiếm, Hà Nội', 'Resort giữa phố, kết hợp kiến trúc Đông Dương và tiện nghi spa hiện đại.', 4, 8.9, 0, 2500000),
('The Chi Boutique Hotel', '13 Hàng Trống, Hoàn Kiếm, Hà Nội', 'Boutique hotel mới xây với view hồ Gươm, nội thất sang trọng phong cách Indochine.', 4, 8.6, 0, 1900000),
('Essence Hanoi Hotel & Spa', '22 Tạ Hiện, Hoàn Kiếm, Hà Nội', 'Nằm trên phố bia nổi tiếng, gần chợ đêm, phù hợp khám phá nightlife Hà Nội.', 3, 8.4, 0, 1200000),
('Hanoi Impressive Hotel', '16 Lương Ngọc Quyến, Hoàn Kiếm, Hà Nội', 'Khách sạn 3 sao giá tốt ngay phố cổ, sân thượng view thành phố.', 3, 8.2, 0, 900000),
('Little Charm Hanoi Hostel', '48 Hàng Gà, Hoàn Kiếm, Hà Nội', 'Hostel sạch đẹp với không gian chung thân thiện, lý tưởng cho backpacker.', 2, 8.0, 0, 450000),
('Lotte Hotel Hanoi', '54 Liễu Giai, Ba Đình, Hà Nội', 'Khách sạn 5 sao trong tổ hợp Lotte Center, tầm nhìn panorama Hồ Tây và thành phố.', 5, 9.1, 0, 4500000);

-- 4. Thêm phòng + amenities + ảnh
DO $$
DECLARE
  v_id INT;
  v_img_id INT;
BEGIN
  -- === SOFITEL ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Sofitel Legend Metropole Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Premium Room', 5500000, 2, 'Phòng cao cấp phong cách Pháp cổ điển, view sân vườn', 10, '1 King', '35 m²'),
  (v_id, 'Grand Prestige Suite', 12000000, 3, 'Suite sang trọng nhất với phòng khách riêng, bồn tắm jacuzzi', 4, '1 King + 1 sofa bed', '65 m²'),
  (v_id, 'Opera Wing Deluxe', 7500000, 2, 'Phòng Deluxe tại cánh Opera, nội thất gỗ quý', 8, '2 Queen', '42 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sofitel1/800/500', 'Sofitel exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sofitel2/800/500', 'Sofitel lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sofitel3/800/500', 'Sofitel room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sofitel4/800/500', 'Sofitel pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sofitel5/800/500', 'Sofitel bedroom', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === JW MARRIOTT ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'JW Marriott Hotel Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Room', 4200000, 2, 'Phòng Deluxe view thành phố, minibar miễn phí', 20, '1 King', '38 m²'),
  (v_id, 'Executive Suite', 8500000, 3, 'Suite với lounge riêng, bữa sáng tại Executive Lounge', 6, '1 King + 1 sofa bed', '55 m²'),
  (v_id, 'Presidential Suite', 25000000, 4, 'Suite tổng thống với phòng họp riêng, butler service', 2, '2 King', '120 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/marriott1/800/500', 'Marriott exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/marriott2/800/500', 'Marriott room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/marriott3/800/500', 'Marriott pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/marriott4/800/500', 'Marriott suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/marriott5/800/500', 'Marriott restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === HILTON ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hilton Hanoi Opera';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe City View', 3800000, 2, 'View Nhà hát Lớn và phố cổ, phòng tắm đá cẩm thạch', 15, '1 King', '32 m²'),
  (v_id, 'Premium Suite', 6500000, 3, 'Suite rộng rãi với ban công riêng', 5, '1 King + 1 Single', '50 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/hilton1/800/500', 'Hilton exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/hilton2/800/500', 'Hilton room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/hilton3/800/500', 'Hilton bathroom', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/hilton4/800/500', 'Hilton lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/hilton5/800/500', 'Hilton dining', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === MELIA ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Melia Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Melia Room', 3200000, 2, 'Phòng tiêu chuẩn Melia, view công viên Thống Nhất', 25, '1 King', '30 m²'),
  (v_id, 'The Level Premium', 4800000, 2, 'Tầng The Level với lounge riêng, cocktail hour', 10, '1 King', '35 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/melia1/800/500', 'Melia exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/melia2/800/500', 'Melia room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/melia3/800/500', 'Melia lounge', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/melia4/800/500', 'Melia pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/melia5/800/500', 'Melia view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === LA SIESTA ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hanoi La Siesta Hotel & Spa';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Charm Double', 2200000, 2, 'Phòng đôi xinh xắn giữa phố cổ, bao gồm spa voucher', 12, '1 Queen', '22 m²'),
  (v_id, 'Bliss Suite', 3500000, 3, 'Suite với bồn tắm lớn, ban công nhìn ra phố Mã Mây', 4, '1 King + 1 Single', '35 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/siesta1/800/500', 'La Siesta exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/siesta2/800/500', 'La Siesta room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/siesta3/800/500', 'La Siesta spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/siesta4/800/500', 'La Siesta bed', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/siesta5/800/500', 'La Siesta bath', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === PEARL ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hanoi Pearl Hotel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Superior Lake View', 1800000, 2, 'View trực diện Hồ Hoàn Kiếm, ban công nhỏ', 8, '1 Queen', '25 m²'),
  (v_id, 'Deluxe Family', 2800000, 4, 'Phòng gia đình rộng, 2 giường lớn', 6, '2 Queen', '38 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pearl1/800/500', 'Pearl exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pearl2/800/500', 'Pearl room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pearl3/800/500', 'Pearl view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pearl4/800/500', 'Pearl breakfast', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pearl5/800/500', 'Pearl bath', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === SILK PATH ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Silk Path Grand Resort & Spa';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Grand Deluxe', 2500000, 2, 'Phòng Deluxe cao cấp với dịch vụ spa miễn phí 30 phút', 15, '1 King', '28 m²'),
  (v_id, 'Silk Suite', 4200000, 3, 'Suite phong cách Đông Dương, bồn tắm gỗ', 4, '1 King + 1 sofa bed', '45 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/silk1/800/500', 'Silk Path exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/silk2/800/500', 'Silk Path room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/silk3/800/500', 'Silk Path spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/silk4/800/500', 'Silk Path lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/silk5/800/500', 'Silk Path suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === THE CHI ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'The Chi Boutique Hotel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Indochine Room', 1900000, 2, 'Phòng phong cách Đông Dương view hồ Gươm', 10, '1 Queen', '24 m²'),
  (v_id, 'Panorama Suite', 3800000, 2, 'Suite tầng cao nhất, view 180° hồ Gươm', 3, '1 King', '40 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/chi1/800/500', 'Chi exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/chi2/800/500', 'Chi room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/chi3/800/500', 'Chi view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/chi4/800/500', 'Chi suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/chi5/800/500', 'Chi balcony', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === ESSENCE ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Essence Hanoi Hotel & Spa';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Standard Double', 1200000, 2, 'Phòng đôi tiêu chuẩn, ngay phố Tạ Hiện', 15, '1 Queen', '20 m²'),
  (v_id, 'Superior Triple', 1600000, 3, 'Phòng ba người, view phố cổ', 8, '1 Queen + 1 Single', '26 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/essence1/800/500', 'Essence exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/essence2/800/500', 'Essence room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/essence3/800/500', 'Essence street', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/essence4/800/500', 'Essence lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/essence5/800/500', 'Essence bed', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === IMPRESSIVE ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hanoi Impressive Hotel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'City View Room', 900000, 2, 'Phòng view thành phố, sân thượng chung', 20, '1 Double', '18 m²'),
  (v_id, 'Family Room', 1400000, 4, 'Phòng gia đình rộng rãi', 8, '2 Double', '28 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/impressive1/800/500', 'Impressive exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/impressive2/800/500', 'Impressive room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/impressive3/800/500', 'Impressive rooftop', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/impressive4/800/500', 'Impressive bed', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/impressive5/800/500', 'Impressive hallway', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === LITTLE CHARM ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Little Charm Hanoi Hostel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Private Double', 450000, 2, 'Phòng riêng đôi, sạch sẽ, có cửa sổ', 10, '1 Double', '14 m²'),
  (v_id, 'Dorm Bed (4-bed)', 200000, 1, 'Giường trong phòng dorm 4 người, tủ locker riêng', 16, '1 Single (bunk)', '4 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/charm1/800/500', 'Charm common', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/charm2/800/500', 'Charm dorm', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/charm3/800/500', 'Charm reception', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);

  -- === LOTTE ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Lotte Hotel Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Room', 4500000, 2, 'Phòng Deluxe tầng cao, view Hồ Tây', 18, '1 King', '36 m²'),
  (v_id, 'Royal Suite', 15000000, 4, 'Suite hoàng gia, phòng khách + phòng ăn riêng, butler 24/7', 3, '2 King', '95 m²'),
  (v_id, 'Corner Suite', 8000000, 3, 'Suite góc với 2 mặt kính view panorama', 5, '1 King + 1 sofa bed', '58 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/lotte1/800/500', 'Lotte exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/lotte2/800/500', 'Lotte room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/lotte3/800/500', 'Lotte city view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/lotte4/800/500', 'Lotte suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/lotte5/800/500', 'Lotte restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- 5. Amenities
  INSERT INTO hotel.amenities (name) VALUES
  ('WiFi miễn phí'), ('Điều hoà'), ('Minibar'), ('Két an toàn'), ('Máy pha cà phê'),
  ('Bồn tắm'), ('Hồ bơi'), ('Phòng gym'), ('Spa'), ('Nhà hàng'),
  ('Bãi đậu xe'), ('Lễ tân 24/7'), ('Dịch vụ phòng 24/7'), ('Ban công'),
  ('TV màn hình phẳng'), ('Máy sấy tóc')
  ON CONFLICT (name) DO NOTHING;

  -- Link amenities 5 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name IN ('Sofitel Legend Metropole Hanoi','JW Marriott Hotel Hanoi','Hilton Hanoi Opera','Melia Hanoi','Lotte Hotel Hanoi'))
    AND a.name IN ('WiFi miễn phí','Điều hoà','Minibar','Két an toàn','TV màn hình phẳng','Máy sấy tóc','Bồn tắm','Dịch vụ phòng 24/7')
  ON CONFLICT DO NOTHING;

  -- Link amenities 4 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name IN ('Hanoi La Siesta Hotel & Spa','Hanoi Pearl Hotel','Silk Path Grand Resort & Spa','The Chi Boutique Hotel'))
    AND a.name IN ('WiFi miễn phí','Điều hoà','Minibar','Két an toàn','TV màn hình phẳng','Máy sấy tóc')
  ON CONFLICT DO NOTHING;

  -- Link amenities 3 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name IN ('Essence Hanoi Hotel & Spa','Hanoi Impressive Hotel'))
    AND a.name IN ('WiFi miễn phí','Điều hoà','TV màn hình phẳng','Máy sấy tóc')
  ON CONFLICT DO NOTHING;

  -- Link amenities hostel
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name = 'Little Charm Hanoi Hostel')
    AND a.name IN ('WiFi miễn phí','Điều hoà')
  ON CONFLICT DO NOTHING;

END $$;

-- Done!


-- ============================================================
-- SEED DATA: Khách sạn Hà Nội (Phần 2) — Thêm 15 khách sạn mới
-- Chạy: psql DATABASE_URL -f seed-hanoi-2.sql
-- Logic: Xoá 15 hotel mới (theo tên) → Insert lại từ đầu
-- KHÔNG ảnh hưởng hotel cũ (chỉ target theo tên cụ thể)
-- ============================================================

-- 1. Xoá sạch dữ liệu cũ của 15 hotel mới (nếu có)
DO $$
DECLARE
  v_names TEXT[] := ARRAY[
    'InterContinental Hanoi Landmark72',
    'Pan Pacific Hanoi',
    'Sheraton Hanoi Hotel',
    'Hotel de l''Opera Hanoi - MGallery',
    'Hanoi Daewoo Hotel',
    'Dolce by Wyndham Hanoi Golden Lake',
    'Apricot Hotel Hanoi',
    'Pullman Hanoi',
    'Peridot Grand Luxury Boutique Hotel',
    'Hanoi La Siesta Diamond',
    'Capella Hanoi',
    'Oriental Jade Hotel & Spa',
    'Acoustic Hotel & Spa',
    'Hanoi Emerald Waters Hotel & Spa',
    'Old Quarter View Hanoi Hostel'
  ];
  v_ids INT[];
  v_room_ids INT[];
BEGIN
  SELECT ARRAY_AGG(id) INTO v_ids FROM hotel.hotels WHERE name = ANY(v_names);

  IF v_ids IS NOT NULL THEN
    SELECT ARRAY_AGG(id) INTO v_room_ids FROM hotel.room_types WHERE hotel_id = ANY(v_ids);

    IF v_room_ids IS NOT NULL THEN
      DELETE FROM hotel.room_amenities WHERE room_type_id = ANY(v_room_ids);
      DELETE FROM booking.reviews WHERE booking_id IN (SELECT id FROM booking.bookings WHERE room_type_id = ANY(v_room_ids));
      DELETE FROM booking.payments WHERE booking_id IN (SELECT id FROM booking.bookings WHERE room_type_id = ANY(v_room_ids));
      DELETE FROM booking.bookings WHERE room_type_id = ANY(v_room_ids);
    END IF;

    DELETE FROM hotel.hotel_images WHERE hotel_id = ANY(v_ids);
    DELETE FROM hotel.room_types WHERE hotel_id = ANY(v_ids);
    DELETE FROM hotel.hotels WHERE id = ANY(v_ids);
  END IF;
END $$;

-- 2. Đảm bảo city Hà Nội tồn tại
INSERT INTO hotel.cities (name, subtitle)
SELECT 'Hà Nội', 'Thủ đô ngàn năm văn hiến'
WHERE NOT EXISTS (SELECT 1 FROM hotel.cities WHERE name = 'Hà Nội');

-- 3. Thêm khách sạn
INSERT INTO hotel.hotels (name, address, description, stars, rating, reviews, price_from) VALUES
('InterContinental Hanoi Landmark72', 'Keangnam Landmark Tower, Phạm Hùng, Nam Từ Liêm, Hà Nội', 'Khách sạn cao nhất Hà Nội trên đỉnh tòa tháp Landmark72 tầng, view panorama toàn thành phố, dịch vụ đẳng cấp InterContinental.', 5, 9.3, 0, 4800000),
('Pan Pacific Hanoi', '1 Thanh Niên, Ba Đình, Hà Nội', 'Khách sạn 5 sao bên Hồ Tây, view hồ tuyệt đẹp, gần Phủ Chủ tịch và chùa Trấn Quốc.', 5, 9.0, 0, 3500000),
('Sheraton Hanoi Hotel', 'K5 Nghi Tàm, 11 Xuân Diệu, Tây Hồ, Hà Nội', 'Resort giữa lòng thành phố bên bờ Hồ Tây, không gian xanh mát, hồ bơi ngoài trời rộng.', 5, 8.9, 0, 3600000),
('Hotel de l''Opera Hanoi - MGallery', '29 Tràng Tiền, Hoàn Kiếm, Hà Nội', 'Boutique hotel 5 sao phong cách opera Pháp, cách phố cổ 3 phút đi bộ, 107 phòng thiết kế tinh xảo.', 5, 9.1, 0, 4000000),
('Hanoi Daewoo Hotel', '360 Kim Mã, Ba Đình, Hà Nội', 'Khách sạn 5 sao lâu đời từ 1996, hồ bơi lớn nhất thành phố, vườn cảnh quan đẹp bên hồ Thủ Lệ.', 5, 8.5, 0, 2800000),
('Dolce by Wyndham Hanoi Golden Lake', 'B7 Giảng Võ, Ba Đình, Hà Nội', 'Khách sạn dát vàng 24K nổi tiếng thế giới, hồ bơi vô cực mạ vàng trên tầng thượng, view hồ Giảng Võ.', 5, 8.7, 0, 3800000),
('Apricot Hotel Hanoi', '136 Hàng Trống, Hoàn Kiếm, Hà Nội', 'Boutique hotel nghệ thuật view trực diện Hồ Hoàn Kiếm, bộ sưu tập tranh quý, hồ bơi tầng thượng.', 5, 9.2, 0, 3400000),
('Pullman Hanoi', '40 Cát Linh, Đống Đa, Hà Nội', 'Khách sạn 5 sao thương gia Accor, gần các cơ quan chính phủ, hồ bơi ngoài trời và nhà hàng Pháp-Á.', 5, 8.6, 0, 2600000),
('Peridot Grand Luxury Boutique Hotel', '2 Hải Tượng, Hoàn Kiếm, Hà Nội', 'Boutique hotel 5 sao mới nhất phố cổ, hồ bơi vô cực tầng thượng, spa cao cấp, gần đền Ngọc Sơn.', 5, 9.4, 0, 2800000),
('Hanoi La Siesta Diamond', '32 Lò Sũ, Hoàn Kiếm, Hà Nội', 'Boutique hotel 4 sao chuỗi La Siesta, nhà hàng tầng thượng view hồ, phong cách Đông Dương hiện đại.', 4, 9.0, 0, 2000000),
('Capella Hanoi', '11 Lê Phụng Hiểu, Hoàn Kiếm, Hà Nội', 'Boutique hotel độc đáo lấy cảm hứng từ opera và nhạc kịch, chỉ 47 phòng, dịch vụ cá nhân hóa.', 5, 9.3, 0, 5000000),
('Oriental Jade Hotel & Spa', '20 Ngõ Huyện, Hoàn Kiếm, Hà Nội', 'Khách sạn 4 sao thiết kế Á Đông, spa nổi tiếng, gần Nhà thờ Lớn và phố cổ.', 4, 8.8, 0, 1600000),
('Acoustic Hotel & Spa', '1 Ngõ Huyện, Hoàn Kiếm, Hà Nội', 'Khách sạn 3 sao âm nhạc, rooftop bar live music, vị trí đắc địa cạnh Nhà thờ Lớn Hà Nội.', 3, 8.5, 0, 1000000),
('Hanoi Emerald Waters Hotel & Spa', '46 Lò Sũ, Hoàn Kiếm, Hà Nội', 'Khách sạn 4 sao mới, hồ bơi trong nhà, spa thủy liệu, cách Hồ Gươm 200m.', 4, 8.7, 0, 1500000),
('Old Quarter View Hanoi Hostel', '8A Tạ Hiện, Hoàn Kiếm, Hà Nội', 'Hostel hiện đại ngay phố bia Tạ Hiện, rooftop bar view phố cổ, không gian sống động cho backpacker.', 2, 8.3, 0, 350000);

-- 4. Thêm phòng + ảnh
DO $$
DECLARE
  v_id INT;
  v_img_id INT;
BEGIN
  -- === INTERCONTINENTAL LANDMARK72 ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'InterContinental Hanoi Landmark72';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe City View', 4800000, 2, 'Phòng Deluxe tầng cao view thành phố, nội thất hiện đại', 30, '1 King', '40 m²'),
  (v_id, 'Club InterContinental Suite', 12000000, 3, 'Suite với quyền sử dụng Club Lounge, cocktail hour, bữa sáng riêng', 8, '1 King + 1 sofa bed', '70 m²'),
  (v_id, 'Panorama Suite', 18000000, 4, 'Suite góc 2 mặt kính, view 270° thành phố từ tầng 60+', 3, '2 King', '100 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/ic72_1/800/500', 'InterContinental Landmark72 exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/ic72_2/800/500', 'InterContinental Landmark72 room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/ic72_3/800/500', 'InterContinental Landmark72 view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/ic72_4/800/500', 'InterContinental Landmark72 lounge', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/ic72_5/800/500', 'InterContinental Landmark72 pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === PAN PACIFIC ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Pan Pacific Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Lake View', 3500000, 2, 'View Hồ Tây thơ mộng, ban công riêng, minibar miễn phí', 25, '1 King', '35 m²'),
  (v_id, 'Pacific Suite', 7000000, 3, 'Suite sang trọng với phòng khách riêng, view hồ 180°', 6, '1 King + 1 sofa bed', '55 m²'),
  (v_id, 'Executive Room', 4500000, 2, 'Phòng Executive với Pacific Lounge access, bữa sáng và cocktail', 12, '1 King', '38 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/panpac1/800/500', 'Pan Pacific exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/panpac2/800/500', 'Pan Pacific lake view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/panpac3/800/500', 'Pan Pacific room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/panpac4/800/500', 'Pan Pacific pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/panpac5/800/500', 'Pan Pacific restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === SHERATON ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Sheraton Hanoi Hotel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Lake View', 3600000, 2, 'View Hồ Tây hoặc sông Hồng, cửa sổ lớn', 40, '1 King', '36 m²'),
  (v_id, 'Club Suite', 8000000, 3, 'Suite với Sheraton Club Lounge, butler service', 8, '1 King + 1 sofa bed', '60 m²'),
  (v_id, 'Grand Suite', 15000000, 4, 'Suite rộng nhất view toàn cảnh Hồ Tây, phòng khách + phòng ăn', 3, '2 King', '90 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sheraton1/800/500', 'Sheraton exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sheraton2/800/500', 'Sheraton pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sheraton3/800/500', 'Sheraton room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sheraton4/800/500', 'Sheraton garden', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/sheraton5/800/500', 'Sheraton lake', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === HOTEL DE L'OPERA ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hotel de l''Opera Hanoi - MGallery';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Grand Deluxe Room', 4000000, 2, 'Phòng mới renovate, sàn gỗ, view sân trong yên tĩnh, vòi sen mưa', 20, '1 King', '32 m²'),
  (v_id, 'Junior Suite Opera View', 7500000, 2, 'Suite 40m² view Nhà hát Lớn, phòng tắm lớn với bồn + vòi sen', 6, '1 King', '40 m²'),
  (v_id, 'L''Opera Grand Suite', 12000000, 3, 'Suite 77m² view Nhà hát Lớn, phòng khách + phòng ngủ riêng biệt', 3, '1 King + 1 sofa bed', '77 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/opera1/800/500', 'Hotel de l Opera exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/opera2/800/500', 'Hotel de l Opera room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/opera3/800/500', 'Hotel de l Opera lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/opera4/800/500', 'Hotel de l Opera suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/opera5/800/500', 'Hotel de l Opera restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === DAEWOO ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hanoi Daewoo Hotel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Room', 2800000, 2, 'Phòng Deluxe phong cách cổ điển, view hồ Thủ Lệ hoặc thành phố', 50, '1 King', '34 m²'),
  (v_id, 'Executive Suite', 6000000, 3, 'Suite với phòng khách riêng, view vườn, minibar đầy đủ', 10, '1 King + 1 sofa bed', '52 m²'),
  (v_id, 'Presidential Suite', 20000000, 4, 'Suite tổng thống rộng nhất, phòng họp riêng, bếp nhỏ', 2, '2 King', '130 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/daewoo1/800/500', 'Daewoo exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/daewoo2/800/500', 'Daewoo pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/daewoo3/800/500', 'Daewoo room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/daewoo4/800/500', 'Daewoo garden', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/daewoo5/800/500', 'Daewoo lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === DOLCE GOLDEN LAKE ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Dolce by Wyndham Hanoi Golden Lake';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Golden Classic King', 3800000, 2, 'Phòng 45m² nội thất mạ vàng, bồn tắm vàng 24K, view hồ Giảng Võ', 40, '1 King', '45 m²'),
  (v_id, 'Golden Executive King', 5500000, 2, 'Phòng 50m² ban công riêng, view thành phố, tiện nghi hoàng gia', 20, '1 King', '50 m²'),
  (v_id, 'Premier Lake View Suite', 9000000, 3, 'Suite 65m² view hồ, phòng khách mạ vàng, butler service', 6, '1 King + 1 sofa bed', '65 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/golden1/800/500', 'Golden Lake exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/golden2/800/500', 'Golden Lake pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/golden3/800/500', 'Golden Lake room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/golden4/800/500', 'Golden Lake bath', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/golden5/800/500', 'Golden Lake lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === APRICOT ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Apricot Hotel Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Room', 3400000, 2, 'Phòng trang trí tranh nghệ thuật, view phố hoặc sân trong', 15, '1 King', '30 m²'),
  (v_id, 'Premium Lake View', 5200000, 2, 'View Hồ Hoàn Kiếm trực diện, bộ sưu tập tranh gốc trong phòng', 8, '1 King', '35 m²'),
  (v_id, 'Apricot Suite', 8500000, 3, 'Suite view hồ Gươm, phòng khách với tranh quý, hồ bơi tầng thượng', 4, '1 King + 1 sofa bed', '50 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/apricot1/800/500', 'Apricot exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/apricot2/800/500', 'Apricot room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/apricot3/800/500', 'Apricot pool rooftop', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/apricot4/800/500', 'Apricot art gallery', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/apricot5/800/500', 'Apricot lake view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === PULLMAN ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Pullman Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Superior Room', 2600000, 2, 'Phòng Superior hiện đại, bàn làm việc rộng, WiFi tốc độ cao', 30, '1 King', '30 m²'),
  (v_id, 'Executive Room', 3500000, 2, 'Phòng Executive với Executive Lounge, bữa sáng + happy hour', 15, '1 King', '35 m²'),
  (v_id, 'Junior Suite', 5000000, 3, 'Suite nhỏ với phòng khách, view hồ bơi và thành phố', 6, '1 King + 1 sofa bed', '45 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pullman1/800/500', 'Pullman exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pullman2/800/500', 'Pullman room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pullman3/800/500', 'Pullman pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pullman4/800/500', 'Pullman restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/pullman5/800/500', 'Pullman lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === PERIDOT GRAND ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Peridot Grand Luxury Boutique Hotel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Deluxe Room', 2800000, 2, 'Phòng Deluxe thiết kế sang trọng, Smart TV 43 inch, vòi sen mưa', 25, '1 King', '28 m²'),
  (v_id, 'Premium Room', 3500000, 2, 'Phòng Premium tầng cao, bồn tắm ngâm sâu, minibar', 15, '1 King', '32 m²'),
  (v_id, 'Grand Suite', 6500000, 3, 'Suite phòng khách riêng, view phố cổ, dịch vụ butler', 5, '1 King + 1 sofa bed', '48 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/peridot1/800/500', 'Peridot exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/peridot2/800/500', 'Peridot pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/peridot3/800/500', 'Peridot room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/peridot4/800/500', 'Peridot spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/peridot5/800/500', 'Peridot bar', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === LA SIESTA DIAMOND ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hanoi La Siesta Diamond';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Diamond Deluxe', 2000000, 2, 'Phòng Deluxe phong cách Đông Dương, bao gồm spa voucher', 14, '1 Queen', '24 m²'),
  (v_id, 'Diamond Suite', 3200000, 3, 'Suite với ban công nhỏ, bồn tắm, view phố cổ', 5, '1 King + 1 Single', '36 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/diamond1/800/500', 'La Siesta Diamond exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/diamond2/800/500', 'La Siesta Diamond room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/diamond3/800/500', 'La Siesta Diamond rooftop', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/diamond4/800/500', 'La Siesta Diamond spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/diamond5/800/500', 'La Siesta Diamond bath', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === CAPELLA ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Capella Hanoi';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Opera Wing Room', 5000000, 2, 'Phòng lấy cảm hứng opera, nội thất kịch nghệ độc đáo, chỉ 47 phòng', 12, '1 King', '35 m²'),
  (v_id, 'Diva Suite', 9000000, 2, 'Suite phong cách diva opera, bồn tắm vintage, view phố', 4, '1 King', '50 m²'),
  (v_id, 'Grand Opera Suite', 15000000, 3, 'Suite lớn nhất, thiết kế sân khấu opera, phòng khách nghệ thuật', 2, '1 King + 1 sofa bed', '70 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/capella1/800/500', 'Capella exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/capella2/800/500', 'Capella room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/capella3/800/500', 'Capella lounge', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/capella4/800/500', 'Capella suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/capella5/800/500', 'Capella detail', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === ORIENTAL JADE ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Oriental Jade Hotel & Spa';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Superior Room', 1600000, 2, 'Phòng Superior thiết kế Á Đông, gần Nhà thờ Lớn', 20, '1 Queen', '22 m²'),
  (v_id, 'Deluxe Balcony', 2200000, 2, 'Phòng Deluxe có ban công, view phố cổ', 12, '1 King', '28 m²'),
  (v_id, 'Jade Suite', 3500000, 3, 'Suite rộng rãi, bồn tắm jacuzzi, spa miễn phí 60 phút', 4, '1 King + 1 Single', '40 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/jade1/800/500', 'Oriental Jade exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/jade2/800/500', 'Oriental Jade room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/jade3/800/500', 'Oriental Jade spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/jade4/800/500', 'Oriental Jade lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/jade5/800/500', 'Oriental Jade breakfast', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === ACOUSTIC ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Acoustic Hotel & Spa';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Standard Room', 1000000, 2, 'Phòng tiêu chuẩn trang trí âm nhạc, gần Nhà thờ Lớn', 18, '1 Queen', '18 m²'),
  (v_id, 'Deluxe Room', 1400000, 2, 'Phòng Deluxe rộng hơn, ban công nhỏ', 10, '1 King', '22 m²'),
  (v_id, 'Family Room', 1800000, 4, 'Phòng gia đình 2 giường, phù hợp nhóm bạn', 6, '2 Double', '30 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/acoustic1/800/500', 'Acoustic exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/acoustic2/800/500', 'Acoustic room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/acoustic3/800/500', 'Acoustic rooftop bar', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/acoustic4/800/500', 'Acoustic music', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/acoustic5/800/500', 'Acoustic spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === EMERALD WATERS ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Hanoi Emerald Waters Hotel & Spa';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Emerald Deluxe', 1500000, 2, 'Phòng Deluxe thiết kế xanh ngọc lục bảo, hồ bơi miễn phí', 16, '1 Queen', '24 m²'),
  (v_id, 'Premium City View', 2100000, 2, 'Phòng tầng cao, view phố cổ, spa voucher', 10, '1 King', '28 m²'),
  (v_id, 'Emerald Suite', 3000000, 3, 'Suite với phòng thủy liệu riêng, bồn jacuzzi', 4, '1 King + 1 Single', '38 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/emerald1/800/500', 'Emerald Waters exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/emerald2/800/500', 'Emerald Waters pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/emerald3/800/500', 'Emerald Waters room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/emerald4/800/500', 'Emerald Waters spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 3);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/emerald5/800/500', 'Emerald Waters lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 4);

  -- === OLD QUARTER VIEW HOSTEL ===
  SELECT id INTO v_id FROM hotel.hotels WHERE name = 'Old Quarter View Hanoi Hostel';
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_id, 'Private Double', 350000, 2, 'Phòng riêng đôi sạch sẽ, view phố Tạ Hiện', 8, '1 Double', '12 m²'),
  (v_id, 'Dorm Bed (6-bed)', 150000, 1, 'Giường capsule trong dorm 6 người, locker + đèn đọc sách', 24, '1 Single (capsule)', '3 m²'),
  (v_id, 'Private Twin', 500000, 2, 'Phòng riêng 2 giường đơn, cửa sổ view phố', 6, '2 Single', '15 m²');
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/oqview1/800/500', 'Old Quarter View rooftop', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 0);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/oqview2/800/500', 'Old Quarter View dorm', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 1);
  INSERT INTO settings.images (url, alt, type) VALUES ('https://picsum.photos/seed/oqview3/800/500', 'Old Quarter View common', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_id, v_img_id, 2);

  -- 5. Amenities (đảm bảo tồn tại)
  INSERT INTO hotel.amenities (name) VALUES
  ('WiFi miễn phí'), ('Điều hoà'), ('Minibar'), ('Két an toàn'), ('Máy pha cà phê'),
  ('Bồn tắm'), ('Hồ bơi'), ('Phòng gym'), ('Spa'), ('Nhà hàng'),
  ('Bãi đậu xe'), ('Lễ tân 24/7'), ('Dịch vụ phòng 24/7'), ('Ban công'),
  ('TV màn hình phẳng'), ('Máy sấy tóc')
  ON CONFLICT (name) DO NOTHING;

  -- Link amenities 5 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name IN (
    'InterContinental Hanoi Landmark72','Pan Pacific Hanoi','Sheraton Hanoi Hotel',
    'Hotel de l''Opera Hanoi - MGallery','Hanoi Daewoo Hotel',
    'Dolce by Wyndham Hanoi Golden Lake','Apricot Hotel Hanoi','Pullman Hanoi',
    'Peridot Grand Luxury Boutique Hotel','Capella Hanoi'
  ))
    AND a.name IN ('WiFi miễn phí','Điều hoà','Minibar','Két an toàn','TV màn hình phẳng','Máy sấy tóc','Bồn tắm','Dịch vụ phòng 24/7','Máy pha cà phê')
  ON CONFLICT DO NOTHING;

  -- Link amenities 4 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name IN (
    'Hanoi La Siesta Diamond','Oriental Jade Hotel & Spa','Hanoi Emerald Waters Hotel & Spa'
  ))
    AND a.name IN ('WiFi miễn phí','Điều hoà','Minibar','Két an toàn','TV màn hình phẳng','Máy sấy tóc')
  ON CONFLICT DO NOTHING;

  -- Link amenities 3 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name = 'Acoustic Hotel & Spa')
    AND a.name IN ('WiFi miễn phí','Điều hoà','TV màn hình phẳng','Máy sấy tóc')
  ON CONFLICT DO NOTHING;

  -- Link amenities hostel
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id FROM hotel.room_types r CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (SELECT id FROM hotel.hotels WHERE name = 'Old Quarter View Hanoi Hostel')
    AND a.name IN ('WiFi miễn phí','Điều hoà')
  ON CONFLICT DO NOTHING;

END $$;

-- Done!



-- ============================================================
-- SEED: Dịch vụ lân cận cho khách sạn Hà Nội (After Booking)
-- Chạy sau seed-hanoi.sql & seed-hanoi-2.sql
-- Idempotent: DELETE trước rồi INSERT lại
-- ============================================================

-- Xoá data cũ
DELETE FROM hotel.nearby_services WHERE hotel_id IN (
  SELECT id FROM hotel.hotels WHERE address ILIKE '%Hà Nội%'
);

-- ============================================================
-- Khu vực HOÀN KIẾM (phố cổ) — áp dụng cho nhiều hotel
-- ============================================================
DO $$
DECLARE
  v_hotel_ids INT[];
  v_id INT;
BEGIN
  -- Lấy tất cả hotel khu Hoàn Kiếm
  SELECT ARRAY_AGG(id) INTO v_hotel_ids
  FROM hotel.hotels
  WHERE address ILIKE '%Hoàn Kiếm%';

  IF v_hotel_ids IS NULL THEN
    RAISE NOTICE 'Không tìm thấy hotel Hoàn Kiếm, skip.';
    RETURN;
  END IF;

  FOREACH v_id IN ARRAY v_hotel_ids LOOP
    -- === FOOD ===
    INSERT INTO hotel.nearby_services (hotel_id, category, name, description, address, distance, rating, price_range, map_url, tags) VALUES
    (v_id, 'food', 'Phở Thìn Bờ Hồ', 'Phở bò truyền thống nổi tiếng nhất Hà Nội, nước dùng đậm đà, thịt bò tươi.', '13 Lò Đúc, Hoàn Kiếm', '500m', 4.5, '50.000 - 80.000₫', 'https://maps.google.com/?q=Pho+Thin+13+Lo+Duc+Hanoi', '{phở,bữa sáng,truyền thống}'),
    (v_id, 'food', 'Bún Chả Hương Liên', 'Quán bún chả Obama từng ghé, hương vị đặc trưng Hà Nội.', '24 Lê Văn Hưu, Hoàn Kiếm', '800m', 4.6, '60.000 - 100.000₫', 'https://maps.google.com/?q=Bun+Cha+Huong+Lien+Hanoi', '{bún chả,obama,đặc sản}'),
    (v_id, 'food', 'Café Giảng - Egg Coffee', 'Quán cà phê trứng nguyên bản từ 1946, không gian hoài cổ.', '39 Nguyễn Hữu Huân, Hoàn Kiếm', '300m', 4.7, '30.000 - 55.000₫', 'https://maps.google.com/?q=Cafe+Giang+Nguyen+Huu+Huan+Hanoi', '{cafe,cà phê trứng,vintage}'),
    (v_id, 'food', 'Nhà hàng Madame Hiền', 'Nhà hàng Việt-Pháp cao cấp trong biệt thự cổ, không gian sân vườn.', '15 Chân Cầm, Hoàn Kiếm', '400m', 4.4, '200.000 - 500.000₫', 'https://maps.google.com/?q=Madame+Hien+Restaurant+Hanoi', '{fine dining,Pháp-Việt,sân vườn}'),
    (v_id, 'food', 'Kem Tràng Tiền', 'Tiệm kem huyền thoại từ 1958, kem que các vị truyền thống.', '35 Tràng Tiền, Hoàn Kiếm', '200m', 4.2, '10.000 - 30.000₫', 'https://maps.google.com/?q=Kem+Trang+Tien+Hanoi', '{kem,dessert,truyền thống}'),

    -- === ATTRACTION ===
    (v_id, 'attraction', 'Hồ Hoàn Kiếm & Đền Ngọc Sơn', 'Biểu tượng Hà Nội, đền cổ trên đảo nhỏ giữa hồ, cầu Thê Húc đỏ.', 'Hồ Hoàn Kiếm, Hoàn Kiếm', '100m', 4.8, 'Miễn phí (đền: 30.000₫)', 'https://maps.google.com/?q=Hoan+Kiem+Lake+Hanoi', '{tâm linh,lịch sử,biểu tượng}'),
    (v_id, 'attraction', 'Phố cổ Hà Nội 36 phố phường', 'Khu phố cổ hơn 1000 năm, mỗi phố một nghề, kiến trúc độc đáo.', 'Phố cổ Hà Nội, Hoàn Kiếm', '0m', 4.6, 'Miễn phí', 'https://maps.google.com/?q=Hanoi+Old+Quarter', '{lịch sử,mua sắm,khám phá}'),
    (v_id, 'attraction', 'Nhà hát Lớn Hà Nội', 'Kiệt tác kiến trúc Pháp 1911, tổ chức biểu diễn nghệ thuật hàng đêm.', '1 Tràng Tiền, Hoàn Kiếm', '300m', 4.5, '200.000 - 500.000₫/vé', 'https://maps.google.com/?q=Hanoi+Opera+House', '{kiến trúc,nghệ thuật,Pháp}'),
    (v_id, 'attraction', 'Văn Miếu - Quốc Tử Giám', 'Trường đại học đầu tiên của Việt Nam (1070), kiến trúc cổ kính.', '58 Quốc Tử Giám, Đống Đa', '2km', 4.7, '30.000₫', 'https://maps.google.com/?q=Temple+of+Literature+Hanoi', '{tâm linh,lịch sử,giáo dục}'),
    (v_id, 'attraction', 'Chợ đêm phố cổ (Thứ 6-CN)', 'Chợ đêm sôi động từ Hàng Đào đến Đồng Xuân, ẩm thực đường phố.', 'Hàng Đào - Đồng Xuân, Hoàn Kiếm', '200m', 4.3, 'Miễn phí (mua sắm tuỳ)', 'https://maps.google.com/?q=Hanoi+Night+Market', '{mua sắm,ẩm thực,nightlife}'),

    -- === WELLNESS ===
    (v_id, 'wellness', 'La Siesta Spa', 'Spa cao cấp với liệu trình massage Việt Nam truyền thống.', '94 Mã Mây, Hoàn Kiếm', '300m', 4.6, '500.000 - 1.500.000₫', 'https://maps.google.com/?q=La+Siesta+Spa+Hanoi', '{massage,thư giãn,truyền thống}'),
    (v_id, 'wellness', 'Zen Spa Hanoi', 'Spa yên tĩnh giữa phố cổ, liệu trình thảo dược và đá nóng.', '14 Ngõ Bảo Khánh, Hoàn Kiếm', '400m', 4.5, '400.000 - 1.200.000₫', 'https://maps.google.com/?q=Zen+Spa+Hanoi', '{spa,thảo dược,đá nóng}'),

    -- === TRANSPORT ===
    (v_id, 'transport', 'Xe đưa đón sân bay Nội Bài', 'Dịch vụ xe riêng 7 chỗ đưa đón sân bay, đặt trước 24h.', 'Đón tại khách sạn', '30km', 4.4, '350.000 - 450.000₫/lượt', 'https://maps.google.com/?q=Noi+Bai+Airport+Hanoi', '{sân bay,tiện lợi,đặt trước}'),
    (v_id, 'transport', 'Thuê xe máy Phố Cổ Motorbike', 'Thuê xe máy tay ga hoặc số, có giao tận nơi.', '12 Hàng Bạc, Hoàn Kiếm', '200m', 4.2, '120.000 - 200.000₫/ngày', 'https://maps.google.com/?q=motorbike+rental+Hang+Bac+Hanoi', '{xe máy,tự do,khám phá}'),

    -- === NIGHTLIFE ===
    (v_id, 'nightlife', 'Bia hơi Tạ Hiện', 'Con phố bia nổi tiếng nhất Hà Nội, không khí sôi động mỗi tối.', 'Phố Tạ Hiện, Hoàn Kiếm', '200m', 4.3, '30.000 - 100.000₫', 'https://maps.google.com/?q=Ta+Hien+Beer+Street+Hanoi', '{bia,vui vẻ,backpacker}'),
    (v_id, 'nightlife', 'Skyline Bar - Lotte Center', 'Bar tầng 65 view toàn cảnh Hà Nội, cocktail cao cấp.', 'Tầng 65, Lotte Center, 54 Liễu Giai', '3km', 4.5, '200.000 - 500.000₫/ly', 'https://maps.google.com/?q=Top+of+Hanoi+Lotte+Center', '{rooftop,cocktail,view}'),
    (v_id, 'nightlife', 'Polite Pub', 'Pub nhạc sống hàng đêm, không gian ấm cúng trong phố cổ.', '5T Bảo Khánh, Hoàn Kiếm', '300m', 4.4, '80.000 - 200.000₫/ly', 'https://maps.google.com/?q=Polite+Pub+Hanoi', '{nhạc sống,pub,ấm cúng}');
  END LOOP;

  -- ============================================================
  -- Khu vực TÂY HỒ — cho Sheraton, Pan Pacific
  -- ============================================================
  SELECT ARRAY_AGG(id) INTO v_hotel_ids
  FROM hotel.hotels
  WHERE address ILIKE '%Tây Hồ%' OR address ILIKE '%Thanh Niên%';

  IF v_hotel_ids IS NOT NULL THEN
    FOREACH v_id IN ARRAY v_hotel_ids LOOP
      INSERT INTO hotel.nearby_services (hotel_id, category, name, description, address, distance, rating, price_range, map_url, tags) VALUES
      (v_id, 'food', 'Quán Ăn Ngon - Tây Hồ', 'Nhà hàng Việt ven hồ, không gian thoáng, menu đa dạng.', '18 Xuân Diệu, Tây Hồ', '500m', 4.3, '100.000 - 300.000₫', 'https://maps.google.com/?q=Quan+An+Ngon+Xuan+Dieu+Hanoi', '{Việt Nam,ven hồ,gia đình}'),
      (v_id, 'food', 'The Hanoi Social Club', 'Quán cafe-bistro phong cách Tây, brunch và cocktail.', '6 Hội Vũ, Hoàn Kiếm', '3km', 4.5, '80.000 - 250.000₫', 'https://maps.google.com/?q=Hanoi+Social+Club', '{cafe,brunch,expat}'),
      (v_id, 'food', 'Bánh Mỳ 25', 'Bánh mì nổi tiếng Hà Nội với đầy đủ nhân truyền thống.', '25 Hàng Cá, Hoàn Kiếm', '4km', 4.6, '25.000 - 40.000₫', 'https://maps.google.com/?q=Banh+Mi+25+Hanoi', '{bánh mì,nhanh,rẻ}'),
      (v_id, 'attraction', 'Chùa Trấn Quốc', 'Ngôi chùa cổ nhất Hà Nội (541), trên bán đảo Hồ Tây.', 'Thanh Niên, Tây Hồ', '300m', 4.8, 'Miễn phí', 'https://maps.google.com/?q=Tran+Quoc+Pagoda+Hanoi', '{tâm linh,cổ nhất,Hồ Tây}'),
      (v_id, 'attraction', 'Phủ Tây Hồ', 'Đền thờ Mẫu Liễu Hạnh linh thiêng, kiến trúc đẹp bên Hồ Tây.', 'Phủ Tây Hồ, Tây Hồ', '2km', 4.6, 'Miễn phí', 'https://maps.google.com/?q=Phu+Tay+Ho+Hanoi', '{tâm linh,Mẫu,Hồ Tây}'),
      (v_id, 'attraction', 'Hồ Tây - Đạp vịt & Du thuyền', 'Hồ nước ngọt lớn nhất Hà Nội, đạp vịt hoặc du thuyền ngắm hoàng hôn.', 'Hồ Tây, Tây Hồ', '100m', 4.4, '50.000 - 200.000₫/h', 'https://maps.google.com/?q=West+Lake+Hanoi', '{thư giãn,hoàng hôn,đạp vịt}'),
      (v_id, 'wellness', 'Six Senses Spa at Intercontinental', 'Spa sang trọng tầm cỡ quốc tế, liệu trình từ 90 phút.', 'InterContinental Westlake, 5 Từ Hoa', '1km', 4.8, '1.500.000 - 4.000.000₫', 'https://maps.google.com/?q=Six+Senses+Spa+Intercontinental+Hanoi', '{luxury,six senses,thư giãn}'),
      (v_id, 'transport', 'Xe đưa đón sân bay Nội Bài', 'Dịch vụ xe riêng VIP, đặt trước 24h, có xe 16 chỗ cho nhóm.', 'Đón tại khách sạn', '25km', 4.4, '350.000 - 600.000₫/lượt', 'https://maps.google.com/?q=Noi+Bai+Airport+Hanoi', '{sân bay,VIP,nhóm}'),
      (v_id, 'nightlife', 'Sunset Bar Intercontinental', 'Bar ven hồ với view hoàng hôn tuyệt đẹp, cocktail signature.', '5 Từ Hoa, Tây Hồ', '1km', 4.6, '150.000 - 400.000₫/ly', 'https://maps.google.com/?q=Sunset+Bar+Intercontinental+Westlake+Hanoi', '{hoàng hôn,ven hồ,cocktail}');
    END LOOP;
  END IF;

  -- ============================================================
  -- Khu vực BA ĐÌNH / NAM TỪ LIÊM — Daewoo, Lotte, Pullman, JW Marriott, IC Landmark72
  -- ============================================================
  SELECT ARRAY_AGG(id) INTO v_hotel_ids
  FROM hotel.hotels
  WHERE (address ILIKE '%Ba Đình%' OR address ILIKE '%Nam Từ Liêm%' OR address ILIKE '%Đống Đa%')
    AND address ILIKE '%Hà Nội%';

  IF v_hotel_ids IS NOT NULL THEN
    FOREACH v_id IN ARRAY v_hotel_ids LOOP
      INSERT INTO hotel.nearby_services (hotel_id, category, name, description, address, distance, rating, price_range, map_url, tags) VALUES
      (v_id, 'food', 'Nhà hàng Sen Tây Hồ', 'Buffet Việt Nam cao cấp, hơn 200 món, không gian sang trọng.', '614 Lạc Long Quân, Tây Hồ', '3km', 4.3, '350.000 - 550.000₫/người', 'https://maps.google.com/?q=Nha+Hang+Sen+Tay+Ho+Hanoi', '{buffet,Việt Nam,sang trọng}'),
      (v_id, 'food', 'Pizza 4P''s Lotte Center', 'Pizza Nhật-Ý với phô mai tự làm, view tầng cao.', 'Tầng 6, Lotte Center, 54 Liễu Giai', '2km', 4.5, '150.000 - 350.000₫', 'https://maps.google.com/?q=Pizza+4Ps+Lotte+Center+Hanoi', '{pizza,Nhật-Ý,tầng cao}'),
      (v_id, 'attraction', 'Lăng Chủ tịch Hồ Chí Minh', 'Di tích lịch sử quốc gia, miễn phí vào cửa (Thứ 3-5-7-CN sáng).', '2 Hùng Vương, Ba Đình', '2km', 4.7, 'Miễn phí', 'https://maps.google.com/?q=Ho+Chi+Minh+Mausoleum+Hanoi', '{lịch sử,tâm linh,quốc gia}'),
      (v_id, 'attraction', 'Bảo tàng Dân tộc học', 'Bảo tàng về 54 dân tộc Việt Nam, khuôn viên rộng với nhà truyền thống.', 'Nguyễn Văn Huyên, Cầu Giấy', '4km', 4.6, '40.000₫', 'https://maps.google.com/?q=Vietnam+Museum+of+Ethnology+Hanoi', '{văn hoá,bảo tàng,gia đình}'),
      (v_id, 'attraction', 'Chùa Một Cột', 'Chùa kiến trúc độc đáo hình hoa sen, biểu tượng Hà Nội.', 'Chùa Một Cột, Ba Đình', '2km', 4.5, 'Miễn phí', 'https://maps.google.com/?q=One+Pillar+Pagoda+Hanoi', '{tâm linh,kiến trúc,biểu tượng}'),
      (v_id, 'wellness', 'JW Marriott Spa', 'Spa 5 sao với hồ bơi ngoài trời, liệu trình massage cao cấp.', '8 Đỗ Đức Dục, Nam Từ Liêm', '3km', 4.7, '1.000.000 - 3.000.000₫', 'https://maps.google.com/?q=JW+Marriott+Spa+Hanoi', '{5 sao,hồ bơi,luxury}'),
      (v_id, 'transport', 'Xe đưa đón sân bay Nội Bài', 'Dịch vụ xe sedan/SUV, đặt qua khách sạn hoặc Grab.', 'Đón tại khách sạn', '28km', 4.3, '300.000 - 500.000₫/lượt', 'https://maps.google.com/?q=Noi+Bai+Airport+Hanoi', '{sân bay,Grab,tiện lợi}'),
      (v_id, 'nightlife', 'Top of Hanoi - Lotte Center', 'Bar cao nhất Hà Nội tầng 65, view 360° thành phố.', 'Tầng 65, Lotte Center, 54 Liễu Giai', '2km', 4.5, '200.000 - 500.000₫/ly', 'https://maps.google.com/?q=Top+of+Hanoi+Lotte+Center', '{rooftop,360°,iconic}');
    END LOOP;
  END IF;

END $$;


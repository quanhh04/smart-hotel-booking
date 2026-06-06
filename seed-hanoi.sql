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

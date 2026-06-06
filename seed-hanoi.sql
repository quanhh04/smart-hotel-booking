-- ============================================================
-- SEED DATA: Khách sạn Hà Nội
-- Chạy: psql DATABASE_URL -f seed-hanoi.sql
-- ============================================================

-- 1. Đảm bảo city Hà Nội tồn tại
INSERT INTO hotel.cities (name, subtitle)
SELECT 'Hà Nội', 'Thủ đô ngàn năm văn hiến'
WHERE NOT EXISTS (SELECT 1 FROM hotel.cities WHERE name = 'Hà Nội');

-- 2. Thêm khách sạn
INSERT INTO hotel.hotels (name, address, description, stars, rating, reviews, price_from) VALUES
('Sofitel Legend Metropole Hanoi', '15 Ngô Quyền, Hoàn Kiếm, Hà Nội', 'Khách sạn 5 sao huyền thoại ngay trung tâm phố cổ, kiến trúc Pháp cổ điển, dịch vụ đẳng cấp quốc tế.', 5, 9.4, 328, 5500000),
('JW Marriott Hotel Hanoi', '8 Đỗ Đức Dục, Nam Từ Liêm, Hà Nội', 'Khách sạn 5 sao sang trọng với thiết kế hình rồng độc đáo, hồ bơi ngoài trời và spa cao cấp.', 5, 9.2, 256, 4200000),
('Hilton Hanoi Opera', '1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội', 'Ngay cạnh Nhà hát Lớn, phong cách kiến trúc thuộc địa Pháp, tiện nghi hiện đại.', 5, 9.0, 189, 3800000),
('Melia Hanoi', '44B Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', 'Khách sạn 5 sao Tây Ban Nha với tầm nhìn toàn cảnh thành phố và công viên Thống Nhất.', 5, 8.8, 203, 3200000),
('Hanoi La Siesta Hotel & Spa', '94 Mã Mây, Hoàn Kiếm, Hà Nội', 'Boutique hotel 4 sao giữa lòng phố cổ, nổi tiếng với dịch vụ spa và ẩm thực.', 4, 9.1, 412, 2200000),
('Hanoi Pearl Hotel', '6 Bảo Khánh, Hoàn Kiếm, Hà Nội', 'Khách sạn 4 sao view hồ Hoàn Kiếm, đi bộ 1 phút tới đền Ngọc Sơn.', 4, 8.7, 187, 1800000),
('Silk Path Grand Resort & Spa', '21 Hàng Khay, Hoàn Kiếm, Hà Nội', 'Resort giữa phố, kết hợp kiến trúc Đông Dương và tiện nghi spa hiện đại.', 4, 8.9, 156, 2500000),
('The Chi Boutique Hotel', '13 Hàng Trống, Hoàn Kiếm, Hà Nội', 'Boutique hotel mới xây với view hồ Gươm, nội thất sang trọng phong cách Indochine.', 4, 8.6, 98, 1900000),
('Essence Hanoi Hotel & Spa', '22 Tạ Hiện, Hoàn Kiếm, Hà Nội', 'Nằm trên phố bia nổi tiếng, gần chợ đêm, phù hợp khám phá nightlife Hà Nội.', 3, 8.4, 267, 1200000),
('Hanoi Impressive Hotel', '16 Lương Ngọc Quyến, Hoàn Kiếm, Hà Nội', 'Khách sạn 3 sao giá tốt ngay phố cổ, sân thượng view thành phố.', 3, 8.2, 342, 900000),
('Little Charm Hanoi Hostel', '48 Hàng Gà, Hoàn Kiếm, Hà Nội', 'Hostel sạch đẹp với không gian chung thân thiện, lý tưởng cho backpacker.', 2, 8.0, 189, 450000),
('Lotte Hotel Hanoi', '54 Liễu Giai, Ba Đình, Hà Nội', 'Khách sạn 5 sao trong tổ hợp Lotte Center, tầm nhìn panorama Hồ Tây và thành phố.', 5, 9.1, 178, 4500000);

-- 3. Thêm phòng cho từng khách sạn
-- Lấy ID khách sạn vừa insert
DO $$
DECLARE
  v_sofitel INT;
  v_marriott INT;
  v_hilton INT;
  v_melia INT;
  v_siesta INT;
  v_pearl INT;
  v_silk INT;
  v_chi INT;
  v_essence INT;
  v_impressive INT;
  v_charm INT;
  v_lotte INT;
BEGIN
  SELECT id INTO v_sofitel FROM hotel.hotels WHERE name = 'Sofitel Legend Metropole Hanoi';
  SELECT id INTO v_marriott FROM hotel.hotels WHERE name = 'JW Marriott Hotel Hanoi';
  SELECT id INTO v_hilton FROM hotel.hotels WHERE name = 'Hilton Hanoi Opera';
  SELECT id INTO v_melia FROM hotel.hotels WHERE name = 'Melia Hanoi';
  SELECT id INTO v_siesta FROM hotel.hotels WHERE name = 'Hanoi La Siesta Hotel & Spa';
  SELECT id INTO v_pearl FROM hotel.hotels WHERE name = 'Hanoi Pearl Hotel';
  SELECT id INTO v_silk FROM hotel.hotels WHERE name = 'Silk Path Grand Resort & Spa';
  SELECT id INTO v_chi FROM hotel.hotels WHERE name = 'The Chi Boutique Hotel';
  SELECT id INTO v_essence FROM hotel.hotels WHERE name = 'Essence Hanoi Hotel & Spa';
  SELECT id INTO v_impressive FROM hotel.hotels WHERE name = 'Hanoi Impressive Hotel';
  SELECT id INTO v_charm FROM hotel.hotels WHERE name = 'Little Charm Hanoi Hostel';
  SELECT id INTO v_lotte FROM hotel.hotels WHERE name = 'Lotte Hotel Hanoi';

  -- Sofitel (5 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_sofitel, 'Premium Room', 5500000, 2, 'Phòng cao cấp phong cách Pháp cổ điển, view sân vườn', 10, '1 King', '35 m²'),
  (v_sofitel, 'Grand Prestige Suite', 12000000, 3, 'Suite sang trọng nhất với phòng khách riêng, bồn tắm jacuzzi', 4, '1 King + 1 sofa bed', '65 m²'),
  (v_sofitel, 'Opera Wing Deluxe', 7500000, 2, 'Phòng Deluxe tại cánh Opera, nội thất gỗ quý', 8, '2 Queen', '42 m²');

  -- JW Marriott (5 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_marriott, 'Deluxe Room', 4200000, 2, 'Phòng Deluxe view thành phố, minibar miễn phí', 20, '1 King', '38 m²'),
  (v_marriott, 'Executive Suite', 8500000, 3, 'Suite với lounge riêng, bữa sáng tại Executive Lounge', 6, '1 King + 1 sofa bed', '55 m²'),
  (v_marriott, 'Presidential Suite', 25000000, 4, 'Suite tổng thống với phòng họp riêng, butler service', 2, '2 King', '120 m²');

  -- Hilton (5 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_hilton, 'Deluxe City View', 3800000, 2, 'View Nhà hát Lớn và phố cổ, phòng tắm đá cẩm thạch', 15, '1 King', '32 m²'),
  (v_hilton, 'Premium Suite', 6500000, 3, 'Suite rộng rãi với ban công riêng', 5, '1 King + 1 Single', '50 m²');

  -- Melia (5 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_melia, 'Melia Room', 3200000, 2, 'Phòng tiêu chuẩn Melia, view công viên Thống Nhất', 25, '1 King', '30 m²'),
  (v_melia, 'The Level Premium', 4800000, 2, 'Tầng The Level với lounge riêng, cocktail hour', 10, '1 King', '35 m²');

  -- La Siesta (4 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_siesta, 'Charm Double', 2200000, 2, 'Phòng đôi xinh xắn giữa phố cổ, bao gồm spa voucher', 12, '1 Queen', '22 m²'),
  (v_siesta, 'Bliss Suite', 3500000, 3, 'Suite với bồn tắm lớn, ban công nhìn ra phố Mã Mây', 4, '1 King + 1 Single', '35 m²');

  -- Pearl (4 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_pearl, 'Superior Lake View', 1800000, 2, 'View trực diện Hồ Hoàn Kiếm, ban công nhỏ', 8, '1 Queen', '25 m²'),
  (v_pearl, 'Deluxe Family', 2800000, 4, 'Phòng gia đình rộng, 2 giường lớn', 6, '2 Queen', '38 m²');

  -- Silk Path (4 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_silk, 'Grand Deluxe', 2500000, 2, 'Phòng Deluxe cao cấp với dịch vụ spa miễn phí 30 phút', 15, '1 King', '28 m²'),
  (v_silk, 'Silk Suite', 4200000, 3, 'Suite phong cách Đông Dương, bồn tắm gỗ', 4, '1 King + 1 sofa bed', '45 m²');

  -- The Chi (4 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_chi, 'Indochine Room', 1900000, 2, 'Phòng phong cách Đông Dương view hồ Gươm', 10, '1 Queen', '24 m²'),
  (v_chi, 'Panorama Suite', 3800000, 2, 'Suite tầng cao nhất, view 180° hồ Gươm', 3, '1 King', '40 m²');

  -- Essence (3 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_essence, 'Standard Double', 1200000, 2, 'Phòng đôi tiêu chuẩn, ngay phố Tạ Hiện', 15, '1 Queen', '20 m²'),
  (v_essence, 'Superior Triple', 1600000, 3, 'Phòng ba người, view phố cổ', 8, '1 Queen + 1 Single', '26 m²');

  -- Impressive (3 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_impressive, 'City View Room', 900000, 2, 'Phòng view thành phố, sân thượng chung', 20, '1 Double', '18 m²'),
  (v_impressive, 'Family Room', 1400000, 4, 'Phòng gia đình rộng rãi', 8, '2 Double', '28 m²');

  -- Little Charm (2 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_charm, 'Private Double', 450000, 2, 'Phòng riêng đôi, sạch sẽ, có cửa sổ', 10, '1 Double', '14 m²'),
  (v_charm, 'Dorm Bed (4-bed)', 200000, 1, 'Giường trong phòng dorm 4 người, tủ locker riêng', 16, '1 Single (bunk)', '4 m² / bed');

  -- Lotte (5 sao)
  INSERT INTO hotel.room_types (hotel_id, name, price_per_night, max_guests, description, total_quantity, bed, size) VALUES
  (v_lotte, 'Deluxe Room', 4500000, 2, 'Phòng Deluxe tầng cao, view Hồ Tây', 18, '1 King', '36 m²'),
  (v_lotte, 'Royal Suite', 15000000, 4, 'Suite hoàng gia, phòng khách + phòng ăn riêng, butler 24/7', 3, '2 King', '95 m²'),
  (v_lotte, 'Corner Suite', 8000000, 3, 'Suite góc với 2 mặt kính view panorama', 5, '1 King + 1 sofa bed', '58 m²');

  -- 4. Thêm amenities cho phòng
  -- Tạo amenities trước
  INSERT INTO hotel.amenities (name) VALUES
  ('WiFi miễn phí'), ('Điều hoà'), ('Minibar'), ('Két an toàn'), ('Máy pha cà phê'),
  ('Bồn tắm'), ('Hồ bơi'), ('Phòng gym'), ('Spa'), ('Nhà hàng'),
  ('Bãi đậu xe'), ('Lễ tân 24/7'), ('Dịch vụ phòng 24/7'), ('Ban công'),
  ('TV màn hình phẳng'), ('Máy sấy tóc')
  ON CONFLICT (name) DO NOTHING;

  -- Link amenities phổ biến cho các phòng 5 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id
  FROM hotel.room_types r
  CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (v_sofitel, v_marriott, v_hilton, v_melia, v_lotte)
    AND a.name IN ('WiFi miễn phí', 'Điều hoà', 'Minibar', 'Két an toàn', 'TV màn hình phẳng', 'Máy sấy tóc', 'Bồn tắm', 'Dịch vụ phòng 24/7')
  ON CONFLICT DO NOTHING;

  -- Link amenities cho phòng 4 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id
  FROM hotel.room_types r
  CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (v_siesta, v_pearl, v_silk, v_chi)
    AND a.name IN ('WiFi miễn phí', 'Điều hoà', 'Minibar', 'Két an toàn', 'TV màn hình phẳng', 'Máy sấy tóc')
  ON CONFLICT DO NOTHING;

  -- Link amenities cho phòng 3 sao
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id
  FROM hotel.room_types r
  CROSS JOIN hotel.amenities a
  WHERE r.hotel_id IN (v_essence, v_impressive)
    AND a.name IN ('WiFi miễn phí', 'Điều hoà', 'TV màn hình phẳng', 'Máy sấy tóc')
  ON CONFLICT DO NOTHING;

  -- Link amenities cho hostel
  INSERT INTO hotel.room_amenities (room_type_id, amenity_id)
  SELECT r.id, a.id
  FROM hotel.room_types r
  CROSS JOIN hotel.amenities a
  WHERE r.hotel_id = v_charm
    AND a.name IN ('WiFi miễn phí', 'Điều hoà')
  ON CONFLICT DO NOTHING;

END $$;

-- 5. Thêm ảnh cho khách sạn
-- Xoá ảnh cũ của các hotel trong script này trước khi thêm mới (tránh duplicate khi chạy lại)
DELETE FROM hotel.hotel_images WHERE hotel_id IN (
  SELECT id FROM hotel.hotels WHERE name IN (
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
  )
);

DO $$
DECLARE
  v_hotel_id INT;
  v_img_id INT;
BEGIN
  -- Sofitel Legend Metropole
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Sofitel Legend Metropole Hanoi';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sofitel Metropole exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sofitel Metropole lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sofitel Metropole room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sofitel Metropole pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sofitel Metropole bedroom', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- JW Marriott
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'JW Marriott Hotel Hanoi';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800', 'JW Marriott exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800', 'JW Marriott room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=800', 'JW Marriott pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 'JW Marriott suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800', 'JW Marriott restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Hilton Hanoi Opera
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Hilton Hanoi Opera';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hilton Opera exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hilton Opera room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hilton Opera bathroom', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hilton Opera lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800', 'Hilton Opera dining', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Melia Hanoi
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Melia Hanoi';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800', 'Melia exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800', 'Melia room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029698/pexels-photo-2029698.jpeg?auto=compress&cs=tinysrgb&w=800', 'Melia lounge', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=800', 'Melia pool', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg?auto=compress&cs=tinysrgb&w=800', 'Melia view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Hanoi La Siesta
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Hanoi La Siesta Hotel & Spa';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=800', 'La Siesta exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3754594/pexels-photo-3754594.jpeg?auto=compress&cs=tinysrgb&w=800', 'La Siesta room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800', 'La Siesta spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg?auto=compress&cs=tinysrgb&w=800', 'La Siesta bed', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800', 'La Siesta bathroom', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Hanoi Pearl Hotel
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Hanoi Pearl Hotel';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pearl Hotel exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pearl Hotel room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pearl Hotel view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pearl Hotel breakfast', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pearl Hotel bath', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Silk Path Grand
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Silk Path Grand Resort & Spa';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800', 'Silk Path exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3659683/pexels-photo-3659683.jpeg?auto=compress&cs=tinysrgb&w=800', 'Silk Path room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800', 'Silk Path spa', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029722/pexels-photo-2029722.jpeg?auto=compress&cs=tinysrgb&w=800', 'Silk Path lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2736522/pexels-photo-2736522.jpeg?auto=compress&cs=tinysrgb&w=800', 'Silk Path suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- The Chi Boutique
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'The Chi Boutique Hotel';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chi Boutique exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chi Boutique room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029731/pexels-photo-2029731.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chi Boutique view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chi Boutique suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg?auto=compress&cs=tinysrgb&w=800', 'Chi Boutique balcony', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Essence Hanoi
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Essence Hanoi Hotel & Spa';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029694/pexels-photo-2029694.jpeg?auto=compress&cs=tinysrgb&w=800', 'Essence exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800', 'Essence room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=800', 'Essence street', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029670/pexels-photo-2029670.jpeg?auto=compress&cs=tinysrgb&w=800', 'Essence lobby', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/3201922/pexels-photo-3201922.jpeg?auto=compress&cs=tinysrgb&w=800', 'Essence bed', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Hanoi Impressive
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Hanoi Impressive Hotel';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2844474/pexels-photo-2844474.jpeg?auto=compress&cs=tinysrgb&w=800', 'Impressive exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800', 'Impressive room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800', 'Impressive rooftop', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=800', 'Impressive bed', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029719/pexels-photo-2029719.jpeg?auto=compress&cs=tinysrgb&w=800', 'Impressive hallway', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

  -- Little Charm Hostel
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Little Charm Hanoi Hostel';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029706/pexels-photo-2029706.jpeg?auto=compress&cs=tinysrgb&w=800', 'Charm common area', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=800', 'Charm dorm', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800', 'Charm reception', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;

  -- Lotte Hotel Hanoi
  SELECT id INTO v_hotel_id FROM hotel.hotels WHERE name = 'Lotte Hotel Hanoi';
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2096984/pexels-photo-2096984.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lotte exterior', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 0) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2736517/pexels-photo-2736517.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lotte room', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/2029705/pexels-photo-2029705.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lotte city view', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 2) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lotte suite', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 3) ON CONFLICT DO NOTHING;
  INSERT INTO settings.images (url, alt, type) VALUES ('https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg?auto=compress&cs=tinysrgb&w=800', 'Lotte restaurant', 'hotel') RETURNING id INTO v_img_id;
  INSERT INTO hotel.hotel_images (hotel_id, image_id, sort_order) VALUES (v_hotel_id, v_img_id, 4) ON CONFLICT DO NOTHING;

END $$;

-- Done!

INSERT INTO departments (id, name, short_name, official_code) VALUES ('00000000-0000-0000-0000-0000000000d0', 'Lãnh đạo Ban', 'Lãnh đạo Ban', 'LĐB') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO departments (id, name, short_name, official_code) VALUES ('00000000-0000-0000-0000-0000000000d1', 'Phòng Tổ chức đảng, đảng viên', 'Tổ chức Đảng', 'TCĐ-ĐV') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO departments (id, name, short_name, official_code) VALUES ('00000000-0000-0000-0000-0000000000d2', 'Phòng Tổ chức cán bộ', 'Tổ chức cán bộ', 'TCCB') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO departments (id, name, short_name, official_code) VALUES ('00000000-0000-0000-0000-0000000000d3', 'Phòng Bảo vệ chính trị nội bộ', 'Bảo vệ CTNB', 'BVCTNB') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO departments (id, name, short_name, official_code) VALUES ('00000000-0000-0000-0000-0000000000d4', 'Văn phòng', 'Văn phòng', 'VP') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('15ff2448-b225-51a1-ae37-9f750c42a77b', 'Trưởng ban', 'truong-ban') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('943c9471-b2cc-5e59-bb65-f44f6acc3cfa', 'Phó Trưởng ban Thường trực', 'pho-truong-ban-thuong-truc') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('37d463fa-4843-50a8-b5ef-4f495ec77c1d', 'Phó Trưởng ban', 'pho-truong-ban') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('8f2400ce-2417-591b-863c-acdb93d58bcf', 'Trưởng phòng', 'truong-phong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('c905d240-2ad7-5d4d-a9cc-33cbc1b8de26', 'Chánh Văn phòng', 'chanh-van-phong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('d557ced2-c8bc-5021-b622-46541c5a7c72', 'Phó Trưởng phòng', 'pho-truong-phong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('8a0ca718-8413-53a5-8dd2-5db02b3a0f73', 'Phó Chánh Văn phòng', 'pho-chanh-van-phong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('a406e490-8a7d-50de-b307-b41c4801cea7', 'Chuyên viên', 'chuyen-vien') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('be6c9407-82ef-5d12-bc00-2c4483615f71', 'Nhân viên', 'nhan-vien') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('ae77347f-928c-5796-b58a-47ff73c2654c', 'Văn thư - Lưu trữ', 'van-thu-luu-tru') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO positions (id, title, external_id) VALUES ('4b2543b5-b639-5d31-b9d9-2f507aa37ec5', 'Văn thư - Lưu trữ / Hành chính', 'van-thu-luu-tru-hanh-chinh') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('48714fba-ed9f-57df-b26e-19e4f8c0fde3', 'Nguyễn Thượng Hải', 'p-nguyen-thuong-hai') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('2f863b91-fa8b-57b5-bb36-51adce9d5b3b', '48714fba-ed9f-57df-b26e-19e4f8c0fde3', '15ff2448-b225-51a1-ae37-9f750c42a77b', '00000000-0000-0000-0000-0000000000d0', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('e2181cf7-351a-5f5c-ad58-e35cc3bde987', 'Lưu Vĩnh Hưng', 'p-luu-vinh-hung') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('fad6a509-03ee-5c6f-8be9-56720b53e157', 'e2181cf7-351a-5f5c-ad58-e35cc3bde987', '943c9471-b2cc-5e59-bb65-f44f6acc3cfa', '00000000-0000-0000-0000-0000000000d0', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('37d18941-e3f0-56a0-b4de-c151b4ffc3fb', 'Nguyễn Hữu Toàn', 'p-nguyen-huu-toan') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('2a822628-ef07-5dcb-b8d3-17c39006245d', '37d18941-e3f0-56a0-b4de-c151b4ffc3fb', '37d463fa-4843-50a8-b5ef-4f495ec77c1d', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('c9b40f39-47a9-5a41-8e7b-c2827af2cfe9', 'Nguyễn Văn Hà', 'p-nguyen-van-ha') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('560ab21d-ade7-56b4-a95d-31a01df27425', 'c9b40f39-47a9-5a41-8e7b-c2827af2cfe9', '37d463fa-4843-50a8-b5ef-4f495ec77c1d', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('5d04b87f-748d-5a76-ada0-b49a32e87862', 'Nguyễn Bá Kim', 'p-nguyen-ba-kim') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('60c59bb9-1069-5586-98d8-e97f6465862b', '5d04b87f-748d-5a76-ada0-b49a32e87862', '37d463fa-4843-50a8-b5ef-4f495ec77c1d', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('e2c94a0d-84c6-5950-ba9d-878af296a47b', 'Phạm Thị Xuyến', 'p-pham-thi-xuyen') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('dbefd45f-f811-5d5a-b47a-92e766d96d0c', 'e2c94a0d-84c6-5950-ba9d-878af296a47b', '37d463fa-4843-50a8-b5ef-4f495ec77c1d', '00000000-0000-0000-0000-0000000000d3', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('0ef7e455-fdc4-5af5-ba6e-ed1fa1706f2a', 'Trần Hải Triều', 'p-tran-hai-trieu') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('0afa1fa0-1fd8-515d-a874-d7f3fa5ff8fe', '0ef7e455-fdc4-5af5-ba6e-ed1fa1706f2a', '8f2400ce-2417-591b-863c-acdb93d58bcf', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('1402e104-211f-5a61-982a-7514a8d77e07', 'Nguyễn Thị Hồng Thúy', 'p-nguyen-thi-hong-thuy') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('75d929a9-4283-567b-95d7-e1dbf785ffed', '1402e104-211f-5a61-982a-7514a8d77e07', 'c905d240-2ad7-5d4d-a9cc-33cbc1b8de26', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('8298f92b-9bc7-509c-b2ed-1fb84f36085a', 'Hoàng Xuân Việt', 'p-hoang-xuan-viet') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('e6110940-84a1-5c64-b3c8-9a22e2492080', '8298f92b-9bc7-509c-b2ed-1fb84f36085a', '8f2400ce-2417-591b-863c-acdb93d58bcf', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('bc82f6aa-878b-548e-832f-fb38b7162807', 'Nguyễn Thanh Thủy', 'p-nguyen-thanh-thuy') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('d2c58279-c0d8-5fbd-8fad-000fb1e12ab2', 'bc82f6aa-878b-548e-832f-fb38b7162807', '8f2400ce-2417-591b-863c-acdb93d58bcf', '00000000-0000-0000-0000-0000000000d3', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('eab5623e-a139-5f47-b510-b24d52491ace', 'Nguyễn Trần Thi', 'p-nguyen-tran-thi') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('698d6d74-df05-5f4b-a1a6-db0709cf8972', 'eab5623e-a139-5f47-b510-b24d52491ace', 'd557ced2-c8bc-5021-b622-46541c5a7c72', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('9560dac9-92d8-5013-8e1d-c54708e437bd', 'Nguyễn Văn Toàn', 'p-nguyen-van-toan') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('ef78b945-e6ba-564c-8e99-a5d6e29364e0', '9560dac9-92d8-5013-8e1d-c54708e437bd', 'd557ced2-c8bc-5021-b622-46541c5a7c72', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('8576f567-7db3-5412-b22b-f508b92fb6dd', 'Phạm Phong Thu', 'p-pham-phong-thu') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('8c16a516-fcd9-5d26-b62c-11bd8a98f120', '8576f567-7db3-5412-b22b-f508b92fb6dd', 'd557ced2-c8bc-5021-b622-46541c5a7c72', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('c9a93dc2-233b-534c-bdb7-53d05f413e61', 'Mai Chí Tùng', 'p-mai-chi-tung') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('dca8dfb9-6aff-5a0f-8b4b-d39d2bdfc1c7', 'c9a93dc2-233b-534c-bdb7-53d05f413e61', '8a0ca718-8413-53a5-8dd2-5db02b3a0f73', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('6239684c-70ad-5bb1-ba9c-cb7d6470b28d', 'Đoàn Đức Dũng', 'p-oan-uc-dung') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('3f2326f8-5aef-589b-854d-774a2b9550d8', '6239684c-70ad-5bb1-ba9c-cb7d6470b28d', '8a0ca718-8413-53a5-8dd2-5db02b3a0f73', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('5892d6d5-9695-5caf-b112-cffa352e35d5', 'Đặng Đức Triều', 'p-ang-uc-trieu') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('0a6fd9fe-bd9e-554f-a0eb-9ac9be58c471', '5892d6d5-9695-5caf-b112-cffa352e35d5', '8a0ca718-8413-53a5-8dd2-5db02b3a0f73', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('31a38b8d-997d-54a8-a2fd-f5aab719df20', 'Hoàng Viết Việt', 'p-hoang-viet-viet') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('6f4fc86e-954f-5f79-b0e0-614550c67b12', '31a38b8d-997d-54a8-a2fd-f5aab719df20', 'd557ced2-c8bc-5021-b622-46541c5a7c72', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('87ab2497-22e1-5b1d-94bb-d892ea98c727', 'Nguyễn Ngọc San', 'p-nguyen-ngoc-san') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('949455d0-aff8-54ea-9d67-3d3bd31d0d99', '87ab2497-22e1-5b1d-94bb-d892ea98c727', 'd557ced2-c8bc-5021-b622-46541c5a7c72', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('b5e81754-1de1-5d2d-92a1-58a5ce8b5bf0', 'Trương Thị Đông', 'p-truong-thi-ong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('e6c9c411-f3f0-5e32-a983-24c5388a1ba2', 'b5e81754-1de1-5d2d-92a1-58a5ce8b5bf0', 'd557ced2-c8bc-5021-b622-46541c5a7c72', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('86eecc85-12e8-5e82-b0ba-a8e251387dd9', 'Hồ Lê Nhân', 'p-ho-le-nhan') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('a2efa923-a849-57e9-a2df-e375f6555b3a', '86eecc85-12e8-5e82-b0ba-a8e251387dd9', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('4e534bff-d8b3-5eda-868a-bc4783986684', 'Nguyễn Thị Hồng Bích', 'p-nguyen-thi-hong-bich') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('78d626e0-edaa-5d39-8bf6-e98750074952', '4e534bff-d8b3-5eda-868a-bc4783986684', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('2552d647-c20b-5c67-9843-030fd48f1dcf', 'Phan Hữu Ân', 'p-phan-huu-an') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('97488a1f-a7b2-5b90-8bbf-5684dd1bb89d', '2552d647-c20b-5c67-9843-030fd48f1dcf', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('2cd9c10e-660f-557d-aa90-52a3da60641f', 'Phan Thị Mai Hạnh', 'p-phan-thi-mai-hanh') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('7929c52f-63c4-580c-afff-0107e9bf9542', '2cd9c10e-660f-557d-aa90-52a3da60641f', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('8f098933-04d5-5e02-9e0a-65f2f67191ec', 'Phan Văn Hùng', 'p-phan-van-hung') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('b5c283e2-5292-58a6-b226-104679d75547', '8f098933-04d5-5e02-9e0a-65f2f67191ec', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('c60db1d9-0266-5f18-a822-08289035a736', 'Y Lucky Niê', 'p-y-lucky-nie') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('0fba67e4-339a-5270-85cc-3219857441d2', 'c60db1d9-0266-5f18-a822-08289035a736', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d2', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('c53be0a0-817a-5c1e-9490-55bd3553bdfe', 'Dương Trúc Phương', 'p-duong-truc-phuong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('554809bf-586f-5c31-9bb5-565f8cbe0f38', 'c53be0a0-817a-5c1e-9490-55bd3553bdfe', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('9de0803c-e0dd-58c0-b99d-5392ca2b8a7c', 'Lê Thị Lin Đa', 'p-le-thi-lin-a') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('8bc47ca0-5758-5573-a404-0d6cdda68687', '9de0803c-e0dd-58c0-b99d-5392ca2b8a7c', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('c5e535cc-b506-5f2c-be3a-408bc742cd98', 'Mai Thị Hoài Thu', 'p-mai-thi-hoai-thu') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('65b31b47-4635-5034-ae0d-2d0d81004065', 'c5e535cc-b506-5f2c-be3a-408bc742cd98', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('30fed231-e8cf-59e5-beee-82e901113de6', 'Nguyễn Quyết Tiến', 'p-nguyen-quyet-tien') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('708e8a91-b9ca-52cc-af1c-8fc6f103ee39', '30fed231-e8cf-59e5-beee-82e901113de6', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('311986fa-da6d-55e0-a10d-7ba25a936814', 'Đoàn Tô Hữu Đức', 'p-oan-to-huu-uc') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('3dd152f6-dd34-5e1c-93eb-8750fed077da', '311986fa-da6d-55e0-a10d-7ba25a936814', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('70933856-bff7-5f56-875f-dfe807414346', 'Nguyễn Hiếu Thông', 'p-nguyen-hieu-thong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('f576156a-9197-52d9-8424-99e81402be07', '70933856-bff7-5f56-875f-dfe807414346', 'be6c9407-82ef-5d12-bc00-2c4483615f71', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('0f6ad048-de9d-5883-8c76-5ea9b1dc8ec3', 'Nguyễn Thị Bích Phượng', 'p-nguyen-thi-bich-phuong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('c8eb5a80-536d-59a4-98af-c704e80a0bbd', '0f6ad048-de9d-5883-8c76-5ea9b1dc8ec3', 'ae77347f-928c-5796-b58a-47ff73c2654c', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('9458d448-22e1-5fd3-9f76-e9d7f80788d4', 'Nguyễn Thị Phúc Anh', 'p-nguyen-thi-phuc-anh') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('c84c1e60-db17-52de-b39a-cab4a9f4b6a2', '9458d448-22e1-5fd3-9f76-e9d7f80788d4', '4b2543b5-b639-5d31-b9d9-2f507aa37ec5', '00000000-0000-0000-0000-0000000000d4', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('0d21f109-5841-525d-b89e-13c63e86b4b7', 'Hứa Thị Thu Huyền', 'p-hua-thi-thu-huyen') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('38aceded-199e-559c-b9fa-1f4b9b5016ea', '0d21f109-5841-525d-b89e-13c63e86b4b7', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('9e449575-8f67-5c0c-9258-5d1a5af02a65', 'Lê Ngọc Tuyền', 'p-le-ngoc-tuyen') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('9634a85f-49bc-5466-ba7b-06509ec198d0', '9e449575-8f67-5c0c-9258-5d1a5af02a65', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('2f249f74-a1b4-5aed-a717-b3b08b5bfbfc', 'Lê Thị Thanh Viên', 'p-le-thi-thanh-vien') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('c0376b5b-56bd-5cad-b273-9ed8f0541e0f', '2f249f74-a1b4-5aed-a717-b3b08b5bfbfc', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('91d9538d-fe74-502d-808e-598699fe9e6e', 'Nguyễn Việt Đức Dương', 'p-nguyen-viet-uc-duong') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('08e860ee-1983-5a9e-8a85-181e573067f1', '91d9538d-fe74-502d-808e-598699fe9e6e', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO people (id, name, external_id) VALUES ('b69a2b38-6a9f-5d17-9434-98290f93d1ba', 'Phạm Duy Nhất', 'p-pham-duy-nhat') ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint
INSERT INTO position_assignments (id, person_id, position_id, department_id, assignment_type) VALUES ('a54bf7c3-0821-5305-b269-5e560ce7dfec', 'b69a2b38-6a9f-5d17-9434-98290f93d1ba', 'a406e490-8a7d-50de-b307-b41c4801cea7', '00000000-0000-0000-0000-0000000000d1', 'STAFF') ON CONFLICT (id) DO NOTHING;
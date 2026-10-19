# Database local

Ứng dụng dùng PostgreSQL. Cấu hình dưới đây tạo một PostgreSQL 16 local với
volume bền vững, sau đó clone schema và dữ liệu từ `apps/api/.env.local`.

## Yêu cầu

- Docker Desktop đang chạy với Linux containers;
- `apps/api/.env.local` có `DATABASE_URL` trỏ tới database nguồn.

## Clone lần đầu

```powershell
pnpm db:clone
```

## Cài trên máy khác

Không cần mang theo `.env.local`, `node_modules` hoặc `.next`. Sau khi copy
source và cài Node.js, pnpm cùng Docker Desktop:

```powershell
pnpm install --frozen-lockfile
pnpm setup:local
pnpm dev
```

Mặc định database dùng cổng `5437`. Nếu máy đích đã dùng cổng này, đặt cổng
khác trước khi setup, ví dụ `$env:BTCTU_DB_PORT=5438`.

`setup:local` tự tạo env local với JWT secret mới và tự restore
`database/source.dump` nếu file này có trong source. Nếu không có dump, script
sẽ chạy migration đã commit.

```powershell
pnpm package:local
```

Trên máy đích giải nén package rồi chạy:

```powershell
pnpm install --frozen-lockfile
pnpm setup:local
pnpm dev
```

Dump chứa dữ liệu thật, nên chỉ gửi qua kênh riêng tư và cần cân nhắc quyền
truy cập nếu commit cùng source.

Lệnh sẽ khởi động PostgreSQL ở `localhost:5437`, tạo dump vào `.local-db/`
(thư mục đã được gitignore), rồi restore các schema `public` và `drizzle` vào
database `btctu` local. Các schema nội bộ/extension riêng của Supabase như
`auth`, `storage`, `vault`, `realtime` không được restore vì ứng dụng BTCTU
không phụ thuộc chúng.

Sau khi kiểm tra restore thành công, đổi `DATABASE_URL` trong
`apps/api/.env.local` thành:

```dotenv
DATABASE_URL=postgresql://btctu:btctu_local@localhost:5437/btctu
```

Sau đó chạy migration nếu có migration mới:

```powershell
pnpm --filter @btctu/api db:migrate
pnpm dev
```

## Quản lý database local

```powershell
pnpm db:local                         # khởi động database
docker compose stop db                # dừng container, giữ dữ liệu
docker compose start db               # chạy lại
docker compose logs db                # xem log
docker compose down                   # xóa container, giữ volume
```

Không chạy `docker compose down -v` nếu chưa muốn xóa dữ liệu local.

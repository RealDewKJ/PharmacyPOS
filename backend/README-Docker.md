# Docker Setup สำหรับ Pharmacy POS

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Docker และ Docker Compose

- ดาวน์โหลดและติดตั้ง Docker Desktop
- ตรวจสอบการติดตั้ง: `docker --version` และ `docker-compose --version`

### 2. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ตัวอย่าง
cp env.example .env

# แก้ไขค่าต่างๆ ใน .env ตามต้องการ
```

### 3. รันฐานข้อมูลและ Redis

```bash
# รันเฉพาะ PostgreSQL และ Redis
docker-compose up -d postgres redis

# หรือรันทั้งหมดรวมทั้งแอป
docker-compose up -d
```

### 4. รัน Migration และ Seed ข้อมูล

```bash
# รัน Prisma Migration
bun prisma migrate dev

# หรือใช้ Docker
docker-compose exec app bun prisma migrate dev

# Seed ข้อมูลเริ่มต้น (ถ้ามี)
bun prisma db seed
```

### 5. สำหรับ Development

```bash
# รันในโหมด Development
docker-compose -f docker-compose.dev.yml up -d

# ดู logs
docker-compose logs -f app
```

## คำสั่งที่มีประโยชน์

```bash
# หยุด containers
docker-compose down

# หยุดและลบ volumes
docker-compose down -v

# รีสตาร์ท services
docker-compose restart

# เข้าไปใน container
docker-compose exec postgres psql -U postgres -d pharmacy_pos
docker-compose exec app sh

# ดู status
docker-compose ps
```

## การเชื่อมต่อฐานข้อมูล

### Connection String สำหรับ PostgreSQL:

```
postgresql://postgres:postgres123@localhost:5432/pharmacy_pos?schema=public
```

### การเชื่อมต่อผ่าน Prisma Studio:

```bash
bun prisma studio
```

## การแก้ไขปัญหา

### 1. Port ถูกใช้งานแล้ว

```bash
# เปลี่ยน port ใน docker-compose.yml
ports:
  - "5433:5432"  # เปลี่ยนจาก 5432 เป็น 5433
```

### 2. ลบข้อมูลเก่า

```bash
# ลบ containers และ volumes
docker-compose down -v
docker system prune -a
```

### 3. รีเซ็ตฐานข้อมูล

```bash
# ลบและสร้างใหม่
docker-compose down -v
docker-compose up -d postgres
bun prisma migrate reset
```

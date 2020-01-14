# Migration `watch-20200114020619`

This migration has been generated at 1/14/2020, 2:06:20 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "lm_db"."Post" DROP COLUMN "dataType",
DROP COLUMN "dfImaginaryPartX",
DROP COLUMN "dfImaginaryPartY",
DROP COLUMN "dfRealPartX",
DROP COLUMN "dfRealPartY",
DROP COLUMN "imaginaryPartX",
DROP COLUMN "imaginaryPartY",
DROP COLUMN "materialType",
DROP COLUMN "published",
ADD COLUMN "published" boolean  NOT NULL DEFAULT false;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..watch-20200114020619
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,26 @@
+generator photon {
+  provider = "photonjs"
+}
+
+datasource db {
+  provider = "postgresql"
+  url      = "postgresql://postgres:postgres@localhost:5432/postgres?schema=lm_db"
+}
+
+model Post {
+  id        String   @default(cuid()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  published Boolean  @default(false)
+  title     String
+  content   String?
+  author    User?
+}
+
+model User {
+  id       String  @default(cuid()) @id
+  email    String  @unique
+  password String
+  name     String?
+  posts    Post[]
+}
```



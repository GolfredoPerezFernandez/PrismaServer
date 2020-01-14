# Migration `watch-20200114021208`

This migration has been generated at 1/14/2020, 2:12:12 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "lm_db"."Post" ADD COLUMN "dataType" text  NOT NULL DEFAULT '' ,
ADD COLUMN "dfImaginaryPartX" Decimal(65,30) []   ,
ADD COLUMN "dfImaginaryPartY" Decimal(65,30) []   ,
ADD COLUMN "dfRealPartX" Decimal(65,30) []   ,
ADD COLUMN "dfRealPartY" Decimal(65,30) []   ,
ADD COLUMN "imaginaryPartX" Decimal(65,30) []   ,
ADD COLUMN "imaginaryPartY" Decimal(65,30) []   ,
ADD COLUMN "materialType" text  NOT NULL DEFAULT '' ,
DROP COLUMN "content",
ADD COLUMN "content" text    ,
DROP COLUMN "createdAt",
ADD COLUMN "createdAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00' ,
DROP COLUMN "published",
ADD COLUMN "published" boolean  NOT NULL DEFAULT true ,
DROP COLUMN "updatedAt",
ADD COLUMN "updatedAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00' ;

ALTER TABLE "lm_db"."User" DROP COLUMN "name",
ADD COLUMN "name" text    ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration watch-20200114020619..watch-20200114021208
--- datamodel.dml
+++ datamodel.dml
@@ -3,19 +3,27 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = "postgresql://postgres:postgres@localhost:5432/postgres?schema=lm_db"
 }
 model Post {
   id        String   @default(cuid()) @id
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
-  published Boolean  @default(false)
+  published Boolean @default(true)
   title     String
   content   String?
   author    User?
+  dataType String
+  materialType String
+  imaginaryPartX Float[]   
+  imaginaryPartY Float[]  
+  dfImaginaryPartX Float[] 
+  dfImaginaryPartY Float[] 
+  dfRealPartX Float[]   
+  dfRealPartY Float[]  
 }
 model User {
   id       String  @default(cuid()) @id
```



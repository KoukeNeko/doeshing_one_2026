#!/usr/bin/env bun
/**
 * 初始化作者腳本
 * 用於在資料庫中創建或更新作者資料
 * 
 * 使用方式：
 * bun run scripts/init-author.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const authorName = process.env.AUTHOR_NAME || "Admin";

  if (!adminEmail) {
    console.error("❌ Error: ADMIN_EMAIL is not set in .env file");
    console.log("💡 Please add ADMIN_EMAIL to your .env file");
    process.exit(1);
  }

  console.log(`\n🔍 Checking for author: ${adminEmail}`);

  // 檢查是否已存在
  let author = await prisma.author.findFirst({
    where: { email: adminEmail },
  });

  if (author) {
    console.log(`✅ Author already exists: ${author.name} (${author.email})`);
    
    // 詢問是否更新
    console.log(`\n📝 Updating author name to: ${authorName}`);
    author = await prisma.author.update({
      where: { id: author.id },
      data: { name: authorName },
    });
    console.log(`✅ Author updated successfully!`);
  } else {
    console.log(`\n📝 Creating new author: ${authorName} (${adminEmail})`);

    // 檢查或創建 User
    let user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: authorName,
          email: adminEmail,
          image: "/images/avatar.svg",
        },
      });
      console.log(`✅ User created: ${user.email}`);
    }

    // 創建 Author
    author = await prisma.author.create({
      data: {
        name: authorName,
        email: adminEmail,
        avatar: "/images/avatar.svg",
        bio: "Creative technologist crafting editorials in the browser.",
        userId: user.id,
      },
    });
    console.log(`✅ Author created: ${author.name} (${author.email})`);
  }

  // 顯示統計
  const postCount = await prisma.post.count({
    where: { authorId: author.id },
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Name: ${author.name}`);
  console.log(`   Email: ${author.email}`);
  console.log(`   Posts: ${postCount}`);
  console.log(`\n✨ Done!\n`);
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAuth() {
  console.log('=== 檢查資料庫中的認證資料 ===\n')
  
  // 查詢所有 Users
  const users = await prisma.user.findMany({
    include: {
      accounts: true
    }
  })
  
  console.log(`找到 ${users.length} 個用戶:`)
  users.forEach((user, i) => {
    console.log(`\n用戶 ${i + 1}:`)
    console.log(`  ID: ${user.id}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Accounts: ${user.accounts.length} 個`)
    user.accounts.forEach(account => {
      console.log(`    - Provider: ${account.provider}, ID: ${account.providerAccountId}`)
    })
  })
  
  // 查詢所有 Accounts
  const accounts = await prisma.account.findMany()
  console.log(`\n找到 ${accounts.length} 個 Account 記錄:`)
  accounts.forEach((account, i) => {
    console.log(`\nAccount ${i + 1}:`)
    console.log(`  Provider: ${account.provider}`)
    console.log(`  ProviderAccountId: ${account.providerAccountId}`)
    console.log(`  UserId: ${account.userId}`)
  })
  
  await prisma.$disconnect()
}

checkAuth().catch(console.error)

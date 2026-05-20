import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Usage: npx tsx prisma/set-plan.ts <email> <FREE|PRO|PREMIUM>
async function main() {
  const email = process.argv[2]
  const plan = process.argv[3] as 'FREE' | 'PRO' | 'PREMIUM'

  if (!email || !plan || !['FREE', 'PRO', 'PREMIUM'].includes(plan)) {
    console.error('Usage: npx tsx prisma/set-plan.ts <email> <FREE|PRO|PREMIUM>')
    process.exit(1)
  }

  const user = await prisma.user.update({
    where: { email },
    data: { plan },
    select: { id: true, email: true, plan: true },
  })

  console.log(`✅ Updated:`, user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
